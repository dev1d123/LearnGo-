'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Template from '@/pages/Template';
import FlashCardContainer from '@/components/layout/FlashCardContainer';
import LocalArchive from '@/services/localArchive';
import DeleteFloatingButton from '@/components/ui/DeleteFloatingButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function FlashCardGroupPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const idStr = params?.id;
  const id = idStr ? Number(idStr) : NaN;
  const [loaded, setLoaded] = React.useState(false);
  const [group, setGroup] = React.useState<any | null>(null);

  // Compute cards deterministically every render to keep hook order stable
  const cards = React.useMemo(() => group?.payload?.cards ?? [], [group?.id]);

  React.useEffect(() => {
    if (Number.isFinite(id)) {
      try { setGroup(LocalArchive.getById('flashcards', id) as any ?? null); } catch { setGroup(null); }
    } else {
      setGroup(null);
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <Template>
        <div className="min-h-screen flex items-center justify-center text-gray-600">Cargando…</div>
      </Template>
    );
  }

  if (!group) {
    return (
      <Template>
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          <p>No se encontró el grupo de flashcards con ID: {idStr}</p>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <DeleteFloatingButton
        onDelete={() => {
          if (Number.isFinite(id)) {
            const ok = LocalArchive.remove('flashcards', id);
            if (ok) { toast.success('Flashcards eliminadas'); try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {} router.push('/flashcards'); }
            else { toast.error('No se pudo eliminar'); }
          }
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{group.title}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(group.dateISO).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <FlashCardContainer initialCards={cards} />
        </div>
      </div>
    </Template>
  );
}
