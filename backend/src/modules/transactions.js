const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');


/**
 * @swagger
 * swagger: "2.0"
 * info:
 *   title: API Transactions
 *   version: 1.0.0
 *   description: API untuk manajemen transaksi peminjaman dan pengembalian buku
 * basePath: /api/transactions
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         memberId:
 *           type: string
 *         bookId:
 *           type: integer
 *         studentName:
 *           type: string
 *         role:
 *           type: string
 *         class:
 *           type: string
 *         major:
 *           type: string
 *         gender:
 *           type: string
 *         quantity:
 *           type: integer
 *         status:
 *           type: string
 *         borrowDate:
 *           type: string
 *           format: date
 *         dueDate:
 *           type: string
 *           format: date
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
 *         bookId:
 *           type: integer
 *         studentName:
 *           type: string
 *         role:
 *           type: string
 *         class:
 *           type: string
 *         major:
 *           type: string
 *         gender:
 *           type: string
 *         status:
 *           type: string
 *         borrowDate:
 *           type: string
 *           format: date
 *         dueDate:
 *           type: string
 *           format: date
 *         quantity:
 *           type: integer
 *           default: 1
 *     UpdateTransactionRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 */


/**
 * @swagger
 * /:
 *   get:
 *     summary: Mengambil semua data riwayat transaksi peminjaman
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua list transaksi
 *       500:
 *         description: Eror internal pada server
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const data = await db('transactions')
            .join('books', 'transactions.bookId', '=', 'books.id')
            .select(
                'transactions.*',
                'books.title as bookTitle'
            );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data transaksi', detail: error.message });
    }
});


/**
 * @swagger
 * /:
 *   post:
 *     summary: Membuat transaksi peminjaman buku baru
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
 *       400:
 *         description: Data input tidak lengkap atau stok tidak mencukupi
 *       500:
 *         description: Eror internal pada server
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { 
            memberId, 
            bookId, 
            studentName, 
            role, 
            class: kelas, 
            major, 
            gender, 
            status, 
            borrowDate, 
            dueDate, 
            quantity = 1 
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
                memberId,
                bookId,
                studentName,
                role,
                class: kelas,
                major,
                gender,
                quantity,
                status,
                borrowDate,
                dueDate
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
 * /{id}:
 *   put:
 *     summary: Mengembalikan buku atau memperpanjang durasi peminjaman
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Transaksi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTransactionRequest'
 *     responses:
 *       200:
 *         description: Operasi berhasil
 *       400:
 *         description: Request tidak valid
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Eror internal pada server
 */
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, dueDate } = req.body;

    try {
        const transaction = await db('transactions').where({ id }).first();
        if (!transaction) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan di database' });
        }

        // JIKA AKSI ADALAH RETURN (PENGEMBALIAN BUKU)
        if (status === 'Dikembalikan') {
            await db.transaction(async (trx) => {
                await trx('transactions')
                    .where({ id })
                    .update({ status: 'Dikembalikan' });

                await trx('books')
                    .where({ id: transaction.bookId })
                    .increment('stock', transaction.quantity || 1);
            });

            return res.status(200).json({ message: 'Buku berhasil dikembalikan dan stok diperbarui' });
        }

        // JIKA AKSI ADALAH EXTEND (PERPANJANG)
        if (dueDate) {
            await db('transactions')
                .where({ id })
                .update({ dueDate });

            return res.status(200).json({ message: 'Durasi peminjaman berhasil diperpanjang' });
        }

        return res.status(400).json({ error: 'Request tidak valid' });

    } catch (error) {
        console.error("Error backend:", error);
        res.status(500).json({ error: 'Gagal memperbarui data', detail: error.message });
    }
});


/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Menghapus riwayat transaksi peminjaman
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Transaksi yang ingin dihapus
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Eror internal pada server
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await db('transactions').where({ id }).first();
        if (!transaction) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan di database' });
        }

        // Jika transaksi dihapus paksa saat statusnya BELUM 'Dikembalikan',
        // naikkan kembali stok bukunya agar data inventory tetap balance.
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
        console.error("Error backend:", error);
        res.status(500).json({ error: 'Gagal menghapus data transaksi', detail: error.message });
    }
});


module.exports = router;