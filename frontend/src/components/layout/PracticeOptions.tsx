'use client';

import React from 'react';
import Slider from '../ui/Slider/Slider';
import ListBox from '../ui/ListBox/ListBox';
import type { ListBoxItemData } from '../ui/ListBox/ListBoxItem';
import CheckBox from '../ui/CheckBox/CheckBox';
import type { CheckBoxItemData } from '../ui/CheckBox/CheckBox';

export type PracticeOptionsValue = {
  exerciseCount: number;
  difficulty: 1 | 2 | 3 | 4;
  focusAreas: string[]; // ids de las áreas
  questionType: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer' | 'relationship' | 'justification' | null;
};

interface PracticeOptionsProps {
  value: PracticeOptionsValue;
  onChange: (value: PracticeOptionsValue) => void;
}

const difficultyLabels: Record<PracticeOptionsValue['difficulty'], string> = {
  1: 'Fácil',
  2: 'Medio',
  3: 'Difícil',
  4: 'Extremo',
};

const questionTypeItems: CheckBoxItemData[] = [
  { id: 'multiple-choice', title: 'Opción múltiple', description: 'Selecciona una alternativa' },
  { id: 'true-false', title: 'Verdadero/Falso', description: 'Elige V o F' },
  { id: 'fill-blank', title: 'Espacio en blanco', description: 'Completa la oración' },
  { id: 'short-answer', title: 'Respuesta corta', description: 'Escribe una breve respuesta' },
  { id: 'relationship', title: 'Relacionar', description: 'Une conceptos con definiciones' },
];


const exerciseOptions = [1, 4, 8, 12];

const PracticeOptions: React.FC<PracticeOptionsProps> = ({ value, onChange }) => {
  const setValue = (patch: Partial<PracticeOptionsValue>) => onChange({ ...value, ...patch });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Opciones de práctica</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Número de ejercicios */}
        <div id="pr-opt-exercises">
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de ejercicios</label>
          <div className="grid grid-cols-4 gap-2">
            {exerciseOptions.map((n) => {
              const selected = value.exerciseCount === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue({ exerciseCount: n })}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all duration-200
                    ${selected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nivel de dificultad */}
        <div id="pr-opt-difficulty">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de dificultad: <span className="font-semibold text-gray-900">{difficultyLabels[value.difficulty]}</span>
          </label>
          <div className="px-1">
            <Slider
              min={1}
              max={4}
              step={1}
              value={value.difficulty}
              onChange={(v) => setValue({ difficulty: Math.min(4, Math.max(1, v)) as PracticeOptionsValue['difficulty'] })}
              showValue={false}
              showMinMaxLabels={false}
            />
          </div>
          <div className="mt-2 grid grid-cols-4 text-xs text-gray-600">
            <span className="text-left">Fácil</span>
            <span className="text-center">Medio</span>
            <span className="text-center">Difícil</span>
            <span className="text-right">Extremo</span>
          </div>
        </div>


        {/* Tipo de pregunta (selección única) */}
        <div id="pr-opt-question" className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pregunta</label>
          <CheckBox
            items={questionTypeItems}
            selectionMode="single"
            selectedIds={value.questionType ? [value.questionType] : []}
            onSelectionChange={(ids) => setValue({ questionType: (ids[0] as PracticeOptionsValue['questionType']) ?? null })}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeOptions;
