import { useEffect, useState } from 'react';
import { UserCircle2, Eye, Ban, Trash2, CheckCircle2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/api/services/adminService';
import { normalizeList } from '@/lib/apiData';
import { Link, useSearchParams } from 'react-router-dom';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState(searchParams.get('name') || '');
  const [filterRole, setFilterRole] = useState(searchParams.get('role') || 'all');

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchName) params.set('name', searchName);
    if (filterRole !== 'all') params.set('role', filterRole);
    setSearchParams(params, { replace: true });
  }, [searchName, filterRole, setSearchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      setUsers(normalizeList(response));
    } catch {
      setError('Gagal memuat pengguna dari backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspendToggle = async (userId: string | number, isSuspended: boolean) => {
    try {
      if (isSuspended) {
        await adminService.unsuspendUser(userId);
      } else {
        await adminService.suspendUser(userId);
      }
      fetchUsers();
    } catch {
      alert('Gagal mengubah status suspend pengguna');
    }
  };

  const handleDelete = async (userId: string | number) => {
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch {
        alert('Gagal menghapus pengguna');
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const role = (user.role as string) ?? (user.roles as string) ?? '—';
    const name = (user.name as string) ?? (user.username as string) ?? 'Pengguna';
    
    const matchesName = name.toLowerCase().includes(searchName.toLowerCase());
    const matchesRole = filterRole === 'all' || role.toLowerCase() === filterRole.toLowerCase();
    
    return matchesName && matchesRole;
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-bold text-slate-800">Manajemen Pengguna</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 w-full appearance-none bg-white"
              >
                <option value="all">Semua Role</option>
                <option value="learner">Learner</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari pengguna..." 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          {loading ? <p className="text-sm text-slate-500">Memuat pengguna...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && filteredUsers.length === 0 ? <p className="text-sm text-slate-500">Tidak ada pengguna yang cocok dengan filter.</p> : null}
          {filteredUsers.map((user, index) => {
            const isSuspended = user.status === 'suspended';
            const userId = (user.id as number | string) || index;
            const tutorId = (user.tutor_id as number | string) || userId;
            const role = (user.role as string) ?? (user.roles as string) ?? '—';
            
            return (
              <div key={index} className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 first:mt-0 gap-4 transition-colors hover:bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-brand-50 p-3 text-brand-700">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{(user.name as string) ?? (user.username as string) ?? 'Pengguna'}</p>
                    <p className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider bg-slate-200 text-slate-600">{role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link 
                    to={role === 'learner' ? `/admin/learners/${userId}` : `/admin/tutors/${tutorId}`} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Lihat Profil"
                  >
                    <Eye className="w-3.5 h-3.5" /> Profil
                  </Link>
                  <button 
                    onClick={() => handleSuspendToggle(userId, isSuspended)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${isSuspended ? 'text-green-600 bg-green-50 hover:bg-green-100 border-green-100' : 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100'}`}
                    title={isSuspended ? "Unsuspend Pengguna" : "Suspend Pengguna"}
                  >
                    {isSuspended ? <><CheckCircle2 className="w-3.5 h-3.5" /> Aktifkan</> : <><Ban className="w-3.5 h-3.5" /> Suspend</>}
                  </button>
                  <button 
                    onClick={() => handleDelete(userId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
