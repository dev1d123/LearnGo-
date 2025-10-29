'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import LocalArchive from '@/services/localArchive';
import Template from '@/pages/Template';
import SummarizerPage from '../SummarizerPage';
import DeleteFloatingButton from '@/components/ui/DeleteFloatingButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SummaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const id = Number(idParam);
  const [loaded, setLoaded] = React.useState(false);
  const [summary, setSummary] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (Number.isFinite(id)) {
      try { setSummary(LocalArchive.getById('summary', id) as any ?? null); } catch { setSummary(null); }
    } else {
      setSummary(null);
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

  if (!summary) {
    return (
      <Template>
        <div className="p-8 text-center text-gray-600">
          <h2 className="text-2xl font-semibold mb-4">Resumen no encontrado</h2>
          <p>El resumen que intentas ver no existe o fue eliminado.</p>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <DeleteFloatingButton
        onDelete={() => {
          if (Number.isFinite(id)) {
            const ok = LocalArchive.remove('summary', id);
            if (ok) { toast.success('Resumen eliminado'); try { window.dispatchEvent(new CustomEvent('archive:update')); } catch {} router.push('/summarizer'); }
            else { toast.error('No se pudo eliminar'); }
          }
        }}
      />
      <SummarizerPage
        initialResponse={summary?.payload?.content || ''}
        title={summary?.title || 'Resumen'}
        date={summary?.dateISO}
        readonly
      />
    </Template>
  );
}
