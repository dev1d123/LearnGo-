import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  progress?: number; // 0-100, opcional
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  title = 'Creando Learning Path',
  message = 'Estamos preparando tu ruta de aprendizaje personalizada...',
  progress
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
        {/* Spinner animado */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Círculo exterior giratorio */}
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            
            {/* Círculo interior con gradiente */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-sm text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Barra de progreso */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Animación de puntos suspensivos */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
