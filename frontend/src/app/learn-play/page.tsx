'use client';

import React, { useState } from 'react';
import Template from "../../pages/Template";
import LearnPlayPage from "./LearnPlayPage";
import { GameOne, GameTwo, GameThree, GameFour } from '@/components/ReactGameComponents';
import SaveFloatingButton from '@/components/ui/SaveFloatingButton';
import DeleteFloatingButton from '@/components/ui/DeleteFloatingButton';
import LocalArchive from '@/services/localArchive';
import { toast } from 'sonner';
import { explainItGames } from '@/resources/files/mockExplainIt';

type Difficulty = 'easy' | 'medium' | 'hard';

type SelectedGame =
  | { type: 'wordsearch' | 'wordconnect'; title: string; words: string[]; difficulty: Difficulty; category?: string; id?: number; fromArchive?: boolean }
  | { type: 'crossword'; title: string; words: { word: string; clue: string }[]; difficulty: Difficulty; category?: string; id?: number; fromArchive?: boolean }
  | { type: 'explainit'; id: number; title: string; category?: string; fromArchive?: boolean };

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

  // New handler: called by LearnPlayPage after API returns data
  const handleGameSelectFromAPI = (game: SelectedGame) => {
    setSelectedGame(game);
  };

  // Legacy handler for Sidebar (mock-based)
  const handleGameSelectFromSidebar = (type: string, id: number) => {
    // Prefer local archive
    const saved = LocalArchive.getGameById(id);
    if (saved) {
      if (saved.gameType === 'crossword') {
        setSelectedGame({ type: 'crossword', id: saved.id, fromArchive: true, title: saved.title, words: saved.payload?.words || [], difficulty: 'medium', category: saved.category });
        return;
      }
      if (saved.gameType === 'wordsearch') {
        setSelectedGame({ type: 'wordsearch', id: saved.id, fromArchive: true, title: saved.title, words: saved.payload?.words || [], difficulty: 'medium', category: saved.category });
        return;
      }
      if (saved.gameType === 'wordconnect') {
        setSelectedGame({ type: 'wordconnect', id: saved.id, fromArchive: true, title: saved.title, words: saved.payload?.words || [], difficulty: 'medium', category: saved.category });
        return;
      }
      if (saved.gameType === 'explainit') {
        setSelectedGame({ type: 'explainit', id: saved.id, fromArchive: true, title: saved.title, category: saved.category });
        return;
      }
    }
    // Fallback for legacy mock explainit
    if (type === 'explainit') {
      const gameData = explainItGames.find(g => g.id === id);
      if (gameData) {
        setSelectedGame({ type: 'explainit', id, title: gameData.question, category: gameData.category });
      }
    }
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.type) {
      case 'crossword': {
        const wordsWithId = selectedGame.words.map((w, idx) => ({ id: idx + 1, word: w.word, clue: w.clue }));
        return (
          <GameThree 
            words={wordsWithId}
            size={12}
            difficulty={selectedGame.difficulty}
            onComplete={() => console.log('Crucigrama completado!')}
          />
        );
      }
      case 'wordsearch': {
        return (
          <GameOne 
            words={selectedGame.words}
            size={12}
            difficulty={selectedGame.difficulty}
            onComplete={() => console.log('Sopa de letras completada!')}
          />
        );
      }
      case 'wordconnect': {
        return (
          <GameTwo 
            words={selectedGame.words}
            difficulty={selectedGame.difficulty}
            onComplete={() => console.log('Conecta palabras completado!')}
          />
        );
      }
      case 'explainit': {
        const explainItGame = explainItGames.find(g => g.id === selectedGame.id);
        return explainItGame ? (
          <GameFour 
            question={explainItGame.question}
            onComplete={() => console.log('Explícalo completado!')}
          />
        ) : null;
      }
      default:
        return null;
    }
  };

  return (
    <Template onGameSelect={handleGameSelectFromSidebar}>
      {selectedGame ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Save button for games */}
            <SaveFloatingButton
              visible={!!selectedGame && !selectedGame.fromArchive}
              defaultTitle={selectedGame.title}
              defaultCategory={selectedGame.category || 'Juegos'}
              onSave={({ title, category }) => {
                if (selectedGame.type === 'crossword') {
                  LocalArchive.addGame({ gameType: 'crossword', title, category, payload: { words: selectedGame.words, difficulty: selectedGame.difficulty } });
                } else if (selectedGame.type === 'wordsearch') {
                  LocalArchive.addGame({ gameType: 'wordsearch', title, category, payload: { words: selectedGame.words, difficulty: selectedGame.difficulty } });
                } else if (selectedGame.type === 'wordconnect') {
                  LocalArchive.addGame({ gameType: 'wordconnect', title, category, payload: { words: selectedGame.words, difficulty: selectedGame.difficulty } });
                } else if (selectedGame.type === 'explainit') {
                  LocalArchive.addGame({ gameType: 'explainit', title, category, payload: { id: selectedGame.id, question: selectedGame.title } });
                }
                try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {}
                toast.success('Juego guardado');
              }}
            />
            {selectedGame?.fromArchive && typeof (selectedGame as any).id === 'number' && (
              <DeleteFloatingButton
                onDelete={() => {
                  const idToDelete = (selectedGame as any).id as number;
                  const kind: 'game' = 'game';
                  if (LocalArchive.remove(kind, idToDelete)) {
                    toast.success('Juego eliminado');
                    try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {}
                    setSelectedGame(null);
                  } else {
                    toast.error('No se pudo eliminar');
                  }
                }}
              />
            )}
            <div className="flex items-center justify-between mb-8">
              <div>
                <button 
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-2 transition-colors"
                >
                  <i className="fas fa-arrow-left"></i>
                  Volver al menú
                </button>
                <h1 className="text-3xl font-bold text-gray-900">{selectedGame.title}</h1>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {renderGame()}
            </div>
          </div>
        </div>
      ) : (
        <LearnPlayPage onGameSelect={handleGameSelectFromAPI} />
      )}
    </Template>
  );
}