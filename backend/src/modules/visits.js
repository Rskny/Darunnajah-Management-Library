const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Get semua catatan pengunjung
router.get('/', authenticateToken, async (req, res) => {
    try {
        const visits = await db('visits').select('*').orderBy('id', 'desc');
        res.json(visits);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data kunjungan', detail: error.message });
    }
});

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
