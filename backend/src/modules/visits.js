const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/visits:
 *   get:
 *     summary: Mendapatkan semua catatan pengunjung
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data kunjungan
 */
// Get semua catatan pengunjung
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { date } = req.query;
        let query = db('visits').select('*');
        if (date) {
            query = query.where({ date });
        }
        const visits = await query.orderBy('id', 'desc');
        res.json(visits);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data kunjungan', detail: error.message });
    }
});

/**
 * @swagger
 * /api/visits:
 *   post:
 *     summary: Merekam pengunjung tamu baru
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               nis: { type: string }
 *               kelas: { type: string }
 *               chosing: { type: string }
 *               purpose: { type: string }
 *               date: { type: string, format: date }
 *               time: { type: string }
 *     responses:
 *       201:
 *         description: Kunjungan berhasil dicatat
 */
// Rekam pengunjung tamu baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, nis, kelas, chosing, purpose, date, time } = req.body;
        const [id] = await db('visits').insert({ name, nis, kelas, chosing, purpose, date, time });
        res.status(201).json({ message: 'Kunjungan berhasil dicatat', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mencatat kunjungan', detail: error.message });
    }
});

/**
 * @swagger
 * /api/visits/{id}:
 *   delete:
 *     summary: Menghapus kunjungan
 *     tags: [Visits]
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
 *         description: Kunjungan berhasil dihapus
 */
// Hapus kunjungan
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db('visits').where({ id }).del();
        res.json({ message: 'Kunjungan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus kunjungan', detail: error.message });
    }
});

module.exports = router;
