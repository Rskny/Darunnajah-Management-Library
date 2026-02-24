const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Mendapatkan semua anggota
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar anggota
 */
// Get semua anggota
router.get('/', authenticateToken, async (req, res) => {
    try {
        const members = await db('members').select('*');
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data anggota', detail: error.message });
    }
});

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Menambah anggota baru
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama: { type: string }
 *               nis: { type: string }
 *               kelas: { type: string }
 *               jurusan: { type: string }
 *               gender: { type: string }
 *     responses:
 *       201:
 *         description: Anggota berhasil ditambahkan
 */
// Tambah anggota baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { nama, nis, kelas, jurusan, gender } = req.body;
        const [id] = await db('members').insert({ nama, nis, kelas, jurusan, gender });
        res.status(201).json({ message: 'Anggota berhasil ditambahkan', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambah anggota', detail: error.message });
    }
});

/**
 * @swagger
 * /api/members/{id}:
 *   delete:
 *     summary: Menghapus anggota
 *     tags: [Members]
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
 *         description: Anggota berhasil dihapus
 */
// Hapus anggota
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db('members').where({ id }).del();
        res.json({ message: 'Anggota berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus anggota', detail: error.message });
    }
});

module.exports = router;
