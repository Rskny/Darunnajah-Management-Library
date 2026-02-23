const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Get semua buku
router.get('/', authenticateToken, async (req, res) => {
    try {
        const books = await db('books').select('*');
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data buku', detail: error.message });
    }
});

// Tambah buku baru
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, author, category, available } = req.body;
        const [id] = await db('books').insert({ title, author, category, available: available ?? true });
        res.status(201).json({ message: 'Buku berhasil ditambahkan', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambah buku', detail: error.message });
    }
});

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
