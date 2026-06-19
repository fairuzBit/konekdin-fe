import { Search, Loader2, Star, Award, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { learnerService } from '@/api/services/learnerService';
import { Link } from 'react-router-dom';

export default function TutorListPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await learnerService.getTutors();
        setTutors(response.data || []);
      } catch (error) {
        console.error('Failed to fetch tutors', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800">Cari Tutor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input className="pl-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 h-11" placeholder="Cari mata kuliah atau nama tutor..." />
            </div>
            <button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-2 text-sm font-bold text-white transition-colors shadow-sm">
              Cari
            </button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="flex flex-col hover:border-emerald-200 transition-all shadow-sm hover:shadow-md rounded-[24px] overflow-hidden border-slate-100">
              <CardContent className="p-5 flex flex-col flex-1">
                {/* Header: Avatar + Rating + Top Tutor Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    {tutor.avatar ? (
                      <img src={tutor.avatar} alt={tutor.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                        <UserCircle className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute -top-2 -right-3 bg-slate-800 text-white rounded-full px-2 py-0.5 text-[11px] font-bold flex items-center shadow-sm">
                      <Star className="w-3 h-3 text-amber-400 mr-1 fill-current" />
                      {tutor.rating_avg || 'Baru'}
                    </div>
                  </div>
                  
                  {/* Top Tutor Indicator (Optional logic, we display for tutors with good rating or just static as per design if rating >= 4.5) */}
                  {(!tutor.rating_avg || parseFloat(tutor.rating_avg) >= 4.5) && (
                    <div className="flex flex-col items-center">
                      <div className="bg-amber-100 text-amber-500 p-1.5 rounded-lg mb-1 shadow-sm border border-amber-200">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-widest">Top Tutor</span>
                    </div>
                  )}
                </div>

                {/* Name & Bio/Info */}
                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-slate-800 mb-0.5 line-clamp-1">{tutor.name}</h3>
                  <p className="text-[13px] text-slate-500 line-clamp-1">
                    {tutor.bio || `Semester ${tutor.current_semester || '?'}`}
                  </p>
                </div>

                {/* Subjects Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tutor.taught_courses && tutor.taught_courses.length > 0 ? (
                    tutor.taught_courses.slice(0, 4).map((c: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded-md uppercase tracking-wider">
                        {c.course_name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] italic text-slate-400">Belum ada mata kuliah</span>
                  )}
                </div>
                
                {/* Available Hours */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jam Tersedia</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.available_slots && tutor.available_slots.length > 0 ? (
                      tutor.available_slots.slice(0, 5).map((slot: any, idx: number) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 text-[11px] px-2.5 py-1 rounded-full font-medium">
                          {slot.start_time}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] italic text-slate-400">Belum ada jadwal.</span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => alert('Fitur Pemesanan Sesi belum diimplementasikan.')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    Pesan Sesi
                  </button>
                  <Link 
                    to={`/tutors/${tutor.id}`}
                    className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[13px] font-bold py-2.5 rounded-xl text-center transition-colors"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {tutors.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
              Belum ada tutor yang tersedia saat ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
