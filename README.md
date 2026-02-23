# Sistem Manajemen Perpustakaan Darunnajah

Sistem Manajemen Perpustakaan Darunnajah adalah aplikasi berbasis web yang dibangun menggunakan **React (Vite)**, **TypeScript**, dan **Dexie.js** (untuk IndexedDB lokal). Aplikasi ini memungkinkan staf perpustakaan untuk mengelola buku, anggota, peminjaman, kunjungan tamu, dan laporan, tanpa memerlukan server backend terpisah berkat penggunaan penyimpanan lokal browser.

## 🖥️ Antarmuka Pengguna (UI)

Sistem ini memiliki beberapa halaman (UI) utama sebagai berikut:

1. **Landing Page (`Landing.tsx`)** - Halaman utama untuk informasi singkat mengenai perpustakaan.
2. **Autentikasi (`Login.tsx`, `Register.tsx`)** - Halaman untuk masuk dan mendaftar akun admin staf perpustakaan.
3. **Dashboard (`Dashboard.tsx`)** - Ikhtisar dan ringkasan data seperti total buku, anggota aktif, dan statistik.
4. **Manajemen Buku (`Books.tsx`)** - Halaman untuk melihat daftar buku, menambah buku baru, mengubah data, dan menghapus buku dari katalog.
5. **Data Anggota (`DataAnggota.tsx`)** - Halaman untuk manajemen dan melihat basis data anggota/santri.
6. **Kunjungan (`Visits.tsx` & `RiwayatKunjungan.tsx`)** - UI untuk mencatat pendaftaran pengunjung/buku tamu dan halaman riwayat data kunjungan.
7. **Peminjaman & Transaksi (`Peminjaman.tsx` & `RiwayatTransaksi.tsx`)** - UI untuk melayani peminjaman dan pengembalian buku, serta melihat riwayat status seluruh proses transaksi dalam perpustakaan.
8. **Laporan (`Reports.tsx`)** - Penampilan laporan dan analisis kegiatan perpustakaan atau pencetakan/ekspor data.

## 🔌 Detail API (Application Programming Interface)

Sistem menggunakan API interaksi memori lokal melalui `Dexie.js` yang didefinisikan dalam `api.ts`. Berikut kebutuhan/fungsionalitas fungsinya:

- **Books API**
  - `getAll()`: Memuat seluruh data buku.
  - `add(book)`: Menambahkan buku baru ke *database*.
  - `update(id, data)`: Memperbarui spesifikasi dan status ketersediaan buku.
  - `delete(id)`: Menghapus sebuah buku dari koleksi.

- **Members API**
  - `getAll()`: Memuat daftar semua anggota.
  - `add(member)`: Mendaftarkan anggota baru.

- **Transactions API**
  - `getAll()`: Memuat daftar riwayat seluruh transaksi buku (Peminjaman/Pengembalian).
  - `add(trans)`: Menyimpan data ketika transaksi baru diproses.
  - `update(id, data)`: Memperbarui status peminjaman (contohnya dari "Dipinjam" menjadi "Dikembalikan").

- **Visits API**
  - `getAll()`: Memuat laporan sejarah kunjungan perpustakaan.
  - `add(visit)`: Merekam jadwal dan identitas kunjungan pengunjung baru.

- **Auth & Admins API**
  - `login(username)`: Mencari akun admin dari *database* berdasarkan `username`.
  - `getAdmins()`: Mengambil daftar admin yang terdaftar.
  - `addAdmin(admin)`: Mendaftarkan akun admin baru (Registrasi).
  - `updateAdmin(id, data)`: Mengubah profil/data admin.

- **System API**
  - `backup()`: Mengekspor (backup) keseluruhan data table dari IndexedDB menjadi objek JSON secara *real-time*.

*(Catatan: Semua data yang diproses lewat API ini tersimpan di Memory Local Storage dari web browser yang digunakan).*

---

## 🚀 Tata Cara Setup & Instalasi

Ikuti langkah-langkah di bawah untuk mengatur dan menjalankan sistem secara lokal:

### 1. Prasyarat Sistem
Pastikan Anda telah menginstal Node.js di komputer (disarankan versi 18 ke atas) beserta NPM package manager.

### 2. Instalasi Ketergantungan (*Dependencies*)
Buka *terminal* atau *command prompt*, arahkan (*cd*) ke dalam folder proyek (*Darunnajah-Management-Library*), kemudian jalankan perintah berikut untuk mengunduh semua *library*:
```bash
npm install
```

### 3. Pengaturan *Environment* Port (Opsional)
Jika Anda ingin menentukan port lain agar tidak berbenturan dengan sistem Anda, Anda bisa menggunakan file konfigurasi.
- Buat file baru dengan nama `.env` di folder utama aplikasi.
- Isi dengan variabel `PORT` yang dikehendaki. Misalnya:
  ```env
  PORT=3000
  ```

### 4. Menjalankan Aplikasi (*Development Server*)
Gunakan perintah ini untuk menyalakan mode pengembangan (CORS aktif dan hot-reload):
```bash
npm run dev
```
Setelah berjalan, Anda dapat mengakses antarmuka sistem pada peramban web (*browser*) dengan membuka URL: `http://localhost:3000` (atau *port* kustom yang sudah Anda isi).

### 5. *Database Seeding* Otomatis
Sistem ini memuat file `db.ts` yang akan secara otomatis memasukkan basis data contoh/data awal (*seeding*) pada kali pertama Anda mengakses situs saat basis datanya kosong. Anda bisa langsung masuk sebagai admin atau anggota default dan bereksplorasi.
