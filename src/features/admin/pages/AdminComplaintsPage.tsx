import { useEffect, useState } from 'react';
import { MessageSquareText, Star, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/api/services/adminService';
import { normalizeList } from '@/lib/apiData';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AdminComplaintsPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await adminService.getModerationReviews();
      setComplaints(normalizeList(response));
    } catch {
      setError('Gagal memuat komplain dari backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleProcess = async (id: number, tutorName?: string) => {
    try {
      await adminService.processReview(id);
      if (tutorName) {
        navigate(`/admin/users?name=${encodeURIComponent(tutorName)}&role=tutor`);
      } else {
        fetchComplaints();
      }
    } catch {
      alert('Gagal memproses ulasan');
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await adminService.resolveReview(id);
      fetchComplaints();
    } catch {
      alert('Gagal menyelesaikan ulasan');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus ulasan buruk ini secara permanen?')) {
      try {
        await adminService.deleteReview(id);
        fetchComplaints();
      } catch {
        alert('Gagal menghapus ulasan');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moderasi Ulasan (Komplain)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat komplain...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && complaints.length === 0 ? <p className="text-sm text-slate-500">Belum ada komplain dari backend. Semua ulasan terlihat baik.</p> : null}
          {complaints.map((item, index) => (
            <div key={index} className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-start rounded-2xl border border-slate-200 bg-slate-50 p-5 first:mt-0">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-rose-600 font-semibold bg-rose-100 px-2 py-1 rounded-md text-xs">
                    <Star className="h-3 w-3 fill-rose-600" /> {item.rating} Bintang
                  </div>
                  <span className="text-sm font-medium text-slate-700">Learner: {item.learner_name}</span>
                  <span className="text-xs text-slate-400">→</span>
                  <span className="text-sm font-medium text-slate-700">Tutor: {item.tutor_name}</span>
                </div>
                <div className="mt-3 flex items-start gap-2 text-slate-600">
                  <MessageSquareText className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-sm italic">"{item.comment || 'Tidak ada komentar'}"</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-400">{item.tanggal}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.moderation_status === 'MENUNGGU TINJAUAN' ? 'bg-amber-100 text-amber-700' : item.moderation_status === 'DIPROSES' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {item.moderation_status}
                  </span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                {item.moderation_status === 'MENUNGGU TINJAUAN' && (
                  <Button size="sm" variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleProcess(item.id, item.tutor_name)}>
                    <AlertCircle className="w-4 h-4 mr-2" /> Proses
                  </Button>
                )}
                {(item.moderation_status === 'MENUNGGU TINJAUAN' || item.moderation_status === 'DIPROSES') && (
                  <Button size="sm" variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleResolve(item.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Selesai
                  </Button>
                )}
                <Button size="sm" variant="outline" className="w-full text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
