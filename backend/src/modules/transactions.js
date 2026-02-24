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
        const transactions = await db('transactions')
            .select('transactions.*', 'books.title as bookTitle')
            .leftJoin('books', 'transactions.bookId', 'books.id')
            .orderBy('transactions.id', 'desc');
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
 *               role: { type: string }
 *               class: { type: string }
 *               major: { type: string }
 *               gender: { type: string }
 *               quantity: { type: integer }
 *               status: { type: string }
 *               borrowDate: { type: string, format: date-time }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Transaksi berhasil dicatat
 */
// Tambah transaksi peminjaman baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { bookId, studentName, role, class: kelas, major, gender, status, borrowDate, dueDate, quantity = 1 } = req.body;

        // Cek stok buku
        const book = await db('books').where({ id: bookId }).first();
        if (!book) {
            return res.status(404).json({ error: 'Buku tidak ditemukan' });
        }
        if (book.stock < quantity) {
            return res.status(400).json({ error: `Jumlah pinjam melebihi stok yang tersedia (${book.stock} tersedia)` });
        }

        const [id] = await db('transactions').insert({ bookId, studentName, role, class: kelas, major, gender, status, borrowDate, dueDate, quantity });

        // Update status buku menjadi tidak tersedia bila dipinjam dan stok menyusut
        if (status === 'Dipinjam') {
            const newStock = book.stock - quantity;
            await db('books').where({ id: bookId }).update({
                stock: newStock,
                available: newStock > 0
            });
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
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Status transaksi berhasil diperbarui
 */
// Update status transaksi (misal: pengembalian)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, dueDate } = req.body;

        // Ambil data transaksi lama buat ngecek id bukunya
        const trx = await db('transactions').where({ id }).first();

        // Update transaksi
        const updatePayload = {};
        if (status) updatePayload.status = status;
        if (dueDate) updatePayload.dueDate = dueDate;

        await db('transactions').where({ id }).update(updatePayload);

        // Update status buku tersedia lagi bila dikembalikan
        if (status === 'Dikembalikan' && trx && trx.status !== 'Dikembalikan') {
            const book = await db('books').where({ id: trx.bookId }).first();
            if (book) {
                const newStock = book.stock + trx.quantity;
                await db('books').where({ id: trx.bookId }).update({
                    stock: newStock,
                    available: true
                });
            }
        }

        res.json({ message: 'Status transaksi berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui transaksi', detail: error.message });
    }
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Menghapus transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 */
// Hapus transaksi
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db('transactions').where({ id }).del();
        res.json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus transaksi', detail: error.message });
    }
});

module.exports = router;
