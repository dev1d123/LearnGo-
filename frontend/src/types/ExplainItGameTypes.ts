// ExplainItGameTypes.ts

export interface ExplainItProps {
  question?: string;
}

export interface EvaluationResults {
  points: number;
  errors: string[];
  missing: string[];
  aiResponse: string;
  feedback: string;
}

export interface ExplainItGameData {
  id: number;
  question: string;
  keywords: string[];
  category: string;
  date: string;
}