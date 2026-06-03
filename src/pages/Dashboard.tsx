import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import StatsOverview from "../components/StatsOverview";
import TopUsersList from "../components/TopUsersList"; // <-- Import komponen baru
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface MonthlyVisits {
  month: string;
  visits: number;
}

interface TopUser {
  name: string;
  count: number;
  subText: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    weeklyVisits: 0,
    activeLoans: 0,
    overdueCount: 0,
    totalBooks: 0,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyVisits[]>([]);
  // Wadah data baru untuk menampung data peringkat dari backend
  const [topVisitors, setTopVisitors] = useState<TopUser[]>([]);
  const [topBorrowers, setTopBorrowers] = useState<TopUser[]>([]);

  const loadData = async () => {
    try {
      const res = await apiClient.get("/dashboard");
      setStats(res.data.stats);
      setMonthlyData(res.data.monthlyData || []);
      
      // Mengambil data top lists dengan aman jika disediakan oleh backend
      if (res.data.topLists) {
        setTopVisitors(res.data.topLists.visitors || []);
        setTopBorrowers(res.data.topLists.borrowers || []);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("visitsUpdated", loadData);
    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("visitsUpdated", loadData);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* STATS */}
      <StatsOverview stats={stats} />

      {/* BARIS 1: Kunjungan Bulanan (Kiri) + Siswa Paling Rajin Berkunjung (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KIRI: Grafik Kunjungan */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow border border-slate-200">
          <h2 className="text-lg font-bold mb-6 text-slate-800">
            Statistik Kunjungan Bulanan
          </h2>

          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                  axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                  tickLine={false}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" name="Kunjungan" radius={[10, 10, 0, 0]} fill="url(#blueGradient)" />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm italic">
              Belum ada data kunjungan bulan ini.
            </div>
          )}
        </div>

        {/* KANAN: Rekapan Peringkat Kunjungan */}
        <TopUsersList title="Pengunjung Teraktif" data={topVisitors} />
      </div>

      {/* BARIS 2: Transaksi Peminjaman (Kiri) + Siswa Paling Banyak Pinjam Buku (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KIRI: Grafik Transaksi */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow border border-slate-200">
          <h2 className="text-lg font-bold mb-6 text-slate-800">
            Statistik Transaksi Peminjaman
          </h2>

          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                  axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                  tickLine={false}
                />
                <Tooltip />
                <Legend />
                {/* Diwarnai dengan Ungu Gradient agar berbeda dengan grafik kunjungan */}
                <Bar dataKey="visits" name="Transaksi Peminjaman" radius={[10, 10, 0, 0]} fill="url(#purpleGradient)" />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8be6fa" />
                    <stop offset="100%" stopColor="#076179" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm italic">
              Belum ada data transaksi bulan ini.
            </div>
          )}
        </div>

        {/* KANAN: Rekapan Peringkat Peminjaman */}
        <TopUsersList title="Peminjam Terbanyak" data={topBorrowers} />
      </div>

    </div>
  );
}