// types/QuestionTypes.ts

export interface MultipleChoiceQuestion {
    id: string;
    type: 'multiple-choice';
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
  }
  
  export interface TrueFalseQuestion {
    id: string;
    type: 'true-false';
    question: string;
    correctAnswer: boolean;
    points: number;
  }
  
  export interface FillBlankQuestion {
    id: string;
    type: 'fill-blank';
    question: string;
    blanks: number;
    correctAnswers: string[];
    points: number;
  }
  
  export interface ShortAnswerQuestion {
    id: string;
    type: 'short-answer';
    question: string;
    correctAnswer: string;
    maxLength: number;
    points: number;
  }
  
  export interface RelationshipQuestion {
    id: string;
    type: 'relationship';
    question: string;
    items: string[];
    concepts: string[];
    correctPairs: [number, number][];
    points: number;
  }
  
  export interface JustificationQuestion {
    id: string;
    type: 'justification';
    question: string;
    statement: string;
    correctAnswer: boolean;
    justification: string;
    points: number;
  }
  