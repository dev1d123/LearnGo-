// src/components/ui/ComboBox/ComboBoxItem.tsx
'use client';

import React from 'react';

export interface ComboBoxItemData {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
}

export interface ComboBoxItemProps {
  item: ComboBoxItemData;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (item: ComboBoxItemData) => void;
  showCategory?: boolean;
}

const ComboBoxItem: React.FC<ComboBoxItemProps> = ({
  item,
  isSelected,
  isHighlighted,
  onSelect,
  showCategory = false
}) => {
  const handleClick = () => {
    if (!item.disabled) {
      onSelect(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : 0}
      className={`p-3 cursor-pointer transition-all duration-200 border-l-4 ${
        isSelected
          ? 'bg-blue-50 border-blue-500 text-blue-900'
          : isHighlighted
          ? 'bg-gray-100 border-gray-300 text-gray-900'
          : 'bg-white border-transparent text-gray-700 hover:bg-gray-50'
      } ${
        item.disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-md'
      } first:rounded-t-lg last:rounded-b-lg`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start space-x-3">
        {/* Icono */}
        {item.icon && (
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
          } transition-colors duration-200`}>
            <i className={`${item.icon} text-sm`}></i>
          </div>
        )}

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-medium text-sm ${
                  isSelected ? 'text-blue-800' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                {showCategory && item.category && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isSelected 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.category}
                  </span>
                )}
              </div>
              
              {item.description && (
                <p className={`text-sm mt-1 ${
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.description}
                </p>
              )}
            </div>

            {/* Indicador de selección */}
            {isSelected && (
              <div className="flex-shrink-0 ml-2">
                <i className="fas fa-check-circle text-blue-500 text-sm"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Efecto de highlight con animación */}
      {isHighlighted && !isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default ComboBoxItem;