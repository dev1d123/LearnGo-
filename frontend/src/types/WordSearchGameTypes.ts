// WordSearchGameTypes.ts

export interface WordSearchProps {
    words: string[];
    size?: number;
    onComplete?: () => void;
  }
  
  export type Cell = [number, number];
  
  export interface Placement {
    word: string;
    cells: Cell[];
  }
  
  export interface GameState {
    selectedCells: Cell[];
    isSelecting: boolean;
    foundIds: Set<number>;
  }
  
  export interface WordItem {
    word: string;
    found: boolean;
  }
  
  export interface GridPlacements {
    grid: string[][];
    placements: Placement[];
  }
  
  export interface WordSearchGameData {
    id: number;
    title: string;
    words: string[];
    size?: number;
    category: string;
    date: string;
  }