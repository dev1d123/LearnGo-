'use client';

import React, { useMemo, useState, useEffect } from 'react';
import CheckBox, { CheckBoxItemData } from '../ui/CheckBox/CheckBox';
import Slider from '../ui/Slider/Slider';

// Estructura de datos para las opciones avanzadas
export interface AdvancedOption {
  enabled: boolean;
  count: number | 'auto';
}

export interface GameOption {
  enabled: boolean;
}

export interface AdvancedOptions {
  mode: 'auto' | 'custom';
  flashcards: AdvancedOption;
  multipleChoice: AdvancedOption;
  trueFalse: AdvancedOption;
  fillBlank: AdvancedOption;
  shortAnswer: AdvancedOption;
  relationship: AdvancedOption;
  justification: AdvancedOption;
  wordSoup: GameOption;
  wordMatch: GameOption;
  storyShuffle: GameOption;
  explainItWrong: GameOption;
  crossword: GameOption;
}

// Estructura de datos para las opciones del Learning Path
export interface LearningPathOptionsData {
  focusType: string | null;
  languageRegister: string | null;
  detailLevel: number;
  moduleCount: number;
  sessionsPerModule: number;
  advancedOptions: AdvancedOptions;
}

type LearningPathOptionsProps = {
  value?: Partial<LearningPathOptionsData>;
  onChange?: (value: LearningPathOptionsData) => void;
  className?: string;
};

