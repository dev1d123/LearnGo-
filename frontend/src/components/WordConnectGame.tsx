'use client';

import React, { useState, useMemo, useRef } from 'react';
import { WordConnectGameProps, Position, GameState } from '../types/WordConnectGameTypes';

export default function WordConnectGame({ words, onComplete }: WordConnectGameProps) {
  const upperWords = useMemo(() => words.map(w => w.toUpperCase()), [words]);

  // Build letter multiset: each letter appears as many times as its maximum count across a single word
  const nodes = useMemo(() => {
    const freqMax: Record<string, number> = {};
    for (const w of upperWords) {
      const local: Record<string, number> = {};
      for (const ch of w) local[ch] = (local[ch] || 0) + 1;
      for (const [ch, n] of Object.entries(local)) {
        freqMax[ch] = Math.max(freqMax[ch] || 0, n);
      }
    }
    const bag: string[] = [];
    Object.entries(freqMax).forEach(([ch, n]) => {
      for (let i = 0; i < n; i++) bag.push(ch);
    });
    return bag;
  }, [upperWords]);

  const [gameState, setGameState] = useState<GameState>({
    current: '',
    found: [],
    isDragging: false
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const radius = 120;
  const center: Position = { x: 150, y: 150 };
  
  const positions = useMemo(() => {
    const step = (2 * Math.PI) / Math.max(1, nodes.length);
    return nodes.map((_, i): Position => ({
      x: center.x + radius * Math.cos(i * step - Math.PI / 2),
      y: center.y + radius * Math.sin(i * step - Math.PI / 2),
    }));
  }, [nodes]);

  const selectedIndicesRef = useRef<number[]>([]);

  function handleMouseDown(index: number) {
    const letter = nodes[index];
    selectedIndicesRef.current = [index];
    setGameState(prev => ({ ...prev, isDragging: true, current: letter }));
    drawLines(selectedIndicesRef.current);
  }

  function handleMouseEnter(index: number) {
    if (!gameState.isDragging) return;
    // Prevent reusing same node in the same word
    if (selectedIndicesRef.current.includes(index)) return;
    selectedIndicesRef.current = [...selectedIndicesRef.current, index];
    const nextWord = selectedIndicesRef.current.map(i => nodes[i]).join('');
    setGameState(prev => ({ ...prev, current: nextWord }));
    drawLines(selectedIndicesRef.current);
  }

  function handleMouseUp() {
    if (!gameState.isDragging) return;
    setGameState(prev => {
      evaluateWord(prev.current);
      return { ...prev, isDragging: false, current: '' };
    });
    selectedIndicesRef.current = [];
    clearCanvas();
  }

  function evaluateWord(word: string) {
    const w = word.toUpperCase();
    if (words.includes(w) && !gameState.found.includes(w)) {
      const newFound = [...gameState.found, w];
      setGameState(prev => ({ ...prev, found: newFound }));
      
      if (newFound.length === words.length) {
        onComplete?.();
      }
    }
  }

  function drawLines(indices: number[]) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    clearCanvas();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    indices.forEach((idx, i) => {
      const { x, y } = positions[idx];
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function clearCanvas() {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 300);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[300px] h-[300px]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute top-0 left-0 pointer-events-none"
        />

        {nodes.map((letter, i) => {
          const pos = positions[i];
          const foundColor = gameState.found.some((w) => w.includes(letter));
          const isSelected = selectedIndicesRef.current.includes(i) && gameState.isDragging;
          return (
            <div
              key={`${letter}-${i}`}
              onMouseDown={() => handleMouseDown(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseUp={handleMouseUp}
              className={`absolute flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold cursor-pointer select-none transition-all
                ${foundColor ? 'bg-green-500 text-white shadow-lg' : isSelected ? 'bg-indigo-400 text-white shadow-lg scale-105' : 'bg-indigo-100 hover:bg-indigo-300'}
              `}
              style={{
                left: pos.x - 24,
                top: pos.y - 24,
                userSelect: 'none',
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        {upperWords.map((w) => (
          <div
            key={w}
            className={`text-lg font-semibold ${
              gameState.found.includes(w) ? 'line-through text-green-600' : 'text-gray-600'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {gameState.isDragging && (
        <div className="text-2xl font-extrabold text-indigo-700 tracking-widest drop-shadow">{gameState.current}</div>
      )}
    </div>
  );
}