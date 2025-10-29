import type { QuestionGroup } from '@/types/QuestionGroup';

export const mockPracticePages: QuestionGroup[] = [
  {
    id: 'page_1',
    title: 'Fundamentos de React',
    date: '2025-10-20',
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        question: '¿Cuál de los siguientes lenguajes es de tipado estático?',
        options: ['JavaScript', 'Python', 'TypeScript', 'Ruby'],
        correctAnswer: 2,
        points: 5
      },
      {
        id: '2',
        type: 'true-false',
        question: 'React fue creado por Facebook',
        correctAnswer: true,
        points: 3
      },
      {
        id: '3',
        type: 'fill-blank',
        question: 'React usa un DOM ________ para optimizar las actualizaciones mediante ________.',
        blanks: 2,
        correctAnswers: ['virtual', 'reconciliación'],
        points: 4
      },
    ]
  },
  {
    id: 'page_2',
    title: 'Hooks y Estado',
    date: '2025-10-21',
    questions: [
      {
        id: '4',
        type: 'short-answer',
        question: 'Explica brevemente qué es el Virtual DOM en React',
        correctAnswer: 'Es una representación en memoria del DOM real que permite actualizaciones eficientes',
        maxLength: 200,
        points: 6
      },
      {
        id: '5',
        type: 'relationship',
        question: 'Relaciona cada Hook con su descripción:',
        items: ['useState', 'useEffect', 'useRef'],
        concepts: [
          'Permite manejar estado en componentes funcionales',
          'Permite manejar efectos secundarios',
          'Permite acceder a elementos o valores persistentes sin re-render'
        ],
        correctPairs: [[0,0],[1,1],[2,2]],
        points: 7
      },
      {
        id: '6',
        type: 'justification',
        question: '¿Se puede usar useState dentro de un componente de clase?',
        statement: 'useState solo se puede usar en componentes funcionales',
        correctAnswer: true,
        justification: 'Los Hooks solo funcionan en componentes funcionales, no en clases.',
        points: 4
      },
    ]
  },
  {
    id: 'page_3',
    title: 'Avanzado en React',
    date: '2025-10-22',
    questions: [
      {
        id: '7',
        type: 'multiple-choice',
        question: '¿Cuál de los siguientes no es un Hook de React?',
        options: ['useEffect', 'useState', 'useFetch', 'useRef'],
        correctAnswer: 2,
        points: 5
      },
      {
        id: '8',
        type: 'short-answer',
        question: '¿Qué es un Context en React y para qué sirve?',
        correctAnswer: 'Permite pasar datos a través del árbol de componentes sin tener que pasar props manualmente en cada nivel.',
        maxLength: 200,
        points: 6
      },
      {
        id: '9',
        type: 'fill-blank',
        question: 'El Hook ________ permite memorizar valores y ________ evita cálculos innecesarios.',
        blanks: 2,
        correctAnswers: ['useMemo','useCallback'],
        points: 5
      },
      {
        id: '10',
        type: 'true-false',
        question: 'useEffect se ejecuta después del renderizado inicial y en cada actualización del componente.',
        correctAnswer: true,
        points: 3
      },
    ]
  }
];
