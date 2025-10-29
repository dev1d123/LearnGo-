'use client';

import React, { useEffect, useState } from 'react';
import FlashCard from './FlashCard';
import FlashCardModal from './FlashCardModal';
import ConfirmationModal from './ConfirmationModal';
import { FlashCardData } from '@/types/FlashCardData';
interface FlashCardContainerProps {
  /** Lista inicial de cartas (puede venir desde mockFlashCards o estar vacía) */
  initialCards?: FlashCardData[];
}

const FlashCardContainer: React.FC<FlashCardContainerProps> = ({ initialCards = [] }) => {
  const [cards, setCards] = useState<FlashCardData[]>(initialCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<FlashCardData | null>(null);

  // Keep internal state in sync with prop updates from parent
  useEffect(() => {
    setCards(initialCards ?? []);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [initialCards]);

  const currentCard = cards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCreateCard = (cardData: Omit<FlashCardData, 'id'>) => {
    const newCard: FlashCardData = {
      ...cardData,
      id: Date.now().toString(),
    };
    setCards([...cards, newCard]);
  };

  const handleEditCard = (cardData: Omit<FlashCardData, 'id'>) => {
    if (cardToEdit) {
      setCards(cards.map(card => 
        card.id === cardToEdit.id 
          ? { ...cardData, id: cardToEdit.id }
          : card
      ));
    }
  };

  const handleDeleteCard = () => {
    if (currentCard) {
      const updated = cards.filter(card => card.id !== currentCard.id);
      setCards(updated);
      setCurrentCardIndex((prev) => Math.max(0, prev - 1));
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = () => {
    setCardToEdit(currentCard);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const progress = cards.length > 0 ? Math.round(((currentCardIndex + 1) / cards.length) * 100) : 0;

  return (
    <div
      id="fc-container"
      className="relative overflow-hidden min-h-[60vh] rounded-3xl p-8 border border-white/40 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl shadow-[0_20px_80px_rgba(2,132,199,0.15)]"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-sky-300/40 to-indigo-400/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tr from-fuchsia-300/40 to-rose-300/40 blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              Flashcards
            </h1>
            <p className="text-sm text-slate-600 mt-1">Practica con tarjetas interactivas y animadas.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openEditModal}
              disabled={!currentCard}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-sky-500/20 hover:from-indigo-400 hover:to-sky-400 disabled:opacity-40 disabled:shadow-none transition-all"
            >
              Editar
            </button>
            <button
              onClick={openDeleteModal}
              disabled={!currentCard}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20 hover:from-rose-400 hover:to-orange-400 disabled:opacity-40 disabled:shadow-none transition-all"
            >
              Eliminar
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-lime-400 transition-all"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Selector de cartas */}
        {cards.length > 0 ? (
          <>
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm p-2 border border-slate-200/60 max-w-full overflow-x-auto">
                {cards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setIsFlipped(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                      index === currentCardIndex
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-indigo-500/20 border-transparent'
                        : 'text-slate-700 bg-white/70 hover:bg-white border-slate-200'
                    }`}
                    title={card.front.text}
                  >
                    {card.front.text.length > 18 ? `${card.front.text.slice(0, 18)}…` : card.front.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Área principal */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {/* Botón Anterior */}
              <button
                onClick={handlePrevCard}
                disabled={cards.length <= 1}
                className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 transition-all"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* FlashCard principal */}
              {currentCard && (
                <FlashCard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              )}

              {/* Botón Siguiente */}
              <button
                onClick={handleNextCard}
                disabled={cards.length <= 1}
                className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 transition-all"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Contador + Progreso */}
            <div className="mt-6 space-y-2">
              <div className="text-center text-slate-700 font-medium">
                {currentCardIndex + 1} / {cards.length}
              </div>
              <div className="h-2 rounded-full bg-slate-200/70 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center mt-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 border border-slate-200 text-sky-600 shadow-inner mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M19.5 6h-15A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h15a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0019.5 6zM5 8h14v7H5V8zm3 6h5v1H8v-1z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-800">No hay flashcards en este grupo aún</p>
            <p className="text-slate-600 text-sm">Genera tarjetas desde el prompt para comenzar a practicar.</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <FlashCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCard}
        mode="create"
      />

      <FlashCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditCard}
        card={cardToEdit}
        mode="edit"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCard}
        title="Eliminar Flashcard"
        message="¿Estás seguro de que quieres eliminar esta flashcard? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default FlashCardContainer;
