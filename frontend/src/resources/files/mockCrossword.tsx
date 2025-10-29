// crosswordMocks.ts
import { CrosswordGameData } from '../../types/CrossWordGameData';

export const crosswordGames: CrosswordGameData[] = [
  {
    id: 1,
    title: "Matemáticas Básicas",
    words: [
      { id: 1, word: "SUMA", clue: "Operación matemática de adición" },
      { id: 2, word: "RESTA", clue: "Operación matemática de sustracción" },
      { id: 3, word: "MULTI", clue: "Abreviatura de multiplicación" },
      { id: 4, word: "DIVISION", clue: "Operación de repartir en partes iguales" },
      { id: 5, word: "NUMERO", clue: "Concepto matemático fundamental" }
    ],
    size: 12,
    category: "Matemáticas",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Sistema Solar",
    words: [
      { id: 1, word: "SOL", clue: "Estrella central de nuestro sistema" },
      { id: 2, word: "TIERRA", clue: "Planeta que habitamos" },
      { id: 3, word: "MARTE", clue: "Planeta rojo" },
      { id: 4, word: "LUNA", clue: "Satélite natural de la Tierra" },
      { id: 5, word: "ORBITA", clue: "Trayectoria de un planeta" }
    ],
    size: 10,
    category: "Astronomía",
    date: "2024-01-16"
  },
  {
    id: 3,
    title: "Animales",
    words: [
      { id: 1, word: "PERRO", clue: "Mejor amigo del hombre" },
      { id: 2, word: "GATO", clue: "Animal doméstico independiente" },
      { id: 3, word: "PAJARO", clue: "Animal que vuela y tiene plumas" },
      { id: 4, word: "PEZ", clue: "Animal que vive en el agua" },
      { id: 5, word: "LEON", clue: "Rey de la selva" }
    ],
    size: 8,
    category: "Animales",
    date: "2024-01-17"
  },
  {
    id: 4,
    title: "Comida",
    words: [
      { id: 1, word: "ARROZ", clue: "Cereal básico en muchas culturas" },
      { id: 2, word: "PAN", clue: "Alimento hecho con harina y horneado" },
      { id: 3, word: "FRUTA", clue: "Alimento dulce y natural" },
      { id: 4, word: "CARNE", clue: "Alimento de origen animal" },
      { id: 5, word: "LECHE", clue: "Bebida blanca de origen animal" }
    ],
    size: 10,
    category: "Alimentos",
    date: "2024-01-18"
  },
  {
    id: 5,
    title: "Deportes",
    words: [
      { id: 1, word: "FUTBOL", clue: "Deporte con balón y porterías" },
      { id: 2, word: "TENIS", clue: "Deporte con raqueta y pelota" },
      { id: 3, word: "NATACION", clue: "Deporte en el agua" },
      { id: 4, word: "CICLISMO", clue: "Deporte con bicicleta" },
      { id: 5, word: "BASQUET", clue: "Deporte con canasta y balón" }
    ],
    size: 12,
    category: "Deportes",
    date: "2024-01-19"
  }
];