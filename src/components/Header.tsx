import React, { useState } from "react";
import SettingsModal from "./SettingsModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const safeUser = user ?? {
    name: "Admin",
    username: "admin",
    email: "admin@mail.com"
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect ke landing/login
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b">

      {/* TITLE */}
      <h1 className="text-lg font-bold text-slate-800">
        Dashboard Perpustakaan
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* USER BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {safeUser.name?.charAt(0)}
          </div>

          <span className="font-semibold text-sm text-slate-700">
            {safeUser.name}
          </span>
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm font-semibold"
        >
          Logout
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <SettingsModal
          user={safeUser}
          onClose={() => setOpen(false)}
          onUpdate={() => {}}
        />
      )}
    </header>
  );
};

export default Header;