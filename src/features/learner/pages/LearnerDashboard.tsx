import { useEffect, useState } from 'react';
import { CalendarDays, Clock, Sparkles, TrendingUp, Wallet, CheckCircle, Clock3, BookOpen, Star, Plus, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLearnerDashboard } from '@/hooks/useLearnerDashboard';
import { pickValue } from '@/lib/apiData';
import { useAuth } from '@/context/AuthContext';
import { learnerService } from '@/api/services/learnerService';
import { normalizeList } from '@/lib/apiData';
import { Link, useNavigate } from 'react-router-dom';

function formatNumber(value: unknown) {
  if (typeof value === 'number') {
    return value.toLocaleString('id-ID');
  }
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return '0';
}

export default function LearnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, stats, loading, error } = useLearnerDashboard();
  
  const [tutors, setTutors] = useState<Array<Record<string, unknown>>>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await learnerService.getTutors();
        setTutors(normalizeList(response));
      } catch (err) {
        console.error('Failed to fetch tutors');
      } finally {
        setLoadingTutors(false);
      }
    };
    fetchTutors();
  }, []);

  const totalSesi = formatNumber(pickValue(stats, ['total_sessions', 'totalSessions', 'completed_sessions', 'activeSessions', 'active_session_count']));
  const jamBelajar = formatNumber(pickValue(stats, ['total_hours', 'jamBelajar', 'hours']));
  const mataKuliah = formatNumber(pickValue(stats, ['total_courses', 'courses', 'totalCourses']));
  
  const upcomingSessions = Array.isArray(pickValue(data, ['upcoming_sessions', 'upcomingSessions', 'schedules']))
    ? (pickValue(data, ['upcoming_sessions', 'upcomingSessions', 'schedules']) as Array<Record<string, unknown>>)
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#001f3f] to-[#00796B] rounded-[32px] p-8 md:p-12 text-white shadow-xl">
        <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="40"/>
            <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="20"/>
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
              Selamat Datang Kembali, <br/>
              <span className="text-[#64ffda]">{user?.name || 'Budi Santoso'}!</span>
            </h1>
            <p className="text-brand-50 text-base md:text-lg opacity-90 max-w-xl">
              Pahami materi lebih cepat dan lebih terarah. Temukan tutor yang cocok dengan kebutuhan belajarmu.
            </p>
          </div>
          
          <Link 
            to="/learner/bookings/new"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-[#003E39] font-bold px-6 py-3 rounded-full hover:bg-slate-50 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" /> Sesi Baru
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm rounded-3xl p-6 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f4f7fe] flex items-center justify-center text-blue-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="bg-[#e8fbf6] text-[#05a660] text-xs font-extrabold px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Total Sesi Selesai</p>
            <h3 className="text-3xl font-extrabold text-[#111840]">{loading ? '...' : totalSesi || '12'}</h3>
          </div>
        </Card>

        <Card className="border-0 shadow-sm rounded-3xl p-6 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e8fbf6] flex items-center justify-center text-[#05a660]">
              <Clock3 className="w-5 h-5" />
            </div>
            <span className="bg-[#e8fbf6] text-[#05a660] text-xs font-extrabold px-2 py-1 rounded-full">+18.5%</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Jam Belajar</p>
            <h3 className="text-3xl font-extrabold text-[#111840]">{loading ? '...' : jamBelajar || '18'} <span className="text-lg">jam</span></h3>
          </div>
        </Card>

        <Card className="border-0 shadow-sm rounded-3xl p-6 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-[#fff4e5] flex items-center justify-center text-[#ff9800]">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="bg-[#e8fbf6] text-[#05a660] text-xs font-extrabold px-2 py-1 rounded-full">+7%</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Mata Kuliah Dipelajari</p>
            <h3 className="text-3xl font-extrabold text-[#111840]">{loading ? '...' : mataKuliah || '3'}</h3>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#111840]">Jadwal Mendatang</h2>
          
          {loading && <p className="text-sm text-slate-500">Memuat jadwal...</p>}
          {!loading && upcomingSessions.length === 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-48">
              <CalendarDays className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Belum ada sesi mendatang.</p>
              <Link to="/learner/bookings/new" className="text-emerald-600 font-bold mt-2 hover:underline">
                Buat sesi baru
              </Link>
            </div>
          )}
          
          {upcomingSessions.map((session, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.tutor_name || session.tutor || 'Tutor'}`} className="w-16 h-16 bg-slate-200 rounded-2xl" alt="Tutor" />
                  <div className="absolute -bottom-2 -right-2 bg-white px-1.5 py-0.5 rounded-lg shadow-sm border border-slate-100 flex items-center text-[10px] font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-0.5" /> 4.9
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#05a660] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">BESOK</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">{session.time || '12:30 WIB'}</span>
                  </div>
                  <h4 className="font-bold text-[#111840]">{session.course_name || session.title || 'Algoritma & Struktur Data'}</h4>
                  <p className="text-sm text-slate-500">{session.tutor_name || session.tutor || 'Irkham Wildan'}</p>
                </div>
              </div>
              <Link 
                to={`/learner/bookings/${session.id}`}
                className="w-full sm:w-auto bg-[#111840] text-white hover:bg-[#1a2352] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors text-center"
              >
                Rincian Sesi
              </Link>
            </div>
          ))}

          {/* Tips Card */}
          <div className="bg-[#fff4e5] border border-[#ffe0b2] rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[#ff9800]" />
              <h4 className="font-bold text-[#b26a00]">Tips Belajar</h4>
            </div>
            <p className="text-[#8c5300] text-sm font-medium leading-relaxed mb-4">
              Mahasiswa lebih menyukai belajar dengan materi ringkasan di akhir sesi. Coba buat "Catatan Digital" agar sesi belajarmu lebih efektif.
            </p>
            <button className="text-[10px] font-extrabold text-[#ff9800] uppercase tracking-widest hover:underline">
              PELAJARI LEBIH LANJUT
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#111840]">Tutor Rekomendasi</h2>
          
          <div className="space-y-4">
            {loadingTutors && <p className="text-sm text-slate-500">Mencari tutor rekomendasi...</p>}
            
            {!loadingTutors && tutors.slice(0, 3).map((tutor, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all" onClick={() => navigate(`/learner/tutors/${tutor.id}`)}>
                <div className="relative">
                  <img src={(tutor.avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.name || 'Tutor'}`} className="w-20 h-20 bg-slate-200 rounded-2xl object-cover" alt="Tutor" />
                  <div className="absolute top-1 right-1 bg-white px-1.5 py-0.5 rounded-lg shadow-sm flex items-center text-[10px] font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-0.5" /> {(tutor.rating as number) || '4.9'}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[#111840]">{tutor.name as string}</h4>
                  <p className="text-xs text-slate-500 font-medium mb-1">{(tutor.major as string) || (tutor.matkul as string[])?.[0] || 'Matematika Diskrit'}</p>
                  <p className="text-[10px] text-slate-400 font-medium">({(tutor.reviews_count as number) || Math.floor(Math.random() * 100) + 10} ulasan)</p>
                </div>
              </div>
            ))}
          </div>

          <Link 
            to="/learner/tutors"
            className="block w-full border-2 border-dashed border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold px-6 py-4 rounded-3xl text-center transition-colors"
          >
            Jelajahi Tutor Lainnya
          </Link>
        </div>

      </div>
    </div>
  );
}
