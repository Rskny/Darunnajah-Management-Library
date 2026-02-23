const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Get semua transaksi
router.get('/', authenticateToken, async (req, res) => {
    try {
        const transactions = await db('transactions').select('*').orderBy('id', 'desc');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data transaksi', detail: error.message });
    }
});

// Tambah transaksi peminjaman baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { bookId, studentName, status, borrowDate } = req.body;
        const [id] = await db('transactions').insert({ bookId, studentName, status, borrowDate });

        // Update status buku menjadi tidak tersedia bila dipinjam
        if (status === 'Dipinjam') {
            await db('books').where({ id: bookId }).update({ available: false });
        }

        res.status(201).json({ message: 'Transaksi berhasil dicatat', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mencatat transaksi', detail: error.message });
    }
});

// Update status transaksi (misal: pengembalian)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Ambil data transaksi lama buat ngecek id bukunya
        const trx = await db('transactions').where({ id }).first();

        // Update transaksi
        await db('transactions').where({ id }).update({ status });

        // Update status buku tersedia lagi bila dikembalikan
        if (status === 'Dikembalikan' && trx) {
            await db('books').where({ id: trx.bookId }).update({ available: true });
        }

        res.json({ message: 'Status transaksi berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui transaksi', detail: error.message });
    }
});

module.exports = router;
