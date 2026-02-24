require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./modules/auth');
const booksRoutes = require('./modules/books');
const membersRoutes = require('./modules/members');
const transactionsRoutes = require('./modules/transactions');
const visitsRoutes = require('./modules/visits');
const systemRoutes = require('./modules/system');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi API Dokumentasi (Swagger)
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
    apis: ['./src/modules/*.js'], // Ambil semua komentar anotasi Swagger dari modules
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ==========================================
// DAFTARKAN SEMUA ROUTE UTAMA
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/system', systemRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi Swagger tersedia di http://localhost:${PORT}/api-docs`);
});
