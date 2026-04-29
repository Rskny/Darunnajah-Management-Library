import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import DataAnggota from "./pages/DataAnggota";
import Visits from "./pages/Visits";
import Peminjaman from "./pages/Peminjaman";
import Reports from "./pages/Reports";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import RiwayatKunjungan from "./pages/RiwayatKunjungan";
import ResetPassword from './pages/ResetPassword'; // Import halaman baru

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Fungsi untuk mengecek apakah user sudah login
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Komponen Pelindung Rute
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    // Jika tidak login, arahkan ke Landing Page (/)
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* TAMBAHAN: Rute Reset Password (Publik agar bisa diakses dari email) */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rute Privat (Dibungkus ProtectedRoute + DashboardLayout) */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} 
      />
      <Route 
        path="/visits" 
        element={<ProtectedRoute><DashboardLayout><Visits /></DashboardLayout></ProtectedRoute>} 
      />
      <Route 
        path="/books" 
        element={<ProtectedRoute><DashboardLayout><Books /></DashboardLayout></ProtectedRoute>} 
      />
      <Route 
        path="/anggota" 
        element={<ProtectedRoute><DashboardLayout><DataAnggota /></DashboardLayout></ProtectedRoute>} 
      />
      <Route 
        path="/peminjaman" 
        element={<ProtectedRoute><DashboardLayout><Peminjaman /></DashboardLayout></ProtectedRoute>} 
      />
      <Route
        path="/riwayat-transaksi"
        element={<ProtectedRoute><DashboardLayout><RiwayatTransaksi /></DashboardLayout></ProtectedRoute>}
      />
      <Route
        path="/riwayat-kunjungan"
        element={<ProtectedRoute><DashboardLayout><RiwayatKunjungan /></DashboardLayout></ProtectedRoute>}
      />
      <Route 
        path="/reports" 
        element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} 
      />

      {/* Jika rute tidak ditemukan */}
      <Route 
        path="*" 
        element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}