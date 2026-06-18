import { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { learnerService } from '@/api/services/learnerService';
import { normalizeList } from '@/lib/apiData';

export default function LearnerNotificationsPage() {
  const [notifications, setNotifications] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await learnerService.getNotifications();
        setNotifications(normalizeList(response));
      } catch {
        setError('Gagal memuat notifikasi dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat notifikasi...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && notifications.length === 0 ? <p className="text-sm text-slate-500">Belum ada notifikasi dari backend.</p> : null}
          {notifications.map((item, index) => (
            <div key={index} className="mt-3 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 first:mt-0">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><BellRing className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-slate-900">{(item.title as string) ?? 'Notifikasi'}</p>
                <p className="text-sm text-slate-500">{(item.body as string) ?? (item.message as string) ?? '—'}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{(item.time as string) ?? (item.created_at as string) ?? '—'}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
