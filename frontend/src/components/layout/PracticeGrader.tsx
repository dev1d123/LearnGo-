'use client';

import React from 'react';
import type { QuestionData } from './PracticeQuestionBox';

export type UserAnswersMap = Record<string, any>;

interface PracticeGraderProps {
  questions: QuestionData[];
  userAnswers: UserAnswersMap;
  onGrade: (score: number, total: number) => void;
  isGraded: boolean;
  score?: number;
  onReset?: () => void;
}

function normalizeText(s: any) {
  // Normalize diacritics, remove punctuation (keep letters/numbers/spaces), collapse spaces
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function arraysEqualIgnoreOrder<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  const as = [...a].sort();
  const bs = [...b].sort();
  return as.every((v, i) => JSON.stringify(v) === JSON.stringify(bs[i]));
}

export function isAnswerCorrect(q: QuestionData, ans: any): boolean {
  switch (q.type) {
    case 'multiple-choice':
      return typeof ans === 'number' && ans === q.correctAnswer;
    case 'true-false':
      return typeof ans === 'boolean' && ans === q.correctAnswer;
    case 'fill-blank': {
      const expected = q.correctAnswers.map(normalizeText);
      const gotArr = Array.isArray(ans) ? ans : (typeof ans === 'string' ? [ans] : []);
      const got = gotArr.map(normalizeText);
      if (got.length !== expected.length) return false;
      return expected.every((e, i) => e === got[i]);
    }
    case 'short-answer':
      return normalizeText(ans) === normalizeText(q.correctAnswer);
    case 'relationship': {
      const expectedPairs = q.correctPairs.map(p => JSON.stringify(p));
      const gotPairs = Array.isArray(ans) ? ans.map((p: any) => JSON.stringify(p)) : [];
      return arraysEqualIgnoreOrder(expectedPairs, gotPairs);
    }
    case 'justification':
      return ans && typeof ans.answer === 'boolean' && ans.answer === q.correctAnswer;
    default:
      return false;
  }
}

const PracticeGrader: React.FC<PracticeGraderProps> = ({ questions, userAnswers, onGrade, isGraded, score, onReset }) => {
  const total = questions.length;

  const handleGrade = () => {
    let s = 0;
    for (const q of questions) {
      const ans = userAnswers[q.id];
      if (isAnswerCorrect(q, ans)) s++;
    }
    onGrade(s, total);
  };

  return (
    <div className="mt-8 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-gray-700">
          {isGraded ? (
            <div className="text-lg font-semibold">
              Puntaje: <span className="text-blue-600">{score}</span> / {total}
            </div>
          ) : (
            <div className="text-sm">Pulsa calificar para ver tu puntaje y resaltar respuestas.</div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reiniciar práctica
            </button>
          )}
          <button
            onClick={handleGrade}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow hover:from-emerald-600 hover:to-teal-700"
          >
            Calificar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeGrader;
