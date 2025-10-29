// Types for Learning Path feature

export interface FlashCardData {
  id: string;
  question: string;
  answer: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer' | 'relationship' | 'justification';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  pairs?: { left: string; right: string }[];
}

export interface Topic {
  id: string;
  title: string;
  duration: string;
  theory: string;
  flashcards: FlashCardData[];
  practice: Question[];
}

export interface Session {
  id: string;
  name: string;
  description: string;
  duration: string;
  topics: Topic[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  sessions: Session[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  difficulty: string;
  createdAt: string;
  modules: Module[];
}