const LearningPathOptions: React.FC<LearningPathOptionsProps> = ({ value, onChange, className }) => {
  // Tipo de enfoque (single selection)
  const focusTypeItems: CheckBoxItemData[] = useMemo(
    () => [
      { id: 'teorico', title: 'Teórico', description: 'Enfocado en conceptos y fundamentos.' },
      { id: 'practico', title: 'Práctico', description: 'Orientado a ejercicios y aplicaciones.' },
      { id: 'balanceado', title: 'Balanceado', description: 'Combinación de teoría y práctica.' },
      { id: 'proyecto', title: 'Basado en Proyectos', description: 'Aprendizaje mediante desarrollo de proyectos.' },
      { id: 'rapido', title: 'Rápido', description: 'Conceptos esenciales en el menor tiempo.' }
    ],
    []
  );
  const [focusTypeSelected, setFocusTypeSelected] = useState<string[]>(
    value?.focusType ? [value.focusType] : []
  );

  // Registro de lenguaje (single selection)
  const languageRegisterItems: CheckBoxItemData[] = useMemo(
    () => [
      { id: 'formal', title: 'Formal', description: 'Académico y profesional.' },
      { id: 'neutral', title: 'Neutral', description: 'Equilibrado y claro.' },
      { id: 'informal', title: 'Informal', description: 'Cercano y conversacional.' },
      { id: 'technical', title: 'Técnico', description: 'Con terminología especializada.' },
      { id: 'beginner-friendly', title: 'Para Principiantes', description: 'Explicaciones simples y gradual.' },
      { id: 'advanced', title: 'Avanzado', description: 'Para expertos, sin redundancias.' }
    ],
    []
  );
  const [registerSelected, setRegisterSelected] = useState<string[]>(
    value?.languageRegister ? [value.languageRegister] : []
  );

  // Nivel de detalle (1..5)
  const [detailLevel, setDetailLevel] = useState<number>(value?.detailLevel ?? 3);
  const detailLabels = ['Básico', 'Intermedio', 'Avanzado', 'Experto', 'Máster'];

  // Número de módulos (1..5)
  const [moduleCount, setModuleCount] = useState<number>(value?.moduleCount ?? 3);

  // Número de sesiones por módulo (1..10)
  const [sessionsPerModule, setSessionsPerModule] = useState<number>(value?.sessionsPerModule ?? 5);

  // Estado de opciones avanzadas
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>(
    value?.advancedOptions ?? {
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
  );

  // Función para alternar el modo auto/custom general
  const toggleMainMode = () => {
    const newMode: 'auto' | 'custom' = advancedOptions.mode === 'auto' ? 'custom' : 'auto';
    setAdvancedOptions(prev => ({ ...prev, mode: newMode }));
  };

  // Sincronizar con cambios externos del valor (solo al inicio)
  useEffect(() => {
    if (!value) return;
    if (value.focusType !== undefined) {
      setFocusTypeSelected(value.focusType ? [value.focusType] : []);
    }
    if (value.languageRegister !== undefined) {
      setRegisterSelected(value.languageRegister ? [value.languageRegister] : []);
    }
    if (typeof value.detailLevel === 'number') {
      setDetailLevel(value.detailLevel);
    }
    if (typeof value.moduleCount === 'number') {
      setModuleCount(value.moduleCount);
    }
    if (typeof value.sessionsPerModule === 'number') {
      setSessionsPerModule(value.sessionsPerModule);
    }
    if (value.advancedOptions) {
      setAdvancedOptions(value.advancedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Emitir cambios hacia arriba cuando algo cambie
  useEffect(() => {
    onChange?.({
      focusType: focusTypeSelected[0] ?? null,
      languageRegister: registerSelected[0] ?? null,
      detailLevel,
      moduleCount,
      sessionsPerModule,
      advancedOptions
    });
  }, [
    focusTypeSelected,
    registerSelected,
    detailLevel,
    moduleCount,
    sessionsPerModule,
    advancedOptions,
    onChange
  ]);

  return (
    <div className={`p-6 md:p-8 max-w-10xl mx-auto space-y-6 ${className ?? ''}`}>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Opciones de Learning Path</h1>

      {/* Grid superior: Tipo de Enfoque y Registro de Lenguaje */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipo de enfoque */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tipo de Enfoque</h2>
          <CheckBox
            items={focusTypeItems}
            selectionMode="single"
            onSelectionChange={setFocusTypeSelected}
            selectedIds={focusTypeSelected}
            className="space-y-3"
          />
        </section>

        {/* Registro de lenguaje */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Registro de Lenguaje</h2>
          <CheckBox
            items={languageRegisterItems}
            selectionMode="single"
            onSelectionChange={setRegisterSelected}
            selectedIds={registerSelected}
            className="space-y-3"
          />
          {/* Resumen de selección (píldoras compactas) */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
            {focusTypeSelected[0] && (
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Enfoque: {focusTypeItems.find(i => i.id === focusTypeSelected[0])?.title}
              </span>
            )}
            {registerSelected[0] && (
              <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Registro: {languageRegisterItems.find(i => i.id === registerSelected[0])?.title}
              </span>
            )}
          </div>
        </section>
      </div>

      {/* Nivel de detalle, Módulos y Sesiones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nivel de detalle */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Nivel de Detalle</h2>
          <Slider
            min={1}
            max={5}
            step={1}
            value={detailLevel}
            onChange={setDetailLevel}
            label=""
            showValue={false}
            showMinMaxLabels={false}
          />
          <div className="mt-3 grid grid-cols-5 text-xs text-center gap-1">
            {detailLabels.map((label, idx) => {
              const lvl = idx + 1;
              const active = detailLevel === lvl;
              return (
                <span
                  key={label}
                  className={
                    'px-1 py-1 rounded-md ' +
                    (active
                      ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 font-medium'
                      : 'text-gray-600')
                  }
                >
                  {label}
                </span>
              );
            })}
          </div>
        </section>

        {/* Número de módulos */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Número de Módulos</h2>
          <Slider
            min={1}
            max={5}
            step={1}
            value={moduleCount}
            onChange={setModuleCount}
            label=""
            showValue={false}
            showMinMaxLabels={false}
          />
          <div className="mt-3 grid grid-cols-5 text-sm text-center gap-1">
            {[1, 2, 3, 4, 5].map((num) => {
              const active = moduleCount === num;
              return (
                <span
                  key={num}
                  className={
                    'px-2 py-1 rounded-md font-medium ' +
                    (active
                      ? 'text-white bg-gradient-to-r from-green-500 to-teal-600'
                      : 'text-gray-600')
                  }
                >
                  {num}
                </span>
              );
            })}
          </div>
        </section>

        {/* Número de sesiones por módulo */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sesiones por Módulo</h2>
          <Slider
            min={1}
            max={10}
            step={1}
            value={sessionsPerModule}
            onChange={setSessionsPerModule}
            label=""
            showValue={false}
            showMinMaxLabels={false}
          />
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-gray-500">1</span>
            <span className={`font-bold ${sessionsPerModule >= 5 ? 'text-orange-600' : 'text-gray-700'}`}>
              {sessionsPerModule}
            </span>
            <span className="text-gray-500">10</span>
          </div>
        </section>
      </div>

      {/* Opciones Avanzadas */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Opciones Avanzadas</h2>
          
          {/* Botón Toggle Auto/Personalizado */}
          <button
            onClick={toggleMainMode}
            className="relative inline-flex items-center rounded-full p-1 transition-all duration-300 bg-white border-2 border-gray-300"
            style={{ width: '230px', height: '40px' }}
          >
            <span
              className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-600 ${
                advancedOptions.mode === 'auto' ? 'left-1 right-[50%]' : 'left-[50%] right-1'
              }`}
            />
            <span className="relative z-10 flex w-full items-center justify-between px-3 text-sm font-medium">
              <span className={`transition-colors ${advancedOptions.mode === 'auto' ? 'text-white' : 'text-gray-700'}`}>
                Auto
              </span>
              <span className={`transition-colors ${advancedOptions.mode === 'custom' ? 'text-white' : 'text-gray-700'}`}>
                Personalizado
              </span>
            </span>
          </button>
        </div>

        {advancedOptions.mode === 'custom' && (
          <div className="space-y-6 pt-4 border-t border-gray-200">
            {/* Flashcards */}
            <AdvancedOptionItem
              label="Flashcards por módulo"
              enabled={advancedOptions.flashcards.enabled}
              count={advancedOptions.flashcards.count}
              min={1}
              max={5}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  flashcards: { ...prev.flashcards, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  flashcards: { ...prev.flashcards, count }
                }))
              }
            />

            {/* Preguntas Multiple Choice */}
            <AdvancedOptionItem
              label="Preguntas Multiple Choice por módulo"
              enabled={advancedOptions.multipleChoice.enabled}
              count={advancedOptions.multipleChoice.count}
              min={1}
              max={3}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  multipleChoice: { ...prev.multipleChoice, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  multipleChoice: { ...prev.multipleChoice, count }
                }))
              }
            />

            {/* Preguntas True/False */}
            <AdvancedOptionItem
              label="Preguntas True/False por módulo"
              enabled={advancedOptions.trueFalse.enabled}
              count={advancedOptions.trueFalse.count}
              min={1}
              max={3}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  trueFalse: { ...prev.trueFalse, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  trueFalse: { ...prev.trueFalse, count }
                }))
              }
            />

            {/* Preguntas Fill Blank */}
            <AdvancedOptionItem
              label="Preguntas Fill Blank por módulo"
              enabled={advancedOptions.fillBlank.enabled}
              count={advancedOptions.fillBlank.count}
              min={1}
              max={3}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  fillBlank: { ...prev.fillBlank, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  fillBlank: { ...prev.fillBlank, count }
                }))
              }
            />

            {/* Preguntas Short Answer */}
            <AdvancedOptionItem
              label="Preguntas Short Answer por módulo"
              enabled={advancedOptions.shortAnswer.enabled}
              count={advancedOptions.shortAnswer.count}
              min={1}
              max={3}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  shortAnswer: { ...prev.shortAnswer, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  shortAnswer: { ...prev.shortAnswer, count }
                }))
              }
            />

            {/* Preguntas Relationship */}
            <AdvancedOptionItem
              label="Preguntas Relationship por módulo"
              enabled={advancedOptions.relationship.enabled}
              count={advancedOptions.relationship.count}
              min={1}
              max={3}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  relationship: { ...prev.relationship, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  relationship: { ...prev.relationship, count }
                }))
              }
            />

            {/* Preguntas Justification */}
            <AdvancedOptionItem
              label="Preguntas Justification por módulo"
              enabled={advancedOptions.justification.enabled}
              count={advancedOptions.justification.count}
              min={1}
              max={3}
              onToggle={(enabled) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  justification: { ...prev.justification, enabled }
                }))
              }
              onCountChange={(count) =>
                setAdvancedOptions(prev => ({
                  ...prev,
                  justification: { ...prev.justification, count }
                }))
              }
            />

            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="text-md font-medium text-gray-700 mb-3">Juegos Interactivos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <GameOptionToggle
                  label="Word Soup"
                  enabled={advancedOptions.wordSoup.enabled}
                  onToggle={(enabled) =>
                    setAdvancedOptions(prev => ({
                      ...prev,
                      wordSoup: { enabled }
                    }))
                  }
                />
                <GameOptionToggle
                  label="Word Match"
                  enabled={advancedOptions.wordMatch.enabled}
                  onToggle={(enabled) =>
                    setAdvancedOptions(prev => ({
                      ...prev,
                      wordMatch: { enabled }
                    }))
                  }
                />
                <GameOptionToggle
                  label="Story Shuffle"
                  enabled={advancedOptions.storyShuffle.enabled}
                  onToggle={(enabled) =>
                    setAdvancedOptions(prev => ({
                      ...prev,
                      storyShuffle: { enabled }
                    }))
                  }
                />
                <GameOptionToggle
                  label="Explain It Wrong"
                  enabled={advancedOptions.explainItWrong.enabled}
                  onToggle={(enabled) =>
                    setAdvancedOptions(prev => ({
                      ...prev,
                      explainItWrong: { enabled }
                    }))
                  }
                />
                <GameOptionToggle
                  label="Crossword"
                  enabled={advancedOptions.crossword.enabled}
                  onToggle={(enabled) =>
                    setAdvancedOptions(prev => ({
                      ...prev,
                      crossword: { enabled }
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

// Componente auxiliar para opciones avanzadas con contador
interface AdvancedOptionItemProps {
  label: string;
  enabled: boolean;
  count: number | 'auto';
  min: number;
  max: number;
  onToggle: (enabled: boolean) => void;
  onCountChange: (count: number | 'auto') => void;
}

const AdvancedOptionItem: React.FC<AdvancedOptionItemProps> = ({
  label,
  enabled,
  count,
  min,
  max,
  onToggle,
  onCountChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(!enabled)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
          >
            {enabled && <span className="text-white text-xs">✓</span>}
          </button>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        {enabled && (
          <button
            onClick={() => onCountChange(count === 'auto' ? min : 'auto')}
            className="relative inline-flex items-center rounded-full p-0.5 transition-all duration-300 bg-white border-2 border-gray-300"
            style={{ width: '140px', height: '32px' }}
          >
            <span
              className={`absolute top-0.5 bottom-0.5 rounded-full transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-600 ${
                count === 'auto' ? 'left-0.5 right-[50%]' : 'left-[50%] right-0.5'
              }`}
            />
            <span className="relative z-10 flex w-full items-center justify-between px-2 text-xs font-medium">
              <span className={`transition-colors ${count === 'auto' ? 'text-white' : 'text-gray-700'}`}>
                Auto
              </span>
              <span className={`transition-colors ${count !== 'auto' ? 'text-white' : 'text-gray-700'}`}>
                Manual
              </span>
            </span>
          </button>
        )}
      </div>
      {enabled && count !== 'auto' && (
        <div className="ml-8 flex items-center gap-3">
          <div className="flex-1">
            <Slider
              min={min}
              max={max}
              step={1}
              value={typeof count === 'number' ? count : min}
              onChange={(val) => onCountChange(val)}
              label=""
              showValue={false}
              showMinMaxLabels={false}
            />
          </div>
          <span className="text-sm font-bold text-gray-700 w-8 text-center bg-gray-100 rounded-md px-2 py-1">
            {typeof count === 'number' ? count : min}
          </span>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para juegos (solo toggle)
interface GameOptionToggleProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const GameOptionToggle: React.FC<GameOptionToggleProps> = ({ label, enabled, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
        enabled
          ? 'bg-blue-50 border-blue-500 text-blue-700'
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
    >
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs ${
        enabled ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'
      }`}>
        {enabled && '✓'}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default LearningPathOptions;
