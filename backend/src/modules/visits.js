const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');


/**
 * @swagger
 * swagger: "2.0"
 * info:
 *   title: API Visits
 *   version: 1.0.0
 *   description: API untuk manajemen catatan kunjungan tamu
 * basePath: /api/visits
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     Visit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         memberId:
 *           type: string
 *         kelas:
 *           type: string
 *         chosing:
 *           type: string
 *         purpose:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 *     CreateVisitRequest:
 *       type: object
 *       required:
 *         - name
 *         - purpose
 *       properties:
 *         name:
 *           type: string
 *         memberId:
 *           type: string
 *         kelas:
 *           type: string
 *         chosing:
 *           type: string
 *         purpose:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 */


/**
 * @swagger
 * /:
 *   get:
 *     summary: Mendapatkan semua catatan pengunjung
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filter berdasarkan tanggal (opsional)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data kunjungan
 *       500:
 *         description: Eror internal pada server
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { date } = req.query;
        let query = db('visits').select('*');
        
        if (date) {
            query = query.where({ date });
        }
        
        const visits = await query.orderBy('id', 'desc');
        res.json(visits);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data kunjungan', detail: error.message });
    }
});


/**
 * @swagger
 * /:
 *   post:
 *     summary: Merekam pengunjung tamu baru
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVisitRequest'
 *     responses:
 *       201:
 *         description: Kunjungan berhasil dicatat
 *       500:
 *         description: Eror internal pada server
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, memberId, kelas, chosing, purpose, date, time } = req.body;
        
        if (!name || !purpose) {
            return res.status(400).json({ error: 'Nama dan tujuan kunjungan wajib diisi' });
        }
        
        const [id] = await db('visits').insert({ 
            name, 
            memberId, 
            kelas, 
            chosing, 
            purpose, 
            date, 
            time 
        });
        
        res.status(201).json({ message: 'Kunjungan berhasil dicatat', id });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mencatat kunjungan', detail: error.message });
    }
});


/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Menghapus kunjungan
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Kunjungan yang akan dihapus
 *     responses:
 *       200:
 *         description: Kunjungan berhasil dihapus
 *       404:
 *         description: Kunjungan tidak ditemukan
 *       500:
 *         description: Eror internal pada server
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const visit = await db('visits').where({ id }).first();
        if (!visit) {
            return res.status(404).json({ error: 'Kunjungan tidak ditemukan' });
        }
        
        await db('visits').where({ id }).del();
        res.json({ message: 'Kunjungan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus kunjungan', detail: error.message });
    }
});


module.exports = router;