import axios from 'axios';

// Pastikan port ini sesuai dengan port backend kamu yang sedang berjalan
const API_URL = 'http://localhost:9602/api';

const apiClient = axios.create({
    baseURL: API_URL,
});

// Request Interceptor: Menempelkan token JWT ke setiap request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Menangani error autentikasi (Token Expired/Invalid)
apiClient.interceptors.response.use(
    (response) => {
        // Jika request berhasil, kembalikan response seperti biasa
        return response;
    },
    (error) => {
        // Cek jika error berasal dari masalah autentikasi (401 atau 403)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            
            // 1. Bersihkan data sesi dari LocalStorage agar aman
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // 2. Redirect ke Landing Page ('/') daripada ke form login
            // Cek agar tidak terjadi redirect loop jika user sudah di landing page
            if (window.location.pathname !== '/') {
                window.location.href = '/'; 
            }
        }
        
        // Kembalikan error agar bisa ditangkap oleh catch() di komponen
        return Promise.reject(error);
    }
);

export default apiClient;