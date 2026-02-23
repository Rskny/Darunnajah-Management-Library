import React, { useState } from "react";
import SettingsModal from "./SettingsModal";

interface HeaderProps {
  user?: {
    name?: string;
    username?: string;
    email?: string;
  };
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {

  const [open, setOpen] = useState(false);

  const safeUser = user ?? {
    name: "Admin",
    username: "admin",
    email: "admin@mail.com"
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b">

      {/* LEFT */}
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
          onClick={() => onLogout?.()}
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
          onUpdate={(data) => console.log("update", data)}
        />
      )}
    </header>
  );
};

export default Header;
