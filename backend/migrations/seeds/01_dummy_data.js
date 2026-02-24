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
        { id: 1, username: 'admin1', password: passwordHash, email: 'admin1@test.com' },
        { id: 2, username: 'admin2', password: passwordHash, email: 'admin2@test.com' },
        { id: 3, username: 'admin3', password: passwordHash, email: 'admin3@test.com' },
        { id: 4, username: 'admin4', password: passwordHash, email: 'admin4@test.com' },
        { id: 5, username: 'admin5', password: passwordHash, email: 'admin5@test.com' }
    ]);

    // Inserts dummy books
    await knex('books').insert([
        { id: 1, title: 'Buku Matematika Dasar', author: 'Budi Santoso', category: 'Pendidikan', available: true },
        { id: 2, title: 'Buku Fisika Kuantum', author: 'Albert Enstein', category: 'Pendidikan', available: true },
        { id: 3, title: 'Algoritma Pemrograman', author: 'Rinaldi Munir', category: 'IT', available: false },
        { id: 4, title: 'Laskar Pelangi', author: 'Andrea Hirata', category: 'Novel', available: true },
        { id: 5, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', category: 'Novel', available: false }
    ]);

    // Inserts dummy members
    await knex('members').insert([
        { id: 1, name: 'Siswa A', nis: '10001', class: 'X-A' },
        { id: 2, name: 'Siswa B', nis: '10002', class: 'X-B' },
        { id: 3, name: 'Siswa C', nis: '10003', class: 'XI-A' },
        { id: 4, name: 'Siswa D', nis: '10004', class: 'XI-B' },
        { id: 5, name: 'Siswa E', nis: '10005', class: 'XII-A' }
    ]);

    // Inserts dummy transactions
    await knex('transactions').insert([
        { id: 1, bookId: 3, studentName: 'Siswa A', status: 'Dipinjam', borrowDate: '2026-02-20' },
        { id: 2, bookId: 5, studentName: 'Siswa B', status: 'Dipinjam', borrowDate: '2026-02-21' },
        { id: 3, bookId: 1, studentName: 'Siswa C', status: 'Dikembalikan', borrowDate: '2026-02-18' },
        { id: 4, bookId: 2, studentName: 'Siswa D', status: 'Dikembalikan', borrowDate: '2026-02-19' },
        { id: 5, bookId: 4, studentName: 'Siswa E', status: 'Dikembalikan', borrowDate: '2026-02-15' }
    ]);

    // Inserts dummy visits
    await knex('visits').insert([
        { id: 1, name: 'Siswa A', nis: '10001', date: '2026-02-24' },
        { id: 2, name: 'Siswa C', nis: '10003', date: '2026-02-24' },
        { id: 3, name: 'Siswa D', nis: '10004', date: '2026-02-23' },
        { id: 4, name: 'Siswa B', nis: '10002', date: '2026-02-23' },
        { id: 5, name: 'Siswa E', nis: '10005', date: '2026-02-22' }
    ]);
};
