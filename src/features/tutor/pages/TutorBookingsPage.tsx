import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorService } from '@/api/services/tutorService';
import { normalizeList } from '@/lib/apiData';

export default function TutorBookingsPage() {
  const [requests, setRequests] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await tutorService.getBookings();
        setRequests(normalizeList(response));
      } catch {
        setError('Gagal memuat booking dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat booking...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && requests.length === 0 ? <p className="text-sm text-slate-500">Belum ada booking dari backend.</p> : null}
          {requests.map((request, index) => (
            <div key={index} className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 first:mt-0">
              <div>
                <p className="font-semibold text-slate-900">{(request.learner as string) ?? 'Learner'}</p>
                <p className="text-sm text-slate-500 font-medium">Mata Kuliah: <span className="text-brand-600">{(request.course as string) ?? (request.subject as string) ?? '—'}</span></p>
                <p className="text-xs text-slate-400 mt-0.5">Jadwal: {(Array.isArray(request.slots) ? request.slots.join(', ') : request.date as string) ?? '—'}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-700"><Sparkles className="h-4 w-4" /> {(request.status as string) ?? 'Menunggu'}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
