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

export default function Dashboard() {
  const [stats, setStats] = useState({
    weeklyVisits: 0,
    activeLoans: 0,
    overdueCount: 0,
    totalBooks: 0,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyVisits[]>([]);

  const loadData = async () => {
    try {
      const res = await apiClient.get("/dashboard");
      setStats(res.data.stats);
      setMonthlyData(res.data.monthlyData);
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

      {/* CHART BOX */}
      <div className="bg-white rounded-3xl p-8 shadow border border-slate-200">

        <h2 className="text-lg font-bold mb-6 text-slate-800">
          Statistik Kunjungan Bulanan
        </h2>

        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData}>

              {/* GRID */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              {/* X AXIS */}
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />

              {/* Y AXIS */}
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                tickLine={false}
              />

              <Tooltip />
              <Legend />

              {/* BAR */}
              <Bar
                dataKey="visits"
                radius={[10, 10, 0, 0]}
                fill="url(#blueGradient)"
              />

              {/* GRADIENT */}
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
    </div>
  );
}