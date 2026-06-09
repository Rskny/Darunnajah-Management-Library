const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
 
// Fungsi untuk cek apakah hari ini
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
 * swagger: "2.0"
 * info:
 *   title: API Reports
 *   version: 1.0.0
 *   description: API untuk laporan transaksi peminjaman dan kunjungan
 * basePath: /api/reports
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     ReportResponse:
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
 *         bookTitle:
 *           type: string
 *     VisitReportResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         memberId:
 *           type: string
 *         kelas:
 *           type: string
 *         chosing:
 *           type: string
 *         purpose:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 */
 
 
/**
 * @swagger
 * /:
 *   get:
 *     summary: Mengambil data laporan berdasarkan filter
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
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Nomor bulan (1-12) atau 'all'
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Tahun laporan
 *     responses:
 *       200:
 *         description: Berhasil mengambil data laporan
 *       400:
 *         description: Parameter type wajib diisi
 *       500:
 *         description: Eror internal pada server
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { type, month, year } = req.query;
 
        if (!type) {
            return res.status(400).json({ error: 'Parameter type wajib diisi (transaksi/kunjungan)' });
        }
 
        let query;
 
        if (type === 'kunjungan') {
            // Laporan Kunjungan - ambil dari visits EXCLUDE hari ini
            query = db('visits').select('*').orderBy('id', 'desc');
            
            if (year) {
                query = query.whereRaw('YEAR(date) = ?', [year]);
            }
            if (month && month !== 'all') {
                query = query.whereRaw('MONTH(date) = ?', [month]);
            }
 
            // TAMBAHAN: Filter exclude hari ini (sama seperti halaman Riwayat Kunjungan)
            const allData = await query;
            const data = allData.filter(item => !isToday(item.date));
            
            res.status(200).json(data);
 
        } else {
            // Default: Laporan Transaksi Peminjaman
            // PERUBAHAN: Tambah filter status = "Dikembalikan" (sama seperti halaman Riwayat Peminjaman)
            query = db('transactions')
                .select('transactions.*', 'books.title as bookTitle')
                .leftJoin('books', 'transactions.bookId', 'books.id')
                .where('transactions.status', 'Dikembalikan')  // FILTER BARU
                .orderBy('transactions.id', 'desc');
 
            if (year) {
                query = query.whereRaw('YEAR(borrowDate) = ?', [year]);
            }
            if (month && month !== 'all') {
                query = query.whereRaw('MONTH(borrowDate) = ?', [month]);
            }
 
            const data = await query;
            res.status(200).json(data);
        }
 
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data laporan', detail: error.message });
    }
});
 
 
module.exports = router;