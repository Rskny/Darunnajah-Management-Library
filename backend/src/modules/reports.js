const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Mendapatkan data riwayat transaksi atau kunjungan berdasarkan bulan & tahun
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
 *         description: Jenis laporan
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bulan (indeks 0-11) ATAU string "all" untuk laporan tahunan
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tahun (contoh 2026)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan laporan
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { type, month, year } = req.query;

        if (!type || month === undefined || !year) {
            return res.status(400).json({ error: 'Parameter type, month, dan year wajib diisi' });
        }

        const isYearly = month === 'all';
        const sqlYear = parseInt(year);
        const sqlMonth = !isYearly ? parseInt(month) + 1 : null;

        let result = [];

        if (type === 'transaksi') {
            let query = db('transactions')
                .select('transactions.*', 'books.title as bookTitle')
                .leftJoin('books', 'transactions.bookId', 'books.id')
                .whereRaw('YEAR(transactions.borrowDate) = ?', [sqlYear]);

            if (!isYearly) {
                query = query.andWhereRaw('MONTH(transactions.borrowDate) = ?', [sqlMonth]);
            }

            const rawData = await query.orderBy('transactions.id', 'desc');

            result = rawData.map(item => ({
                id: item.id,
                date: item.borrowDate,
                name: item.studentName,
                role: item.role,
                quantity: item.quantity,
                bookTitle: item.bookTitle,
                activity: `Peminjaman Buku ${item.bookTitle} (${item.quantity} buah)`,
                status: item.status,
                description: item.status === 'Dikembalikan' 
                    ? `Selesai (Tenggat: ${new Date(item.dueDate).toLocaleDateString('id-ID')})` 
                    : `Aktif (Tenggat: ${new Date(item.dueDate).toLocaleDateString('id-ID')})`
            }));

        } else if (type === 'kunjungan') {
            let query = db('visits').whereRaw('YEAR(date) = ?', [sqlYear]);

            if (!isYearly) {
                query = query.andWhereRaw('MONTH(date) = ?', [sqlMonth]);
            }

            const rawData = await query.orderBy('id', 'desc');

            result = rawData.map(item => ({
                id: item.id,
                date: item.date,
                name: item.name,
                role: item.chosing,
                quantity: '-',
                activity: `Tujuan: ${item.purpose}`,
                status: 'Selesai',
                description: `Pukul ${item.time || '-'}`
            }));
        } else {
            return res.status(400).json({ error: 'Tipe tidak valid' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data laporan', detail: error.message });
    }
});

module.exports = router;