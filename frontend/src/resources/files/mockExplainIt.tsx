// explainItMocks.ts
import { ExplainItGameData } from '../../types/ExplainItGameTypes';

export const explainItGames: ExplainItGameData[] = [
  {
    id: 1,
    question: "¿Puedes explicar sobre la fotosíntesis?",
    keywords: ["luz", "clorofila", "agua", "co2", "oxígeno", "plantas"],
    category: "Biología",
    date: "2024-01-15"
  },
  {
    id: 2,
    question: "Explica qué es la gravedad",
    keywords: ["fuerza", "atracción", "masa", "newton", "planetas", "caída"],
    category: "Física",
    date: "2024-01-16"
  },
  {
    id: 3,
    question: "¿Qué es la democracia?",
    keywords: ["gobierno", "pueblo", "elecciones", "derechos", "voto", "libertad"],
    category: "Política",
    date: "2024-01-17"
  },
  {
    id: 4,
    question: "Describe el ciclo del agua",
    keywords: ["evaporación", "condensación", "precipitación", "nubes", "lluvia", "ríos"],
    category: "Geografía",
    date: "2024-01-18"
  },
  {
    id: 5,
    question: "Explica cómo funciona internet",
    keywords: ["red", "servidores", "protocolos", "datos", "wifi", "navegador"],
    category: "Tecnología",
    date: "2024-01-19"
  }
];