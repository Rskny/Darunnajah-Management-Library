require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Semua Route Modul
const authRoutes = require('./modules/auth');
const booksRoutes = require('./modules/books');
const membersRoutes = require('./modules/members');
const transactionsRoutes = require('./modules/transactions');
const visitsRoutes = require('./modules/visits');
const systemRoutes = require('./modules/system');
const dashboardRoutes = require('./modules/dashboard');
const reportsRoutes = require('./modules/reports');
const settingsRoutes = require('./modules/settings'); 

const app = express();

// Middleware Utama
app.use(cors());
app.use(express.json());

// ==========================================
// KONFIGURASI SWAGGER (API DOCUMENTATION)
// ==========================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistem Perpustakaan Darunnajah',
            version: '1.0.0',
            description: 'Dokumentasi REST API dengan Express.js untuk Perpustakaan',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
    },
    // Pastikan path ini benar mengarah ke folder modules kamu agar rute forgot-password muncul di Swagger
    apis: ['./src/modules/*.js'], 
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ==========================================
// DAFTARKAN SEMUA ROUTE UTAMA
// ==========================================

// Rute ini sekarang mencakup: /login, /register, /admins, dan /forgot-password
app.use('/api/auth', authRoutes); 

app.use('/api/books', booksRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);

// ==========================================
// JALANKAN SERVER
// ==========================================
const PORT = process.env.PORT || 9602; // Sesuaikan dengan port yang kamu pakai di screenshot (9602)
app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 Server Backend Berjalan di http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`================================================`);
});