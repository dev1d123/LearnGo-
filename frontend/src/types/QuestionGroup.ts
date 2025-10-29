// types/QuestionGroup.ts

import type { 
    MultipleChoiceQuestion, 
    TrueFalseQuestion, 
    FillBlankQuestion, 
    ShortAnswerQuestion, 
    RelationshipQuestion, 
    JustificationQuestion 
  } from './QuestionTypes';
  
  // Types that agroup all question types
  export type Question =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | FillBlankQuestion
    | ShortAnswerQuestion
    | RelationshipQuestion
    | JustificationQuestion;

  // Types for a group of questions
  export type QuestionGroup = {
    id: string;           // Identifier 
    title: string;        // Name of the group
    date: string;         //  Creation or asignation date 
    questions: Question[]; // Questions in the group
  };
  