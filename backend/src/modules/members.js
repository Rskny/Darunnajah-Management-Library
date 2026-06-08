const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');


// ==========================================
// FUNGSI GENERATOR ID OTOMATIS
// ==========================================
async function getNextMemberId(status) {
    const prefix = status.toLowerCase() === 'teacher' ? 'T' : 'S';
    
    const lastMember = await db('members')
        .where('id', 'like', `${prefix}%`)
        .orderBy('id', 'desc')
        .first();
        
    if (!lastMember) {
        return `${prefix}1000`;
    }
    
    const lastNumberStr = lastMember.id.substring(1);
    const lastNumber = parseInt(lastNumberStr, 10);
    const nextNumber = lastNumber + 1;
    
    return `${prefix}${nextNumber}`;
}


/**
 * @swagger
 * swagger: "2.0"
 * info:
 *   title: API Members
 *   version: 1.0.0
 *   description: API untuk manajemen anggota (student/teacher)
 * basePath: /api/members
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nama:
 *           type: string
 *         status:
 *           type: string
 *         kelas:
 *           type: string
 *         jurusan:
 *           type: string
 *         gender:
 *           type: string
 *     MemberCreateRequest:
 *       type: object
 *       required:
 *         - nama
 *         - status
 *       properties:
 *         nama:
 *           type: string
 *         status:
 *           type: string
 *           enum: [student, teacher]
 *         kelas:
 *           type: string
 *         juroran:
 *           type: string
 *         gender:
 *           type: string
 *     NextIdResponse:
 *       type: object
 *       properties:
 *         nextId:
 *           type: string
 */


/**
 * @swagger
 * /next-id:
 *   get:
 *     summary: Mendapatkan ID otomatis berikutnya berdasarkan status peran
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status anggota (student/teacher)
 *     responses:
 *       200:
 *         description: ID berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NextIdResponse'
 *       400:
 *         description: Parameter status wajib diisi
 */
router.get('/next-id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;
        
        if (!status) {
            return res.status(400).json({ error: 'Parameter status (student/teacher) wajib diisi!' });
        }
        
        const nextId = await getNextMemberId(status);
        res.json({ nextId });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat urutan ID baru', detail: error.message });
    }
});


/**
 * @swagger
 * /:
 *   get:
 *     summary: Mendapatkan semua anggota
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar anggota berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
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
 * /:
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
 *             $ref: '#/components/schemas/MemberCreateRequest'
 *     responses:
 *       201:
 *         description: Anggota berhasil ditambahkan
 *       400:
 *         description: Nama dan Status wajib diisi
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { nama, status, kelas, jurusan, gender } = req.body;
        
        if (!nama || !status) {
            return res.status(400).json({ error: 'Nama dan Status wajib diisi!' });
        }

        const finalCustomId = await getNextMemberId(status);
        
        await db('members').insert({ 
            id: finalCustomId,
            nama, 
            status, 
            kelas, 
            jurusan, 
            gender 
        });
        
        res.status(201).json({ message: 'Anggota berhasil ditambahkan', id: finalCustomId });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambah anggota', detail: error.message });
    }
});


/**
 * @swagger
 * /{id}:
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
 *           type: string
 *         description: ID Anggota yang akan dihapus
 *     responses:
 *       200:
 *         description: Anggota berhasil dihapus
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const member = await db('members').where({ id }).first();
        if (!member) {
            return res.status(404).json({ error: 'Anggota tidak ditemukan' });
        }
        
        await db('members').where({ id }).del();
        res.json({ message: 'Anggota berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus anggota', detail: error.message });
    }
});


/**
 * @swagger
 * /selection:
 *   get:
 *     summary: Mendapatkan daftar nama anggota untuk pilihan dropdown
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar anggota berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nama:
 *                     type: string
 *                   status:
 *                     type: string
 *                   kelas:
 *                     type: string
 *                   juroran:
 *                     type: string
 */
router.get('/selection', authenticateToken, async (req, res) => {
    try {
        const members = await db('members')
            .select('id', 'nama', 'status', 'kelas', 'jurusan')
            .orderBy('nama', 'asc');
            
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil list seleksi anggota', detail: error.message });
    }
});


module.exports = router;