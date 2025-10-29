import { FlashCardData } from './FlashCardData';

export interface FlashCardGroup {
  id: string;            // Identifier
  title: string;         // Descriptive title of the group (e.g., "Lesson 1 - Physics")
  date: string;          // Creation or modification date (ISO string or short format)
  cards: FlashCardData[]; // Array of flashcards belonging to the group
}
