# Spesifikasi Alur Pemesanan & Pembayaran KonekDin Learner

## 1. Ringkasan (Overview)
Spesifikasi ini merinci implementasi Alur Pemesanan Learner, mengubah *mockup* statis menjadi pengalaman pemesanan menyeluruh yang sepenuhnya interaktif. Alur ini mencakup penemuan tutor, penjadwalan sesi, pembuatan pesanan, dan penagihan pembayaran (invoice).

## 2. Komponen Inti yang Akan Dibangun/Diubah

### A. Modal Pembuatan Pesanan (`BookingModal.tsx`)
- **Lokasi**: Dimunculkan dari `TutorListPage.tsx` saat tombol "Pesan Sesi" diklik.
- **Input Formulir**:
  - **Mata Kuliah**: Dropdown yang mengambil data dari `tutor.taught_courses`.
  - **Tanggal**: Pemilih tanggal (Date picker) yang dibatasi hanya pada hari-hari yang tersedia di `tutor.available_slots`.
  - **Jam Sesi**: Badge/Chips untuk memilih satu atau beberapa slot waktu.
- **Ringkasan Langsung (Live Summary)**: "Ringkasan Pesanan" dinamis yang sesuai dengan desain warna *Navy/Emerald* yang diberikan, menghitung otomatis: `(Harga Tutor × Jumlah Sesi) + Biaya Layanan`.
- **Aksi**: Tombol "Lanjut" yang membuat pesanan dengan status `Pending` di *backend* via API dan mengarahkan pengguna (*redirect*) ke halaman `/learner/bookings`.

### B. Halaman Daftar Pesanan (`LearnerBookingsPage.tsx`)
- **Lokasi**: `/learner/bookings`
- **Desain Ulang**: Diselaraskan dengan gambar "Detail Pesanan" yang dilampirkan.
- **Konten Kartu Pesanan**:
  - Avatar & Rating Tutor.
  - Nama Tutor & Mata Pelajaran.
  - Tanggal & Waktu Terjadwal.
  - Badge Status Pembayaran ("Belum Bayar" atau "Lunas").
- **Aksi**: Tombol "Bayar Sekarang" untuk pesanan yang belum dibayar, mengarahkan pengguna ke halaman/modal Invoice Pembayaran.

### C. Tampilan Invoice Pembayaran (`PaymentInvoicePage.tsx` atau Modal)
- **Lokasi**: Ditampilkan ketika Learner memilih untuk membayar pesanan yang belum dibayar (Sesuai dengan gambar "Invoice Pembayaran").
- **Tata Letak (Layout)**: Mengisi area konten utama secara penuh (dengan *sidebar* tetap terlihat di kiri).
- **Panel Kiri**:
  - **Ringkasan Pesanan**: Menampilkan Nama Learner, Nama Tutor, Mata Pelajaran, dan Jadwal.
  - **Metode Pembayaran**: Pilihan tombol *radio* untuk:
    - Bayar Tunai (Di Lokasi)
    - Transfer Bank (BRI, BNI, Mandiri, BCA)
    - E-Wallet (OVO, GoPay, Dana) - menampilkan sub-opsi dinamis ketika dipilih.
- **Panel Kanan (Kartu Navy)**:
  - **Rincian Harga**: Rincian Biaya Sesi dan Biaya Layanan.
  - **Total Pembayaran**: Total keseluruhan tagihan.
  - **Aksi**: Tombol "Konfirmasi" untuk menyelesaikan pembayaran (Mengirimkan data ke *backend* untuk mengubah status pesanan menjadi 'Lunas').

## 3. Alur Data & Manajemen State
1. **State Pemilihan**: `BookingModal` akan menggunakan *state* lokal React (`useState`) untuk mengelola pilihan mata kuliah, tanggal, dan slot waktu.
2. **Integrasi API**: 
   - Menggunakan `learnerService.createBooking(payload)` untuk menyimpan pesanan ke *database*.
   - Menggunakan `learnerService.getBookings()` untuk memuat data di `LearnerBookingsPage`.
   - Menggunakan `learnerService.payBooking(id, method)` untuk memproses simulasi pembayaran.
3. **Pengalihan (Redirection)**: Menggunakan `useNavigate` dari `react-router-dom` untuk berpindah antara: Daftar Tutor -> Daftar Pesanan -> Invoice Pembayaran.

## 4. Estetika Desain
- **Warna**: Hijau Emerald sebagai *Primary* (`#10B981` atau serupa), Biru Navy Gelap untuk kartu ringkasan (`#0B132B` atau serupa), dan abu-abu Slate muda untuk latar belakang.
- **Tipografi**: Bersih, menggunakan *font sans-serif* dengan hierarki ketebalan yang jelas (misal: *ExtraBold* untuk harga, *Medium* untuk label).
- **Interaksi**: Transisi perpindahan yang halus, efek *hover* pada metode pembayaran, dan balasan visual yang jelas (jelas secara visual) saat melakukan konfirmasi.

## 5. Ruang Lingkup & Keterbatasan
- Pemrosesan pembayaran masih bersifat **simulasi** (langsung memperbarui status di *database*) dan tidak terintegrasi langsung dengan API Payment Gateway asli (seperti Midtrans) pada fase ini.
- UI akan sepenuhnya responsif dari layar komputer (*desktop*) hingga layar *mobile* (HP).
