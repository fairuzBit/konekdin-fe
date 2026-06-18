import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, getRoleLabel } from '@/context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const role = getRoleLabel(user);
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'tutor') {
        navigate('/tutor', { replace: true });
      } else {
        navigate('/learner', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate('/learner', { replace: true });
    } catch (err) {
      setError('Login gagal. Periksa email dan password Anda.');
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,121,107,0.16),_transparent_35%),linear-gradient(135deg,_#f3fffc_0%,_#e6f6f2_100%)] p-4 md:p-8">
      <div className="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[32px] border border-brand-100 bg-white/90 shadow-[0_30px_80px_rgba(0,121,107,0.16)] lg:flex-row">
        <section className="flex flex-1 flex-col justify-between bg-brand-700 p-8 text-white md:p-12">
          <div>
            <div className="inline-flex rounded-2xl bg-white/15 p-3">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Masuk ke KonekDin</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-brand-50">
              Kelola reservasi tutor, sesi belajar, dan riwayat kelas dalam satu platform yang cepat dan aman.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/20 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4" /> JWT auth terintegrasi siap pakai</div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Selamat datang kembali</h2>
            <p className="mt-2 text-sm text-slate-500">Masukkan kredensial Anda untuk melanjutkan.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-900">Email</Label>
                <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} className="bg-white text-slate-900 placeholder:text-slate-400" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-900">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="bg-white text-slate-900 placeholder:text-slate-400" required />
              </div>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? 'Memproses...' : 'Masuk'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-brand-600">Daftar sekarang</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
