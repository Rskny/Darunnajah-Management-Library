const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         year:
 *           type: string
 *         publisher:
 *           type: string
 *         isbn:
 *           type: string
 *         bookCode:
 *           type: string
 *           description: Kode perpustakaan, contoh 200 ALI D
 *         category:
 *           type: string
 *         classCode:
 *           type: string
 *         major:
 *           type: string
 *         stock:
 *           type: integer
 *         source:
 *           type: string
 *         inputDate:
 *           type: string
 *         coverImage:
 *           type: string
 *         available:
 *           type: boolean
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Gagal mendapatkan data buku
 */
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
 *             required:
 *               - title
 *               - author
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Laskar Pelangi
 *               author:
 *                 type: string
 *                 example: Andrea Hirata
 *               year:
 *                 type: string
 *                 example: "2005"
 *               publisher:
 *                 type: string
 *                 example: Bentang Pustaka
 *               isbn:
 *                 type: string
 *                 example: 978-602-8519
 *               bookCode:
 *                 type: string
 *                 example: 800 AND L
 *                 description: Kode perpustakaan yang diinput manual oleh admin
 *               category:
 *                 type: string
 *                 example: Sastra
 *               classCode:
 *                 type: string
 *               major:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 example: 5
 *               source:
 *                 type: string
 *                 example: Pembelian
 *               inputDate:
 *                 type: string
 *                 example: "2026-01-01"
 *               coverImage:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       500:
 *         description: Gagal menambah buku
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { 
            title, author, year, publisher, isbn, bookCode,
            category, classCode, major, stock, source, 
            inputDate, coverImage, available 
        } = req.body;

        const [id] = await db('books').insert({ 
            title, 
            author, 
            year, 
            publisher, 
            isbn: isbn || null,
            bookCode: bookCode || null,
            category, 
            classCode: classCode || null, 
            major: major || null, 
            stock, 
            source, 
            inputDate, 
            coverImage: coverImage || null, 
            available: available ?? true 
        });

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
 *         description: ID buku yang ingin diupdate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: string
 *               publisher:
 *                 type: string
 *               isbn:
 *                 type: string
 *               bookCode:
 *                 type: string
 *                 description: Kode perpustakaan
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               source:
 *                 type: string
 *               inputDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Buku berhasil diperbarui
 *       404:
 *         description: Buku tidak ditemukan
 *       500:
 *         description: Gagal memperbarui buku
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, author, year, publisher, 
            isbn, bookCode, category, 
            stock, source, inputDate 
        } = req.body;

        const count = await db('books').where({ id }).update({
            title,
            author,
            year,
            publisher,
            isbn: isbn || null,
            bookCode: bookCode || null,
            category,
            stock: Number(stock),
            source,
            inputDate,
            available: Number(stock) > 0 ? true : false
        });

        if (count === 0) {
            return res.status(404).json({ error: 'Buku tidak ditemukan' });
        }

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
 *         description: ID buku yang ingin dihapus
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
 *       500:
 *         description: Gagal menghapus buku
 */
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