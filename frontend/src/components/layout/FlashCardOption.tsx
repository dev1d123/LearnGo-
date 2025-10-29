'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CheckBox from '@/components/ui/CheckBox/CheckBox';
import Slider from '@/components/ui/Slider/Slider';

type Complexity = 1 | 2 | 3;

export interface FlashCardOptionsValue {
  count: 4 | 8 | 12;
  complexity: Complexity;
  focuses: string[];
}

interface FlashCardOptionProps {
  value?: FlashCardOptionsValue;
  onChange?: (value: FlashCardOptionsValue) => void;
  className?: string;
}

const COUNT_ITEMS = [
  { id: '4', title: '4', description: 'Sesión rápida' },
  { id: '8', title: '8', description: 'Equilibrado' },
  { id: '12', title: '12', description: 'Sesión completa' }
];

const FOCUS_ITEMS = [
  { id: 'vocabulario', title: 'Vocabulario', description: 'Términos clave' },
  { id: 'conceptos', title: 'Conceptos', description: 'Ideas fundamentales' },
  { id: 'definiciones', title: 'Definiciones', description: 'Significados claros' },
  { id: 'ejemplos', title: 'Ejemplos', description: 'Casos prácticos' },
  { id: 'comparaciones', title: 'Comparaciones', description: 'Diferencias y similitudes' }
];

const complexityLabel = (c: Complexity) =>
  c === 1 ? 'Básico' : c === 2 ? 'Intermedio' : 'Avanzado';

const FlashCardOption: React.FC<FlashCardOptionProps> = ({ value, onChange, className = '' }) => {
  const [internal, setInternal] = useState<FlashCardOptionsValue>(
    value ?? { count: 8, complexity: 2, focuses: ['conceptos', 'definiciones'] }
  );

  useEffect(() => {
    if (value) setInternal(value);
  }, [value]);

  // Emit changes upstream
  useEffect(() => {
    onChange?.(internal);
  }, [internal, onChange]);

  const selectedCountId = useMemo(() => String(internal.count), [internal.count]);

  return (
    <div
      id="fc-options"
      className={[
        'bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl',
        'transition-all duration-300 hover:shadow-[0_10px_40px_rgba(2,132,199,0.12)]',
        className
      ].join(' ')}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Opciones de Flashcards</h3>
            <p className="text-xs text-gray-500 mt-1">
              Personaliza cantidad, dificultad y enfoque
            </p>
          </div>
          <div className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
            Configuración
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cantidad (selección única) */}
        <div className="col-span-1" id="fc-opt-count">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Número de flashcards
            </h4>
          </div>
          <CheckBox
            items={COUNT_ITEMS}
            selectionMode="single"
            selectedIds={[selectedCountId]}
            onSelectionChange={(ids) => {
              const next = Number(ids[0] ?? internal.count) as 4 | 8 | 12;
              setInternal((prev) => ({ ...prev, count: (next || 8) as 4 | 8 | 12 }));
            }}
            className="space-y-2"
          />
        </div>

        {/* Complejidad (slider 1-3) */}
        <div className="col-span-1" id="fc-opt-complexity">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Nivel de complejidad
            </h4>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
              {complexityLabel(internal.complexity)}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200/70 p-4">
            <Slider
              min={1}
              max={3}
              step={1}
              value={internal.complexity}
              onChange={(v) => setInternal((p) => ({ ...p, complexity: (v as Complexity) }))}
              label=""
              showValue={false}
              showMinMaxLabels={false}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Básico</span>
              <span>Intermedio</span>
              <span>Avanzado</span>
            </div>
          </div>
        </div>

        {/* Enfoque (selección única) */}
        <div className="col-span-1" id="fc-opt-focus">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Enfoque de la carta
            </h4>
          </div>
          <CheckBox
            items={FOCUS_ITEMS}
            selectionMode="single"
            selectedIds={internal.focuses.length ? [internal.focuses[0]] : []}
            onSelectionChange={(ids) => setInternal((prev) => ({ ...prev, focuses: ids.length ? [ids[0]] : [] }))}
            className="space-y-2"
          />
        </div>
      </div>

      {/* Footer summary */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200/60 rounded-xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-700">
            Selección: <strong className="text-gray-900">{internal.count}</strong> tarjetas ·{' '}
            <strong className="text-gray-900">{complexityLabel(internal.complexity)}</strong>
          </span>
          <span className="text-sm text-gray-700">
            Enfoques: {internal.focuses.length > 0 ? (
              <strong className="text-gray-900">{internal.focuses.join(', ')}</strong>
            ) : (
              <em className="text-gray-500">sin selección</em>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlashCardOption;
