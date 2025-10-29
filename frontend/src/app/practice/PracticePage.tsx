'use client';

import { useEffect, useMemo, useState } from 'react';
import PracticeQuestionBox, { type QuestionData } from '@/components/layout/PracticeQuestionBox';
import PromptInput from '@/components/layout/PromptInput';
import PracticeOptions, { PracticeOptionsValue } from '@/components/layout/PracticeOptions';
import { Api } from '@/services/api';
import PracticeGrader, { type UserAnswersMap } from '@/components/layout/PracticeGrader';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import SaveFloatingButton from '@/components/ui/SaveFloatingButton';
import LocalArchive from '@/services/localArchive';
import { toast } from 'sonner';

// Small typing effect for tour
const TypingText: React.FC<{ text: string; speed?: number; onDone?: () => void; onStep?: (i:number,ch:string)=>void }> = ({ text, speed = 18, onDone, onStep }) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0; setShown('');
    const id = setInterval(() => { i++; setShown(text.slice(0, i)); onStep?.(i, text[i-1] ?? ''); if (i >= text.length) { clearInterval(id); onDone?.(); } }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone, onStep]);
  return <span>{shown}</span>;
};

export default function PracticePage() {
  const [practiceOptions, setPracticeOptions] = useState<PracticeOptionsValue>({
    exerciseCount: 4,
    difficulty: 2,
    focusAreas: [],
    questionType: null,
  });

  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswersMap>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [metas, setMetas] = useState<Array<{ learningObjective?: string; explanation?: string; answerText?: string }>>([]);

  const resetPractice = () => {
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setScore(undefined);
    setError(null);
    setResponse('');
    // keep practiceOptions as-is so the user can tweak and regenerate
  };

  // Tour state
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [focusRect, setFocusRect] = useState<{x:number;y:number;w:number;h:number}|null>(null);
  const [typingReset, setTypingReset] = useState(0);

  // Steps
  const steps = useMemo(() => [
    { key:'prompt', selector:'#pr-input', text:'Este es el prompt: escribe el tema o pega contenido para crear ejercicios.' },
    { key:'exercises', selector:'#pr-opt-exercises', text:'Elige cuántos ejercicios quieres generar.' },
    { key:'focus', selector:'#pr-opt-focus', text:'Selecciona el área de enfoque: vocabulario, análisis, comprensión o resumen.' },
    { key:'difficulty', selector:'#pr-opt-difficulty', text:'Ajusta la dificultad: Fácil, Medio, Difícil o Extremo.' },
    { key:'question', selector:'#pr-opt-question', text:'Selecciona el tipo de pregunta preferido.' },
  ], []);

  // First-visit only
  useEffect(() => {
    try {
      const k = 'tour:practice:v1';
      if (!localStorage.getItem(k)) { setTourOpen(true); setTourIndex(0); console.log('[practice-tour] start'); }
    } catch {}
  }, []);

  // Compute focus rect, scroll, wheel typing restart
  useEffect(() => {
    if (!tourOpen) return;
    const step = steps[tourIndex]; if (!step) return;
    let skipTimer: number | null = null;
    const compute = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) {
        console.warn('[practice-tour] target not found', step.selector);
        if (skipTimer == null) {
          skipTimer = window.setTimeout(() => {
            console.warn('[practice-tour] auto-skip step', step.key);
            setTourIndex((i)=>Math.min(i+1, steps.length-1));
          }, 400);
        }
        return;
      }
      if (skipTimer) { clearTimeout(skipTimer); skipTimer = null; }
      const r = el.getBoundingClientRect(); const pad = 12;
      setFocusRect({ x: Math.max(0, r.left - pad), y: Math.max(0, r.top - pad), w: r.width + pad*2, h: r.height + pad*2 });
      console.log('[practice-tour] rect', step.key);
    };
    const el2 = document.querySelector(step.selector) as HTMLElement | null; if (el2) { try { el2.scrollIntoView({ behavior:'smooth', block:'center' }); } catch {} }
    compute();
    const on = () => { console.log('[practice-tour] recalc', step.key); compute(); };
    window.addEventListener('resize', on); window.addEventListener('scroll', on, true);
    const onWheel = () => { setTypingReset(n=>n+1); console.log('[practice-tour] wheel -> restart typing'); };
    window.addEventListener('wheel', onWheel, { passive:true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); console.log('[practice-tour] key next'); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); console.log('[practice-tour] key prev'); prev(); }
      else if (e.key === 'Escape') { e.preventDefault(); console.log('[practice-tour] key skip'); skip(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { if (skipTimer) clearTimeout(skipTimer); window.removeEventListener('resize', on); window.removeEventListener('scroll', on, true); window.removeEventListener('wheel', onWheel as any); window.removeEventListener('keydown', onKey); };
  }, [tourOpen, tourIndex, steps]);

  const next = () => { setTypingReset(n=>n+1); setTourIndex(i => { const nx = i+1; if (nx >= steps.length) { try{localStorage.setItem('tour:practice:v1','done');}catch{} setTourOpen(false); console.log('[practice-tour] done'); return i; } console.log('[practice-tour] next ->', steps[nx].key); return nx; }); };
  const prev = () => setTourIndex(i => Math.max(0, i-1));
  const skip = () => { try{localStorage.setItem('tour:practice:v1','done');}catch{} setTourOpen(false); };

  // Local mirror of PromptInput's UploadedFile
  type UploadedFile = { id: string; file: File; previewUrl?: string };

  const mapDifficulty = (d: PracticeOptionsValue['difficulty']): string => {
    switch (d) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      case 4: return 'extreme';
      default: return 'medium';
    }
  };

  const mapQuestionTypeToApi = (qt: PracticeOptionsValue['questionType'] | null): string => {
    switch (qt) {
      case 'multiple-choice': return 'multiple_choice';
      case 'true-false': return 'true_false';
      case 'fill-blank': return 'fill_in_the_blank';
      case 'short-answer': return 'short_answer';
      case 'relationship': return 'matching';
      // 'justification' not supported on backend; fallback
      default: return 'multiple_choice';
    }
  };

  const toQuestionData = (raw: any, requestedType: PracticeOptionsValue['questionType'] | null, index: number): QuestionData => {
    const qText = (raw?.statement ?? raw?.question ?? 'Pregunta') as string;
    const base = {
      id: `q_${Date.now()}_${index}`,
      question: qText,
      points: undefined as number | undefined,
    } as any;

    // Prefer the requested type mapping, fallback to multiple-choice using choices
    const choices: Array<{ text: string; is_correct?: boolean }> = Array.isArray(raw?.choices) ? raw.choices : [];
    const correctIndex = Math.max(0, choices.findIndex(c => c?.is_correct));

    switch (requestedType) {
      case 'true-false': {
        // Prefer backend boolean when provided
        if (typeof raw?.is_true === 'boolean') {
          return { ...base, type: 'true-false', correctAnswer: !!raw.is_true } as QuestionData;
        }
        // Otherwise infer from choices if available
        let correct = false;
        if (choices.length === 2) {
          const ci = choices.findIndex(c => c?.is_correct);
          const txt = (choices[ci]?.text || '').toLowerCase();
          if (/(true|verdadero)/.test(txt)) correct = true;
          else if (/(false|falso)/.test(txt)) correct = false;
          else correct = ci === 0;
        }
        return { ...base, type: 'true-false', correctAnswer: correct } as QuestionData;
      }
      case 'fill-blank': {
        const correctText = (raw?.answer ?? choices.find(c => c.is_correct)?.text ?? '').trim();
        return { ...base, type: 'fill-blank', blanks: 1, correctAnswers: [correctText] } as QuestionData;
      }
      case 'short-answer': {
        const correctText = (raw?.answer ?? choices.find(c => c.is_correct)?.text ?? raw?.explanation ?? '').trim();
        return { ...base, type: 'short-answer', correctAnswer: correctText, maxLength: 200 } as QuestionData;
      }
      case 'relationship': {
        // Backend structure: premises (items), responses (concepts), correct_matches (object mapping)
        const items: string[] = Array.isArray(raw?.premises) ? raw.premises : (choices.length ? choices.map((_, i) => `Ítem ${i+1}`) : []);
        const concepts: string[] = Array.isArray(raw?.responses) ? raw.responses : (choices.length ? choices.map((c: any) => c.text) : []);
        let correctPairs: [number, number][] = [];
        if (raw && raw.correct_matches && typeof raw.correct_matches === 'object') {
          for (const k of Object.keys(raw.correct_matches)) {
            const a = Number(k);
            const b = Number((raw.correct_matches as any)[k]);
            if (Number.isInteger(a) && Number.isInteger(b)) correctPairs.push([a, b]);
          }
        }
        // Fallback: if empty, align by index when both arrays are same length
        if ((!correctPairs || correctPairs.length === 0) && items.length && items.length === concepts.length) {
          correctPairs = items.map((_, i) => [i, i]);
        }
        return { ...base, type: 'relationship', items, concepts, correctPairs } as QuestionData;
      }
      case 'multiple-choice':
      default: {
        const options = choices.length ? choices.map(c => c.text) : [];
        const corr = correctIndex >= 0 ? correctIndex : 0;
        return { ...base, type: 'multiple-choice', options, correctAnswer: corr } as QuestionData;
      }
    }
  };

  const handleSendMessage = async (message: string, files: UploadedFile[]) => {
    setIsLoading(true);
    setError(null);
    setResponse('');
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setScore(undefined);
    try {
      const usesFiles = Array.isArray(files) && files.length > 0;
      const exercises_types = mapQuestionTypeToApi(practiceOptions.questionType);
      const exercises_difficulty = mapDifficulty(practiceOptions.difficulty);
      const exercises_count = practiceOptions.exerciseCount;

      let data: any;
      if (usesFiles) {
        data = await Api.generateExercisesFromFiles({
          files: files.map(f => f.file),
          exercises_count,
          exercises_difficulty,
          exercises_types,
        });
      } else {
        data = await Api.generateExercisesByTopic({
          topic: message || 'General',
          exercises_count,
          exercises_difficulty,
          exercises_types,
        });
      }

      console.log('[practice] API response:', data);
      const list: any[] = data?.exercises?.exercises ?? [];
      if (!Array.isArray(list) || list.length === 0) {
        setResponse('No se recibieron ejercicios. Intenta con otros parámetros.');
      } else {
        const mapped = list.map((it, i) => toQuestionData(it, practiceOptions.questionType, i));
        setQuestions(mapped);
        const mappedMeta = list.map((it: any) => {
          const lo = it?.learning_objective ?? it?.learningObjective ?? undefined;
          const exp = it?.explanation ?? undefined;
          let ansText: string | undefined = undefined;
          // Best-effort extraction of correct answer text by type
          if (typeof it?.is_true === 'boolean') ansText = it.is_true ? 'Verdadero' : 'Falso';
          if (!ansText && Array.isArray(it?.choices)) {
            const idx = it.choices.findIndex((c: any) => c?.is_correct);
            ansText = it.choices[idx]?.text ?? ansText;
          }
          if (!ansText && typeof it?.answer === 'string') ansText = it.answer;
          // Relationship pretty answer
          if (!ansText && Array.isArray(it?.premises) && Array.isArray(it?.responses)) {
            const pairs: Array<[number, number]> = [];
            if (it?.correct_matches && typeof it.correct_matches === 'object') {
              for (const k of Object.keys(it.correct_matches)) {
                const a = Number(k);
                const b = Number(it.correct_matches[k]);
                if (Number.isInteger(a) && Number.isInteger(b)) pairs.push([a, b]);
              }
            }
            const usedPairs = pairs.length ? pairs : (it.premises.length === it.responses.length ? it.premises.map((_: any, i: number) => [i, i]) : []);
            if (usedPairs.length) {
              ansText = usedPairs.map(([i, j]: [number, number]) => `${it.premises[i]} ↔ ${it.responses[j]}`).join(' | ');
            }
          }
          return { learningObjective: lo, explanation: exp, answerText: ansText };
        });
        setMetas(mappedMeta);
      }
    } catch (e: any) {
      console.error('[practice] error', e);
      setError(e?.message || 'Error al generar ejercicios');
    } finally {
      setIsLoading(false);
    }
  };

  const canSave = questions.length > 0;

  return (
    <>
      <LoadingOverlay open={isLoading} title="Generando tus ejercicios" subtitle="Creando preguntas y opciones…" />
      <SaveFloatingButton
        visible={canSave}
        defaultTitle={`Práctica de ${questions.length} preguntas`}
        defaultCategory={'Prácticas'}
        onSave={({ title, category }) => {
          LocalArchive.addPractice({ title, category, questions, metas, options: practiceOptions });
          try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {}
          toast.success('Práctica guardada');
        }}
      />
      <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Guided tour overlay */}
      {tourOpen && focusRect && (
        <div className="fixed inset-0 z-[9999]">
          {/* exterior blur panels */}
          <div className="absolute left-0 top-0 w-full" style={{height:focusRect.y, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute left-0" style={{top:focusRect.y, width:focusRect.x, height:focusRect.h, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute" style={{top:focusRect.y, left:focusRect.x+focusRect.w, right:0, height:focusRect.h, background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          <div className="absolute left-0" style={{top:focusRect.y+focusRect.h, bottom:0, width:'100%', background:'rgba(2,6,23,0.75)', backdropFilter:'blur(4px)'}} onClick={skip}/>
          {/* highlight */}
          <div className="absolute rounded-xl pointer-events-none" style={{left:focusRect.x, top:focusRect.y, width:focusRect.w, height:focusRect.h, boxShadow:'0 0 0 2px rgba(56,189,248,0.9), 0 0 40px rgba(56,189,248,0.35)'}}/>
          {/* bubble */}
          <div className="absolute max-w-sm p-4 rounded-xl bg-slate-900 text-slate-100 border border-cyan-400/30 shadow-2xl" style={{left: Math.max(16, Math.min(window.innerWidth - 336, focusRect.x)), top: Math.min(window.innerHeight - 140, focusRect.y + focusRect.h + 12)}}>
            <div className="text-xs text-cyan-300 mb-1">Paso {tourIndex+1} de {steps.length}</div>
            <div className="text-sm leading-relaxed">
              <TypingText key={typingReset + tourIndex*1000} text={steps[tourIndex].text} speed={16} onStep={(i,ch)=>console.log('[practice-tour] typing',{i,ch})}/>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button onClick={prev} disabled={tourIndex===0} className="inline-flex items-center gap-2 rounded-md text-slate-300 hover:text-white px-3 py-1.5">Atrás</button>
              <div className="flex items-center gap-2">
                <button onClick={skip} className="inline-flex items-center gap-2 rounded-md text-slate-300 hover:text-white px-3 py-1.5">Saltar</button>
                <button onClick={next} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 font-semibold px-3 py-1.5 shadow ring-1 ring-white/10 hover:from-cyan-300 hover:to-sky-400">{tourIndex < steps.length-1 ? 'Siguiente' : 'Entendido'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="inline-block mb-2"><span className="text-5xl">🧠</span></div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Nueva práctica
        </h1>
        <p className="text-gray-600">Configura y genera tus ejercicios personalizados.</p>
      </div>
      {questions.length === 0 && (
        <>
          <div className="mt-10" id="pr-input">
            <PromptInput
              placeholder="Escribe el texto o tema para generar ejercicios..."
              onSendMessage={handleSendMessage}
            />
          </div>
          <PracticeOptions value={practiceOptions} onChange={setPracticeOptions} />
        </>
      )}

      {isLoading && (
        <div className="flex justify-center mt-6" aria-label="Cargando preguntas">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      )}
      {error && <p className="text-center text-red-600 mt-2">{error}</p>}

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Resultado:</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}

      {questions.length > 0 && (
        <>
          <div className="mt-6 space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-3">
                <PracticeQuestionBox
                  question={q}
                  showResults={showResults}
                  onAnswer={(ans) => setUserAnswers(prev => ({ ...prev, [q.id]: ans }))}
                />
                {showResults && (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-wide text-indigo-700 uppercase">Pregunta {idx + 1}</span>
                      {metas[idx]?.answerText && (
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-200 text-indigo-800">Respuesta</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <div className="text-[13px] text-indigo-900/90">
                          <span className="font-semibold">Objetivo de aprendizaje: </span>
                          <span>{metas[idx]?.learningObjective ?? '—'}</span>
                        </div>
                        {metas[idx]?.explanation && (
                          <div className="text-[13px] text-indigo-900/90 mt-1">
                            <span className="font-semibold">Explicación: </span>
                            <span>{metas[idx]?.explanation}</span>
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-1">
                        <div className="text-[13px] text-indigo-900/90">
                          <span className="font-semibold">Respuesta correcta: </span>
                          <span>{metas[idx]?.answerText ?? '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <PracticeGrader
            questions={questions}
            userAnswers={userAnswers}
            isGraded={showResults}
            score={score}
            onGrade={(s, _t) => { setScore(s); setShowResults(true); }}
            onReset={resetPractice}
          />
        </>
      )}
      </div>
    </>
  );
}
