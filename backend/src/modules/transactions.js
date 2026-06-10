const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         memberId:
 *           type: string
 *           example: S2053
 *         bookId:
 *           type: integer
 *           example: 3
 *         studentName:
 *           type: string
 *           example: Abdiatul Abadiah
 *         role:
 *           type: string
 *           example: siswa
 *         class:
 *           type: string
 *           example: XII
 *         major:
 *           type: string
 *           example: IPA
 *         gender:
 *           type: string
 *           example: Perempuan
 *         quantity:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: Dipinjam
 *         borrowDate:
 *           type: string
 *           format: date
 *           example: "2026-06-09"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2026-06-16"
 *         bookTitle:
 *           type: string
 *           example: Laskar Pelangi
 *         bookCode:
 *           type: string
 *           example: 800 AND L
 *     CreateTransactionRequest:
 *       type: object
 *       required:
 *         - memberId
 *         - bookId
 *         - studentName
 *         - status
 *         - borrowDate
 *         - dueDate
 *       properties:
 *         memberId:
 *           type: string
 *           example: S2053
 *         bookId:
 *           type: integer
 *           example: 3
 *         studentName:
 *           type: string
 *           example: Abdiatul Abadiah
 *         role:
 *           type: string
 *           example: siswa
 *         class:
 *           type: string
 *           example: XII
 *         major:
 *           type: string
 *           example: IPA
 *         gender:
 *           type: string
 *           example: Perempuan
 *         quantity:
 *           type: integer
 *           default: 1
 *           example: 1
 *         status:
 *           type: string
 *           example: Dipinjam
 *         borrowDate:
 *           type: string
 *           format: date
 *           example: "2026-06-09"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2026-06-16"
 *     UpdateTransactionRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: Dikembalikan
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2026-06-23"
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Mengambil semua data transaksi peminjaman
 *     description: Mengembalikan semua transaksi beserta judul buku dan kode buku dari join tabel books
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua data transaksi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Gagal mengambil data transaksi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 detail:
 *                   type: string
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const data = await db('transactions')
            .join('books', 'transactions.bookId', '=', 'books.id')
            .select(
                'transactions.*',
                'books.title as bookTitle',
                'books.bookCode as bookCode'
            );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data transaksi', detail: error.message });
    }
});

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Membuat transaksi peminjaman buku baru
 *     description: Mencatat peminjaman baru dan otomatis mengurangi stok buku
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionRequest'
 *     responses:
 *       201:
 *         description: Transaksi berhasil dicatat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaksi berhasil dicatat
 *       400:
 *         description: Data input tidak lengkap atau stok tidak mencukupi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Stok buku tidak mencukupi
 *       500:
 *         description: Gagal memproses transaksi
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { 
            memberId, bookId, studentName, role, 
            class: kelas, major, gender, status, 
            borrowDate, dueDate, quantity = 1 
        } = req.body;

        if (!memberId || !bookId || !studentName || !status || !borrowDate || !dueDate) {
            return res.status(400).json({ error: 'Data input tidak lengkap' });
        }

        const book = await db('books').where({ id: bookId }).first();
        if (!book || book.stock < quantity) {
            return res.status(400).json({ error: 'Stok buku tidak mencukupi' });
        }

        await db.transaction(async (trx) => {
            await trx('transactions').insert({
                memberId, bookId, studentName, role,
                class: kelas, major, gender, quantity,
                status, borrowDate, dueDate
            });
            await trx('books').where({ id: bookId }).decrement('stock', quantity);
        });

        res.status(201).json({ message: 'Transaksi berhasil dicatat' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses transaksi', detail: error.message });
    }
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Mengembalikan buku atau memperpanjang durasi peminjaman
 *     description: >
 *       Jika body berisi `status: Dikembalikan`, maka stok buku otomatis bertambah.
 *       Jika body berisi `dueDate`, maka durasi peminjaman diperpanjang.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID transaksi
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTransactionRequest'
 *           examples:
 *             return:
 *               summary: Kembalikan buku
 *               value:
 *                 status: Dikembalikan
 *             extend:
 *               summary: Perpanjang peminjaman
 *               value:
 *                 dueDate: "2026-06-23"
 *     responses:
 *       200:
 *         description: Operasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Buku berhasil dikembalikan dan stok diperbarui
 *       400:
 *         description: Request tidak valid
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data
 */
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, dueDate } = req.body;

    try {
        const transaction = await db('transactions').where({ id }).first();
        if (!transaction) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
        }

        if (status === 'Dikembalikan') {
            await db.transaction(async (trx) => {
                await trx('transactions').where({ id }).update({ status: 'Dikembalikan' });
                await trx('books')
                    .where({ id: transaction.bookId })
                    .increment('stock', transaction.quantity || 1);
            });
            return res.status(200).json({ message: 'Buku berhasil dikembalikan dan stok diperbarui' });
        }

        if (dueDate) {
            await db('transactions').where({ id }).update({ dueDate });
            return res.status(200).json({ message: 'Durasi peminjaman berhasil diperpanjang' });
        }

        return res.status(400).json({ error: 'Request tidak valid' });

    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui data', detail: error.message });
    }
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Menghapus riwayat transaksi
 *     description: >
 *       Jika status transaksi masih Dipinjam saat dihapus,
 *       stok buku otomatis dikembalikan agar data inventory tetap balance.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID transaksi yang ingin dihapus
 *         example: 1
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaksi berhasil dihapus
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Gagal menghapus data transaksi
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await db('transactions').where({ id }).first();
        if (!transaction) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
        }

        if (transaction.status !== 'Dikembalikan') {
            await db.transaction(async (trx) => {
                await trx('books')
                    .where({ id: transaction.bookId })
                    .increment('stock', transaction.quantity || 1);
                await trx('transactions').where({ id }).del();
            });
        } else {
            await db('transactions').where({ id }).del();
        }

        return res.status(200).json({ message: 'Transaksi berhasil dihapus' });

    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus data transaksi', detail: error.message });
    }
});

module.exports = router;