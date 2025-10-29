import React, { useState, useEffect } from 'react';
import { FlashCardData } from '../../types/FlashCardData';

interface FlashCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Omit<FlashCardData, 'id'>) => void;
  card?: FlashCardData | null;
  mode: 'create' | 'edit';
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  card, 
  mode 
}) => {
  const [frontText, setFrontText] = useState('');
  const [frontColor, setFrontColor] = useState('#ffffff');
  const [backText, setBackText] = useState('');
  const [backColor, setBackColor] = useState('#f3f4f6');

  useEffect(() => {
    if (card && mode === 'edit') {
      setFrontText(card.front.text);
      setFrontColor(card.front.color);
      setBackText(card.back.text);
      setBackColor(card.back.color);
    } else {
      setFrontText('');
      setFrontColor('#ffffff');
      setBackText('');
      setBackColor('#f3f4f6');
    }
  }, [card, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      front: {
        text: frontText,
        color: frontColor
      },
      back: {
        text: backText,
        color: backColor
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'create' ? 'Crear Flashcard' : 'Editar Flashcard'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Front side */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anverso
            </label>
            <textarea
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Texto del anverso..."
              required
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color del anverso
              </label>
              <input
                type="color"
                value={frontColor}
                onChange={(e) => setFrontColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          </div>

          {/* Back side */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reverso
            </label>
            <textarea
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Texto del reverso..."
              required
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color del reverso
              </label>
              <input
                type="color"
                value={backColor}
                onChange={(e) => setBackColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mode === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashCardModal;