import React, { useState, useEffect, useRef } from "react";
import SettingsModal from "./SettingsModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Icons } from "../constants/icons";

const Header: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const menuRef = useRef<HTMLDivElement>(null);

  const safeUser = user ?? {
    name: "Admin",
    username: "admin",
    email: "admin@mail.com",
    avatar: ""
  };

  /* CLOSE DROPDOWN OUTSIDE */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* SEARCH PLACEHOLDER */
  const getPlaceholder = () => {
    if (path.includes("books")) return "Cari buku...";
    if (path.includes("anggota")) return "Cari anggota...";
    if (path.includes("peminjaman")) return "Cari peminjaman...";
    if (path.includes("kunjungan")) return "Cari kunjungan...";
    if (path.includes("riwayat")) return "Cari riwayat...";
    return "Cari...";
  };

  const hideSearch = path.includes("laporan");

  /* SYNC URL SEARCH */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearch(q);
  }, [location.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (search) params.set("search", search);
      else params.delete("search");
      navigate(`${path}?${params.toString()}`, { replace: true });
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  /* ICON BASED ON PAGE */
  const getPageIcon = () => {
    if (path.includes("books")) return <Icons.Books />;
    if (path.includes("anggota")) return <Icons.Users />;
    if (path.includes("riwayat")) return <Icons.History />;
    if (path.includes("peminjaman")) return <Icons.Upload />;
    return <Icons.Home />;
  };

  const initial =
    safeUser?.name?.charAt(0)?.toUpperCase() ||
    safeUser?.username?.charAt(0)?.toUpperCase() ||
    "A";

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200 shadow-sm relative z-40">

      {/* LEFT ICON TITLE */}
      <div className="flex items-center gap-4 text-slate-700">
        <div className="p-3 rounded-2xl bg-slate-100">
          {getPageIcon()}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* SEARCH */}
        {!hideSearch && (
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Icons.Search />
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={getPlaceholder()}
              className="pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 outline-none w-72 transition text-sm"
            />
          </div>
        )}

        {/* PROFILE SECTION */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-slate-100 transition"
          >
            {safeUser.avatar ? (
              <img
                src={safeUser.avatar}
                alt="profile"
                className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-md">
                {initial}
              </div>
            )}

            <span className={`text-[10px] text-slate-400 transition-transform duration-300 ${openMenu ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {/* DROPDOWN MENU */}
          {openMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in zoom-in duration-200">

              <div className="px-6 py-5 bg-slate-50/50">
                <p className="font-bold text-slate-900 text-sm truncate">
                  {safeUser.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                  {safeUser.email}
                </p>
              </div>

              <div className="border-t border-slate-100"/>

              <div className="p-2">
                <button
                  onClick={()=>{
                    setOpenMenu(false);
                    setOpenSettings(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition"
                >
                  <span className="text-slate-400">
                    <Icons.Settings />
                  </span>
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-2xl transition"
                >
                  <span className="text-rose-400">
                    <Icons.Logout />
                  </span>
                  Logout
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {openSettings && (
        <SettingsModal onClose={() => setOpenSettings(false)} />
      )}
    </header>
  );
};

export default Header;