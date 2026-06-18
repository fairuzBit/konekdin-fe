import { ReactNode } from 'react';
import { CalendarDays, Clock3, History, LayoutGrid, MessageSquareText, Sparkles, UserCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

const navigation = [
  { label: 'Dashboard', to: '/tutor', icon: LayoutGrid },
  { label: 'Availability', to: '/tutor/availability', icon: CalendarDays },
  { label: 'Booking', to: '/tutor/bookings', icon: Sparkles },
  { label: 'Jadwal', to: '/tutor/schedules', icon: Clock3 },
  { label: 'Riwayat', to: '/tutor/history', icon: History },
  { label: 'Review', to: '/tutor/reviews', icon: MessageSquareText },
  { label: 'Profil', to: '/tutor/profile', icon: UserCircle2 },
];

export default function TutorLayout({ children }: { children: ReactNode }) {
  return <AppLayout navigation={navigation}>{children}</AppLayout>;
}
