// src/components/ui/CheckBox/CheckBoxItem.tsx
'use client';

import React from 'react';

export interface CheckBoxItemProps {
  item: {
    id: string;
    title: string;
    description: string;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
  variant?: 'default' | 'card' | 'minimal';
  disabled?: boolean;
}

const CheckBoxItem: React.FC<CheckBoxItemProps> = ({
  item,
  isSelected,
  onToggle,
  variant = 'default',
  disabled = false
}) => {
  const baseClasses = "flex items-start space-x-3 p-4 transition-all duration-200 cursor-pointer";
  
  const variantClasses = {
    default: `rounded-lg border-2 ${
      isSelected 
        ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`,
    card: `rounded-xl border ${
      isSelected 
        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-md' 
        : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
    }`,
    minimal: `border-b border-gray-100 ${
      isSelected 
        ? 'bg-blue-50/30' 
        : 'hover:bg-gray-50/50'
    }`
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      onClick={() => !disabled && onToggle(item.id)}
    >
      {/* Checkbox Circle */}
      <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-500 border-blue-500' 
          : 'border-gray-300 bg-white'
      } ${disabled ? 'bg-gray-200 border-gray-300' : ''}`}>
        {isSelected && (
          <i className="fas fa-check text-white text-xs transform scale-90"></i>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-sm transition-colors duration-200 ${
          isSelected ? 'text-blue-700' : 'text-gray-900'
        } ${disabled ? 'text-gray-500' : ''}`}>
          {item.title}
        </h3>
        <p className={`text-sm mt-1 transition-colors duration-200 ${
          isSelected ? 'text-blue-600/80' : 'text-gray-600'
        } ${disabled ? 'text-gray-400' : ''}`}>
          {item.description}
        </p>
      </div>

      {/* Selected Indicator */}
      {isSelected && variant !== 'minimal' && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default CheckBoxItem;