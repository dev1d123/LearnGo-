'use client';

import React from 'react';

interface DeleteFloatingButtonProps {
  onDelete: () => void;
  confirmText?: string;
}

export default function DeleteFloatingButton({ onDelete, confirmText = '¿Seguro que deseas eliminar este elemento?' }: DeleteFloatingButtonProps) {
  const handleDelete = () => {
    if (window.confirm(confirmText)) onDelete();
  };
  return (
    <button
      onClick={handleDelete}
      className="fixed bottom-6 left-6 z-[9000] bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold shadow-2xl hover:shadow-[0_12px_30px_rgba(244,63,94,0.45)] px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
      aria-label="Eliminar"
    >
      <i className="fas fa-trash" />
      Eliminar
    </button>
  );
}
