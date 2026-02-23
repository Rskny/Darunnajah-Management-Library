import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import DataAnggota from "./pages/DataAnggota";
import Visits from "./pages/Visits";
import Peminjaman from "./pages/Peminjaman";
import Reports from "./pages/Reports";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import RiwayatKunjungan from "./pages/RiwayatKunjungan";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

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
      <Route path="/" element={<Landing />} />

      <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/visits" element={<DashboardLayout><Visits /></DashboardLayout>} />
      <Route path="/books" element={<DashboardLayout><Books /></DashboardLayout>} />
      <Route path="/anggota" element={<DashboardLayout><DataAnggota /></DashboardLayout>} />
      <Route path="/peminjaman" element={<DashboardLayout><Peminjaman /></DashboardLayout>} />
      <Route
  path="/riwayat-transaksi"
  element={<DashboardLayout><RiwayatTransaksi /></DashboardLayout>}
/>
    <Route
  path="/riwayat-kunjungan"
  element={<DashboardLayout><RiwayatKunjungan /></DashboardLayout>}
/>
      <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
