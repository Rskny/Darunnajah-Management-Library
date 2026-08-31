import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Book, FileText, Clock, ClipboardList } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { Icons } from "../constants/icons";
import { Admin } from "../types";

import LogoDarunnajah from "../assets/logo darunnajah.png";

const Sidebar: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/visits", label: "List Kunjungan", icon: Users },
    { path: "/books", label: "Katalog Buku", icon: Book },
    { path: "/anggota", label: "Data Anggota", icon: Users },
    { path: "/peminjaman", label: "Peminjaman", icon: ClipboardList },
    { path: "/riwayat-transaksi", label: "Riwayat Transaksi", icon: Clock },
    { path: "/riwayat-kunjungan", label: "Riwayat Kunjungan", icon: Clock },
    { path: "/reports", label: "Report & Export", icon: FileText },
  ];

  return (
    <>
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen hidden lg:flex shrink-0 print:hidden">

        {/* LOGO AREA - Direnggangkan sedikit padding-nya */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3 text-[#3b5998]">
            <div className="bg-white p-2 rounded-full shadow-md shadow-blue-100/50 w-12 h-12 flex items-center justify-center border border-slate-50 shrink-0">
              <img 
                src={LogoDarunnajah} 
                alt="Logo Darunnajah" 
                className="w-8 h-8 object-contain" 
              />
            </div>

            <span className="font-extrabold text-xl tracking-tight text-[#1F3A5F]">
              Darunnajah
            </span>
          </div>
        </div>

        {/* MENU - Jarak antar item (space-y-1) & padding (py-2.5) dirapatkan agar muat presisi */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#3b5998] text-white shadow-lg shadow-blue-900/10 scale-[1.01]"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`
                }
              >
                <Icon size={18} />
                <span className="font-bold text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER - Padding dirapatkan */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
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
          onClose={() => setOpenSettings(false)}
          onUpdate={(data: Admin) => console.log("Update:", data)}
        />
      )}
    </>
  );
};

export default Sidebar;