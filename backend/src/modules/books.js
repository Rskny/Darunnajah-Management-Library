const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Mendapatkan semua buku
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar buku
 */
// Get semua buku
router.get('/', authenticateToken, async (req, res) => {
    try {
        const books = await db('books').select('*');
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data buku', detail: error.message });
    }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Menambah buku baru
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               year: { type: string }
 *               publisher: { type: string }
 *               isbn: { type: string }
 *               category: { type: string }
 *               classCode: { type: string }
 *               major: { type: string }
 *               stock: { type: integer }
 *               source: { type: string }
 *               inputDate: { type: string }
 *               coverImage: { type: string }
 *               available: { type: boolean }
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
 */
// Tambah buku baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, author, year, publisher, isbn, category, classCode, major, stock, source, inputDate, coverImage, available } = req.body;
        const [id] = await db('books').insert({ title, author, year, publisher, isbn, category, classCode, major, stock, source, inputDate, coverImage, available: available ?? true });
        res.status(201).json({ message: 'Buku berhasil ditambahkan', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambah buku', detail: error.message });
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Memperbarui data buku
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               year: { type: string }
 *               publisher: { type: string }
 *               isbn: { type: string }
 *               category: { type: string }
 *               classCode: { type: string }
 *               major: { type: string }
 *               stock: { type: integer }
 *               source: { type: string }
 *               inputDate: { type: string }
 *               coverImage: { type: string }
 *               available: { type: boolean }
 *     responses:
 *       200:
 *         description: Buku berhasil diperbarui
 */
// Update data buku
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        await db('books').where({ id }).update(updateData);
        res.json({ message: 'Buku berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui buku', detail: error.message });
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Menghapus buku
 *     tags: [Books]
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
 *         description: Buku berhasil dihapus
 */
// Hapus buku
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db('books').where({ id }).del();
        res.json({ message: 'Buku berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus buku', detail: error.message });
    }
});

module.exports = router;
