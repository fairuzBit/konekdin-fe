import { BookOpen, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const tutors = [
  { id: 1, name: 'Rafi Hidayat', subject: 'Kalkulus', rate: 'Rp75.000 / sesi', rating: '4.9' },
  { id: 2, name: 'Sinta Wulandari', subject: 'Algoritma', rate: 'Rp90.000 / sesi', rating: '4.8' },
];

export default function TutorListPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cari Tutor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="Cari mata kuliah atau tutor" />
            </div>
            <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Cari</button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {tutors.map((tutor) => (
          <Card key={tutor.id}>
            <CardHeader>
              <CardTitle>{tutor.name}</CardTitle>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{tutor.rating} ★</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-slate-600"><BookOpen className="h-4 w-4" /> {tutor.subject}</div>
              <p className="text-sm text-slate-500">{tutor.rate}</p>
              <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Lihat detail</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
