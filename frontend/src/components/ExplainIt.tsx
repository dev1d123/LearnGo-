'use client';

import React, { useState } from 'react';
import { ExplainItProps, EvaluationResults } from '../types/ExplainItGameTypes';

export default function ExplainIt({
  question = '¿Puedes explicar sobre la fotosíntesis?',
}: ExplainItProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<EvaluationResults | null>(null);

  function handleSubmit() {
    if (!answer.trim()) return;

    // Simulación de evaluación
    const words = answer.trim().toLowerCase().split(/\s+/);

    // Puntos: número de palabras clave encontradas
    const keywords = ['luz', 'clorofila', 'agua', 'co2', 'oxígeno', 'plantas'];
    const found = words.filter((w) => keywords.includes(w));
    const points = Math.min(found.length * 10, 100);

    // Errores detectados (palabras incorrectas aleatorias)
    const errors = words
      .filter((w) => !keywords.includes(w))
      .slice(0, 5);

    // Qué falta
    const missing = keywords.filter((kw) => !words.includes(kw));

    // Respuesta AI simulada
    const aiResponse = `La fotosíntesis es el proceso mediante el cual las plantas transforman la luz solar en energía química, usando agua y CO2 para producir oxígeno y glucosa.`;

    // Retroalimentación
    let feedback = '';
    if (points >= 70) feedback = '¡Excelente! Has identificado la mayoría de conceptos clave.';
    else if (points >= 40) feedback = 'Bien, pero faltan algunos conceptos importantes.';
    else feedback = 'Debes revisar el tema con más detalle.';

    setResults({ points, errors, missing, aiResponse, feedback });
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 gap-4">
      {/* Pregunta */}
      <div className="bg-indigo-100 p-4 rounded-lg w-full text-left">
        <p className="text-lg font-semibold">{question}</p>
      </div>

      {/* Respuesta */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        disabled={submitted}
      />

      {/* Botón enviar */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Enviar
        </button>
      )}

      {/* Resultados */}
      {submitted && results && (
        <div className="w-full bg-gray-50 p-4 rounded-lg shadow space-y-3">
          <div>
            <strong>Puntos correctos:</strong> {results.points}/100
          </div>
          <div>
            <strong>Errores detectados:</strong>{' '}
            {results.errors.length > 0 ? results.errors.join(', ') : 'Ninguno'}
          </div>
          <div>
            <strong>Qué falta:</strong>{' '}
            {results.missing.length > 0 ? results.missing.join(', ') : 'Nada'}
          </div>
          <div>
            <strong>AI respuesta:</strong> {results.aiResponse}
          </div>
          <div className="bg-green-100 p-2 rounded">
            <strong>Retroalimentación:</strong> {results.feedback}
          </div>

          {/* Botón para reiniciar */}
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswer('');
              setResults(null);
            }}
            className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Volver a intentar
          </button>
        </div>
      )}
    </div>
  );
}