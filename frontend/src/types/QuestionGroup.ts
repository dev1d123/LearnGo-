// types/QuestionGroup.ts

import type { 
    MultipleChoiceQuestion, 
    TrueFalseQuestion, 
    FillBlankQuestion, 
    ShortAnswerQuestion, 
    RelationshipQuestion, 
    JustificationQuestion 
  } from './QuestionTypes';
  
  // 1️⃣ Tipo que agrupa todos los tipos de pregunta
  export type Question =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | FillBlankQuestion
    | ShortAnswerQuestion
    | RelationshipQuestion
    | JustificationQuestion;
  
  // 2️⃣ Tipo para un grupo de preguntas
  export type QuestionGroup = {
    id: string;           // Identificador del grupo
    title: string;        // Nombre del grupo o ejercicio
    date: string;         // Fecha de creación o asignación
    questions: Question[]; // Array de preguntas
  };
  