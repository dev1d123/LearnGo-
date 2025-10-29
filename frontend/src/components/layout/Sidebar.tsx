'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
// Replaced mocks with local archive
import LocalArchive from '@/services/localArchive';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onGameSelect?: (type: string, id: number) => void;
}

interface GameItem { id: number; title: string; date: string; type: 'crossword' | 'wordsearch' | 'wordconnect' | 'explainit'; category: string; }

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle, onGameSelect }) => {
  const pathname = usePathname();

  // Detectamos en qué sección estamos
  const isPractice = pathname?.startsWith('/practice') ?? false;
  const isFlashcards = pathname?.startsWith('/flashcards') ?? false;
  const isLearnPlay = pathname?.startsWith('/learn-play') ?? false;

  // Avoid hydration mismatch: compute client-side after mount
  const [mounted, setMounted] = useState(false);
  const [savedGames, setSavedGames] = useState<GameItem[]>([]);
  const [savedList, setSavedList] = useState<any[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // Load games when on learn-play
    if (isLearnPlay) {
      try {
        const games = LocalArchive.listGames().map(g => ({ id: g.id, title: g.title, date: g.dateISO, type: g.gameType, category: g.category }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSavedGames(games);
      } catch { setSavedGames([]); }
    }
  }, [isLearnPlay, pathname]);

  useEffect(() => {
    // Load lists for other sections
    if (!isLearnPlay) {
      try {
        if (isFlashcards) setSavedList(LocalArchive.listByKind('flashcards'));
        else if (isPractice) setSavedList(LocalArchive.listByKind('practice'));
        else setSavedList(LocalArchive.listByKind('summary'));
      } catch { setSavedList([]); }
    }
  }, [isLearnPlay, isFlashcards, isPractice, pathname]);

  // Refresh lists on archive updates
  useEffect(() => {
    const onUpdate = () => {
      if (isLearnPlay) {
        try {
          const games = LocalArchive.listGames().map(g => ({ id: g.id, title: g.title, date: g.dateISO, type: g.gameType, category: g.category }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setSavedGames(games);
        } catch { setSavedGames([]); }
      } else {
        try {
          if (isFlashcards) setSavedList(LocalArchive.listByKind('flashcards'));
          else if (isPractice) setSavedList(LocalArchive.listByKind('practice'));
          else setSavedList(LocalArchive.listByKind('summary'));
        } catch { setSavedList([]); }
      }
    };
    window.addEventListener('archive:update', onUpdate as any);
    return () => window.removeEventListener('archive:update', onUpdate as any);
  }, [isLearnPlay, isFlashcards, isPractice]);

  const allGames: GameItem[] = isLearnPlay ? (mounted ? savedGames : []) : [];

  // Agrupar juegos por tipo
  const gamesByType = allGames.reduce((acc, game) => {
    if (!acc[game.type]) {
      acc[game.type] = [];
    }
    acc[game.type].push(game);
    return acc;
  }, {} as Record<string, GameItem[]>);

  // Determinar los datos que se muestran según la ruta (usar LocalArchive)
  const summariesList = isLearnPlay ? [] : (mounted ? savedList : []);

  // Título dinámico con emoji
  const sectionEmoji = isLearnPlay ? '🎮' : isFlashcards ? '🃏' : isPractice ? '🧠' : '📝';
  const title = isLearnPlay
    ? `${sectionEmoji} Mis Juegos`
    : isFlashcards
    ? `${sectionEmoji} Flashcards`
    : isPractice
    ? `${sectionEmoji} Mis Prácticas`
    : `${sectionEmoji} Resúmenes`;

  // URL base para los enlaces
  const basePath = isLearnPlay ? '/learn-play' : isFlashcards ? '/flashcards' : isPractice ? '/practice' : '/summarizer';

  // Texto del botón principal
  const newButtonText = isLearnPlay
    ? 'Nuevo Juego'
    : isFlashcards
    ? 'Nuevo Grupo'
    : isPractice
    ? 'Nueva Práctica'
    : 'Nuevo Resumen';

  // Nombres de los tipos de juego
  const gameTypeNames = {
    crossword: '🧩 Crucigramas',
    wordsearch: '🔍 Sopas de Letras',
    wordconnect: '🔗 Conecta Palabras',
    explainit: '💡 Explícalo'
  };
  const gameTypeEmoji: Record<string, string> = {
    crossword: '🧩',
    wordsearch: '🔍',
    wordconnect: '🔗',
    explainit: '💡'
  };

  const handleGameClick = (type: string, id: number) => {
    onClose();
    if (onGameSelect) {
      onGameSelect(type, id);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir el sidebar en móvil */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-6 left-6 z-50 lg:hidden
          w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 
          text-white rounded-2xl shadow-2xl 
          flex items-center justify-center
          transform transition-all duration-500 ease-out
          hover:scale-110 hover:from-blue-600 hover:to-purple-700
          active:scale-95
          ${isOpen ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}
        `}
        aria-label="Abrir menú"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center relative">
          <span className={`absolute w-4 h-0.5 bg-white transform transition-all duration-300 ${isOpen ? 'rotate-45' : '-translate-y-1'}`}></span>
          <span className={`absolute w-4 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`absolute w-4 h-0.5 bg-white transform transition-all duration-300 ${isOpen ? '-rotate-45' : 'translate-y-1'}`}></span>
        </div>
      </button>

      {/* Fondo oscuro cuando el sidebar está abierto en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar principal */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-50
          transform transition-all duration-500 ease-out
          lg:relative lg:translate-x-0 lg:z-auto lg:shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group"
            aria-label="Cerrar sidebar"
          >
            <i className="fas fa-times text-gray-600 text-lg group-hover:text-red-500 group-hover:rotate-90 transition-all duration-300"></i>
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-6">
            {/* Botón Nuevo */}
            <a
              href={basePath}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mb-8 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 group"
            >
              <i className="fas fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
              <span>{newButtonText}</span>
            </a>

            {/* Para la página de juegos: mostrar juegos agrupados por tipo */}
            {isLearnPlay ? (
              <div className="space-y-6">
                {Object.entries(gamesByType).map(([type, games]) => (
                  <div key={type} className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 px-2">
                      {gameTypeNames[type as keyof typeof gameTypeNames]}
                    </h3>
                    <div className="space-y-1">
                      {games.map((game) => (
                        <button
                          key={`${type}-${game.id}`}
                          onClick={() => handleGameClick(type, game.id)}
                          className="w-full text-left block px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group relative"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium truncate flex items-center gap-2">
                              <span aria-hidden>{gameTypeEmoji[game.type] ?? '🎮'}</span>
                              {game.title}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {new Date(game.date).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-xs text-blue-500 font-medium mt-1">
                              {game.category}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Para otras páginas: mostrar lista normal */
              <div className="space-y-1 mb-8">
                {mounted && summariesList.length > 0 ? (
                  summariesList.map((item: any) => (
                    <button
                      type="button"
                      onClick={() => { onClose(); window.location.href = `${basePath}/${item.id}`; }}
                      key={item.id}
                      className="w-full text-left px-4 py-3 rounded-xl text-gray-700 bg-white/70 hover:bg-blue-50/80 transition-all duration-300 group relative border border-gray-200/60"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium truncate flex items-center gap-2">
                          <span aria-hidden>{sectionEmoji}</span>
                          {item.title}
                        </span>
                        {item.dateISO && (
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(item.dateISO).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {item.category && (
                          <span className="text-[11px] text-blue-600 mt-1">{item.category}</span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 px-4 py-2">{mounted ? (isFlashcards ? 'No hay grupos de flashcards guardados.' : isPractice ? 'No hay prácticas guardadas.' : 'No hay resúmenes guardados.') : 'Cargando…'}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;