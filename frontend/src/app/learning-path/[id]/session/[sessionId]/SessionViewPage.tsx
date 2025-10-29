'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Circle,
  Sparkles,
  Trophy,
  Brain,
  Gamepad2
} from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Sidebar from '@/components/layout/Sidebar';
import PracticeQuestionBox from '@/components/layout/PracticeQuestionBox';
import FlashCard from '@/components/layout/FlashCard';
import type { QuestionData } from '@/components/layout/PracticeQuestionBox';
import type { FlashCardData as FlashCardComponentData } from '@/types/FlashCardData';
import { getSessionById } from '@/resources/files/mockLearningPaths';
import type { Session, Topic } from '@/types/LearningPath';

// Componente para renderizar el contenido markdown
const TopicContent: React.FC<{ content: string }> = ({ content }) => {
  // Parsear markdown a HTML de forma básica
  const parseMarkdown = (text: string) => {
    let html = text;
    
    // Bloques de código
    html = html.replace(/```javascript\n([\s\S]+?)```/g, (_, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-6 shadow-lg"><code class="language-javascript">${code.trim()}</code></pre>`;
    });
    
    // Headers
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-4 mt-8">$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-gray-800 mb-3 mt-6">$2</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-800 mb-2 mt-4">$3</h3>');
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-sm font-mono">$1</code>');
    
    // Líneas en blanco como separador de párrafos
    html = html.split('\n\n').map(paragraph => {
      // No envolver si ya es un elemento HTML
      if (paragraph.trim().startsWith('<')) {
        return paragraph;
      }
      // No envolver líneas vacías
      if (!paragraph.trim()) {
        return '';
      }
      return `<p class="text-gray-700 mb-4 leading-relaxed">${paragraph.trim()}</p>`;
    }).join('\n');
    
    return html;
  };

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

export default function SessionViewPage() {
  const params = useParams();
  const router = useRouter();
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Obtener sessionId de los parámetros
  const sessionId = params?.sessionId as string;
  
  // Cargar datos desde mock
  const session = getSessionById(sessionId);
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesión no encontrada</h2>
          <p className="text-gray-600">La sesión que buscas no existe</p>
          <button
            onClick={() => router.push('/learning-path')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Validar que la sesión tenga topics
  if (!session.topics || session.topics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesión sin contenido</h2>
          <p className="text-gray-600">Esta sesión aún no tiene topics disponibles</p>
          <button
            onClick={() => router.push(`/learning-path/${params?.id}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Learning Path
          </button>
        </div>
      </div>
    );
  }

  const currentTopic = session.topics[currentTopicIndex];
  const totalTopics = session.topics.length;
  const progressPercentage = ((currentTopicIndex + 1) / totalTopics) * 100;
  
  // Preparar flashcards para el componente (convertir formato)
  const flashcards: FlashCardComponentData[] = currentTopic?.flashcards.map(fc => ({
    id: fc.id,
    front: { text: fc.question, color: '#ffffff' },
    back: { text: fc.answer, color: '#f3f4f6' }
  })) || [];
  
  // Preparar questions para el componente (convertir formato)
  const questions: QuestionData[] = currentTopic?.practice.map(q => {
    if (q.type === 'multiple-choice') {
      const opts = q.options || [];
      let idx = 0;
      if (typeof q.correctAnswer === 'string') {
        const found = opts.indexOf(q.correctAnswer);
        idx = found >= 0 ? found : 0;
      } else if (Array.isArray(q.correctAnswer) && q.correctAnswer.length > 0) {
        const found = opts.indexOf(q.correctAnswer[0]);
        idx = found >= 0 ? found : 0;
      }
      return {
        id: q.id,
        type: 'multiple-choice',
        question: q.question,
        options: opts,
        correctAnswer: idx,
        points: 5,
      };
    }
    if (q.type === 'true-false') {
      const val = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;
      return {
        id: q.id,
        type: 'true-false',
        question: q.question,
        correctAnswer: String(val).toLowerCase() === 'true',
        points: 3,
      };
    }
    if (q.type === 'fill-blank') {
      return {
        id: q.id,
        type: 'fill-blank',
        question: q.question,
        blanks: 1,
        correctAnswers: Array.isArray(q.correctAnswer) ? q.correctAnswer : [String(q.correctAnswer)],
        points: 4,
      };
    }
    if (q.type === 'relationship' && q.pairs) {
      return {
        id: q.id,
        type: 'relationship',
        question: q.question,
        items: q.pairs.map(p => p.left),
        concepts: q.pairs.map(p => p.right),
        correctPairs: q.pairs.map((_, idx) => [idx, idx]),
        points: 8,
      };
    }
    // Default fallback para short-answer
    return {
      id: q.id,
      type: 'short-answer',
      question: q.question,
      correctAnswer: Array.isArray(q.correctAnswer) ? (q.correctAnswer[0] ?? '') : String(q.correctAnswer ?? ''),
      points: 6,
    };
  }) || [];

  const handleNextTopic = () => {
    if (currentTopicIndex < totalTopics - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Última teoría, pasar a práctica
      setShowPractice(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevTopic = () => {
    if (showPractice) {
      setShowPractice(false);
      setCurrentTopicIndex(totalTopics - 1);
    } else if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopicSelect = (index: number) => {
    setCurrentTopicIndex(index);
    setShowPractice(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkTopicComplete = () => {
    // Aquí marcar el topic como completado en el backend
    if (currentTopicIndex < totalTopics - 1) {
      handleNextTopic();
    }
  };

  const handleNextFlashcard = () => {
    setIsFlashcardFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlashcardFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleCompleteSession = () => {
    // Navegar de vuelta al learning path view
    router.push(`/learning-path/${params?.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <NavBar />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Contenido principal */}
        <div className="flex-1">
          {/* Header fijo - Se extiende detrás del sidebar, debajo del navbar */}
          <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 md:ml-64">
              {/* Breadcrumb con botón de volver */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <button
                    onClick={() => router.push(`/learning-path/${params?.id}`)}
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Learning Path</span>
                  </button>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{session.name}</span>
                </div>
                
                {/* Botón de volver al Learning Path */}
                <button
                  onClick={() => router.push(`/learning-path/${params?.id}`)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Volver al Path</span>
                </button>
              </div>

          {/* Barra de progreso */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {showPractice ? 'Práctica' : `Tema ${currentTopicIndex + 1} de ${totalTopics}`}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Botones de navegación superiores */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevTopic}
              disabled={currentTopicIndex === 0 && !showPractice}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentTopicIndex === 0 && !showPractice
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">
                {showPractice ? 'Fase de Práctica' : `Tema ${currentTopicIndex + 1} de ${totalTopics}`}
              </span>
            </div>

            <button
              onClick={handleNextTopic}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>{currentTopicIndex === totalTopics - 1 && !showPractice ? 'Ir a Práctica' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Selector de topics */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {session.topics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTopicIndex === index && !showPractice
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Circle className="w-4 h-4" />
                  <span>Tema {index + 1}</span>
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowPractice(true)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showPractice
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Práctica</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-4 pt-25 pb-8 md:ml-64">
        {!showPractice ? (
          /* Vista de Teoría */
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header del topic */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <BookOpen className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">{currentTopic.title}</h1>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span>⏱️ {currentTopic.duration}</span>
                    <span>📖 Tema {currentTopicIndex + 1} de {totalTopics}</span>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Contenido del topic */}
            <div className="px-8 py-8">
              <TopicContent content={currentTopic.theory} />
            </div>

            {/* Footer con navegación */}
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevTopic}
                  disabled={currentTopicIndex === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentTopicIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Tema Anterior</span>
                </button>

                <button
                  onClick={handleMarkTopicComplete}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Marcar como Completado</span>
                </button>

                <button
                  onClick={handleNextTopic}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span>{currentTopicIndex === totalTopics - 1 ? 'Ir a Práctica' : 'Siguiente Tema'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Vista de Práctica */
          <div className="space-y-8">
            {/* Header de práctica */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Trophy className="w-7 h-7" />
                    <h1 className="text-3xl font-bold">¡Pon en Práctica lo Aprendido!</h1>
                  </div>
                  <p className="text-purple-100">
                    Refuerza tus conocimientos con flashcards, preguntas y ejercicios interactivos
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de Flashcards */}
            {flashcards.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Flashcards de Repaso</h2>
                    <p className="text-gray-600">Memoriza conceptos clave</p>
                  </div>
                </div>

                {/* Flashcard container */}
                <div className="my-8">
                  <div className="flex items-center justify-center gap-6 max-w-6xl mx-auto">
                    <button
                      onClick={handlePrevFlashcard}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                      disabled={flashcards.length <= 1}
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="flex justify-center flex-1">
                      <FlashCard
                        card={flashcards[currentFlashcardIndex]}
                        isFlipped={isFlashcardFlipped}
                        onFlip={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                      />
                    </div>

                    <button
                      onClick={handleNextFlashcard}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                      disabled={flashcards.length <= 1}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="text-center text-gray-600">
                  Flashcard {currentFlashcardIndex + 1} de {flashcards.length}
                </div>
              </div>
            )}

            {/* Sección de Preguntas */}
            {questions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Preguntas de Evaluación</h2>
                    <p className="text-gray-600">Demuestra lo que has aprendido</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((question) => (
                    <PracticeQuestionBox
                      key={question.id}
                      question={question}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sección de Juegos (placeholder) */}
            {false && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Juegos Interactivos</h2>
                    <p className="text-gray-600">Aprende jugando</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 text-center">
                  <Gamepad2 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <p className="text-gray-600">Los juegos interactivos estarán disponibles próximamente</p>
                </div>
              </div>
            )}

            {/* Footer de práctica */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowPractice(false);
                    setCurrentTopicIndex(totalTopics - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Volver a Teoría</span>
                </button>

                <button
                  onClick={handleCompleteSession}
                  className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Completar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    </div>
  );
}
