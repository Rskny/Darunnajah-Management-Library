const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../authMiddleware');
const { sendResetPasswordEmail } = require('../utils/mailer.js');


/**
 * @swagger
 * swagger: "2.0"
 * info:
 *   title: API Authentication
 *   version: 1.0.0
 *   description: API untuk login, register, dan manajemen admin
 * basePath: /api/auth
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - password
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *         newPassword:
 *           type: string
 *     UpdateAdminRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login admin (Dapatkan Token JWT)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT
 *       401:
 *         description: Password salah
 *       404:
 *         description: Username tidak ditemukan
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' });
        }

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
            { id: user.id, name: user.name, username: user.username },
            process.env.JWT_SECRET || 'supersecretjwtkey',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({ 
            message: 'Login berhasil', 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                username: user.username, 
                email: user.email 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Login gagal', detail: error.message });
    }
});


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrasi admin baru
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 *       400:
 *         description: Username sudah terdaftar
 */
router.post('/register', async (req, res) => {
    try {
        const { name, username, password, email } = req.body;

        if (!name || !username || !password || !email) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Cek apakah username sudah ada
        const existingUser = await db('admins').where({ username }).first();
        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }

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
 * /forgot-password:
 *   post:
 *     summary: Mengirim email reset password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Email berhasil dikirim
 *       404:
 *         description: Email tidak ditemukan
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email wajib diisi' });
        }

        const user = await db('admins').where({ email }).first();

        if (!user) {
            return res.status(404).json({ message: 'Email tidak terdaftar di sistem kami' });
        }

        // Buat token unik
        const resetToken = Math.random().toString(36).substring(2, 15);

        // Simpan token ke database
        await db('admins').where({ email }).update({
            reset_token: resetToken
        });

        // Kirim email
        await sendResetPasswordEmail(email, resetToken);

        res.json({ message: 'Link reset password telah dikirim ke email Anda!' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses lupa password', detail: error.message });
    }
});


/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password menggunakan token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Token tidak valid
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token dan password baru wajib diisi' });
        }

        const user = await db('admins').where({ reset_token: token }).first();

        if (!user) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db('admins').where({ id: user.id }).update({
            password: hashedPassword,
            reset_token: null 
        });

        res.json({ message: 'Password berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal reset password', detail: error.message });
    }
});


/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Mendapatkan daftar semua admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data admin
 */
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
 * /admins/{id}:
 *   put:
 *     summary: Memperbarui data admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID admin yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdminRequest'
 *     responses:
 *       200:
 *         description: Profil admin berhasil diperbarui
 *       404:
 *         description: Admin tidak ditemukan
 */
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

        // Cek apakah admin ada
        const existingAdmin = await db('admins').where({ id }).first();
        if (!existingAdmin) {
            return res.status(404).json({ message: 'Admin tidak ditemukan' });
        }

        await db('admins').where({ id }).update(updateData);
        res.json({ message: 'Profil admin berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui admin', detail: error.message });
    }
});


module.exports = router;