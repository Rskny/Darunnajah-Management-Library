const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/system/backup:
 *   get:
 *     summary: Mendapatkan data backup untuk semua entitas (dalam format JSON)
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data backup dari sistem
 */
// Endpoint Sistem Backup
router.get('/backup', authenticateToken, async (req, res) => {
    try {
        const data = {
            books: await db('books').select('*'),
            members: await db('members').select('*'),
            transactions: await db('transactions').select('*'),
            visits: await db('visits').select('*'),
            admins: await db('admins').select('id', 'username', 'email'), // Sembunyikan password hash
            exportDate: new Date().toISOString()
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal melakukan backup JSON', detail: error.message });
    }
});

module.exports = router;
