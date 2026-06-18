import { useEffect, useState } from 'react';
import { MessageSquareText, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorService } from '@/api/services/tutorService';
import { normalizeList } from '@/lib/apiData';

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await tutorService.getReviews();
        setReviews(normalizeList(response));
      } catch {
        setError('Gagal memuat ulasan dari backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ulasan Learner</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Memuat ulasan...</p> : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {!loading && !error && reviews.length === 0 ? <p className="text-sm text-slate-500">Belum ada ulasan dari backend.</p> : null}
          {reviews.map((review, index) => (
            <div key={index} className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 first:mt-0">
              <div className="flex items-center gap-2 text-amber-600"><Star className="h-4 w-4" /> {(review.rating as string) ?? '—'}</div>
              <div className="mt-3 flex items-start gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><MessageSquareText className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-slate-900">{(review.learner as string) ?? 'Learner'}</p>
                  <p className="text-sm text-slate-500">{(review.comment as string) ?? (review.message as string) ?? '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
