import { useEffect, useState } from 'react';
import { Users, FileText, X, Check, Search, Filter, ShieldCheck, Wallet, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { adminService } from '@/api/services/adminService';
import { normalizeList } from '@/lib/apiData';
import { Link, useLocation } from 'react-router-dom';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await adminService.getApplications();
      setApplications(normalizeList(response));
    } catch {
      setError('Gagal memuat aplikasi tutor dari backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: number | string) => {
    try {
      await adminService.approveApplication(id);
      fetchApplications();
    } catch {
      alert('Gagal menyetujui tutor');
    }
  };

  const handleReject = async (id: number | string) => {
    const reason = prompt('Masukkan alasan penolakan (opsional):');
    if (reason !== null) {
      try {
        await adminService.rejectApplication(id, reason);
        fetchApplications();
      } catch {
        alert('Gagal menolak tutor');
      }
    }
  };

  const handleDelete = async (id: number | string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pengajuan ini?')) {
      try {
        await adminService.deleteApplication(id);
        fetchApplications();
      } catch {
        alert('Gagal menghapus pengajuan');
      }
    }
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative z-10">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Manajemen Platform</h1>
        <p className="text-textSecondary">Kelola pengguna, verifikasi tutor baru, dan pantau pembayaran dalam satu tempat.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-borderColor pb-px">
        <Link
          to="/admin/users"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors text-textSecondary hover:bg-bgSecondary hover:text-textPrimary"
        >
          <Users className="w-4 h-4" /> Manajemen Pengguna
        </Link>
        <Link
          to="/admin/applications"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors bg-accentYellow text-slate-900 shadow-[0_-2px_10px_rgba(250,204,21,0.2)] border-x border-t border-accentYellow relative top-px"
        >
          <ShieldCheck className="w-4 h-4" /> Verifikasi Tutor
        </Link>
        <Link
          to="#"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors text-textSecondary hover:bg-bgSecondary hover:text-textPrimary"
        >
          <Wallet className="w-4 h-4" /> Manajemen Keuangan
        </Link>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-bgSecondary">
        <div className="p-6 border-b border-borderColor flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-textPrimary">Daftar Pengajuan Tutor</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-textSecondary bg-bgPrimary hover:bg-borderColor rounded-lg border border-borderColor transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <div className="relative">
              <Search className="w-4 h-4 text-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari learner..." 
                className="pl-9 pr-4 py-2 text-sm bg-bgPrimary text-textPrimary border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-borderColor bg-bgPrimary/50">
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-textSecondary">Learner</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-textSecondary">Tanggal Pengajuan</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-textSecondary">Mata Kuliah Diajukan</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-textSecondary text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-textSecondary">Memuat aplikasi...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-rose-500">{error}</td>
                </tr>
              )}
              {!loading && !error && applications.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-textSecondary">Belum ada pengajuan tutor baru.</td>
                </tr>
              )}
              {!loading && !error && applications.map((item, index) => {
                const name = (item.name as string) ?? 'Unknown';
                const email = (item.email as string) ?? 'No email';
                const matkul = (item.matkul as string[])?.[0] ?? 'Umum';
                const docs = item.documents as Array<{url?: string}>;
                const docUrl = docs?.[0]?.url ?? '#';

                return (
                  <tr key={index} className="hover:bg-bgPrimary transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {getInitials(name)}
                        </div>
                        <div>
                          <p className="font-bold text-textPrimary">{name}</p>
                          <p className="text-xs text-textSecondary">{email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-textSecondary font-medium">{(item.created_at as string) ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-bgPrimary text-textPrimary border border-borderColor">
                        {matkul}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={docUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-textPrimary bg-bgPrimary hover:bg-borderColor transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> Lihat Berkas
                        </a>
                        
                        {item.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleReject(item.id as number)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                            >
                              <X className="w-3.5 h-3.5" /> Tolak
                            </button>
                            <button 
                              onClick={() => handleApprove(item.id as number)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-100 transition-colors dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20"
                            >
                              <Check className="w-3.5 h-3.5" /> ACC
                            </button>
                          </>
                        ) : (
                          <>
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              item.status === 'approved' ? 'text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400'
                            }`}>
                              {item.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                            </span>
                            {item.status === 'rejected' && (
                              <button 
                                onClick={() => handleDelete(item.id as number)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                title="Hapus Pengajuan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
