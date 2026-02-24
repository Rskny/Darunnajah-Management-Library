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
        const visits = await db('visits').select('*').orderBy('id', 'desc');
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
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Kunjungan berhasil dicatat
 */
// Rekam pengunjung tamu baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, nis, date } = req.body;
        const [id] = await db('visits').insert({ name, nis, date });
        res.status(201).json({ message: 'Kunjungan berhasil dicatat', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mencatat kunjungan', detail: error.message });
    }
});

module.exports = router;
