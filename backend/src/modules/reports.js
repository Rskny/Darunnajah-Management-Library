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
 *   description: API untuk manajemen transaksi peminjaman buku
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
 *       required:
 *         - memberId
 *         - bookId
 *         - studentName
 *         - status
 *         - borrowDate
 *         - dueDate
 *       properties:
 *         id:
 *           type: integer
 *           description: ID Otomatis dari sistem
 *         memberId:
 *           type: string
 *           description: ID Unik Anggota (NIS/NIP)
 *         bookId:
 *           type: integer
 *           description: ID Buku yang dipinjam
 *         studentName:
 *           type: string
 *           description: Nama lengkap anggota
 *         role:
 *           type: string
 *           default: siswa
 *         class:
 *           type: string
 *         major:
 *           type: string
 *         gender:
 *           type: string
 *         quantity:
 *           type: integer
 *           default: 1
 *         status:
 *           type: string
 *           example: Dipinjam
 *         borrowDate:
 *           type: string
 *           format: date
 *         dueDate:
 *           type: string
 *           format: date
 *     TransactionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
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
        const transactions = await db('transactions')
            .select('transactions.*', 'books.title as bookTitle')
            .leftJoin('books', 'transactions.bookId', 'books.id')
            .orderBy('transactions.id', 'desc');

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data transaksi', detail: error.message });
    }
});


/**
 * @swagger
 * /:
 *   post:
 *     summary: Membuat dan mencatat transaksi peminjaman buku baru
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *               - bookId
 *               - studentName
 *               - status
 *               - borrowDate
 *               - dueDate
 *             properties:
 *               memberId:
 *                 type: string
 *               bookId:
 *                 type: integer
 *               studentName:
 *                 type: string
 *               role:
 *                 type: string
 *               class:
 *                 type: string
 *               major:
 *                 type: string
 *               gender:
 *                 type: string
 *               status:
 *                 type: string
 *               borrowDate:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Transaksi berhasil dicatat dan stok buku berkurang
 *       400:
 *         description: Input tidak lengkap atau stok buku habis
 *       404:
 *         description: Buku tidak ditemukan
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

        // Validasi input wajib
        if (!memberId || !bookId || !studentName || !status || !borrowDate || !dueDate) {
            return res.status(400).json({ error: 'Data input tidak lengkap' });
        }

        const book = await db('books').where({ id: bookId }).first();
        if (!book) {
            return res.status(404).json({ error: 'Buku tidak ditemukan di katalog' });
        }
        if (book.stock < quantity) {
            return res.status(400).json({ error: 'Stok buku tidak mencukupi untuk dipinjam' });
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

            await trx('books')
                .where({ id: bookId })
                .decrement('stock', quantity);
        });

        res.status(201).json({ message: 'Transaksi berhasil dicatat dan stok diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses transaksi baru', detail: error.message });
    }
});


module.exports = router;