# Fix Perhitungan Denda - Mencegah Denda Bertambah Saat Pembayaran

## Masalah

Saat user klik "Bayar Denda", sistem masih terus menghitung denda per menit sehingga jumlahnya bertambah dari Rp2.000 menjadi Rp4.000 dalam 2 menit.

## Solusi yang Diimplementasikan

### 1. Backend Changes

#### A. Notification Controller (`notificationController.js`)

- ✅ Menambahkan kondisi untuk menghentikan perhitungan denda jika `penalty_payment_status` sudah `paid`
- ✅ Query hanya memproses rental dengan `penalty_payment_status` NULL atau `pending`
- ✅ Update denda hanya jika belum dibayar

```javascript
// Query yang diperbaiki
WHERE r.status = 'playing'
AND CURRENT_TIMESTAMP > r.end_time
AND (r.penalty_payment_status IS NULL OR r.penalty_payment_status = 'pending')

// Update denda dengan kondisi
UPDATE rentals SET penalty_amount = ?
WHERE id = ? AND (penalty_payment_status IS NULL OR penalty_payment_status = "pending")
```

#### B. Payment Controller (`paymentController.js`)

- ✅ Set `penalty_payment_status = "pending"` saat pembayaran denda dimulai
- ✅ Mencegah perhitungan denda berlanjut

#### C. Rental Controller (`rentalController.js`)

- ✅ Menambahkan endpoint `stopPenaltyCalculation`
- ✅ Route: `POST /rentals/:id/stop-penalty`

### 2. Frontend Changes

#### A. Detail Report (`detail-report.dart`)

- ✅ Panggil endpoint `stop-penalty` sebelum membuat pembayaran
- ✅ Debug logging untuk tracking

#### B. Detail Activity (`detail-activity.dart`)

- ✅ Panggil endpoint `stop-penalty` sebelum membuat pembayaran
- ✅ Debug logging untuk tracking

### 3. Flow yang Diperbaiki

**Sebelum:**

1. User klik "Bayar Denda" (Rp2.000)
2. Sistem masih hitung denda per menit
3. User delay 2 menit
4. Denda jadi Rp4.000 ❌

**Sesudah:**

1. User klik "Bayar Denda" (Rp2.000)
2. Frontend panggil `stop-penalty` endpoint
3. Backend set `penalty_payment_status = "pending"`
4. Sistem berhenti hitung denda ✅
5. Denda tetap Rp2.000 ✅

### 4. Endpoint Baru

```
POST /rentals/:id/stop-penalty
```

**Response:**

```json
{
  "status": true,
  "message": "Perhitungan denda dihentikan",
  "data": {
    "rental_id": 104,
    "penalty_payment_status": "pending"
  }
}
```

### 5. Database Changes

Tidak ada perubahan struktur database, hanya menggunakan kolom `penalty_payment_status` yang sudah ada:

- `NULL` = Belum ada pembayaran denda
- `pending` = Pembayaran denda sedang diproses (hentikan perhitungan)
- `paid` = Denda sudah dibayar (hentikan perhitungan)

### 6. Testing

**Test Case:**

1. Buat rental yang terlambat
2. Cek denda awal (misal: Rp2.000)
3. Klik "Bayar Denda"
4. Tunggu 2-3 menit
5. Cek denda tetap sama (Rp2.000) ✅

### 7. Logging

Backend akan menampilkan log:

```
Set penalty_payment_status to pending for rental 104
Rental 104: Denda sudah dibayar, skip perhitungan
Updated penalty for rental 104: Rp2000
```

## Keuntungan

1. ✅ Denda tidak bertambah saat pembayaran
2. ✅ User experience lebih baik
3. ✅ Transparansi jumlah denda
4. ✅ Mencegah konflik pembayaran
5. ✅ Logging untuk debugging

## File yang Diubah

### Backend

- `controllers/notificationController.js`
- `controllers/paymentController.js`
- `controllers/rentalController.js`
- `routes/rentalRoutes.js`

### Frontend

- `lib/user/pages/detail-report.dart`
- `lib/user/pages/detail-activity.dart`
