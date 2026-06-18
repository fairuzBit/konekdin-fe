import { useEffect, useState } from 'react';
import { History, Star, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { learnerService } from '@/api/services/learnerService';
import { normalizeList } from '@/lib/apiData';

export default function LearnerHistoryPage() {
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await learnerService.getHistory();
        const data = normalizeList(response);
        
        // If backend is empty, use some realistic mock data for presentation
        if (data.length === 0) {
          setHistory([
            {
              title: 'Pemrograman Web Dasar',
              date: '12 Mei 2026, 14:00 WIB',
              tutor_name: 'Irkham Wildan',
              status: 'completed',
              rating: '4.9'
            },
            {
              title: 'Algoritma & Struktur Data',
              date: '08 Mei 2026, 09:30 WIB',
              tutor_name: 'Mery Zahra',
              status: 'completed',
              rating: '4.8'
            }
          ]);
        } else {
          setHistory(data);
        }
      } catch {
        setError('Gagal memuat riwayat kelas dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 relative z-10 max-w-5xl mx-auto pb-12">
      <div className="rounded-[28px] border border-borderColor bg-bgSecondary p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-brand-500 p-3 text-white shadow-md"><History className="h-6 w-6" /></div>
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">Riwayat Belajar</h2>
            <p className="text-sm text-textSecondary font-medium mt-1">Daftar sesi pembelajaran yang telah Anda selesaikan.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-sm text-textSecondary font-semibold animate-pulse">Memuat riwayat belajar...</p>
        </div>
      ) : null}
      
      {error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-center">
          <p className="text-sm font-semibold text-rose-500 dark:text-rose-400">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {!loading && history.map((item, index) => (
          <Card key={index} className="border-borderColor bg-bgSecondary shadow-sm rounded-3xl overflow-hidden hover:border-brand-500 transition-colors">
            <CardHeader className="pb-3 border-b border-borderColor">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-textPrimary mb-1">{(item.title as string) || (item.course_name as string) || 'Sesi Kelas'}</CardTitle>
                  <span className="text-xs font-semibold text-textSecondary">{(item.date as string) || (item.completed_at as string) || '—'}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Tutor</p>
                  <p className="text-sm font-bold text-textPrimary">{(item.tutor as string) || (item.tutor_name as string) || '—'}</p>
                </div>
                {((item.rating as string) || (item.score as string)) && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl">
                    <Star className="h-4 w-4 fill-current" /> {(item.rating as string) || (item.score as string)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
