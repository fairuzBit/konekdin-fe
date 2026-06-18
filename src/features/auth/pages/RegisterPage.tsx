import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/learner', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register({ name, nim, phone, email, password });
      navigate('/learner', { replace: true });
    } catch {
      setError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-medium text-slate-600">Memuat sesi...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/learner" replace />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(0,121,107,0.16),_transparent_35%),linear-gradient(135deg,_#f8fffd_0%,_#ebf8f4_100%)] p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-6xl max-h-full flex-col-reverse overflow-y-auto lg:overflow-hidden rounded-[32px] border border-brand-100 bg-white/90 shadow-[0_30px_80px_rgba(0,121,107,0.16)] lg:flex-row">
        <section className="flex flex-1 items-center justify-center p-6 md:p-10 shrink-0">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 md:p-8">
            <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Buat akun Learner baru</h2>
            <p className="mt-2 text-sm text-slate-500">Daftar dan mulai cari tutor sesuai kebutuhan belajar Anda.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" placeholder="Nama lengkap" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nim">NIM</Label>
                  <Input id="nim" placeholder="123456789" value={nim} onChange={(event) => setNim(event.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" placeholder="0812xxxxxxxx" value={phone} onChange={(event) => setPhone(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)} 
                    className="pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? 'Memproses...' : 'Daftar'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-brand-600">Masuk di sini</Link>
            </p>
          </div>
        </section>

        <section className="flex lg:flex-1 shrink-0 flex-col justify-between bg-brand-700 p-8 text-white md:p-12">
          <div>
            <div className="inline-flex rounded-2xl bg-white/15 p-3">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Gabung sebagai Learner</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-brand-50">
              Jelajahi tutor, buat booking, dan dapatkan bimbingan belajar yang terorganisir dengan baik.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
