import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorService } from '@/api/services/tutorService';
import { normalizeList } from '@/lib/apiData';

export default function TutorSchedulesPage() {
  const [schedules, setSchedules] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await tutorService.getSchedules();
        setSchedules(normalizeList(response));
      } catch {
        setError('Gagal memuat jadwal dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Sesi Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat jadwal...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && schedules.length === 0 ? <p className="text-sm text-slate-500">Belum ada jadwal dari backend.</p> : null}
          {schedules.map((schedule, index) => (
            <div key={index} className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 first:mt-0">
              <div>
                <p className="font-semibold text-slate-900">{(schedule.title as string) ?? 'Sesi'}</p>
                <p className="text-sm text-slate-500">{(schedule.learner as string) ?? '—'}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-700"><Clock3 className="h-4 w-4" /> {(schedule.time as string) ?? '—'}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
