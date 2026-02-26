import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Book, FileText, Clock, ClipboardList } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { Icons } from "../constants/icons";


const Sidebar: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/visits", label: "List Kunjungan", icon: Users },
    { path: "/books", label: "Katalog Buku", icon: Book },
    { path: "/anggota", label: "Data Anggota", icon: Users },
    { path: "/peminjaman", label: "Peminjaman", icon: ClipboardList },
    { path: "/riwayat-transaksi", label: "Riwayat Peminjaman", icon: Clock },
    { path: "/riwayat-kunjungan", label: "Riwayat Kunjungan", icon: Clock },
    { path: "/reports", label: "Laporan PDF", icon: FileText },
  ];

  return (
    <>
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen hidden lg:flex shrink-0 print:hidden">

        {/* LOGO */}
        <div className="p-10">
          <div className="flex items-center space-x-4 text-[#3b5998]">
            <div className="bg-[#3b5998] p-2.5 rounded-2xl shadow-lg shadow-blue-100">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              Darunnajah
            </span>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${
                    isActive
                      ? "bg-[#3b5998] text-white shadow-xl shadow-blue-900/10 scale-[1.02]"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-bold text-sm">{item.label}</span>
              </NavLink>
            );
          })}

      
        </nav>

        {/* FOOTER */}
        <div className="p-8 mt-auto">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Library Server
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Versi 2.5.0-Denim
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MODAL SETTINGS */}
      {openSettings && (
        <SettingsModal
          user={{
            name: "Admin",
            username: "admin",
            email: "admin@mail.com",
          }}
          onClose={() => setOpenSettings(false)}
          onUpdate={(data) => console.log("Update:", data)}
        />
      )}
    </>
  );
};

export default Sidebar;
