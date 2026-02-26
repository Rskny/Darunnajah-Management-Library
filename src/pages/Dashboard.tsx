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

    // realtime update kalau visits berubah
    window.addEventListener("visitsUpdated", loadData);
    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("visitsUpdated", loadData);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  return (
    <div className="p-8 space-y-8">

      <StatsOverview stats={stats} />

      <div className="bg-white rounded-3xl p-8 shadow">
        <h2 className="text-lg font-bold mb-4">
          Statistik Kunjungan Bulanan
        </h2>

        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="visits"
                radius={[8, 8, 0, 0]}
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