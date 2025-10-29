import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown,
  PlayCircle,
  FileText,
  GraduationCap
} from 'lucide-react';

interface ResponseVisualizerProps {
  content: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onExercises?: () => void;
  onFlashcards?: () => void;
  onLearningPath?: () => void;
  isLoading?: boolean;
}

// Tipos para los componentes de react-markdown
interface CodeProps {
  node?: any;
  className?: string;
  children?: React.ReactNode;
}

const ResponseVisualizer: React.FC<ResponseVisualizerProps> = ({
  content,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
  onExercises,
  onFlashcards,
  onLearningPath,
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  const handleRegenerate = () => {
    onRegenerate?.();
  };

  // Componente personalizado para código
  const CodeBlock = ({ node, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !className?.includes('language-');

    if (isInline) {
      return (
        <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    return (
      <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Área principal de contenido */}
      <div className="relative min-h-[400px] max-h-[70vh] overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : content ? (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code: CodeBlock
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>No hay respuesta para mostrar</p>
          </div>
        )}

        {/* Botones flotantes en esquina inferior derecha */}
        {content && !isLoading && (
          <div className="sticky bottom-4 float-right clear-both mt-4">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-2 shadow-lg">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                title="Copiar respuesta"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                title="Regenerar respuesta"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerar</span>
              </button>

              <div className="h-4 w-px bg-gray-300"></div>

              <button
                onClick={onLike}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                title="Me gusta esta respuesta"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Me gusta</span>
              </button>

              <button
                onClick={onDislike}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                title="No me gusta esta respuesta"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>No me gusta</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botones inferiores */}
      {content && !isLoading && (
        <div className="border-t border-gray-200 bg-gray-50/50 p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={onExercises}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Ejercicios</span>
            </button>

            <button
              onClick={onFlashcards}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
            >
              <FileText className="w-5 h-5" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={onLearningPath}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-sm"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Ruta de aprendizaje</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseVisualizer;