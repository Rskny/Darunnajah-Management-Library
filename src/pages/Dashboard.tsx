import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import StatsOverview from "../components/StatsOverview";
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

interface HistoryItem {
  id: number;
  date: string;
  category: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    weeklyVisits: 0,
    activeLoans: 0,
    overdueCount: 0,
    totalBooks: 0,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyVisits[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiClient.get('/dashboard');
        setStats(response.data.stats);
        setMonthlyData(response.data.monthlyData);
      } catch (err) {
        console.error("Gagal mendapatkan data dashboard:", err);
      }
    };

    loadData();

    // reload data setiap page difokuskan
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);

  }, []);


  return (
    <div className="p-8 space-y-8">
      {/* Statistik Kartu */}
      <StatsOverview stats={stats} />

      {/* Chart Kunjungan Bulanan */}
      <div className="bg-white rounded-3xl p-8 shadow">
        <h2 className="text-lg font-bold mb-4">Statistik Kunjungan Bulanan</h2>

        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.6} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white shadow-lg rounded-lg px-3 py-2 border border-slate-200">
                        <p className="text-xs text-slate-500">
                          Bulan: {payload[0].payload.month}
                        </p>
                        <p className="text-sm font-bold text-blue-600">
                          Kunjungan: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend />
              <Bar
                dataKey="visits"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                label={{
                  position: "top",
                  fill: "#1E40AF",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-sm italic">
            Belum ada data kunjungan bulan ini.
          </p>
        )}
      </div>
    </div>
  );
}
