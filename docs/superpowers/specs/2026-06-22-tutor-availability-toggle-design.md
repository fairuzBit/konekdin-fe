# Design Spec: Instant Tutor Availability Toggle

Dokumen ini mendefinisikan implementasi perubahan status ketersediaan Tutor secara instan (auto-save) saat tombol toggle diklik.

---

## 1. Backend Integration

### 1.1. Route
Menambahkan route PATCH baru di `routes/api.php` di dalam middleware group `role:tutor`:
```php
Route::patch('/tutor/profile/status', [TutorProfileController::class, 'toggleStatus']);
```

### 1.2. Controller Method
Menambahkan method `toggleStatus` di `TutorProfileController`:
* Memastikan user adalah Tutor.
* Membalikkan nilai boolean `is_active` (`$tutor->is_active = !$tutor->is_active`).
* Menyimpan perubahan dan mengembalikan JSON response dengan status terbaru.

### 1.3. Booking Safeguard
Menambahkan validasi di `BookingService::createBooking` sebelum memproses pesanan:
* Mengecek apakah `$tutor->is_active` bernilai `true`.
* Jika `false`, lempar `Exception` dengan pesan: `"Gagal membuat pesanan. Tutor yang bersangkutan sedang tidak aktif menerima pemesanan saat ini."`

---

## 2. Frontend Integration

### 2.1. API Service
Menambahkan method `toggleStatus` di `src/api/services/tutorService.ts`:
```typescript
async toggleStatus() {
  const response = await apiClient.patch('/tutor/profile/status');
  return response.data;
}
```

### 2.2. TutorProfilePage UI Update
* Mengubah event `onClick` pada tombol toggle status ketersediaan di `TutorProfilePage.tsx` agar memanggil API `toggleStatus`.
* Menambahkan state `togglingStatus` untuk menampilkan efek loading/disabled pada toggle saat request berlangsung demi menghindari double-click.
* Menerapkan fallback (rollback state) jika API call gagal dan menampilkan toast/alert kesalahan.
