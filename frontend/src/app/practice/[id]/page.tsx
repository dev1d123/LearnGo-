'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import LocalArchive from '@/services/localArchive';
import PracticeQuestionBox from '@/components/layout/PracticeQuestionBox';
import Template from '@/pages/Template';
import DeleteFloatingButton from '@/components/ui/DeleteFloatingButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PracticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = typeof params?.id === 'string' ? params.id : undefined;
  const id = idStr ? Number(idStr) : NaN;
  const [loaded, setLoaded] = React.useState(false);
  const [practice, setPractice] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (Number.isFinite(id)) {
      try { setPractice(LocalArchive.getById('practice', id) as any ?? null); } catch { setPractice(null); }
    } else {
      setPractice(null);
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <Template>
        <div className="p-8 text-center text-gray-600">Cargando…</div>
      </Template>
    );
  }

  if (!practice) {
    return (
      <Template>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">404 - Práctica no encontrada</h1>
          <p className="text-gray-500">La práctica con ID "{idStr}" no existe.</p>
        </div>
      </Template>
    );
  }

  return (
    <Template>
    <DeleteFloatingButton
      onDelete={() => {
        if (Number.isFinite(id)) {
          const ok = LocalArchive.remove('practice', id);
          if (ok) { toast.success('Práctica eliminada'); try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {} router.push('/practice'); }
          else { toast.error('No se pudo eliminar'); }
        }
      }}
    />
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{practice.title}</h1>
        <p className="text-gray-500">
          {new Date(practice.dateISO).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="space-y-6">
        {(practice?.payload?.questions ?? []).map((question: any, idx: number) => (
          <PracticeQuestionBox key={question.id ?? idx} question={question} />
        ))}
      </div>
    </div>
    </Template>
  );
}
