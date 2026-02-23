const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (token == null) return res.status(401).json({ message: 'Token tidak ditemukan (Unauthorized)' });

    jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey', (err, user) => {
        if (err) return res.status(403).json({ message: 'Akses ditolak, Token tidak valid' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
