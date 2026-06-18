import { useEffect, useState } from 'react';
import { CalendarDays, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { learnerService } from '@/api/services/learnerService';
import { normalizeList } from '@/lib/apiData';

export default function LearnerBookingsPage() {
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await learnerService.getBookings();
        setBookings(normalizeList(response));
      } catch {
        setError('Gagal memuat data booking dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-brand-100 bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-50">Learner Flow</p>
            <h2 className="text-2xl font-semibold">Pesanan & Pembayaran</h2>
          </div>
          <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">Data dari backend</div>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-500">Memuat booking...</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      {!loading && !error && bookings.length === 0 ? <p className="text-sm text-slate-500">Belum ada data booking dari backend.</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {bookings.map((booking, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{(booking.title as string) ?? (booking.subject as string) ?? 'Booking'}</CardTitle>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{(booking.status as string) ?? 'Menunggu'}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" /> {(booking.time as string) ?? (booking.schedule as string) ?? '—'}</div>
              <div className="flex items-center gap-2 text-sm text-slate-500"><CreditCard className="h-4 w-4" /> {(booking.payment_status as string) ?? 'Belum diproses'}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
