import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Banknote, CreditCard, Smartphone, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { learnerService } from '@/api/services/learnerService';

export default function LearnerBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Payment State
  const [selectedMethod, setSelectedMethod] = useState<string>('transfer');
  const [selectedProvider, setSelectedProvider] = useState<string>('bri');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const res = await learnerService.getBookingById(id!);
      setBooking(res.data || res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat detail pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookingDetail();
    }
  }, [id]);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      let paymentMethodStr = selectedMethod;
      if (selectedMethod === 'transfer' || selectedMethod === 'ewallet') {
        paymentMethodStr = `${selectedMethod}_${selectedProvider}`;
      }

      const res = await learnerService.payBooking(booking.id, paymentMethodStr);
      
      if (res.success) {
        // Fetch fresh data after successful payment
        await fetchBookingDetail();
      }
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || 'Gagal memproses pembayaran. Coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/learner/bookings')} className="text-emerald-600 font-bold hover:underline">
          Kembali ke Daftar Pesanan
        </button>
      </div>
    );
  }

  const tutorName = booking.tutor?.user?.name || booking.tutor?.name || 'Tutor KonekDin';
  const isPaid = booking.payment_status === 'paid';
  
  // Format Date
  const dateObj = new Date(booking.booking_date);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dateText = `${days[dateObj.getDay()]}, ${dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  
  // Format Time
  let timeText = '-';
  if (booking.slots && booking.slots.length > 0) {
    const start = booking.slots[0].start_time;
    const end = booking.slots[booking.slots.length - 1].end_time;
    timeText = `${start} - ${end}`;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in zoom-in-95 duration-300">
      <button 
        onClick={() => navigate('/learner/bookings')}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Detail & Methods */}
        <div className="w-full md:w-3/5 p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#0B132B]">Invoice Pembayaran</h2>
            <p className="text-sm text-slate-500 mt-1">ID Pesanan: <span className="font-mono text-slate-700">#{booking.id.toString().padStart(5, '0')}</span></p>
          </div>

          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
              {paymentError}
            </div>
          )}

          {/* Ringkasan Pesanan Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Banknote className="w-4 h-4 text-emerald-500" /> Rincian Sesi
            </h3>
            
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Learner</p>
                <p className="text-sm font-bold text-slate-800">Anda</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tutor</p>
                <p className="text-sm font-bold text-slate-800">{tutorName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mata Pelajaran</p>
                <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                  {booking.course?.name || '-'}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jadwal Sesi</p>
                <div className="flex items-start gap-1.5 text-xs font-bold text-slate-800 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    {dateText}<br/>
                    {timeText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran (Only show if UNPAID) */}
          {!isPaid ? (
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-emerald-500" /> Metode Pembayaran
              </h3>
              
              <div className="space-y-3">
                {/* Tunai */}
                <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                  selectedMethod === 'cash' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4">
                    <Banknote className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800">Bayar Tunai</h4>
                    <p className="text-xs text-slate-500">Di Lokasi</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cash' ? 'border-emerald-500' : 'border-slate-300'}`}>
                    {selectedMethod === 'cash' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                  </div>
                  <input type="radio" name="method" value="cash" className="hidden" onChange={() => setSelectedMethod('cash')} />
                </label>

                {/* Transfer Bank */}
                <div className={`border rounded-2xl transition-all overflow-hidden ${
                  selectedMethod === 'transfer' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mr-4">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800">Transfer Bank</h4>
                      <p className="text-xs text-slate-500">BRI, BNI, Mandiri, BCA</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'transfer' ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {selectedMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                    </div>
                    <input type="radio" name="method" value="transfer" className="hidden" onChange={() => setSelectedMethod('transfer')} />
                  </label>
                  
                  {selectedMethod === 'transfer' && (
                    <div className="px-4 pb-4 pt-0 pl-[72px]">
                      <div className="flex gap-2">
                        {['bri', 'bni', 'mandiri', 'bca'].map(bank => (
                          <button
                            key={bank}
                            onClick={() => setSelectedProvider(bank)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                              selectedProvider === bank 
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* E-Wallet */}
                <div className={`border rounded-2xl transition-all overflow-hidden ${
                  selectedMethod === 'ewallet' ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-4">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800">E-Wallet</h4>
                      <p className="text-xs text-slate-500">OVO, GoPay, Dana</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'ewallet' ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {selectedMethod === 'ewallet' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                    </div>
                    <input type="radio" name="method" value="ewallet" className="hidden" onChange={() => setSelectedMethod('ewallet')} />
                  </label>

                  {selectedMethod === 'ewallet' && (
                    <div className="px-4 pb-4 pt-0 pl-[72px]">
                      <div className="flex gap-2">
                        {['ovo', 'gopay', 'dana'].map(wallet => (
                          <button
                            key={wallet}
                            onClick={() => setSelectedProvider(wallet)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors border ${
                              selectedProvider === wallet 
                                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {wallet}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-emerald-700 text-sm">Sesi belajar Anda bersama {tutorName} sudah dikonfirmasi.</p>
              <div className="mt-6 px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-sm border border-emerald-200">
                Kode Pembayaran: {booking.payment_code || '-'}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Price Details */}
        <div className="w-full md:w-2/5 bg-[#0B132B] flex flex-col p-6 md:p-10 text-white relative">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-400" /> Rincian Harga
            </h3>

            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Biaya Sesi ({booking.slots?.length || 0} Sesi)</span>
                <span className="font-bold">Rp {booking.total_price?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Biaya Layanan</span>
                <span className="font-bold">Rp {booking.service_fee?.toLocaleString('id-ID')}</span>
              </div>
              {isPaid && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-400 font-medium">Metode Pembayaran</span>
                  <span className="font-bold uppercase">{booking.payment_method?.replace('_', ' ') || '-'}</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10 mb-8">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
              <p className="text-4xl font-black text-white tracking-tight">Rp {booking.grand_total?.toLocaleString('id-ID')}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Pembayaran Anda dijamin aman melalui sistem escrow kami. Dana hanya akan diteruskan ke tutor setelah sesi selesai.
              </p>
            </div>
          </div>

          <div className="mt-10 relative z-10">
            {!isPaid ? (
              <>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mb-4"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Selesaikan Pembayaran'}
                </button>
                <p className="text-[10px] text-center text-slate-500">
                  Dengan membayar, Anda menyetujui <a href="#" className="underline hover:text-white transition-colors">Ketentuan Layanan</a> & <a href="#" className="underline hover:text-white transition-colors">Kebijakan Privasi</a> KonekDin.
                </p>
              </>
            ) : (
              <button
                onClick={() => navigate('/learner/history')}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10"
              >
                Lihat Jadwal Belajar Anda
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
