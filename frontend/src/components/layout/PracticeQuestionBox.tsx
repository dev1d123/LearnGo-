import React, { useState } from 'react';

// Tipos de pregunta
export type QuestionType = 
  | 'multiple-choice' 
  | 'true-false' 
  | 'fill-blank' 
  | 'short-answer' 
  | 'relationship' 
  | 'justification';

// Interfaces para los datos de cada tipo de pregunta
export interface BaseQuestion {
  id: string;
  question: string;
  points?: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number; // índice de la opción correcta
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  blanks: number; // número de espacios en blanco
  correctAnswers: string[]; // respuestas para cada espacio
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  correctAnswer: string;
  maxLength?: number;
}

export interface RelationshipQuestion extends BaseQuestion {
  type: 'relationship';
  items: string[];
  concepts: string[];
  correctPairs: [number, number][]; // [índice_item, índice_concepto]
}

export interface JustificationQuestion extends BaseQuestion {
  type: 'justification';
  statement: string;
  correctAnswer: boolean;
  justification: string;
}

export type QuestionData = 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | ShortAnswerQuestion 
  | RelationshipQuestion 
  | JustificationQuestion;

export interface QuestionBoxProps {
  question: QuestionData;
  onAnswer?: (answer: any) => void;
  showResults?: boolean;
}

