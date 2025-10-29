// wordSearchMocks.ts
import { WordSearchGameData } from '../../types/WordSearchGameTypes';

export const wordSearchGames: WordSearchGameData[] = [
  {
    id: 1,
    title: "Animales Salvajes",
    words: ["LEON", "TIGRE", "ELEFANTE", "JIRAFA", "CEBRA"],
    size: 12,
    category: "Animales",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Frutas Tropicales",
    words: ["MANGO", "PINA", "COCO", "PAPAYA", "GUAYABA"],
    size: 10,
    category: "Alimentos",
    date: "2024-01-16"
  },
  {
    id: 3,
    title: "Países Europeos",
    words: ["ESPAÑA", "FRANCIA", "ITALIA", "ALEMANIA", "PORTUGAL"],
    size: 15,
    category: "Geografía",
    date: "2024-01-17"
  },
  {
    id: 4,
    title: "Deportes Acuáticos",
    words: ["NATACION", "SURF", "BUCEO", "VELA", "KAYAK"],
    size: 12,
    category: "Deportes",
    date: "2024-01-18"
  },
  {
    id: 5,
    title: "Profesiones Médicas",
    words: ["DOCTOR", "ENFERMERA", "CIRUJANO", "PEDIATRA", "DENTISTA"],
    size: 14,
    category: "Profesiones",
    date: "2024-01-19"
  }
];