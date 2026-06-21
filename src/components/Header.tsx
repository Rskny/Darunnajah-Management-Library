import React, { useState, useEffect, useRef } from "react";
import SettingsModal from "./SettingsModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Icons } from "../constants/icons";
import { Admin } from "../types";

const Header: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");

  const { user, logout, updateUser } = useAuth();
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

  const getPlaceholder = () => {
    if (path.includes("books")) return "Cari buku...";
    if (path.includes("anggota")) return "Cari anggota...";
    return "Cari...";
  };

  const hideSearch = path.includes("laporan");
  const initial = safeUser?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4 text-slate-700">
        <div className="p-3 rounded-2xl bg-slate-100">
          {path.includes("books") ? <Icons.Books /> : <Icons.Home />}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {!hideSearch && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={getPlaceholder()}
            className="pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 w-72 text-sm"
          />
        )}

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-1.5 group"
          >
            <span className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center group-hover:bg-slate-900 transition-all">
              {initial}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                openMenu ? "rotate-180" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.293l3.71-4.06a.75.75 0 1 1 1.08 1.04l-4.25 4.65a.75.75 0 0 1-1.08 0l-4.25-4.65a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white shadow-2xl rounded-3xl z-[9999] p-2 border border-slate-100">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  setOpenSettings(true);
                }}
                className="w-full p-3 text-sm text-left hover:bg-slate-50 rounded-2xl font-bold text-slate-600 flex items-center gap-2"
              >
                <span className="text-slate-600">
                  <Icons.Settings />
                </span>{" "}
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full p-3 text-sm text-rose-500 text-left hover:bg-rose-50 rounded-2xl font-bold flex items-center gap-2"
              >
                <span className="text-rose-500">
                  <Icons.Logout />
                </span>{" "}
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {openSettings && (
        <SettingsModal
          onClose={() => setOpenSettings(false)}
          onUpdate={(data) => {
            updateUser(data);
            setOpenSettings(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;