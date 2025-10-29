// src/components/ui/ListBox/ListBox.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import ListBoxItem, { ListBoxItemData, ListBoxItemProps } from './ListBoxItem';

export interface ListBoxProps {
  items: ListBoxItemData[];
  variant?: ListBoxItemProps['variant'];
  selectionMode?: 'single' | 'multiple';
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  searchable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onActiveItemChange?: (activeId: string | null) => void;
  selectedIds?: string[]; // new: controlled selection
  defaultSelectedIds?: string[]; // new: initial selection
}

const ListBox: React.FC<ListBoxProps> = ({
  items,
  variant = 'default',
  selectionMode = 'single',
  disabled = false,
  className = '',
  emptyMessage = 'No hay elementos disponibles',
  searchable = false,
  onSelectionChange,
  onActiveItemChange,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = []
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(controlledSelectedIds ?? defaultSelectedIds);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // Sync with controlled prop
  useEffect(() => {
    if (controlledSelectedIds) {
      setSelectedIds(controlledSelectedIds);
    }
  }, [controlledSelectedIds]);

  // Filtrar items basado en búsqueda
  const filteredItems = searchable 
    ? items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!listRef.current) return;

      const currentIndex = filteredItems.findIndex(item => item.id === activeId);
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % filteredItems.length;
          setActiveId(filteredItems[nextIndex]?.id || null);
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex <= 0 ? filteredItems.length - 1 : currentIndex - 1;
          setActiveId(filteredItems[prevIndex]?.id || null);
          break;
        
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeId) {
            handleSelect(activeId);
          }
          break;
        
        case 'Home':
          e.preventDefault();
          setActiveId(filteredItems[0]?.id || null);
          break;
        
        case 'End':
          e.preventDefault();
          setActiveId(filteredItems[filteredItems.length - 1]?.id || null);
          break;
      }
    };

    if (listRef.current) {
      listRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      listRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeId, filteredItems]);

  // Notificar cambios en el item activo
  useEffect(() => {
    onActiveItemChange?.(activeId);
  }, [activeId, onActiveItemChange]);

  const handleSelect = (id: string) => {
    if (disabled) return;

    const item = items.find(item => item.id === id);
    if (item?.disabled) return;

    let newSelectedIds: string[];
    
    if (selectionMode === 'single') {
      newSelectedIds = selectedIds.includes(id) ? [] : [id];
    } else {
      newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id];
    }

    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const selectAll = () => {
    const enabledItems = items.filter(item => !item.disabled);
    const allIds = enabledItems.map(item => item.id);
    setSelectedIds(allIds);
    onSelectionChange?.(allIds);
  };

  const clearAll = () => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  };

  return (
    <div className={`space-y-4 ${className}`} ref={listRef} tabIndex={0} role="listbox">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Búsqueda */}
        {searchable && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Buscar elementos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                disabled={disabled}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Controles de selección */}
        {selectionMode === 'multiple' && filteredItems.length > 0 && (
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">
              {selectedIds.length} de {filteredItems.length} seleccionados
            </span>
            <div className="flex space-x-2">
              <button
                onClick={selectAll}
                disabled={disabled}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
              >
                <i className="fas fa-check-double text-xs"></i>
                <span>Seleccionar todos</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={clearAll}
                disabled={disabled}
                className="text-gray-600 hover:text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
              >
                <i className="fas fa-broom text-xs"></i>
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de items */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <ListBoxItem
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            isActive={activeId === item.id}
            onSelect={handleSelect}
            variant={variant}
            showIndicator={selectionMode === 'multiple'}
          />
        ))}
      </div>

      {/* Estados vacíos */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
          {searchTerm ? (
            <>
              <i className="fas fa-search text-3xl mb-3 opacity-50"></i>
              <p className="text-lg font-medium mb-2">No se encontraron resultados</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Limpiar búsqueda
              </button>
            </>
          ) : (
            <>
              <i className="fas fa-inbox text-3xl mb-3 opacity-50"></i>
              <p className="text-lg font-medium">{emptyMessage}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ListBox;