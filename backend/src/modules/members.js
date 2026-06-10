const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
 
async function getNextMemberId(status) {
    const prefix = status.toLowerCase() === 'teacher' ? 'T' : 'S';
    const lastMember = await db('members')
        .where('id', 'like', `${prefix}%`)
        .orderBy('id', 'desc')
        .first();
    if (!lastMember) return `${prefix}1000`;
    const lastNumber = parseInt(lastMember.id.substring(1), 10);
    return `${prefix}${lastNumber + 1}`;
}
 
/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: S1001
 *         nama:
 *           type: string
 *           example: Budi Santoso
 *         status:
 *           type: string
 *           example: student
 *         kelas:
 *           type: string
 *           example: "3"
 *         jurusan:
 *           type: string
 *           example: IPA
 *         gender:
 *           type: string
 *           example: Laki-laki
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
 *         jurusan:
 *           type: string
 *         gender:
 *           type: string
 *     MemberUpdateRequest:
 *       type: object
 *       properties:
 *         nama:
 *           type: string
 *           example: Budi Santoso
 *         kelas:
 *           type: string
 *           example: "3"
 *         jurusan:
 *           type: string
 *           example: IPA
 *         gender:
 *           type: string
 *           example: Laki-laki
 *     NextIdResponse:
 *       type: object
 *       properties:
 *         nextId:
 *           type: string
 *           example: S1042
 */
 
/**
 * @swagger
 * /api/members/next-id:
 *   get:
 *     summary: Mendapatkan ID otomatis berikutnya berdasarkan status
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [student, teacher]
 *         description: Status anggota
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
        if (!status) return res.status(400).json({ error: 'Parameter status wajib diisi!' });
        const nextId = await getNextMemberId(status);
        res.json({ nextId });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat urutan ID baru', detail: error.message });
    }
});
 
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
 *         description: Daftar anggota berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       500:
 *         description: Gagal mendapatkan data anggota
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
 * /api/members:
 *   post:
 *     summary: Menambah anggota baru dengan ID otomatis
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                   example: S1042
 *       400:
 *         description: Nama dan Status wajib diisi
 *       500:
 *         description: Gagal menambah anggota
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { nama, status, kelas, jurusan, gender } = req.body;
        if (!nama || !status) return res.status(400).json({ error: 'Nama dan Status wajib diisi!' });
        const finalCustomId = await getNextMemberId(status);
        await db('members').insert({ id: finalCustomId, nama, status, kelas, jurusan, gender });
        res.status(201).json({ message: 'Anggota berhasil ditambahkan', id: finalCustomId });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambah anggota', detail: error.message });
    }
});
 
/**
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Memperbarui data anggota
 *     description: Update nama, kelas, jurusan, dan gender anggota. ID dan status tidak bisa diubah.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID anggota yang ingin diupdate
 *         example: S1001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberUpdateRequest'
 *     responses:
 *       200:
 *         description: Anggota berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Anggota berhasil diperbarui
 *       404:
 *         description: Anggota tidak ditemukan
 *       500:
 *         description: Gagal memperbarui anggota
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, kelas, jurusan, gender } = req.body;
 
        const member = await db('members').where({ id }).first();
        if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
 
        await db('members').where({ id }).update({ nama, kelas, jurusan, gender });
        res.json({ message: 'Anggota berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui anggota', detail: error.message });
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
 *           type: string
 *         description: ID anggota yang akan dihapus
 *         example: S1001
 *     responses:
 *       200:
 *         description: Anggota berhasil dihapus
 *       404:
 *         description: Anggota tidak ditemukan
 *       500:
 *         description: Gagal menghapus anggota
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const member = await db('members').where({ id }).first();
        if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
        await db('members').where({ id }).del();
        res.json({ message: 'Anggota berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus anggota', detail: error.message });
    }
});
 
/**
 * @swagger
 * /api/members/selection:
 *   get:
 *     summary: Mendapatkan daftar anggota untuk dropdown pilihan
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
 *                   jurusan:
 *                     type: string
 *                   gender:
 *                     type: string
 */
router.get('/selection', authenticateToken, async (req, res) => {
    try {
        const members = await db('members')
            .select('id', 'nama', 'status', 'kelas', 'jurusan', 'gender')
            .orderBy('nama', 'asc');
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil list seleksi anggota', detail: error.message });
    }
});
 
module.exports = router;