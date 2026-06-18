import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TutorApplicationPage() {
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');
  const [ipk, setIpk] = useState('');
  const [bio, setBio] = useState('');
  const [transcriptName, setTranscriptName] = useState('Belum ada file dipilih');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar Sebagai Tutor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-[24px] border border-dashed border-brand-300 bg-brand-50 p-6 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-brand-700" />
            <p className="mt-3 text-lg font-semibold text-slate-900">Unggah dokumen transkrip Anda</p>
            <p className="mt-2 text-sm text-slate-500">Form ini menyesuaikan field tutor_application dari dokumentasi KonekDin.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course">Mata Kuliah</Label>
              <select id="course" value={course} onChange={(event) => setCourse(event.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <option value="">Pilih mata kuliah</option>
                <option value="1">Teknik Informatika</option>
                <option value="2">Sistem Informasi</option>
                <option value="3">Matematika</option>
                <option value="4">Statistika</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade / Kelas</Label>
              <Input id="grade" value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="Contoh: A, B, 3.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipk">IPK</Label>
              <Input id="ipk" value={ipk} onChange={(event) => setIpk(event.target.value)} placeholder="3.75" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transcript">File Transkrip</Label>
              <Input id="transcript" type="file" onChange={(event) => setTranscriptName(event.target.files?.[0]?.name ?? 'Belum ada file dipilih')} />
              <p className="text-sm text-slate-500">{transcriptName}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="bio">Bio Singkat</Label>
            <textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={4} placeholder="Ceritakan keahlian, pengalaman, dan bidang yang ingin diajarkan" className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" />
          </div>

          <Button className="mt-6" type="submit">Kirim Aplikasi</Button>
        </CardContent>
      </Card>
    </div>
  );
}
