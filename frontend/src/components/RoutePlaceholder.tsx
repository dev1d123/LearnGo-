import React from 'react';

export default function RoutePlaceholder({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500">Contenido próximamente.</p>
      </div>
    </div>
  );
}
