import { FlashCardData } from './FlashCardData';

export interface FlashCardGroup {
  id: string;            // identificador único del grupo
  title: string;         // título descriptivo del grupo (ej: “Lección 1 - Física”)
  date: string;          // fecha de creación o modificación (ISO string o formato corto)
  cards: FlashCardData[]; // array de flashcards que pertenecen al grupo
}
