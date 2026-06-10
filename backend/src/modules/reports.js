const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

const isToday = (dateString) => {
    const d = new Date(dateString);
    const now = new Date();
    return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    );
};

/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionReport:
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
 *           example: Dikembalikan
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
 *     VisitReport:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Budi Santoso
 *         memberId:
 *           type: string
 *           example: S1001
 *         kelas:
 *           type: string
 *           example: XI IPA 1
 *         chosing:
 *           type: string
 *           example: Membaca
 *         purpose:
 *           type: string
 *           example: Mencari referensi tugas sekolah
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-06-09"
 *         time:
 *           type: string
 *           example: "09:30:00"
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Mengambil data laporan berdasarkan filter
 *     description: >
 *       Mengambil laporan transaksi peminjaman (status Dikembalikan) atau
 *       laporan kunjungan berdasarkan bulan dan tahun.
 *       Laporan kunjungan otomatis mengecualikan data hari ini.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [transaksi, kunjungan]
 *         description: Tipe laporan yang diminta
 *         example: transaksi
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Nomor bulan 1-12 atau "all" untuk satu tahun penuh
 *         example: "6"
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Tahun laporan
 *         example: 2026
 *     responses:
 *       200:
 *         description: Berhasil mengambil data laporan
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransactionReport'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/VisitReport'
 *       400:
 *         description: Parameter type wajib diisi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter type wajib diisi (transaksi/kunjungan)
 *       500:
 *         description: Gagal mengambil data laporan
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
        const { type, month, year } = req.query;

        if (!type) {
            return res.status(400).json({ error: 'Parameter type wajib diisi (transaksi/kunjungan)' });
        }

        if (type === 'kunjungan') {
            let query = db('visits').select('*').orderBy('id', 'desc');

            if (year) query = query.whereRaw('YEAR(date) = ?', [year]);
            if (month && month !== 'all') query = query.whereRaw('MONTH(date) = ?', [month]);

            const allData = await query;
            const data = allData.filter(item => !isToday(item.date));

            return res.status(200).json(data);
        }

        // TRANSAKSI
        let query = db('transactions')
            .select(
                'transactions.*',
                'books.title as bookTitle',
                'books.bookCode as bookCode'
            )
            .leftJoin('books', 'transactions.bookId', 'books.id')
            .where('transactions.status', 'Dikembalikan')
            .orderBy('transactions.id', 'desc');

        if (year) query = query.whereRaw('YEAR(borrowDate) = ?', [year]);
        if (month && month !== 'all') query = query.whereRaw('MONTH(borrowDate) = ?', [month]);

        const data = await query;
        return res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data laporan', detail: error.message });
    }
});

module.exports = router;