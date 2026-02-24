const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Mendapatkan data ringkasan dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data ringkasan
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

        res.json({
            stats: {
                weeklyVisits,
                activeLoans,
                overdueCount,
                totalBooks,
            },
            monthlyData: monthly
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan data dashboard', detail: error.message });
    }
});

module.exports = router;
