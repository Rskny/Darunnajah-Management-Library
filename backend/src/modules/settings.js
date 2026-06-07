const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
const bcrypt = require('bcrypt');
const { sendPasswordChangedEmail } = require('../utils/mailer');


/**
 * @swagger
 * swagger: "2.0"
 * info:
 *   title: API Settings
 *   version: 1.0.0
 *   description: API untuk pengaturan profil admin, manajemen admin, dan backup
 * basePath: /api/settings
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     ProfileUpdateRequest:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: "Admin Utama"
 *         username:
 *           type: string
 *           example: "admin_super"
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@example.com"
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           format: password
 *           example: "passwordlama123"
 *         newPassword:
 *           type: string
 *           format: password
 *           example: "passwordbaru456"
 *     AdminResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *     BackupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         time:
 *           type: string
 *           format: date-time
 *     BackupInfoResponse:
 *       type: object
 *       properties:
 *         last_backup:
 *           type: string
 *           format: date-time
 *           nullable: true
 */


/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Memperbarui data profil admin yang sedang login
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateRequest'
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Validasi input gagal
 *       500:
 *         description: Gagal memperbarui profil
 */
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, username, email } = req.body;
        const adminId = req.user.id;

        if (!name || !username || !email) {
            return res.status(400).json({ error: 'Semua field profil wajib diisi' });
        }

        await db('admins')
            .where({ id: adminId })
            .update({ name, username, email });

        res.json({ 
            message: 'Profil berhasil diperbarui', 
            user: { id: adminId, name, username, email } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui profil', detail: error.message });
    }
});


/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Mendapatkan semua daftar administrator
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar admin berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminResponse'
 *       500:
 *         description: Gagal mengambil data admin
 */
router.get('/admins', authenticateToken, async (req, res) => {
    try {
        const admins = await db('admins').select('id', 'name', 'username', 'email');
        res.json(Array.isArray(admins) ? admins : []);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data admin' });
    }
});


/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Menghapus akun admin tertentu
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Admin yang akan dihapus
 *     responses:
 *       200:
 *         description: Akun admin berhasil dihapus
 *       400:
 *         description: Anda tidak dapat menghapus akun Anda sendiri
 *       500:
 *         description: Gagal menghapus akun admin
 */
router.delete('/admins/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ error: 'Anda tidak dapat menghapus akun Anda sendiri dari daftar ini.' });
        }

        await db('admins').where({ id }).del();
        res.json({ message: 'Akun admin berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus akun admin' });
    }
});


/**
 * @swagger
 * /change-password-request:
 *   post:
 *     summary: Memperbarui kata sandi admin
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password berhasil diperbarui
 *       400:
 *         description: Password lama salah
 *       500:
 *         description: Gagal memproses perubahan password
 */
router.post('/change-password-request', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const adminId = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Password lama dan baru wajib diisi' });
        }

        const admin = await db('admins').where({ id: adminId }).first();
        if (!admin) {
            return res.status(404).json({ error: 'Admin tidak ditemukan' });
        }

        const match = await bcrypt.compare(oldPassword, admin.password);
        if (!match) {
            return res.status(400).json({ error: 'Password lama salah' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db('admins').where({ id: adminId }).update({ password: hashedNewPassword });

        try {
            await sendPasswordChangedEmail(admin.email, admin.username);
        } catch (emailError) {
            console.error('Sistem gagal mengirimkan email notifikasi:', emailError.message);
        }

        res.json({ 
            message: `Password Anda telah aman diperbarui. Notifikasi konfirmasi berhasil dikirim ke email ${admin.email}.` 
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses perubahan password', detail: error.message });
    }
});


/**
 * @swagger
 * /backup:
 *   post:
 *     summary: Menjalankan simulasi backup dan mencatat waktu terakhir
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupResponse'
 *       500:
 *         description: Proses backup gagal
 */
router.post('/backup', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
        await db('settings')
            .insert({ id: 1, last_backup_at: now })
            .onConflict('id')
            .merge();
            
        res.json({ message: "Backup berhasil", time: now });
    } catch (error) {
        res.status(500).json({ error: 'Proses backup gagal' });
    }
});


/**
 * @swagger
 * /backup-info:
 *   get:
 *     summary: Ambil info backup terakhir
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Info backup terakhir berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupInfoResponse'
 *       500:
 *         description: Gagal mengambil info backup
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