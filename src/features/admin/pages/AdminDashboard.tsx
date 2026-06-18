import { useEffect, useState } from 'react';
import { BarChart3, ShieldCheck, Users, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { adminService } from '@/api/services/adminService';
import { normalizeRecord, pickValue } from '@/lib/apiData';
import { Link } from 'react-router-dom';

function formatNumber(value: unknown) {
  if (typeof value === 'number') {
    return value.toLocaleString('id-ID');
  }

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return '0';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [activeComplaintsCount, setActiveComplaintsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, reviewsResponse] = await Promise.all([
          adminService.getStats(),
          adminService.getModerationReviews()
        ]);
        setStats(normalizeRecord(statsResponse));
        
        // Count active complaints (MENUNGGU TINJAUAN or DIPROSES)
        const reviews = Array.isArray(reviewsResponse) ? reviewsResponse : (reviewsResponse?.data || []);
        const active = reviews.filter((r: any) => r.moderation_status !== 'SELESAI');
        setActiveComplaintsCount(active.length);
        
      } catch {
        setError('Gagal memuat data dashboard dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalLearners = formatNumber(pickValue(stats, ['total_learners', 'total_users', 'users_count']));
  const tutorVerified = formatNumber(pickValue(stats, ['verified_tutors', 'total_tutors', 'tutors_count']));
  const complaints = formatNumber(activeComplaintsCount);
  const pendingApplications = formatNumber(pickValue(stats, ['pending_applications', 'tutor_applications', 'applications_count']));

  return (
    <div className="space-y-8">
      {/* Header section similar to image */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-500">Performa dan aktivitas platform hari ini. Kelola ekosistem akademik dengan presisi.</p>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">{error}</div>}

      {/* 3 Top Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-brand-50 p-3 rounded-2xl text-brand-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Total Pelajar</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{loading ? '...' : totalLearners}</h3>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Tutor Terdaftar</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{loading ? '...' : tutorVerified}</h3>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Komplain Aktif</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{loading ? '...' : complaints}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - 2 Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Col - Activity (Mocked since no API yet) */}
        <div className="lg:col-span-2">
          <Card className="h-full border-slate-200 shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Aktivitas Terbaru</h3>
                <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">Lihat Semua</button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b">
                  <span>Nama Pengguna</span>
                  <span className="col-span-2">Aktivitas</span>
                  <span className="text-right">Status</span>
                </div>
                
                {loading ? (
                   <p className="text-sm text-slate-500 py-4">Memuat aktivitas...</p>
                ) : (
                  <div className="py-8 text-center text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Belum ada aktivitas baru hari ini.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Quick Actions & Alerts */}
        <div className="space-y-6">
          <Card className="border-brand-200 shadow-sm rounded-3xl overflow-hidden border-l-4 border-l-brand-600">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900">Manajemen Tutor</h3>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{loading ? '-' : pendingApplications}</span>
              </div>
              <p className="text-sm text-slate-500 mb-5">Pengajuan verifikasi dokumen tutor tertunda.</p>
              <Link to="/admin/applications" className="block text-center w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold py-2.5 rounded-xl transition-colors">
                Lihat Detail
              </Link>
            </CardContent>
          </Card>

          <Card className="border-rose-200 shadow-sm rounded-3xl overflow-hidden border-l-4 border-l-rose-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900">Komplain Baru</h3>
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-md">{loading ? '-' : complaints}</span>
              </div>
              <p className="text-sm text-slate-500 mb-5">Butuh tanggapan admin segera.</p>
              <Link to="/admin/complaints" className="flex items-center text-rose-600 font-semibold text-sm hover:text-rose-700 group">
                Tinjau Komplain <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
