import { useState, useMemo } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, GraduationCap, Briefcase, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { learnerService } from '@/api/services/learnerService';
import { useNavigate } from 'react-router-dom';

// Mock Data for Courses to demonstrate filtering logic
const MOCK_COURSES = [
  { id: 1, name: "Algoritma Pemrograman", semester: 1 },
  { id: 2, name: "Kalkulus Dasar", semester: 1 },
  { id: 3, name: "Logika Informatika", semester: 1 },
  { id: 4, name: "Struktur Data", semester: 2 },
  { id: 5, name: "Basis Data", semester: 2 },
  { id: 6, name: "Jaringan Komputer", semester: 3 },
  { id: 7, name: "Sistem Operasi", semester: 3 },
  { id: 8, name: "Pemrograman Web", semester: 4 },
  { id: 9, name: "Kecerdasan Buatan", semester: 5 },
];

export default function TutorApplicationPage() {
  const navigate = useNavigate();
  const [currentSemester, setCurrentSemester] = useState<number>(3);
  const [courseId, setCourseId] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [portfolioLink, setPortfolioLink] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Array to hold files based on required count
  const requiredFilesCount = Math.max(1, currentSemester - 1);
  const [transcriptFiles, setTranscriptFiles] = useState<(File | null)[]>(Array(requiredFilesCount).fill(null));

  // Filter courses based on current semester (can only teach past semesters)
  const availableCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => course.semester < currentSemester);
  }, [currentSemester]);

  const handleSemesterChange = (val: number) => {
    const newSem = Math.max(3, Math.min(14, val)); // Validate bounds 3-14
    setCurrentSemester(newSem);
    
    // Reset course if the currently selected one is no longer valid
    const isCurrentCourseValid = MOCK_COURSES.find(c => c.id.toString() === courseId && c.semester < newSem);
    if (!isCurrentCourseValid) setCourseId('');

    // Adjust transcript files array size
    const newRequiredCount = Math.max(1, newSem - 1);
    setTranscriptFiles(prev => {
      const newFiles = [...prev];
      if (newFiles.length < newRequiredCount) {
        return [...newFiles, ...Array(newRequiredCount - newFiles.length).fill(null)];
      }
      return newFiles.slice(0, newRequiredCount);
    });
  };

  const handleFileChange = (index: number, file: File | null) => {
    setTranscriptFiles(prev => {
      const newArr = [...prev];
      newArr[index] = file;
      return newArr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || transcriptFiles.some(f => f === null)) {
      alert("Mohon lengkapi semua field yang wajib!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('current_semester', currentSemester.toString());
      formData.append('course_id', courseId);
      
      // Backend currently only accepts one transcript_file
      if (transcriptFiles[0]) {
        formData.append('transcript_file', transcriptFiles[0]);
      }
      
      formData.append('bio', bio);
      formData.append('portfolio_link', portfolioLink);

      await learnerService.upgradeToTutor(formData);
      alert('Aplikasi berhasil dikirim! Menunggu persetujuan admin.');
      navigate('/learner/profile');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan sistem';
      alert('Gagal: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid lg:grid-cols-[45%_55%] gap-8 lg:gap-12 relative z-10 pb-12">
      
      {/* Left Column: Thesis & Information */}
      <div className="flex flex-col pt-8 lg:pt-16 lg:sticky lg:top-8 h-fit">
        <div className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-extrabold tracking-widest text-xs uppercase mb-6 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-full w-fit">
          <GraduationCap className="w-4 h-4" />
          KonekDin Tutor
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
          Bantu yang lain,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
            Kembangkan dirimu.
          </span>
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 text-lg font-medium leading-relaxed max-w-md mb-12">
          Bagikan keahlianmu pada mata kuliah yang telah kamu kuasai. Menjadi tutor tidak hanya menambah penghasilan, tapi juga mengasah pemahamanmu sendiri.
        </p>

        <div className="space-y-8 max-w-md">
          {[
            { title: "Verifikasi Semester", desc: "Upload transkrip nilai sesuai jumlah semester yang telah kamu lewati." },
            { title: "Pilih Mata Kuliah", desc: "Kamu hanya bisa mengajar mata kuliah dari semester di bawahmu." },
            { title: "Tunggu Persetujuan", desc: "Sistem akan memverifikasi IPK dan nilaimu secara otomatis sebelum kamu bisa mengajar." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Application Form */}
      <div className="bg-white dark:bg-bgSecondary rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-borderColor p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Akademik */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-borderColor pb-4">
              1. Informasi Akademik
            </h3>
            
            <div className="space-y-3">
              <label className="block text-[11px] font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase ml-1">
                Semester Berjalan <span className="text-red-500">*</span>
              </label>
              <Input 
                type="number" 
                min="3" max="14"
                value={currentSemester}
                onChange={(e) => handleSemesterChange(parseInt(e.target.value) || 3)}
                className="h-14 rounded-2xl bg-slate-50 dark:bg-bgPrimary border-slate-300 dark:border-borderColor focus-visible:ring-brand-500 text-lg font-bold px-5 text-slate-900 dark:text-white"
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">Minimal semester 3. Anda memerlukan {requiredFilesCount} transkrip nilai.</p>
            </div>

            {/* Dynamic Transcripts Upload */}
            <div className="space-y-4 pt-2">
              <label className="block text-[11px] font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase ml-1 mb-2">
                Dokumen Transkrip <span className="text-red-500">*</span>
              </label>
              
              <div className="grid gap-4">
                {Array.from({ length: requiredFilesCount }).map((_, i) => (
                  <div key={i} className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => handleFileChange(i, e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-colors
                      ${transcriptFiles[i] ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-slate-300 dark:border-borderColor bg-slate-50 dark:bg-bgPrimary group-hover:border-brand-400'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                        ${transcriptFiles[i] ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>
                        {transcriptFiles[i] ? <CheckCircle2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                      </div>
                      <div className="truncate pr-4">
                        <p className={`font-bold text-sm truncate ${transcriptFiles[i] ? 'text-brand-700 dark:text-brand-400' : 'text-slate-900 dark:text-white'}`}>
                          {transcriptFiles[i] ? transcriptFiles[i]?.name : `Transkrip Semester ${i + 1}`}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {transcriptFiles[i] ? 'Siap diunggah' : 'Format PDF (Maks. 5MB)'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Pemilihan Matkul */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-borderColor pb-4">
              2. Mata Kuliah & Keahlian
            </h3>

            <div className="space-y-3">
              <label className="block text-[11px] font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase ml-1">
                Mata Kuliah Diajarkan <span className="text-red-500">*</span>
              </label>
              <select 
                value={courseId} 
                onChange={(e) => setCourseId(e.target.value)} 
                className="w-full h-14 rounded-2xl border border-slate-300 dark:border-borderColor bg-slate-50 dark:bg-bgPrimary px-5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none cursor-pointer"
                required
              >
                <option value="" className="text-slate-500">Pilih mata kuliah...</option>
                {availableCourses.map(c => (
                  <option key={c.id} value={c.id} className="text-slate-900 dark:text-white">{c.name} (Sem {c.semester})</option>
                ))}
              </select>
              {availableCourses.length === 0 && (
                <p className="text-xs text-red-500 font-semibold mt-1">Tidak ada matkul tersedia untuk semester ini.</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase ml-1 flex items-center gap-1.5">
                Keahlian & Bio Singkat <span className="text-slate-400 font-medium normal-case tracking-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute top-4 left-4 w-5 h-5 text-slate-400" />
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  rows={4} 
                  placeholder="Ceritakan keahlian spesifikmu, gaya mengajarmu..." 
                  className="w-full rounded-2xl border border-slate-300 dark:border-borderColor bg-slate-50 dark:bg-bgPrimary pl-12 pr-5 py-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase ml-1 flex items-center gap-1.5">
                Link Portofolio <span className="text-slate-400 font-medium normal-case tracking-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                <Input 
                  type="url"
                  value={portfolioLink} 
                  onChange={(e) => setPortfolioLink(e.target.value)} 
                  placeholder="https://github.com/username" 
                  className="h-14 rounded-2xl bg-slate-50 dark:bg-bgPrimary border-slate-300 dark:border-borderColor focus-visible:ring-brand-500 text-sm font-medium text-slate-900 dark:text-white pl-12 pr-5 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-borderColor">
            <Button 
              type="submit" 
              disabled={isSubmitting || availableCourses.length === 0}
              className="w-full h-14 rounded-2xl text-base font-bold bg-[#0a192f] hover:bg-[#112240] dark:bg-brand-600 dark:hover:bg-brand-700 text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sedang Mengirim...
                </>
              ) : (
                <>
                  Kirim Aplikasi Tutor
                  <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-4">
              Dengan mengirim aplikasi, Anda menyetujui syarat & ketentuan KonekDin.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
