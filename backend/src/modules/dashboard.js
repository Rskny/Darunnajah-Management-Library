const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const STATUS_BORROWED = 'Dipinjam';

const toDateString = (date) => date.toISOString().split('T')[0];

const parseCount = (result) => Number(result[0]?.count) || 0;

const buildMonthlyVisits = (visits) => {
    const monthly = MONTH_LABELS.map((month) => ({ month, visits: 0 }));

    for (const { date } of visits) {
        if (!date) continue;

        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            monthly[parsedDate.getMonth()].visits++;
        }
    }

    return monthly;
};

const fetchTopList = async (table, nameColumn, limit = 3) => {
    try {
        const rows = await db(table)
            .select(nameColumn)
            .count('* as count')
            .groupBy(nameColumn)
            .orderBy('count', 'desc')
            .limit(limit);

        return rows.map((row) => ({
            name: row[nameColumn],
            count: Number(row.count),
            subText: 'Member of Library',
        }));
    } catch (error) {
        console.warn(`Gagal mengambil top list dari ${table}:`, error.message);
        return [];
    }
};

/**
 * @swagger
 * paths:
 *   /api/dashboard:
 *     get:
 *       summary: Mendapatkan data ringkasan dashboard
 *       tags:
 *         - Dashboard
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Berhasil mendapatkan data ringkasan
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 example:
 *                   stats:
 *                     weeklyVisits: 0
 *                     activeLoans: 0
 *                     overdueCount: 0
 *                     totalBooks: 0
 *                     totalMembers: 0
 *                   monthlyData: []
 *                   topLists: {}
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const todayStr = toDateString(today);
        const oneWeekAgoStr = toDateString(oneWeekAgo);

        const [
            weeklyVisits,
            activeLoans,
            overdueCount,
            totalBooks,
            totalMembers,
            visits,
            topVisitors,
            topBorrowers,
        ] = await Promise.all([
            db('visits').count('* as count').where('date', '>=', oneWeekAgoStr).then(parseCount),
            db('transactions').count('* as count').where('status', STATUS_BORROWED).then(parseCount),
            db('transactions')
                .count('* as count')
                .where('status', STATUS_BORROWED)
                .andWhere('dueDate', '<', todayStr)
                .then(parseCount),
            db('books').count('* as count').then(parseCount),
            db('members').count('* as count').then(parseCount),
            db('visits').select('date'),
            fetchTopList('visits', 'name'),
            fetchTopList('transactions', 'studentName'),
        ]);

        res.json({
            stats: {
                weeklyVisits,
                activeLoans,
                overdueCount,
                totalBooks,
                totalMembers,
            },
            monthlyData: buildMonthlyVisits(visits),
            topLists: {
                visitors: topVisitors,
                borrowers: topBorrowers,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: 'Gagal mendapatkan data dashboard',
            detail: error.message,
        });
    }
});

module.exports = router;