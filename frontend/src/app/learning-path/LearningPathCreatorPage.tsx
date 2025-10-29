'use client';

import React, { useState } from 'react';
import LearningPathOptions, { LearningPathOptionsData } from '../../components/layout/LearningPathOptions';
import PromptInput from '../../components/layout/PromptInput';
import LoadingModal from '../../components/layout/LoadingModal';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

export default function LearningPathCreatorPage() {
  const router = useRouter();
  
  const [options, setOptions] = useState<LearningPathOptionsData>({
    focusType: null,
    languageRegister: null,
    detailLevel: 3,
    moduleCount: 3,
    sessionsPerModule: 5,
    advancedOptions: {
      mode: 'auto',
      flashcards: { enabled: false, count: 'auto' },
      multipleChoice: { enabled: false, count: 'auto' },
      trueFalse: { enabled: false, count: 'auto' },
      fillBlank: { enabled: false, count: 'auto' },
      shortAnswer: { enabled: false, count: 'auto' },
      relationship: { enabled: false, count: 'auto' },
      justification: { enabled: false, count: 'auto' },
      wordSoup: { enabled: false },
      wordMatch: { enabled: false },
      storyShuffle: { enabled: false },
      explainItWrong: { enabled: false },
      crossword: { enabled: false }
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    console.log('Archivos subidos:', files);
  };

  const handleSendMessage = async (message: string, files: UploadedFile[]) => {
    console.log('Mensaje enviado:', message);
    console.log('Archivos:', files);
    
    // Mostrar modal de carga
    setIsCreating(true);
    setProgress(0);
    
    const requestData = {
      message,
      files: files.map(file => ({
        name: file.file.name,
        type: file.file.type,
        size: file.file.size
      })),
      options
    };
    
    console.log('Datos para el learning path:', requestData);
    
    // Simular progreso de creación
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    // Simular tiempo de procesamiento (1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Completar progreso
    setProgress(100);
    clearInterval(progressInterval);
    
    // Esperar un momento antes de redirigir
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Reemplazar con llamada real al backend
    // const response = await fetch('/api/learning-paths', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(requestData)
    // });
    // const { id } = await response.json();
    // router.push(`/learning-path/${id}`);
    
    // Temporal: usar ID del mock data existente
    const mockLearningPathId = '1'; // ID del mockLearningPaths
    console.log('Learning Path creado con ID:', mockLearningPathId);
    
    // Redirigir a la página del learning path
    router.push(`/learning-path/${mockLearningPathId}`);
  };

  return (
    <>
      {/* Modal de carga */}
      <LoadingModal
        isOpen={isCreating}
        title="Creando Learning Path"
        message="Estamos preparando tu ruta de aprendizaje personalizada..."
        progress={progress}
      />

      <div className="p-6 max-w-10xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">Learning Path Creator</h1>

        {/* PromptInput component */}
        <div className="mb-6">
          <PromptInput
            placeholder="Escribe sobre qué deseas aprender o sube archivos..."
            onFilesChange={handleFilesChange}
            onSendMessage={handleSendMessage}
          />
        </div>

      {/* Opciones seleccionadas */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Opciones seleccionadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="space-y-1">
            <p><span className="text-gray-500">Tipo de enfoque:</span> <span className="font-medium">{options.focusType ?? '—'}</span></p>
            <p><span className="text-gray-500">Registro:</span> <span className="font-medium">{options.languageRegister ?? '—'}</span></p>
          </div>
          <div className="space-y-1">
            <p><span className="text-gray-500">Nivel de detalle:</span> <span className="font-medium">{options.detailLevel}/5</span></p>
            <p><span className="text-gray-500">Número de módulos:</span> <span className="font-medium">{options.moduleCount}</span></p>
          </div>
          <div className="space-y-1">
            <p><span className="text-gray-500">Sesiones por módulo:</span> <span className="font-medium">{options.sessionsPerModule}</span></p>
            <p>
              <span className="text-gray-500">Opciones avanzadas:</span>{' '}
              <span className={`font-medium ${options.advancedOptions.mode === 'auto' ? 'text-blue-600' : 'text-orange-600'}`}>
                {options.advancedOptions.mode === 'auto' ? 'Auto' : 'Personalizado'}
              </span>
            </p>
          </div>
        </div>
        
        {/* Mostrar opciones avanzadas personalizadas */}
        {options.advancedOptions.mode === 'custom' && (() => {
          const custom: string[] = [];
          const adv = options.advancedOptions;

          if (adv.flashcards.enabled && adv.flashcards.count !== 'auto') {
            custom.push(`Flashcards: ${adv.flashcards.count}`);
          }
          if (adv.multipleChoice.enabled && adv.multipleChoice.count !== 'auto') {
            custom.push(`Multiple Choice: ${adv.multipleChoice.count}`);
          }
          if (adv.trueFalse.enabled && adv.trueFalse.count !== 'auto') {
            custom.push(`True/False: ${adv.trueFalse.count}`);
          }
          if (adv.fillBlank.enabled && adv.fillBlank.count !== 'auto') {
            custom.push(`Fill Blank: ${adv.fillBlank.count}`);
          }
          if (adv.shortAnswer.enabled && adv.shortAnswer.count !== 'auto') {
            custom.push(`Short Answer: ${adv.shortAnswer.count}`);
          }
          if (adv.relationship.enabled && adv.relationship.count !== 'auto') {
            custom.push(`Relationship: ${adv.relationship.count}`);
          }
          if (adv.justification.enabled && adv.justification.count !== 'auto') {
            custom.push(`Justification: ${adv.justification.count}`);
          }

          // Juegos
          if (adv.wordSoup.enabled) custom.push('Word Soup');
          if (adv.wordMatch.enabled) custom.push('Word Match');
          if (adv.storyShuffle.enabled) custom.push('Story Shuffle');
          if (adv.explainItWrong.enabled) custom.push('Explain It Wrong');
          if (adv.crossword.enabled) custom.push('Crossword');

          return custom.length > 0 ? (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                <span className="text-orange-600">(Personalizado)</span> Opciones avanzadas activas:
              </h3>
              <div className="flex flex-wrap gap-2">
                {custom.map((option, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-medium"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ) : null;
        })()}
        
        {/* Mostrar archivos subidos */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-2">Archivos listos para procesar:</h3>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1 text-sm border border-blue-200"
                >
                  <span className="text-blue-700 max-w-32 truncate" title={file.file.name}>
                    {file.file.name}
                  </span>
                  <span className="text-blue-500 text-xs">
                    ({(file.file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* LearningPathOptions component */}
        <div>
          <LearningPathOptions value={options} onChange={setOptions} />
        </div>
      </div>
    </>
  );
}
