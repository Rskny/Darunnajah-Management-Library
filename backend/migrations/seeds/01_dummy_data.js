const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
    // Deletes ALL existing entries in reverse order to respect foreign key constraints
    await knex('transactions').del();
    await knex('visits').del();
    await knex('members').del();
    await knex('books').del();
    await knex('admins').del();

    const passwordHash = await bcrypt.hash('password123', 10);

    // Inserts dummy admins
    await knex('admins').insert([
        { id: 1, name: 'Kepala Perpus', username: 'admin1', password: passwordHash, email: 'admin1@test.com' },
        { id: 2, name: 'Admin Perpus', username: 'admin2', password: passwordHash, email: 'admin2@test.com' },
        { id: 3, name: 'Staf IT', username: 'admin3', password: passwordHash, email: 'admin3@test.com' },
        { id: 4, name: 'Pustakawan A', username: 'admin4', password: passwordHash, email: 'admin4@test.com' },
        { id: 5, name: 'Pustakawan B', username: 'admin5', password: passwordHash, email: 'admin5@test.com' }
    ]);

    // Inserts dummy books
    await knex('books').insert([
        { id: 1, title: 'Buku Matematika Dasar', author: 'Budi Santoso', year: '2023', publisher: 'Erlangga', category: 'Pendidikan', stock: 5, source: 'Pembelian', inputDate: '2026-01-01', available: true },
        { id: 2, title: 'Buku Fisika Kuantum', author: 'Albert Enstein', year: '2022', publisher: 'Gramedia', category: 'Pendidikan', stock: 3, source: 'Sumbangan', inputDate: '2026-01-02', available: true },
        { id: 3, title: 'Algoritma Pemrograman', author: 'Rinaldi Munir', year: '2021', publisher: 'Informatika', category: 'IT', stock: 2, source: 'Pembelian', inputDate: '2026-01-03', available: false },
        { id: 4, title: 'Laskar Pelangi', author: 'Andrea Hirata', year: '2005', publisher: 'Bentang Pustaka', category: 'Novel', stock: 10, source: 'Sumbangan', inputDate: '2026-01-04', available: true },
        { id: 5, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', year: '1980', publisher: 'Hasta Mitra', category: 'Novel', stock: 4, source: 'Pembelian', inputDate: '2026-01-05', available: false }
    ]);

    // Inserts dummy members
    await knex('members').insert([
        { id: 1, nama: 'Siswa A', nis: '10001', kelas: 'X-A', jurusan: 'IPA', gender: 'Laki-laki' },
        { id: 2, nama: 'Siswa B', nis: '10002', kelas: 'X-B', jurusan: 'IPS', gender: 'Perempuan' },
        { id: 3, nama: 'Siswa C', nis: '10003', kelas: 'XI-A', jurusan: 'IPA', gender: 'Laki-laki' },
        { id: 4, nama: 'Siswa D', nis: '10004', kelas: 'XI-B', jurusan: 'IPS', gender: 'Perempuan' },
        { id: 5, nama: 'Siswa E', nis: '10005', kelas: 'XII-A', jurusan: 'IPA', gender: 'Laki-laki' }
    ]);

    // Inserts dummy transactions
    await knex('transactions').insert([
        { id: 1, bookId: 3, studentName: 'Siswa A', role: 'siswa', class: 'X-A', major: 'IPA', gender: 'Laki-laki', status: 'Dipinjam', quantity: 1, borrowDate: '2026-02-20', dueDate: '2026-02-27' },
        { id: 2, bookId: 5, studentName: 'Siswa B', role: 'siswa', class: 'X-B', major: 'IPS', gender: 'Perempuan', status: 'Dipinjam', quantity: 1, borrowDate: '2026-02-21', dueDate: '2026-02-28' },
        { id: 3, bookId: 1, studentName: 'Siswa C', role: 'siswa', class: 'XI-A', major: 'IPA', gender: 'Laki-laki', status: 'Dikembalikan', quantity: 1, borrowDate: '2026-02-18', dueDate: '2026-02-25' },
        { id: 4, bookId: 2, studentName: 'Siswa D', role: 'siswa', class: 'XI-B', major: 'IPS', gender: 'Perempuan', status: 'Dikembalikan', quantity: 2, borrowDate: '2026-02-19', dueDate: '2026-02-26' },
        { id: 5, bookId: 4, studentName: 'Siswa E', role: 'siswa', class: 'XII-A', major: 'IPA', gender: 'Laki-laki', status: 'Dikembalikan', quantity: 1, borrowDate: '2026-02-15', dueDate: '2026-02-22' }
    ]);

    // Inserts dummy visits
    await knex('visits').insert([
        { id: 1, name: 'Siswa A', nis: '10001', kelas: 'X-A', chosing: 'Siswa', purpose: 'Membaca', date: '2026-02-24', time: '08:00' },
        { id: 2, name: 'Siswa C', nis: '10003', kelas: 'XI-A', chosing: 'Siswa', purpose: 'Meminjam', date: '2026-02-24', time: '09:00' },
        { id: 3, name: 'Siswa D', nis: '10004', kelas: 'XI-B', chosing: 'Siswa', purpose: 'Mengembalikan', date: '2026-02-23', time: '10:00' },
        { id: 4, name: 'Siswa B', nis: '10002', kelas: 'X-B', chosing: 'Siswa', purpose: 'Belajar', date: '2026-02-23', time: '11:00' },
        { id: 5, name: 'Siswa E', nis: '10005', kelas: 'XII-A', chosing: 'Siswa', purpose: 'Membaca', date: '2026-02-22', time: '12:00' }
    ]);
};
