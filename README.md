# Sistem Manajemen Perpustakaan Darunnajah

Sistem Manajemen Perpustakaan Darunnajah adalah aplikasi berbasis web yang dirombak untuk menggunakan arsitektur *Client-Server* penuh menggunakan **React (Vite) + TypeScript** untuk Antarmuka (UI) dan **Node.js (Express) + MySQL** untuk layanan *Backend*. Sistem ini memberdayakan staf perpustakaan untuk mengelola buku, kunjungan tamu perpustakaan, transaksi peminjaman (mengontrol stok), serta pembuatan daftar profil admin. 

---

## Prasyarat Sistem

Sebelum Anda menjalankan sistem ini, pastikan komputer/server Anda telah memiliki prasyarat di bawah ini:
- **Node.js** (Versi 18 atau lebih baru) dan NPM.
- **MySQL Database Server** (Misalnya MySQL/MariaDB yang berjalan secara lokal pada port 3306 atau menggunakan XAMPP/MAMP).

---

## 1. Setup Backend (Server & Database)

Pusat kendali (API) dan penyimpanan utama (Database MySQL) berada di direkori `/backend`. Anda harus menyiapkan basis data dan *environment* peladen dahulu sebelum memulai _Frontend_-nya.

### A. Buat Database MySQL
Buka klien MySQL Anda (seperti phpMyAdmin, DBeaver, atau Terminal) dan buatlah basis data (database) kosong dengan nama `darunnajah_library` (atau sesuaikan dengan konfigurasi `.env` Anda kelak).

```sql
CREATE DATABASE darunnajah_library;
```

### B. Konfigurasi File `.env` Backend
Buka terminal dan arahkan ke penempatan *backend*:
```bash
cd backend
```

Buatlah sebuah *file* bernema `.env` di dalam folder `backend` ini (sejajar dengan `package.json`). Isi _file_ tersebut dengan susunan seperti ini:

```env
# Konfigurasi Koneksi Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=password_mysql_anda # Kosongkan jika root localhost default (XAMPP tanpa password)
DB_NAME=darunnajah_library

# Konfigurasi Keamanan (Token JWT)
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=1h

# Port Eksekusi API Server Lokal
PORT=9602
```

### C. Instalasi Dependensi Backend
Masih di *terminal* folder `backend`, unduh semua *package* Node.js yang diperlukan *backend* dengan perintah:

```bash
npm install
```

### D. Migrasi & Seeding Data Utama
Sistem ini menggunakan **Knex.js** supaya struktur tabel dan _dummy data_ percobaan (Akun Admin default, Daftar Buku awal, Riwayat Kunjungan dan Peminjaman) dapat dipasang secara serentak, tanpa perlu mengatur setiap kolom MySQL secara manual.  
Abaikan perintah ini jika Anda menggunakan instruksi terpisah `npx knex migrate:latest`.

Untuk langsung menetapkan/me-*load* seluruh rancangan Skema Database (tabel `admins`, `books`, `transactions`, `visits`, dan `members`) **beserta** menanamkan Data Pancingan (_Seeder_), jalankan *script* berikut:

```bash
npm run migrate:latest:seed
```

### E. Menyalakan Server Backend
Apabila data berhasil dimigrasi, segera luncurkan *Development Server API* dengan perintah:

```bash
npm run dev
```
Peladen (Server API) sekarang hidup dan menjaga tautan rute Anda di: **`http://localhost:9602`** (Sesuai dengan `PORT` di *Backend*). Jika Anda ingin mengecek dokumentasi API interaktifnya, bukalah tautan **`http://localhost:9602/api-docs`** di web *browser* Anda.

---

## 2. Setup Frontend (UI / Antarmuka)

Kerangka UI perpustakaan berakar di sistem utama (luar penempatan *backend*). Buka *panel terminal baru* untuk menjalankan *Frontend React / Vite*.

### A. Konfigurasi File `.env` untuk UI (Opsional)
Tetap berada di penempatan/lokasi akar folder proyek (`Darunnajah-Management-Library`).
Jika Anda enggan *port frontend* VITE Anda bertabrakan dengan koneksi lain, buat file `.env` di *root directory* perpustakaan ini lalu tempatkan *port default* Vite:

```env
PORT=9604
```

### B. Instalasi Dependensi Web UI
Unduh material/pustaka antarmuka yang diperlukan proyek _Frontend_ Node:

```bash
npm install
```

*(Catatan: Aplikasi mengarah menuntut sambungan langsung (`baseURL`) ke **`http://localhost:9602/api`**. Jika Anda hendak menghabiskan rute port backend menjadi 3000 atau sebagainya, ubahlah konstanta baris `API_URL` yang terdapat di file `src/apiClient.ts`)*.

### C. Meluncurkan Aplikasi
Nyalakan kerangka grafis/UI *(Development Mode)* dengan perintah:

```bash
npm run dev
```

Selamat! Kini aplikasi Manajemen Perpustakaan Darunnajah sudah berjalan mumpuni secara menyeluruh (*Fullstack*).
Kunjungi **`http://localhost:9604`** di penjelajah web komputer.

---

## 3. Akun Akses Percobaan

Efek dari perintah *Seeder* pada awal tadi, Database telah dibekali dengan susunan Login contoh yang dapat segera Anda gunakan di halaman masuk UI.

Gunakan rujukan ini saat singgah di halaman login:
- **Username** : `admin1`
- **Password** : `password123`

*(Anda bisa menambah Pengelola/Admin secara mandiri via tombol Register di web dengan isian Data yang Tervalidasi)*.
