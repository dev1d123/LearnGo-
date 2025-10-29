// src/components/ui/ComboBox/ComboBox.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ComboBoxItem, { ComboBoxItemData, ComboBoxItemProps } from './ComboBoxItem';

export interface ComboBoxProps {
  items: ComboBoxItemData[];
  value?: ComboBoxItemData | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  searchable?: boolean;
  showCategory?: boolean;
  onSelect?: (item: ComboBoxItemData | null) => void;
  onSearch?: (searchTerm: string) => void;
  onCreateNew?: (searchTerm: string) => void;
  creatable?: boolean;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  items,
  value = null,
  placeholder = 'Selecciona una opción...',
  disabled = false,
  className = '',
  emptyMessage = 'No se encontraron resultados',
  searchable = true,
  showCategory = false,
  onSelect,
  onSearch,
  onCreateNew,
  creatable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filtrar items basado en búsqueda
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sincronizar input value con el valor seleccionado
  useEffect(() => {
    if (value) {
      setInputValue(value.title);
    } else {
      setInputValue('');
    }
  }, [value]);

  // Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        listRef.current && !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegación por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : creatable ? filteredItems.length : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : creatable ? filteredItems.length : filteredItems.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          handleSelect(filteredItems[highlightedIndex]);
        } else if (creatable && highlightedIndex === filteredItems.length && searchTerm.trim()) {
          handleCreateNew();
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    setHighlightedIndex(0);
    
    if (!isOpen) {
      setIsOpen(true);
    }

    onSearch?.(value);
  };

  const handleSelect = (item: ComboBoxItemData) => {
    onSelect?.(item);
    setInputValue(item.title);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  const handleCreateNew = () => {
    if (creatable && searchTerm.trim() && onCreateNew) {
      onCreateNew(searchTerm.trim());
      setInputValue(searchTerm.trim());
      setSearchTerm('');
      setIsOpen(false);
      setHighlightedIndex(0);
    }
  };

  const clearSelection = () => {
    onSelect?.(null);
    setInputValue('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
        inputRef.current?.focus();
      }
    }
  };

  const showCreateNew = creatable && searchTerm.trim() && 
    !filteredItems.some(item => 
      item.title.toLowerCase() === searchTerm.toLowerCase()
    );

  return (
    <div className={`relative ${className}`}>
      {/* Input y trigger */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        />
        
        {/* Iconos del lado derecho */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <button
              onClick={clearSelection}
              disabled={disabled}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
              aria-label="Limpiar selección"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          )}
          
          <button
            onClick={toggleDropdown}
            disabled={disabled}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label={isOpen ? "Cerrar lista" : "Abrir lista"}
          >
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-sm transition-transform duration-200`}></i>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          role="listbox"
        >
          {/* Items de la lista */}
          {filteredItems.length > 0 ? (
            <div className="p-2">
              {filteredItems.map((item, index) => (
                <ComboBoxItem
                  key={item.id}
                  item={item}
                  isSelected={value?.id === item.id}
                  isHighlighted={index === highlightedIndex}
                  onSelect={handleSelect}
                  showCategory={showCategory}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-6 text-center text-gray-500">
              <i className="fas fa-search text-2xl mb-2 opacity-50"></i>
              <p className="font-medium">{emptyMessage}</p>
              {searchTerm && (
                <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
              )}
            </div>
          )}

          {/* Opción para crear nuevo */}
          {showCreateNew && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={handleCreateNew}
                className={`w-full p-3 text-left rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all duration-200 ${
                  highlightedIndex === filteredItems.length ? 'ring-2 ring-blue-300' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i className="fas fa-plus-circle text-blue-500 text-lg"></i>
                  <div>
                    <p className="font-medium text-blue-800">
                      Crear: "{searchTerm}"
                    </p>
                    <p className="text-sm text-blue-600">
                      Presiona Enter para crear nuevo elemento
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ComboBox;