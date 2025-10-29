'use client';

import React from 'react';

interface LoadingOverlayProps {
  open: boolean;
  title?: string;
  subtitle?: string;
}

export default function LoadingOverlay({ open, title = 'Procesando…', subtitle = 'Esto puede tardar unos segundos.' }: LoadingOverlayProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!open) { setProgress(0); return; }
    let current = 0;
    let raf: number | null = null;
    const tick = () => {
      // Ease towards ~92%, never finish on its own
      const next = current + Math.max(0.5, (100 - current) * 0.02);
      current = Math.min(92, next);
      setProgress(current);
      if (open) raf = window.setTimeout(tick, 120);
    };
    tick();
    return () => { if (raf) window.clearTimeout(raf); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      {/* Dim background */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-[min(92vw,520px)] rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-md flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 animate-pulse">
              <path fillRule="evenodd" d="M12 3a1 1 0 01.894.553l2.382 4.763 5.26.765a1 1 0 01.554 1.706l-3.804 3.706.898 5.235a1 1 0 01-1.452 1.054L12 18.347l-4.68 2.465a1 1 0 01-1.452-1.054l.898-5.235L2.962 10.787a1 1 0 01.554-1.706l5.26-.765 2.382-4.763A1 1 0 0112 3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-extrabold leading-tight bg-gradient-to-r from-indigo-700 to-fuchsia-600 bg-clip-text text-transparent">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4" aria-live="polite" aria-busy="true">
          <div className="h-3 w-full rounded-full bg-indigo-100 overflow-hidden shadow-inner" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.floor(progress))}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 transition-[width] duration-200 ease-out"
              style={{ width: `${Math.min(100, Math.floor(progress))}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>Preparando</span>
            <span>{Math.min(100, Math.floor(progress))}%</span>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-gray-500">
          No cierres esta ventana. Estamos generando tu contenido con IA.
        </div>
      </div>
    </div>
  );
}
