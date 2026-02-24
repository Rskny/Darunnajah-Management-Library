const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Mendapatkan semua transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar transaksi
 */
// Get semua transaksi
router.get('/', authenticateToken, async (req, res) => {
    try {
        const transactions = await db('transactions').select('*').orderBy('id', 'desc');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data transaksi', detail: error.message });
    }
});

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Menambah transaksi peminjaman baru
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId: { type: integer }
 *               studentName: { type: string }
 *               status: { type: string }
 *               borrowDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Transaksi berhasil dicatat
 */
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Memperbarui status transaksi (misal pengembalian)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Status transaksi berhasil diperbarui
 */
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
