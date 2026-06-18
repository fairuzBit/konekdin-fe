import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorService } from '@/api/services/tutorService';
import { normalizeList } from '@/lib/apiData';

export default function TutorHistoryPage() {
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await tutorService.getHistory();
        setHistory(normalizeList(response));
      } catch {
        setError('Gagal memuat riwayat mengajar dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Mengajar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat riwayat...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && history.length === 0 ? <p className="text-sm text-slate-500">Belum ada riwayat dari backend.</p> : null}
          {history.map((item, index) => (
            <div key={index} className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 first:mt-0">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><History className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-slate-900">{(item.title as string) ?? 'Sesi'}</p>
                <p className="text-sm text-slate-500">{(item.detail as string) ?? (item.status as string) ?? '—'}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