const PracticeQuestionBox: React.FC<QuestionBoxProps> = ({ 
  question, 
  onAnswer, 
  showResults = false 
}) => {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>([]);
  const [relationshipPairs, setRelationshipPairs] = useState<[number, number][]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleAnswer = (answer: any) => {
    setUserAnswer(answer);
    onAnswer?.(answer);
  };

  const handleFillBlankChange = (index: number, value: string) => {
    const newAnswers = [...fillBlankAnswers];
    newAnswers[index] = value;
    setFillBlankAnswers(newAnswers);
    handleAnswer(newAnswers);
  };

  const handleRelationshipPair = (itemIndex: number, conceptIndex: number) => {
    const newPairs = relationshipPairs.filter(pair => pair[0] !== itemIndex);
    newPairs.push([itemIndex, conceptIndex]);
    setRelationshipPairs(newPairs);
    handleAnswer(newPairs);
    setSelectedItem(null);
  };

  const getAnswerStatus = (isCorrect: boolean) => {
    if (!showResults) return '';
    return isCorrect 
      ? 'border-2 border-green-500 bg-green-50' 
      : 'border-2 border-red-500 bg-red-50';
  };

  // Renderizado de Multiple Choice
  const renderMultipleChoice = (question: MultipleChoiceQuestion) => {
    return (
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full p-4 text-left rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${
              userAnswer === index ? 'border-2 border-blue-500 bg-blue-50' : ''
            } ${showResults ? getAnswerStatus(index === question.correctAnswer) : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                userAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              } ${showResults && index === question.correctAnswer ? 'border-green-500 bg-green-500' : ''}`}>
                {userAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-800">{option}</span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Renderizado de True/False
  const renderTrueFalse = (question: TrueFalseQuestion) => {
    return (
      <div className="flex space-x-4">
        <button
          onClick={() => handleAnswer(true)}
          className={`flex-1 p-6 rounded-xl bg-white border-2 transition-all duration-200 ${
            userAnswer === true 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          } ${showResults ? getAnswerStatus(true === question.correctAnswer) : ''}`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">✓</div>
            <span className="text-gray-700 font-medium">Verdadero</span>
          </div>
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className={`flex-1 p-6 rounded-xl bg-white border-2 transition-all duration-200 ${
            userAnswer === false 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          } ${showResults ? getAnswerStatus(false === question.correctAnswer) : ''}`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">✗</div>
            <span className="text-gray-700 font-medium">Falso</span>
          </div>
        </button>
      </div>
    );
  };

  // Renderizado de Fill in the Blank
  const renderFillBlank = (question: FillBlankQuestion) => {
    return (
      <div className="space-y-4">
        {Array.from({ length: question.blanks }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">{index + 1}.</span>
            <input
              type="text"
              value={fillBlankAnswers[index] || ''}
              onChange={(e) => handleFillBlankChange(index, e.target.value)}
              className={`flex-1 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                showResults 
                  ? getAnswerStatus(
                      fillBlankAnswers[index]?.toLowerCase() === 
                      question.correctAnswers[index]?.toLowerCase()
                    )
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              placeholder={`Respuesta ${index + 1}`}
            />
          </div>
        ))}
      </div>
    );
  };

  // Renderizado de Short Answer
  const renderShortAnswer = (question: ShortAnswerQuestion) => {
    return (
      <textarea
        value={userAnswer || ''}
        onChange={(e) => handleAnswer(e.target.value)}
        className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 ${
          showResults 
            ? getAnswerStatus(userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase())
            : 'border-gray-300 hover:border-blue-300'
        }`}
        placeholder="Escribe tu respuesta aquí..."
        rows={4}
        maxLength={question.maxLength}
      />
    );
  };

  // Renderizado de Relationship
  // Renderizado de Relationship - Versión corregida sin botones anidados
const renderRelationship = (question: RelationshipQuestion) => {
  // Array de colores para los pares
  const pairColors = [
    'bg-blue-50 border-blue-500 text-blue-700',
    'bg-green-50 border-green-500 text-green-700',
    'bg-purple-50 border-purple-500 text-purple-700',
    'bg-orange-50 border-orange-500 text-orange-700',
    'bg-pink-50 border-pink-500 text-pink-700',
    'bg-indigo-50 border-indigo-500 text-indigo-700',
  ];

  // Función para obtener el color de un par
  const getPairColor = (pairIndex: number) => {
    return pairColors[pairIndex % pairColors.length];
  };

  // Encontrar el índice del par para un item o concepto
  const getPairIndex = (itemIndex: number, conceptIndex: number) => {
    return relationshipPairs.findIndex(pair => 
      pair[0] === itemIndex && pair[1] === conceptIndex
    );
  };

  // Eliminar un par existente
  const removePair = (itemIndex: number, conceptIndex: number) => {
    const newPairs = relationshipPairs.filter(pair => 
      !(pair[0] === itemIndex && pair[1] === conceptIndex)
    );
    setRelationshipPairs(newPairs);
    handleAnswer(newPairs);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Items */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 mb-3">Temas</h4>
          {question.items.map((item, index) => {
            const pairIndex = relationshipPairs.findIndex(pair => pair[0] === index);
            const isPaired = pairIndex !== -1;
            const isSelected = selectedItem === index;
            
            return (
              <div
                key={index}
                onClick={() => {
                  if (isPaired) {
                    // Si ya está emparejado, eliminar el par
                    const conceptIndex = relationshipPairs[pairIndex][1];
                    removePair(index, conceptIndex);
                  } else {
                    // Si no está emparejado, seleccionar/deseleccionar
                    setSelectedItem(isSelected ? null : index);
                  }
                }}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : isPaired
                    ? getPairColor(pairIndex)
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span className="font-medium">{item}</span>
                {isPaired && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-70">
                      → {question.concepts[relationshipPairs[pairIndex][1]]}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removePair(index, relationshipPairs[pairIndex][1]);
                      }}
                      className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      ×
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Concepts */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 mb-3">Conceptos</h4>
          {question.concepts.map((concept, index) => {
            const pairIndex = relationshipPairs.findIndex(pair => pair[1] === index);
            const isPaired = pairIndex !== -1;
            const isSelectable = selectedItem !== null;
            
            return (
              <div
                key={index}
                onClick={() => {
                  if (selectedItem !== null && !isPaired) {
                    handleRelationshipPair(selectedItem, index);
                  }
                }}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isPaired
                    ? getPairColor(pairIndex)
                    : isSelectable
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span className="font-medium">{concept}</span>
                {isPaired && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-70">
                      ← {question.items[relationshipPairs[pairIndex][0]]}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removePair(relationshipPairs[pairIndex][0], index);
                      }}
                      className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      ×
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pares establecidos con colores */}
      {relationshipPairs.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-700 mb-3">Relaciones establecidas:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relationshipPairs.map(([itemIdx, conceptIdx], index) => {
              const colorClass = getPairColor(index);
              
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border-2 ${colorClass} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        colorClass.includes('blue') ? 'bg-blue-500' :
                        colorClass.includes('green') ? 'bg-green-500' :
                        colorClass.includes('purple') ? 'bg-purple-500' :
                        colorClass.includes('orange') ? 'bg-orange-500' :
                        colorClass.includes('pink') ? 'bg-pink-500' :
                        'bg-indigo-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {question.items[itemIdx]}
                        </div>
                        <div className="text-xs opacity-75 flex items-center space-x-1">
                          <span>→</span>
                          <span>{question.concepts[conceptIdx]}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => removePair(itemIdx, conceptIdx)}
                      className="w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-600 text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      ×
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <i className="fas fa-info-circle"></i>
          <span>
            {selectedItem !== null 
              ? `Selecciona un concepto para relacionar con "${question.items[selectedItem]}"`
              : 'Haz clic en un tema para seleccionarlo, luego en un concepto para relacionarlos'
            }
          </span>
        </div>
      </div>
    </div>
  );
};


  // Renderizado de Justification
  const renderJustification = (question: JustificationQuestion) => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-gray-800 font-medium">{question.statement}</p>
        </div>
        
        {/* True/False */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleAnswer({ answer: true, justification: userAnswer?.justification || '' })}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              userAnswer?.answer === true 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            } ${showResults ? getAnswerStatus(true === question.correctAnswer) : ''}`}
          >
            <div className="text-center font-medium text-gray-700">Verdadero</div>
          </button>
          <button
            onClick={() => handleAnswer({ answer: false, justification: userAnswer?.justification || '' })}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
              userAnswer?.answer === false 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            } ${showResults ? getAnswerStatus(false === question.correctAnswer) : ''}`}
          >
            <div className="text-center font-medium text-gray-700">Falso</div>
          </button>
        </div>

        {/* Justificación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justifica tu respuesta:
          </label>
          <textarea
            value={userAnswer?.justification || ''}
            onChange={(e) => handleAnswer({ 
              answer: userAnswer?.answer, 
              justification: e.target.value 
            })}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-blue-300"
            placeholder="Explica por qué elegiste esta respuesta..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {question.question}
          </h3>
          {question.points && (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full">
              {question.points} puntos
            </span>
          )}
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
          {question.type.replace('-', ' ')}
        </span>
      </div>

      {/* Content */}
      <div className="mt-4">
        {question.type === 'multiple-choice' && renderMultipleChoice(question)}
        {question.type === 'true-false' && renderTrueFalse(question)}
        {question.type === 'fill-blank' && renderFillBlank(question)}
        {question.type === 'short-answer' && renderShortAnswer(question)}
        {question.type === 'relationship' && renderRelationship(question)}
        {question.type === 'justification' && renderJustification(question)}
      </div>
    </div>
  );
};

export default PracticeQuestionBox;