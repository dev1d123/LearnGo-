import React, { useEffect, useState, useRef } from 'react';
import WordSearchGame from './WordSearchGame';
import WordConnectGame from './WordConnectGame';
import CrosswordGame from './CrosswordGame';
import ExplainIt from './ExplainIt';
import { Api } from '@/services/api';

/* ---------- Types ---------- */
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameParams {
  timeSeconds: number;
  difficulty: Difficulty;
  hints: number;
}

export interface GameStats {
  timeStartedAt: number;
  timeEndedAt: number;
  timeRemaining: number;
  hintsUsed: number;
  difficulty: Difficulty;
  won: boolean;
}

/* ---------- Utility: score calculation ---------- */
function computeScore(stats: GameStats): number {
  const base = stats.difficulty === 'easy' ? 100 : stats.difficulty === 'medium' ? 200 : 350;
  const timeBonus = Math.max(0, Math.floor(stats.timeRemaining));
  const hintPenalty = stats.hintsUsed * 25;
  const winBonus = stats.won ? 150 : 0;
  return Math.max(0, base + timeBonus + winBonus - hintPenalty);
}

/* ---------- ModalVictory ---------- */
function difficultyToEs(d: Difficulty): string {
  switch (d) {
    case 'easy':
      return 'fácil';
    case 'medium':
      return 'medio';
    case 'hard':
      return 'difícil';
    default:
      return String(d);
  }
}

function ModalVictory({ stats, onClose, wordsCount }: { stats: GameStats; onClose: () => void; wordsCount?: number }) {
  const score = computeScore(stats);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[min(90%,640px)] bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-semibold mb-2">{stats.won ? '¡Victoria!' : 'Juego terminado'}</h2>
        <p className="text-sm text-gray-600 mb-4">Resumen del juego</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500">Dificultad</p>
            <p className="font-medium">{difficultyToEs(stats.difficulty)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Estado</p>
            <p className="font-medium">{stats.won ? 'Ganado' : 'No ganado'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tiempo restante (s)</p>
            <p className="font-medium">{Math.max(0, Math.floor(stats.timeRemaining))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pistas usadas</p>
            <p className="font-medium">{stats.hintsUsed}</p>
          </div>
          {typeof wordsCount === 'number' && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Palabras</p>
              <p className="font-medium">{wordsCount}</p>
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">Score calculado</p>
          <p className="text-3xl font-extrabold">{score}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- GameShell ---------- */
export function GameShell({
  title,
  defaultParams,
  renderGameContent,
  onFinish,
  summaryWordsCount,
}: {
  title: string;
  defaultParams?: GameParams;
  renderGameContent: (controls: {
    started: boolean;
    params: GameParams;
    useHint: () => boolean;
    endGame: (won?: boolean) => void;
    ticks: number;
  }) => React.ReactNode;
  onFinish?: (stats: GameStats) => void;
  summaryWordsCount?: number;
}) {
  const [params, setParams] = useState<GameParams>(
    defaultParams ?? { timeSeconds: 60, difficulty: 'medium', hints: 3 }
  );
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(params.timeSeconds);
  const [hintsLeft, setHintsLeft] = useState<number>(params.hints);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(false);
  const [ticks, setTicks] = useState(0);

  const timerRef = useRef<number | null>(null);
  const timeStartedAtRef = useRef<number | null>(null);

  function startGame() {
    setTimeLeft(params.timeSeconds);
    setHintsLeft(params.hints);
    setHintsUsed(0);
    setStarted(true);
    setShowModal(false);
    setWon(false);
    setTicks(0);
    timeStartedAtRef.current = Date.now();
  }

  function useHint() {
    if (!started) return false;
    if (hintsLeft <= 0) return false;
    setHintsLeft((h) => h - 1);
    setHintsUsed((u) => u + 1);
    return true;
  }

  function endGameCallback(didWin = false) {
    if (!started) return;
    setStarted(false);
    setShowModal(true);
    setWon(didWin);

    const now = Date.now();
    const stats: GameStats = {
      timeStartedAt: timeStartedAtRef.current ?? now,
      timeEndedAt: now,
      timeRemaining: timeLeft,
      hintsUsed,
      difficulty: params.difficulty,
      won: didWin,
    };

    if (onFinish) onFinish(stats);
  }

  useEffect(() => {
    if (!started) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          endGameCallback(false);
          return 0;
        }
        return t - 1;
      });
      setTicks((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [started]);

  useEffect(() => {
    if (!started) {
      setTimeLeft(params.timeSeconds);
      setHintsLeft(params.hints);
    }
  }, [params, started]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-blue-50 rounded-2xl shadow-xl p-4 border border-indigo-100">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-fuchsia-600 bg-clip-text text-transparent tracking-tight">{title}</h1>
            <p className="text-sm text-gray-600">Configura el juego antes de empezar</p>
          </div>

          <div className="flex gap-3 items-center">
            {started && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-gray-500">Tiempo</span>
                <span className="px-3 py-1 rounded-full bg-black text-white text-sm font-mono shadow">
                  {Math.max(0, Math.floor(timeLeft))}s
                </span>
              </div>
            )}
            {!started && (
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Tiempo (s)</label>
                  <input
                    type="number"
                    value={params.timeSeconds}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, timeSeconds: Math.max(5, Number(e.target.value) || 5) }))
                    }
                    className="w-24 px-3 py-1.5 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
                  />
                </div>

                <button
                  onClick={startGame}
                  className="ml-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
                >
                  Jugar
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-[260px] bg-white rounded-xl p-4 flex flex-col border border-gray-100 shadow-inner">
          {renderGameContent({
            started,
            params,
            useHint: useHint,
            endGame: endGameCallback,
            ticks,
          })}
        </main>
      </div>

      {started && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => endGameCallback(false)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
          >
            Terminar juego
          </button>
        </div>
      )}

      {showModal && (
        <ModalVictory
          stats={{
            timeStartedAt: timeStartedAtRef.current ?? Date.now(),
            timeEndedAt: Date.now(),
            timeRemaining: timeLeft,
            hintsUsed,
            difficulty: params.difficulty,
            won,
          }}
          wordsCount={summaryWordsCount}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ---------- Game Components ---------- */

// GameOne - WordSearch
export function GameOne({ words, size = 12, onComplete, difficulty = 'medium' }: { words: string[]; size?: number; onComplete?: () => void; difficulty?: Difficulty }) {
  const [wsLanguage, setWsLanguage] = useState<string>('Spanish');

  return (
    <GameShell
      title="Sopa de Letras"
      defaultParams={{ timeSeconds: 90, difficulty, hints: 2 }}
      summaryWordsCount={words.length}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Ajusta los parámetros y pulsa Jugar para iniciar la sopa de letras.</p>
          ) : (
            <>
              <WordSearchGame
                words={words}
                size={size}
                onComplete={() => {
                  endGame(true);
                  onComplete?.();
                }}
              />
            </>
          )}
        </div>
      )}
    />
  );
}

// GameTwo - WordConnect
export function GameTwo({ words, onComplete, difficulty = 'medium' }: { words: string[]; onComplete?: () => void; difficulty?: Difficulty }) {
  return (
    <GameShell
      title="Conecta las Letras"
      defaultParams={{ timeSeconds: 60, difficulty, hints: 2 }}
      summaryWordsCount={words.length}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Une las letras en círculo para formar las palabras correctas.</p>
          ) : (
            <WordConnectGame
              words={words}
              onComplete={() => {
                endGame(true);
                onComplete?.();
              }}
            />
          )}
        </div>
      )}
    />
  );
}

