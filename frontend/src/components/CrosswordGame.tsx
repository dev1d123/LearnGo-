'use client';

import React, { useState, useEffect } from 'react';

import { CrosswordWord, Placement, CrosswordGameProps } from '../types/CrossWordGameData';
export default function CrosswordGame({
  words,
  size = 12,
  onComplete,
}: CrosswordGameProps) {
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array.from({ length: size }, () => Array(size).fill(null))
  );
  const [inputGrid, setInputGrid] = useState<string[][]>(
    Array.from({ length: size }, () => Array(size).fill(''))
  );
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  // End markers map: for each cell, whether it's the end of a word across or down
  const [endMarkers, setEndMarkers] = useState<Record<string, { right?: boolean; bottom?: boolean }>>({});

  // =====================
  // Generador de crucigrama con cruces
  // =====================
  function generatePlacements(words: CrosswordWord[], size: number) {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const placements: Placement[] = [];

    // Ordenar palabras de más larga a más corta
    const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

    sortedWords.forEach((wordObj, index) => {
      const word = wordObj.word.toUpperCase();
      let placed = false;

      // 1. Colocar la primera palabra en el centro horizontal
      if (index === 0) {
        const row = Math.floor(size / 2);
        const col = Math.floor((size - word.length) / 2);
        placeWord(grid, word, row, col, 'across');
        placements.push({ id: wordObj.id, word, row, col, direction: 'across' });
        placed = true;
        return;
      }

      // 2. Intentar cruzar la palabra con letras ya colocadas
      for (let attempt = 0; attempt < 200 && !placed; attempt++) {
        const direction: 'across' | 'down' = Math.random() > 0.5 ? 'across' : 'down';
        const intersections = findIntersections(grid, word, direction);

        if (intersections.length === 0) continue;

        const choice = intersections[Math.floor(Math.random() * intersections.length)];
        if (canPlaceWord(grid, word, choice.row, choice.col, direction)) {
          placeWord(grid, word, choice.row, choice.col, direction);
          placements.push({
            id: wordObj.id,
            word,
            row: choice.row,
            col: choice.col,
            direction,
          });
          placed = true;
        }
      }

      // 3. Si no se puede cruzar, colocar aleatoriamente
      if (!placed) {
        for (let attempt = 0; attempt < 100 && !placed; attempt++) {
          const direction: 'across' | 'down' = Math.random() > 0.5 ? 'across' : 'down';
          const row = Math.floor(Math.random() * size);
          const col = Math.floor(Math.random() * size);
          if (canPlaceWord(grid, word, row, col, direction)) {
            placeWord(grid, word, row, col, direction);
            placements.push({ id: wordObj.id, word, row, col, direction });
            placed = true;
          }
        }
      }
    });

    return { grid, placements };
  }

  function findIntersections(
    grid: (string | null)[][],
    word: string,
    direction: 'across' | 'down'
  ) {
    const intersections: { row: number; col: number }[] = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        for (let i = 0; i < word.length; i++) {
          const rr = direction === 'across' ? r : r + i;
          const cc = direction === 'across' ? c + i : c;
          if (rr >= grid.length || cc >= grid[0].length) continue;
          if (grid[rr][cc] && grid[rr][cc] === word[i]) {
            intersections.push({
              row: direction === 'across' ? rr : rr - i,
              col: direction === 'across' ? cc - i : cc,
            });
          }
        }
      }
    }
    return intersections;
  }

  function canPlaceWord(
    grid: (string | null)[][],
    word: string,
    row: number,
    col: number,
    direction: 'across' | 'down'
  ) {
    const len = word.length;
    if (direction === 'across') {
      if (col + len > grid[0].length) return false;
      for (let i = 0; i < len; i++) {
        const cell = grid[row][col + i];
        if (cell && cell !== word[i]) return false;
      }
    } else {
      if (row + len > grid.length) return false;
      for (let i = 0; i < len; i++) {
        const cell = grid[row + i][col];
        if (cell && cell !== word[i]) return false;
      }
    }
    return true;
  }

  function placeWord(
    grid: (string | null)[][],
    word: string,
    row: number,
    col: number,
    direction: 'across' | 'down'
  ) {
    if (direction === 'across') {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
  }

  // =====================
  // Inicialización (una sola vez)
  // =====================
  useEffect(() => {
    const { grid: newGrid, placements } = generatePlacements(words, size);
    setGrid(newGrid);
    setPlacements(placements);
    setInputGrid(Array.from({ length: size }, () => Array(size).fill('')));
    // Compute end markers for visual cues
    const ends: Record<string, { right?: boolean; bottom?: boolean }> = {};
    placements.forEach((p) => {
      const len = p.word.length;
      const endR = p.direction === 'across' ? p.row : p.row + len - 1;
      const endC = p.direction === 'across' ? p.col + len - 1 : p.col;
      const key = `${endR},${endC}`;
      if (!ends[key]) ends[key] = {};
      if (p.direction === 'across') ends[key].right = true; else ends[key].bottom = true;
    });
    setEndMarkers(ends);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================
  // Manejo de input del jugador
  // =====================
  function handleChange(r: number, c: number, val: string) {
    const letter = val.slice(-1).toUpperCase();
    const newGrid = inputGrid.map((row) => [...row]);
    newGrid[r][c] = letter;
    setInputGrid(newGrid);
    checkCompletion(newGrid);
  }

  function checkCompletion(currentGrid: string[][]) {
    const completedIds: number[] = [];

    placements.forEach(({ id, word, row, col, direction }) => {
      const letters = [];
      for (let i = 0; i < word.length; i++) {
        const rr = direction === 'across' ? row : row + i;
        const cc = direction === 'across' ? col + i : col;
        letters.push(currentGrid[rr][cc]);
      }
      if (letters.join('') === word) {
        completedIds.push(id);
      }
    });

    setCompleted(completedIds);
    if (completedIds.length === placements.length) {
      onComplete?.();
    }
  }

  // =====================
  // Render
  // =====================
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Tablero */}
      <div
        className="grid bg-gradient-to-br from-slate-200 to-slate-300 p-2 rounded-2xl shadow-inner"
        style={{ gridTemplateColumns: `repeat(${size}, 36px)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const placement = placements.find(
              (p) => p.row === r && p.col === c
            );
            const isStart = placements.some((p) => p.row === r && p.col === c);
            const endKey = `${r},${c}`;
            const endInfo = endMarkers[endKey];
            return (
              <div
                key={`${r}-${c}`}
                className={`relative w-9 h-9 border border-gray-400 flex items-center justify-center ${
                  cell ? 'bg-white' : 'bg-gray-300'
                } rounded-md shadow-sm`}
              >
                {cell ? (
                  <>
                    {isStart && (
                      <span className="absolute top-[2px] left-[4px] text-[9px] text-gray-500">
                        {
                          placements.find(
                            (p) => p.row === r && p.col === c
                          )?.id
                        }
                      </span>
                    )}
                    <input
                      value={inputGrid[r][c]}
                      onChange={(e) => handleChange(r, c, e.target.value)}
                      maxLength={1}
                      className={`w-full h-full text-center text-sm font-semibold uppercase focus:outline-none rounded-md ${
                        completed.some(
                          (id) =>
                            placements.find(
                              (p) => p.id === id && p.row === r && p.col === c
                            )
                        )
                          ? 'bg-green-200'
                          : 'bg-transparent'
                      }`}
                    />

                    {/* End-of-word markers */}
                    {endInfo?.right && (
                      <div className="absolute right-0 top-0 h-full w-[3px] bg-indigo-400/80 rounded-full shadow hover:bg-indigo-500 transition" />
                    )}
                    {endInfo?.bottom && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-400/80 rounded-full shadow hover:bg-indigo-500 transition" />
                    )}
                  </>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Definiciones */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 border border-indigo-100">
        <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-700 to-fuchsia-600 bg-clip-text text-transparent mb-3">Definiciones</h2>
        <div className="space-y-2">
          {words.map((w) => (
            <div
              key={w.id}
              className={`flex gap-2 text-sm ${
                completed.includes(w.id)
                  ? 'text-green-700 line-through'
                  : 'text-gray-700'
              }`}
            >
              <span className="font-bold">{w.id}.</span>
              <span>{w.clue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
