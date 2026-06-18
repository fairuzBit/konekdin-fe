import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Pencil, 
  Building2, 
  Banknote, 
  FileText, 
  Award, 
  ExternalLink,
  Briefcase,
  Loader2,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tutorService } from '@/api/services/tutorService';
import { adminService } from '@/api/services/adminService';

export default function TutorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdminView = !!id;
  const [isAvailable, setIsAvailable] = useState(true);
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    major: '',
    faculty: '',
    phone: '',
    price_per_session: 0
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchTutorData = async () => {
      setLoading(true);
      try {
        let data;
        if (isAdminView) {
          const response = await adminService.getUserById(id);
          data = response.data || response;
        } else {
          const response = await tutorService.getProfile();
          data = response.data || response;
        }
        setTutor(data);
        
        if (data) {
          if (data.status !== undefined) {
            setIsAvailable(data.status === 'active');
          }
          setFormData({
            name: data.name || data.username || '',
            nim: data.nim || '',
            major: data.major || '',
            faculty: data.faculty || '',
            phone: data.phone || '',
            price_per_session: data.price_per_session || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch tutor data');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [id, isAdminView]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Optional: immediately upload or wait for "Simpan Perubahan"
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('nim', formData.nim);
      payload.append('phone', formData.phone);
      payload.append('price_per_session', String(formData.price_per_session));
      
      if (fileInputRef.current?.files?.[0]) {
        payload.append('avatar', fileInputRef.current.files[0]);
      }

      await tutorService.updateProfile(payload);
      
      if (avatarPreview) {
        localStorage.setItem('tutor_avatar_preview', avatarPreview);
      }
      alert('Profil berhasil diperbarui!');
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      const msg = err.response?.data?.message || err.message || 'Error tidak diketahui';
      alert('Gagal memperbarui profil: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const tutorName = formData.name || tutor?.name || tutor?.username || 'Tutor Name';
  const displayAvatar = avatarPreview || tutor?.avatar || '';

  const renderAvatar = (sizeClasses: string, textClasses: string) => {
    if (displayAvatar) {
      return <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />;
    }
    return (
      <div className={`flex w-full h-full items-center justify-center bg-brand-100 text-brand-700 font-black tracking-tight ${textClasses}`}>
        {tutorName.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative z-10">
      
      {/* Top Profile Header with Navigation & Status */}
      <div className="bg-bgSecondary/90 backdrop-blur-xl border border-borderColor rounded-[36px] p-6 md:p-8 shadow-sm flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full text-center md:text-left">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] overflow-hidden bg-bgSecondary border-4 border-bgSecondary shadow-lg">
                {renderAvatar('w-32 h-32 md:w-40 md:h-40', 'text-4xl md:text-5xl')}
              </div>
              {!isAdminView && (
                <>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-2 right-2 bg-brand-500 text-white p-2.5 rounded-2xl shadow-lg hover:bg-brand-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </>
              )}
            </div>
            
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 text-brand-600 font-semibold text-xs mb-2 bg-brand-50 px-2.5 py-1 rounded-full dark:bg-brand-500/10 dark:text-brand-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Tutor
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-textPrimary tracking-tight mb-2">{tutorName}</h1>
              <div className="flex items-center justify-center md:justify-start text-textSecondary font-medium">
                <Building2 className="w-4 h-4 mr-2" />
                {formData.faculty || 'Universitas Dian Nuswantoro'}
              </div>
            </div>
          </div>

          {/* Switch to Learner Panel Button */}
          {!isAdminView && (
            <Link 
              to="/learner/dashboard"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-bgPrimary border border-borderColor text-textPrimary hover:border-brand-500 hover:text-brand-500 transition-colors shadow-sm text-sm font-semibold mt-4 md:mt-0 w-full md:w-auto shrink-0"
            >
              <GraduationCap className="w-4 h-4" />
              Beralih ke Panel Learner
            </Link>
          )}
        </div>

        {/* Status Ketersediaan (Combined) */}
        <div className="flex items-center justify-between border-t border-borderColor mt-8 pt-8">
          <div>
            <div className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider mb-2 ${isAvailable ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400' : 'bg-bgSecondary text-textSecondary border border-borderColor'}`}>
              ● {isAvailable ? 'Aktif' : 'Nonaktif'}
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-1">Status Ketersediaan</h3>
            <p className="text-sm text-textSecondary">
              {isAdminView 
                ? 'Status ketersediaan tutor untuk menerima sesi baru.' 
                : 'Nonaktifkan jika Anda tidak ingin muncul di pencarian learner atau menerima permintaan sesi baru untuk sementara waktu.'}
            </p>
          </div>
          {!isAdminView && (
            <div className="shrink-0 ml-4">
              <button 
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isAvailable ? 'bg-brand-500' : 'bg-borderColor'}`}
              >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Informasi Pribadi */}
      <Card className="border-borderColor bg-bgSecondary shadow-sm rounded-[32px] overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-textPrimary">Informasi Pribadi</h3>
            {!isAdminView && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-sm font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Pencil className="w-4 h-4" /> Edit Profil
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Nama', value: formData.name || tutorName },
              { label: 'NIM', value: formData.nim },
              { label: 'Jurusan', value: 'Teknik Informatika' },
              { label: 'Fakultas', value: 'Ilmu Komputer' },
              { label: 'Email', value: tutor?.email || 'email@example.com' },
              { label: 'Nomor Telepon', value: formData.phone },
            ].map((item, idx) => (
              <div key={idx}>
                <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1.5 ml-1">
                  {item.label}
                </label>
                <div className="rounded-2xl p-4 text-sm font-semibold border transition-colors bg-bgPrimary border-transparent text-textSecondary">
                  <input 
                    type="text" 
                    value={item.value} 
                    readOnly
                    className="bg-transparent w-full outline-none text-textPrimary cursor-default"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      {isEditModalOpen && !isAdminView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bgSecondary w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-textPrimary mb-6">Edit Profil</h2>
              
              <div className="space-y-6">
                {/* Avatar Edit */}
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0 w-24 h-24 rounded-full overflow-hidden border-4 border-bgPrimary bg-bgPrimary">
                    {renderAvatar('w-24 h-24', 'text-3xl')}
                  </div>
                  <div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-bold text-sm rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                    >
                      Ganti Foto Profil
                    </button>
                    <p className="text-xs text-textSecondary mt-2">Format: JPG, PNG, GIF (Maks. 2MB)</p>
                  </div>
                </div>

                {/* Fields Edit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-textSecondary mb-1.5">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full rounded-xl p-3 bg-bgPrimary border border-borderColor focus:border-brand-500 outline-none text-textPrimary font-medium text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textSecondary mb-1.5">NIM</label>
                    <input 
                      type="text" 
                      value={formData.nim} 
                      onChange={(e) => handleInputChange('nim', e.target.value)}
                      className="w-full rounded-xl p-3 bg-bgPrimary border border-borderColor focus:border-brand-500 outline-none text-textPrimary font-medium text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textSecondary mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={tutor?.email || ''} 
                      readOnly
                      className="w-full rounded-xl p-3 bg-bgPrimary border border-transparent outline-none text-textSecondary font-medium text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textSecondary mb-1.5">Nomor Telepon</label>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full rounded-xl p-3 bg-bgPrimary border border-borderColor focus:border-brand-500 outline-none text-textPrimary font-medium text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Hardcoded Readonly Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
                  <div>
                    <label className="block text-xs font-bold text-textSecondary mb-1.5">Jurusan</label>
                    <input type="text" value="Teknik Informatika" readOnly className="w-full rounded-xl p-3 bg-bgPrimary border border-transparent outline-none text-textSecondary font-medium text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textSecondary mb-1.5">Fakultas</label>
                    <input type="text" value="Ilmu Komputer" readOnly className="w-full rounded-xl p-3 bg-bgPrimary border border-transparent outline-none text-textSecondary font-medium text-sm cursor-not-allowed" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderColor">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-textSecondary hover:bg-bgPrimary transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={async () => {
                      await handleSaveProfile();
                      setIsEditModalOpen(false);
                    }}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tarif Mengajar */}
      <Card className="border-borderColor bg-bgSecondary shadow-sm rounded-[32px] overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-2 text-brand-500 mb-6">
            <Banknote className="w-5 h-5" />
            <h3 className="text-lg font-bold text-textPrimary">Tarif Mengajar</h3>
          </div>
          <p className="text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Per Sesi</p>
          
          {!isAdminView ? (
            <div className="mb-6 flex items-center">
              <span className="text-4xl font-extrabold text-textPrimary mr-4">Rp</span>
              <input 
                type="number"
                value={formData.price_per_session}
                onChange={(e) => handleInputChange('price_per_session', parseInt(e.target.value) || 0)}
                className="text-4xl font-extrabold text-textPrimary bg-transparent border-b-2 border-dashed border-borderColor focus:border-brand-500 outline-none w-48"
              />
            </div>
          ) : (
            <div className="text-4xl font-extrabold text-textPrimary mb-6">Rp {tutor?.price_per_session ? tutor.price_per_session.toLocaleString('id-ID') : '0'}</div>
          )}
          
          {!isAdminView && (
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-6 font-bold text-base shadow-sm">
              {saving ? 'Menyimpan...' : 'Perbarui Tarif Mengajar'}
            </Button>
          )}
        </div>
      </Card>

      {/* Prestasi Akademik */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-textPrimary">Prestasi Akademik</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bgSecondary border border-borderColor rounded-3xl p-6 text-center flex flex-col justify-center items-center h-32 hover:border-brand-500 transition-all cursor-default shadow-sm">
            <div className="text-3xl font-extrabold text-brand-500 mb-2">{tutor?.ipk || tutor?.application?.ipk || 'Belum diatur'}</div>
            <div className="text-[10px] font-extrabold text-textSecondary uppercase tracking-widest leading-snug">
              IPK Kumulatif
            </div>
          </div>
        </div>
      </div>

      {/* Portofolio / Transkrip */}
      {(tutor?.transcript_path || tutor?.application?.transcript_path) && (
        <div className="pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-textPrimary">Dokumen Transkrip</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group cursor-pointer">
              <a 
                href={tutor?.transcript_path || tutor?.application?.transcript_path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block aspect-[16/9] bg-slate-900 rounded-[32px] overflow-hidden mb-4 relative shadow-sm border border-borderColor"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 transition-transform duration-500 group-hover:scale-105">
                  <FileText className="w-16 h-16 text-brand-400 opacity-80" />
                </div>
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Dokumen
                </div>
              </a>
              <h4 className="text-lg font-bold text-textPrimary mb-1.5 group-hover:text-brand-500 transition-colors">Transkrip Nilai</h4>
              <p className="text-sm text-textSecondary font-medium leading-relaxed">
                Dokumen transkrip nilai yang diunggah saat pendaftaran tutor.
              </p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
