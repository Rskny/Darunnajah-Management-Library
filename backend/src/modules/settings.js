const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
const bcrypt = require('bcrypt');
const { sendPasswordChangedEmail } = require('../utils/mailer');
const fs = require('fs');
const path = require('path');
 
// Menentukan lokasi file backup JSON tersimpan di server backend
const BACKUP_FILE_PATH = path.join(__dirname, '../backups', 'latest_backup.json');
 
// Memastikan folder 'backups' otomatis terbuat jika belum ada di server
if (!fs.existsSync(path.dirname(BACKUP_FILE_PATH))) {
    fs.mkdirSync(path.dirname(BACKUP_FILE_PATH), { recursive: true });
}
 
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
 *     tags:
 *       - Settings
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
 *     tags:
 *       - Settings
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
 *     tags:
 *       - Settings
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
 *     tags:
 *       - Settings
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
 *     summary: Menjalankan backup data aktual ke dalam file JSON server
 *     tags:
 *       - Settings
 */
router.post('/backup', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
 
        // 1. Ambil data asli dari tabel members untuk dicadangkan
        const currentMembers = await db('members').select('*');
 
        const backupPayload = {
            version: "1.0",
            backed_at: now,
            data: {
                members: currentMembers
            }
        };
 
        // 2. Tulis data ke dalam berkas JSON di server
        fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(backupPayload, null, 2), 'utf-8');
 
        // 3. Catat waktu log terakhir di tabel settings
        await db('settings')
            .insert({ id: 1, last_backup_at: now })
            .onConflict('id')
            .merge();
            
        res.json({ message: "Backup data database berhasil disimpan!", time: now });
    } catch (error) {
        console.error("Backup Error:", error);
        res.status(500).json({ error: 'Proses backup gagal', detail: error.message });
    }
});
 
/**
 * @swagger
 * /restore:
 *   post:
 *     summary: Mengembalikan seluruh data anggota berdasarkan file backup terakhir
 *     tags:
 *       - Settings
 */
router.post('/restore', authenticateToken, async (req, res) => {
    try {
        // 1. Validasi apakah berkas backup tersedia di sistem backend
        if (!fs.existsSync(BACKUP_FILE_PATH)) {
            return res.status(404).json({ error: 'File cadangan (backup) tidak ditemukan di server.' });
        }
 
        // 2. Baca file JSON backup
        const rawData = fs.readFileSync(BACKUP_FILE_PATH, 'utf-8');
        const backupPayload = JSON.parse(rawData);
        const targetMembers = backupPayload.data?.members || [];
 
        // 3. Jalankan Transaksi Database agar aman (kalau gagal di tengah, dibatalkan semua)
        await db.transaction(async (trx) => {
            // Hapus isi tabel lama agar tidak terjadi duplikasi ID (Primary Key)
            await trx('members').del();
 
            // Masukkan data hasil backup jika datanya tersedia
            if (targetMembers.length > 0) {
                await trx('members').insert(targetMembers);
            }
        });
 
        res.json({ 
            message: `Restore berhasil! Berhasil mengembalikan ${targetMembers.length} data anggota ke kondisi tanggal ${new Date(backupPayload.backed_at).toLocaleString('id-ID')}.`
        });
    } catch (error) {
        console.error("Restore Error:", error);
        res.status(500).json({ error: 'Proses restore data gagal dilakukan', detail: error.message });
    }
});
 
/**
 * @swagger
 * /backup-info:
 *   get:
 *     summary: Ambil info backup terakhir
 *     tags:
 *       - Settings
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