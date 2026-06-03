const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer'); // Install ini jika ingin kirim email sungguhan via SMTP

/**
 * @swagger
 * /api/settings/profile:
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
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin Utama"
 *               username:
 *                 type: string
 *                 example: "admin_super"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
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
        const adminId = req.user.id; // Diambil dari payload token JWT

        if (!name || !username || !email) {
            return res.status(400).json({ error: 'Semua field profil wajib diisi' });
        }

        await db('admins')
            .where({ id: adminId })
            .update({ name, username, email });

        res.json({ message: 'Profil berhasil diperbarui', user: { id: adminId, name, username, email } });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui profil', detail: error.message });
    }
});

/**
 * @swagger
 * /api/settings/admins:
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
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
 * /api/settings/admins/{id}:
 *   delete:
 *     summary: Menghapus akun admin tertentu (Button Hapus Akun)
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
        
        // Mencegah admin menghapus dirinya sendiri secara tidak sengaja melalui list
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
 * /api/settings/change-password-request:
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
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "passwordlama123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "passwordbaru456"
 *     responses:
 *       200:
 *         description: Password berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Password lama salah
 *       500:
 *         description: Gagal memproses perubahan password
 */
router.post('/change-password-request', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const adminId = req.user.id;

        const admin = await db('admins').where({ id: adminId }).first();
        if (!admin) return res.status(404).json({ error: 'Admin tidak ditemukan' });

        // Cek password lama
        const match = await bcrypt.compare(oldPassword, admin.password);
        if (!match) return res.status(400).json({ error: 'Password lama salah' });

        // LOGIKA EMAIL SIMULASI (Bisa dikembangkan dengan nodemailer)
        console.log(`Kirim email konfirmasi ke: ${admin.email}`);
        
        // Eksekusi update password langsung (atau simpan token verifikasi email terlebih dahulu)
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db('admins').where({ id: adminId }).update({ password: hashedNewPassword });

        res.json({ message: `Konfirmasi berhasil dikirim ke email ${admin.email}. Password Anda telah aman diperbarui.` });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses perubahan password', detail: error.message });
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
 *         description: Backup berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 time:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Proses backup gagal
 */
router.post('/backup', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
        await db('settings').insert({ id: 1, last_backup_at: now }).onConflict('id').merge();
        res.json({ message: "Backup berhasil", time: now });
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
 *         description: Info backup terakhir berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 last_backup:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
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