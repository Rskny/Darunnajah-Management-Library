const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login admin (Dapatkan Token JWT)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db('admins').where({ username }).first();

        if (!user) {
            return res.status(404).json({ message: 'Username tidak ditemukan' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Password salah' });
        }

        // Buat JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'supersecretjwtkey',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({ message: 'Login berhasil', token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login gagal', detail: error.message });
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi admin baru
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               username: { type: string }
 *               password: { type: string }
 *               email: { type: string }
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 */
router.post('/register', async (req, res) => {
    try {
        const { name, username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db('admins').insert({
            name,
            username,
            password: hashedPassword,
            email
        });

        res.status(201).json({ message: 'Admin sukses didaftarkan' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal register', detail: error.message });
    }
});

/**
 * @swagger
 * /api/auth/admins:
 *   get:
 *     summary: Mendapatkan daftar semua admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data admin
 */
// Get List Semua Admin
router.get('/admins', authenticateToken, async (req, res) => {
    try {
        const admins = await db('admins').select('id', 'name', 'username', 'email');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data admin', detail: error.message });
    }
});

/**
 * @swagger
 * /api/auth/admins/{id}:
 *   put:
 *     summary: Memperbarui data admin
 *     tags: [Auth]
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
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Profil admin berhasil diperbarui
 */
// Update data Admin
router.put('/admins/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, password } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await db('admins').where({ id }).update(updateData);
        res.json({ message: 'Profil admin berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui admin', detail: error.message });
    }
});

module.exports = router;
