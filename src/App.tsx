import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Halaman
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
import ResetPassword from './pages/ResetPassword';

// Import Komponen
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Fungsi Cek Auth
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Proteksi Rute
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Layout Dashboard yang sudah diperbaiki agar tidak bergeser saat scroll
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      {/* Sidebar - Fix di sisi kiri */}
      <Sidebar />
      
      {/* Wrapper Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header - Fix di atas */}
        <Header /> 
        
        {/* Main Content - Hanya bagian ini yang akan scroll */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <Routes>
        {/* RUTE PUBLIK */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/reset-password" 
          element={
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
              <ResetPassword onClose={() => window.history.back()} />
            </div>
          } 
        />

        {/* RUTE PRIVAT */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/visits" element={<ProtectedRoute><DashboardLayout><Visits /></DashboardLayout></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><DashboardLayout><Books /></DashboardLayout></ProtectedRoute>} />
        <Route path="/anggota" element={<ProtectedRoute><DashboardLayout><DataAnggota /></DashboardLayout></ProtectedRoute>} />
        <Route path="/peminjaman" element={<ProtectedRoute><DashboardLayout><Peminjaman /></DashboardLayout></ProtectedRoute>} />
        <Route path="/riwayat-transaksi" element={<ProtectedRoute><DashboardLayout><RiwayatTransaksi /></DashboardLayout></ProtectedRoute>} />
        <Route path="/riwayat-kunjungan" element={<ProtectedRoute><DashboardLayout><RiwayatKunjungan /></DashboardLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />

        <Route path="*" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}