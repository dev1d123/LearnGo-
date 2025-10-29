import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Paperclip, 
  X, 
  Plus, 
  FileText, 
  Image, 
  FileCode, 
  File,
  FileSpreadsheet,
  Video,
  Send, // added
} from 'lucide-react';

// Tipos para TypeScript
interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

interface PromptInputProps {
  placeholder?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
  onSendMessage?: (message: string, files: UploadedFile[]) => void;
}

// Función para obtener el icono según el tipo de archivo
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (fileType === 'application/pdf') return <FileText className="w-4 h-4" />;
  if (fileType.startsWith('text/') || fileType.includes('code')) return <FileCode className="w-4 h-4" />;
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-4 h-4" />;
  if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
  if (fileType.startsWith('audio/')) return <File className="w-4 h-4" />; // Usamos File para audio
  return <File className="w-4 h-4" />;
};

// Función para obtener el color según el tipo de archivo
const getFileColor = (fileType: string) => {
  if (fileType.startsWith('image/')) return 'text-blue-500';
  if (fileType === 'application/pdf') return 'text-red-500';
  if (fileType.startsWith('text/') || fileType.includes('code')) return 'text-green-500';
  if (fileType.startsWith('video/')) return 'text-purple-500';
  if (fileType.startsWith('audio/')) return 'text-yellow-500';
  return 'text-gray-500';
};

const PromptInput: React.FC<PromptInputProps> = ({ 
  placeholder = "Escribe tu mensaje...",
  onFilesChange,
  onSendMessage
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState('');

  // Enable/disable send button
  const canSend = message.trim().length > 0 || uploadedFiles.length > 0;

  // Función para manejar la eliminación de archivos
  const removeFile = (fileId: string) => {
    const newFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles);
    
    // Limpiar URLs de preview para imágenes
    const fileToRemove = uploadedFiles.find(file => file.id === fileId);
    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
  };

  // Configuración de react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploadedFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  }, [uploadedFiles, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true
  });

  // Función para manejar el envío del mensaje
  const handleSend = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      onSendMessage?.(message, uploadedFiles);
      setMessage('');
      // Limpiar preview URLs antes de limpiar los archivos
      uploadedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
      setUploadedFiles([]);
    }
  };

  // Función para manejar la tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div 
        {...getRootProps()} 
        className={`
          border border-gray-300 rounded-lg p-4 bg-white shadow-sm
          ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Área de archivos subidos */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm border border-gray-200"
              >
                <div className={`flex items-center gap-1 ${getFileColor(uploadedFile.file.type)}`}>
                  {getFileIcon(uploadedFile.file.type)}
                  <span className="max-w-32 truncate" title={uploadedFile.file.name}>
                    {uploadedFile.file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(uploadedFile.id);
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Área de entrada de texto */}
        <div className="flex items-start gap-3">
          {/* Botón de más opciones */}
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Más opciones"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Área de texto */}
          <div className="flex-1 min-w-0">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              rows={1}
              className="w-full resize-none border-0 focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-900 bg-transparent"
              style={{ 
                minHeight: '24px', 
                maxHeight: '120px',
                overflowY: 'auto'
              }}
            />
          </div>

          {/* Botón de adjuntar archivo */}
          <button
            type="button"
            onClick={open}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Adjuntar archivos"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Botón de enviar */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Enviar"
            title="Enviar"
            className={`flex-shrink-0 p-2 rounded-lg transition-colors shadow-sm
              ${canSend 
                ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Indicador de arrastrar archivos */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center pointer-events-none">
          <div className="text-blue-500 text-center bg-white bg-opacity-90 rounded-lg p-4">
            <Paperclip className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Suelta los archivos aquí</p>
            <p className="text-sm text-blue-400">Se agregarán a tu mensaje</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptInput;