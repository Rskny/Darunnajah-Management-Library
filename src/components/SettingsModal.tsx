import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Icons } from "../constants/icons";

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { user, changePassword } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "admin" | "backup">("profile");
  const [showPass, setShowPass] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_BASE = "http://localhost:9602/api/settings";

  // Warna Biru Dashboard (Navy)
  const DASHBOARD_BLUE = "#3b5998";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        if (activeSection === "admin") {
          const res = await axios.get(`${API_BASE}/admins`, config);
          setAdminList(Array.isArray(res.data) ? res.data : []);
        }
        if (activeSection === "backup") {
          const res = await axios.get(`${API_BASE}/backup-info`, config);
          if (res.data && res.data.last_backup) {
            setLastBackup(new Date(res.data.last_backup).toLocaleString("id-ID"));
          }
        }
      } catch (err) {
        console.error(err);
        setAdminList([]);
      }
    };
    if (user) fetchData();
  }, [activeSection, user]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300">
      <div 
        ref={modalRef} 
        className="w-full max-w-4xl h-[480px] rounded-[40px] overflow-hidden flex shadow-2xl bg-white border border-slate-100 animate-in zoom-in-95 duration-300"
      >
        
        {/* SIDEBAR */}
        <div className="w-72 bg-[#f8fafc] border-r p-6 pt-8 flex flex-col shrink-0">
          {/* Tulisan Settings */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-[#3b5998] animate-pulse"></div>
              <span className="font-black text-sm uppercase tracking-[0.2em] text-slate-700">Settings</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Menu icon={<Icons.Profile />} text="Profil" id="profile" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE}/>
            <Menu icon={<Icons.Security />} text="Keamanan" id="security" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE}/>
            <Menu icon={<Icons.Users />} text="Info Admin" id="admin" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE}/>
            <Menu icon={<Icons.Backup />} text="Backup" id="backup" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE}/>
          </div>

          <button onClick={onClose} className="mt-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">
            ESC untuk tutup
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* HEADER UTAMA DENGAN GELEMBUNG PUTIH (Tinggi dikurangi sedikit) */}
          <div className="relative p-8 pb-6 bg-[#3b5998] overflow-hidden shrink-0">
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-40px] left-[20%] w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {title(activeSection)}
                </h1>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-0.5">
                  Sistem Manajemen Perpustakaan
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black text-lg shadow-inner">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* ISI KONTEN (Padding atas bawah dirapatkan) */}
          <div className="flex-1 p-8 py-6 overflow-y-auto">
            <div className="max-w-md">
              {(activeSection === "profile" || activeSection === "security") && (
                <form className="space-y-4">
                  {activeSection === "profile" && (
                    <>
                      <Input label="Username" value={formData.username} color={DASHBOARD_BLUE}/>
                      <Input label="Nama Lengkap" value={formData.name} color={DASHBOARD_BLUE}/>
                      <Input label="Alamat Email" value={formData.email} color={DASHBOARD_BLUE}/>
                    </>
                  )}
                  {activeSection === "security" && (
                    <>
                      <Input label="Password Lama" type="password" color={DASHBOARD_BLUE}/>
                      <PasswordInput label="Password Baru" show={showPass} toggle={() => setShowPass(!showPass)} color={DASHBOARD_BLUE}/>
                      <PasswordInput label="Konfirmasi Password" show={showPass} toggle={() => setShowPass(!showPass)} color={DASHBOARD_BLUE}/>
                    </>
                  )}
                  <SaveButton color={DASHBOARD_BLUE}/>
                </form>
              )}

              {activeSection === "admin" && (
                 <div className="grid gap-3">
                    {adminList.map((a: any) => (
                      <div key={a.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center font-bold text-xs">
                           {a.name?.charAt(0).toUpperCase()}
                         </div>
                         <div>
                          <p className="font-bold text-slate-800 text-sm">{a.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{a.username}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              )}

              {activeSection === "backup" && (
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Terakhir Backup</p>
                    <p className="text-base font-black text-slate-700">{lastBackup || "Belum ada data"}</p>
                  </div>
                  <button className="w-full py-3.5 rounded-2xl bg-[#3b5998] text-white font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                    Backup Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* --- SUB COMPONENTS --- */

const Menu = ({ icon, text, id, active, set, color }: any) => (
  <button 
    type="button"
    onClick={() => set(id)} 
    className={`flex items-center gap-4 w-full px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
      active === id 
      ? `bg-white shadow-md shadow-slate-200 translate-x-2` 
      : "text-slate-400 hover:text-slate-600"
    }`}
    style={{ color: active === id ? color : undefined }}
  >
    <span className="text-lg">{icon}</span>
    {text}
  </button>
);

const Input = ({ label, value, color }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      onChange
      value={value} 
      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
      style={{ borderLeft: `4px solid ${color}` }}
    />
  </div>
);

const PasswordInput = ({ label, show, toggle, color }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input 
        type={show ? "text" : "password"} 
        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
        style={{ borderLeft: `4px solid ${color}` }}
      />
      <button type="button" onClick={toggle} className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-slate-600">
        {show ? "HIDE" : "SHOW"}
      </button>
    </div>
  </div>
);

const SaveButton = ({ color }: { color: string }) => (
  <button type="submit" className="w-full py-4 mt-2 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all" style={{ backgroundColor: color }}>
    Simpan Perubahan
  </button>
);

const title = (s: string) => {
  const titles: any = { profile: "Profil Admin", security: "Keamanan Akun", admin: "Database Admin", backup: "Backup Sistem" };
  return titles[s] || "";
};

export default SettingsModal;