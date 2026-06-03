const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * paths:
 *  /api/dashboard:
 *   get:
 *    summary: Mendapatkan data ringkasan dashboard
 *    tags:
 *     - Dashboard
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: Berhasil mendapatkan data ringkasan
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         example:
 *          stats:
 *           weeklyVisits: 0
 *           activeLoans: 0
 *           overdueCount: 0
 *           totalBooks: 0
 *          monthlyData: []
 *          topLists: {}
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // 1. Weekly Visits
        const weeklyVisitsResult = await db('visits')
            .count('* as count')
            .where('date', '>=', oneWeekAgo.toISOString().split('T')[0]);
        const weeklyVisits = weeklyVisitsResult[0].count;

        // 2. Active Loans (status = Dipinjam)
        const activeLoansResult = await db('transactions')
            .count('* as count')
            .where('status', 'Dipinjam');
        const activeLoans = activeLoansResult[0].count;

        // 3. Overdue Count (status = Dipinjam & dueDate < today)
        const overdueCountResult = await db('transactions')
            .count('* as count')
            .where('status', 'Dipinjam')
            .andWhere('dueDate', '<', today.toISOString().split('T')[0]);
        const overdueCount = overdueCountResult[0].count;

        // 4. Total Books
        const totalBooksResult = await db('books').count('* as count');
        const totalBooks = totalBooksResult[0].count;

        // 5. Monthly Visits (12 months array)
        const visits = await db('visits').select('date');

        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const monthly = months.map(m => ({ month: m, visits: 0 }));

        visits.forEach((v) => {
            if (v.date) {
                const d = new Date(v.date);
                if (!isNaN(d.getTime())) {
                    monthly[d.getMonth()].visits++;
                }
            }
        });

       // ==================== DAFTAR TOP LIST ====================
let topVisitors = [];
let topBorrowers = [];

// 6. Ambil Top 3 Pengunjung Teraktif
try {
    const rawVisitors = await db('visits')
        .select('name')
        .count('* as count')
        .groupBy('name')
        .orderBy('count', 'desc')
        .limit(3);

    topVisitors = rawVisitors.map(v => ({
        name: v.name,
        count: Number(v.count),
        subText: 'Siswa / Anggota'
    }));
} catch (visError) {
    console.log('💡 Note Top Visitors:', visError.message);
}

// 7. Ambil Top 3 Peminjam Buku Terbanyak
try {
    const rawBorrowers = await db('transactions')
        .select('studentName')
        .count('* as count')
        .groupBy('studentName')
        .orderBy('count', 'desc')
        .limit(3);

    topBorrowers = rawBorrowers.map(b => ({
        name: b.studentName,
        count: Number(b.count),
        subText: 'Siswa / Anggota'
    }));
} catch (borError) {
    console.log('💡 Note Top Borrowers:', borError.message);
}

console.log('TOP VISITORS:', topVisitors);
console.log('TOP BORROWERS:', topBorrowers);
// ====================================================================================
        // Kirim semua response ke frontend
        res.json({
            stats: {
                weeklyVisits: Number(weeklyVisits) || 0,
                activeLoans: Number(activeLoans) || 0,
                overdueCount: Number(overdueCount) || 0,
                totalBooks: Number(totalBooks) || 0,
            },
            monthlyData: monthly,
            topLists: {              
                visitors: topVisitors,
                borrowers: topBorrowers
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data dashboard', detail: error.message });
    }
});

module.exports = router;