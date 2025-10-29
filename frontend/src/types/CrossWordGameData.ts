// CrossWordGameTypes.ts

export interface CrosswordWord {
  id: number;
  word: string;
  clue: string;
}

export interface Placement {
  id: number;
  word: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

export interface CrosswordGameProps {
  words: CrosswordWord[];
  size?: number;
  onComplete?: () => void;
}

export interface CrosswordGameData {
  id: number;
  title: string;
  words: CrosswordWord[];
  size?: number;
  category: string;
  date: string;
}