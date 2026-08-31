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
    { label: 'Total Anggota', value: stats.totalMembers, color: 'from-emerald-600 to-teal-800', sub: 'Anggota terdaftar di sistem' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-5 rounded-bl-[3rem]`}></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-3">{card.label}</p>
          <div className="flex items-baseline space-x-2 relative z-10">
            <h4 className={`text-4xl font-black tracking-tighter bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
              {card.value ?? 0}
            </h4>
          </div>
          <p className="text-slate-400 text-[10px] mt-3 font-bold italic tracking-tight">{card.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;