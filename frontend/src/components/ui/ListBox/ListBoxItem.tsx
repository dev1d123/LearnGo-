// src/components/ui/ListBox/ListBoxItem.tsx
'use client';

import React from 'react';

export interface ListBoxItemData {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
}

export interface ListBoxItemProps {
  item: ListBoxItemData;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (id: string) => void;
  variant?: 'default' | 'card' | 'minimal';
  showIndicator?: boolean;
}

const ListBoxItem: React.FC<ListBoxItemProps> = ({
  item,
  isSelected,
  isActive,
  onSelect,
  variant = 'default',
  showIndicator = true
}) => {
  const handleClick = () => {
    if (!item.disabled) {
      onSelect(item.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const baseClasses = "flex items-start space-x-4 p-4 transition-all duration-200 cursor-pointer focus:outline-none";
  
  const variantClasses = {
    default: `rounded-lg border-2 ${
      isSelected 
        ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    } ${isActive ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`,
    card: `rounded-xl border ${
      isSelected 
        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-md' 
        : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
    } ${isActive ? 'ring-2 ring-blue-400 ring-opacity-30' : ''}`,
    minimal: `border-b border-gray-100 last:border-b-0 ${
      isSelected 
        ? 'bg-blue-50/30' 
        : 'hover:bg-gray-50/50'
    } ${isActive ? 'bg-blue-100/50' : ''}`
  };

  const disabledClasses = item.disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : 0}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Icono opcional */}
      {item.icon && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        } transition-colors duration-200`}>
          <i className={`${item.icon} text-sm`}></i>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <h3 className={`font-semibold text-sm transition-colors duration-200 ${
            isSelected ? 'text-blue-700' : 'text-gray-900'
          } ${item.disabled ? 'text-gray-500' : ''}`}>
            {item.title}
          </h3>
          {item.badge && (
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              isSelected 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600'
            } transition-colors duration-200`}>
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className={`text-sm mt-1 transition-colors duration-200 ${
            isSelected ? 'text-blue-600/80' : 'text-gray-600'
          } ${item.disabled ? 'text-gray-400' : ''}`}>
            {item.description}
          </p>
        )}
      </div>

      {/* Indicador de selección */}
      {showIndicator && (
        <div className="flex-shrink-0 flex items-center justify-center">
          {isSelected ? (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transform scale-100 animate-pulse">
              <i className="fas fa-check text-white text-xs"></i>
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full transition-colors duration-200 hover:border-blue-400"></div>
          )}
        </div>
      )}

      {/* Indicador de activo (para navegación por teclado) */}
      {isActive && variant !== 'minimal' && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default ListBoxItem;