const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/settings/admins:
 *   get:
 *     summary: Mendapatkan semua daftar administrator
 *     tags : [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar admin
 */
router.get('/admins', authenticateToken, async (req, res) => {
    try{
        const admins = await db('admins').select('id', 'name', 'username', 'email');
        res.json(Array.isArray(admins) ? admins : []);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data admin' });
    }
});

/**
 * @swagger
 * /api/settings/backup:
 *   post:
 *     summary: Menjalankan simulasi backup dan mencatat waktu terakhir
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup berhasil dicatat
 */
router.post('/backup', authenticateToken, async (req, res) => {
    try {
        const now =new Date();
        await db('settings').insert({ id: 1, last_backup_at: now })
        .onConflict('id').merge();

        res.json({ message: "Backup berhasil", time:now });
    } catch (error) {
        res.status(500).json({ error: 'Proses backup gagal' });
    }
});

/**
 * @swagger
 * /api/settings/backup-info:
 *   get:
 *     summary: Ambil info backup terakhir
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *        description: Berhasil mendapatkan info backup
 */
router.get('/backup-info', authenticateToken, async (req, res) => {
    try {
        const data = await db('settings').where({ id: 1 }).first();
        res.json({ last_backup: data ? data.last_backup_at : null });
        } catch (error) {
            res.status(500).json({ last_backup: null });
        }
});

module.exports = router;