'use client';

import React from 'react';

interface SaveFloatingButtonProps {
  visible: boolean;
  defaultTitle?: string;
  defaultCategory?: string;
  onSave: (data: { title: string; category: string }) => void;
}

export default function SaveFloatingButton({ visible, defaultTitle = '', defaultCategory = 'General', onSave }: SaveFloatingButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(defaultTitle);
  const [category, setCategory] = React.useState(defaultCategory);

  React.useEffect(() => { setTitle(defaultTitle); }, [defaultTitle]);
  React.useEffect(() => { setCategory(defaultCategory || 'General'); }, [defaultCategory]);

  if (!visible) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9000] bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-2xl hover:shadow-[0_12px_30px_rgba(16,185,129,0.45)] px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        aria-label="Guardar"
      >
        <i className="fas fa-save"></i>
        Guardar
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9500] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-[min(92vw,520px)] rounded-2xl border border-emerald-200/40 bg-white shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center">
                <i className="fas fa-bookmark" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-emerald-700">Guardar en tu navegador</h3>
                <p className="text-sm text-gray-600">Asigna un título y categoría para encontrarlo en el sidebar.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Resumen de Historia del Perú"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej: Conocimiento General, Lengua, Ciencia"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100" onClick={() => setOpen(false)}>Cancelar</button>
              <button
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow hover:opacity-95"
                onClick={() => { onSave({ title: title.trim() || 'Sin título', category: category.trim() || 'General' }); setOpen(false); }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