// GameThree - Crossword
export function GameThree({ words, size = 12, onComplete, difficulty = 'medium' }: { words: { id: number; word: string; clue: string }[]; size?: number; onComplete?: () => void; difficulty?: Difficulty }) {
  return (
    <GameShell
      title="Crucigrama"
      defaultParams={{ timeSeconds: 90, difficulty, hints: 2 }}
      summaryWordsCount={words.length}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Completa el crucigrama escribiendo las palabras correctas.</p>
          ) : (
            <CrosswordGame
              words={words}
              size={size}
              onComplete={() => {
                endGame(true);
                onComplete?.();
              }}
            />
          )}
        </div>
      )}
    />
  );
}

// GameFour - ExplainIt
export function GameFour({ question, onComplete }: { question: string; onComplete?: () => void }) {
  return (
    <GameShell
      title="Explícalo"
      defaultParams={{ timeSeconds: 120, difficulty: 'medium', hints: 1 }}
      renderGameContent={({ started, endGame }) => (
        <div className="p-4">
          {!started ? (
            <p className="text-gray-500">Explica el concepto que se te indica y presiona "Jugar" para empezar.</p>
          ) : (
            <ExplainIt 
              question={question}
            />
          )}
        </div>
      )}
    />
  );
}

// GameFive - Placeholder (sin props específicos)
export function GameFive({ onComplete }: { onComplete?: () => void }) {
  const [canPress, setCanPress] = useState(false);
  const windowRef = useRef<number | null>(null);

  return (
    <GameShell
      title="Juego de Reacción"
      defaultParams={{ timeSeconds: 20, difficulty: 'medium', hints: 0 }}
      renderGameContent={({ started, useHint, endGame, ticks }) => {
        React.useEffect(() => {
          if (!started) return;
          setCanPress(false);
          if (windowRef.current) window.clearTimeout(windowRef.current);
          const when = Math.floor(Math.random() * 9) + 3;
          windowRef.current = window.setTimeout(() => setCanPress(true), when * 1000);
          return () => {
            if (windowRef.current) window.clearTimeout(windowRef.current);
          };
        }, [started]);

        return (
          <div className="p-4">
            {!started ? (
              <p className="text-gray-500">Prepárate para reaccionar.</p>
            ) : (
              <div className="space-y-3">
                <p>Presiona el botón cuando aparezca "¡Ahora!"</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      endGame(canPress);
                      if (canPress) onComplete?.();
                    }}
                    className={`px-4 py-2 rounded-lg ${canPress ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                  >
                    {canPress ? '¡Ahora!' : 'Esperando...'}
                  </button>

                  <button
                    onClick={() => {
                      if (useHint()) alert('Concéntrate en el cambio de color.');
                      else alert('No quedan pistas');
                    }}
                    className="px-3 py-2 border rounded-lg"
                  >
                    Pista
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}