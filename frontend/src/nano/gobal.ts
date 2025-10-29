export interface Template {
   content: string;
}

export interface PropType {
   name: 'summarize' | 'generate-exercises' | 'generate-exercises-by-topic' | 'flashcards' | 'flashcards-by-topic' | 'roadmap' | 'games';
}

export interface NanoClientOptions {
   outputLanguage: string; // 'es', 'en'
   type: PropType;
   content: string;
}

export declare const LanguageModel: any;

export interface ExerciseOptions {
   topic: string;
   exercises_difficulty: 'Easy' | 'Medium' | 'Hard';
   exercises_count: number;
   exercises_types: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
}