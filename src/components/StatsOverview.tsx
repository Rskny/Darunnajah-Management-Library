import React from 'react';
import { Statistics } from "../types";

interface StatsOverviewProps {
  stats: Statistics;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards = [
    { label: 'Kunjungan Minggu Ini', value: stats.weeklyVisits, color: 'from-blue-600 to-[#3b5998]', sub: 'Siswa hadir ke perpustakaan' },
    { label: 'Peminjaman Aktif', value: stats.activeLoans, color: 'from-indigo-600 to-indigo-800', sub: 'Buku yang sedang di luar' },
    { label: 'Melebihi Tenggat', value: stats.overdueCount, color: 'from-rose-500 to-rose-700', sub: 'Segera lakukan penagihan' },
    { label: 'Total Koleksi', value: stats.totalBooks, color: 'from-slate-700 to-slate-900', sub: 'Total eksemplar tersedia' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-bl-[4rem]`}></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{card.label}</p>
          <div className="flex items-baseline space-x-3 relative z-10">
            <h4 className={`text-5xl font-black tracking-tighter bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
              {card.value}
            </h4>
          </div>
          <p className="text-slate-400 text-[10px] mt-4 font-bold italic tracking-tight">{card.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
