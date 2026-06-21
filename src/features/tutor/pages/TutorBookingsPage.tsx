import { useEffect, useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorService } from '@/api/services/tutorService';
import { normalizeList } from '@/lib/apiData';

// Helper to format phone number to international WhatsApp format
const formatWhatsAppLink = (phone: string | undefined) => {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  }
  return `https://wa.me/${clean}`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === '-') return '-';
  const dateObj = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
};

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
        setError('Gagal memuat jadwal dari backend.');
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
          <CardTitle>Jadwal Sesi Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat jadwal...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && requests.length === 0 ? <p className="text-sm text-slate-500">Belum ada jadwal aktif.</p> : null}
          {requests.map((request, index) => {
            const waLink = formatWhatsAppLink(request.learner_phone as string | undefined);
            
            return (
              <div key={index} className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 first:mt-0">
                <div>
                  <p className="font-bold text-slate-900 text-lg">{(request.learner as string) ?? 'Learner'}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">Mata Kuliah: <span className="text-emerald-600 font-bold">{(request.course as string) ?? '—'}</span></p>
                  <p className="text-sm text-slate-600 mt-1 font-medium bg-white inline-block px-2 py-1 rounded-md border border-slate-100">
                    Jadwal: <span className="font-bold text-[#0B132B]">{formatDate(request.date as string)}</span> | {Array.isArray(request.slots) && request.slots.length > 0 ? request.slots.join(', ') : 'Belum memilih waktu'}
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><Sparkles className="h-4 w-4" /> Disetujui</div>
                  {waLink && (
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors w-full md:w-auto justify-center shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> Hubungi Learner
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
