import React, { useState, useEffect, useRef } from "react";
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

  // Base URL Backend kamu
  const API_BASE = "http://localhost:5000/api/settings";

  /* EFFECT: Ambil data dengan Token Authentication */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Pastikan token tersimpan di sini
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        if (activeSection === "admin") {
          const res = await axios.get(`${API_BASE}/admins`, config);
          // Pastikan res.data adalah array, jika tidak set ke array kosong
          setAdminList(Array.isArray(res.data) ? res.data : []);
        }

        if (activeSection === "backup") {
          const res = await axios.get(`${API_BASE}/backup-info`, config);
          if (res.data && res.data.last_backup) {
            setLastBackup(new Date(res.data.last_backup).toLocaleString("id-ID"));
          } else {
            setLastBackup(null);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data dari server", err);
        setAdminList([]); // Mencegah crash jika error
      }
    };

    if (user) fetchData();
  }, [activeSection, user]);

  /* FUNGSI BACKUP */
  const handleBackupNow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/backup`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        setLastBackup(new Date(res.data.time).toLocaleString("id-ID"));
        alert("Sistem berhasil di-backup ke database!");
      }
    } catch (err) {
      alert("Proses backup gagal. Cek koneksi server atau hak akses admin.");
    } finally {
      setLoading(false);
    }
  };

  /* CLOSE LOGIC (ESC & Click Outside) */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const click = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", esc);
    document.addEventListener("mousedown", click);
    return () => {
      window.removeEventListener("keydown", esc);
      document.removeEventListener("mousedown", click);
    };
  }, [onClose]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === "security") {
      if (!formData.oldPassword) return alert("Masukkan password lama");
      if (formData.newPassword !== formData.confirmPassword) return alert("Konfirmasi password salah");
      const ok = changePassword(formData.oldPassword, formData.newPassword);
      if (!ok) return alert("Password lama salah");
      alert("Password diganti");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div ref={modalRef} className="w-full max-w-4xl rounded-[32px] overflow-hidden flex shadow-2xl bg-white border border-slate-200">
        
        {/* SIDEBAR */}
        <div className="w-72 bg-slate-50/50 border-r p-8 flex flex-col">
          <h2 className="font-bold text-xl text-slate-800 mb-8 px-2">Settings</h2>
          <div className="flex flex-col gap-2">
            <Menu icon={<Icons.Profile />} text="Profil" id="profile" active={activeSection} set={setActiveSection}/>
            <Menu icon={<Icons.Security />} text="Keamanan" id="security" active={activeSection} set={setActiveSection}/>
            <Menu icon={<Icons.Users />} text="Info Admin" id="admin" active={activeSection} set={setActiveSection}/>
            <Menu icon={<Icons.Backup />} text="Backup" id="backup" active={activeSection} set={setActiveSection}/>
          </div>
          <button onClick={onClose} className="mt-auto text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors px-2">
            ESC untuk tutup
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-10 max-h-[85vh] overflow-y-auto bg-white">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title(activeSection)}</h1>
              <p className="text-sm text-slate-400 mt-1 font-medium">Manajemen pengaturan akun sistem</p>
            </div>
            <Avatar name={user.name}/>
          </div>

          <div className="max-w-md">
            {(activeSection === "profile" || activeSection === "security") && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeSection === "profile" && (
                  <>
                    <Input label="Username" value={formData.username} onChange={(v: string) => setFormData({ ...formData, username: v })}/>
                    <Input label="Nama Lengkap" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })}/>
                    <Input label="Alamat Email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })}/>
                  </>
                )}
                {activeSection === "security" && (
                  <>
                    <Input label="Password Lama" type="password" value={formData.oldPassword} onChange={(v: string) => setFormData({ ...formData, oldPassword: v })}/>
                    <PasswordInput label="Password Baru" value={formData.newPassword} show={showPass} toggle={() => setShowPass(!showPass)} onChange={(v: string) => setFormData({ ...formData, newPassword: v })}/>
                    <PasswordInput label="Konfirmasi Password" value={formData.confirmPassword} show={showPass} toggle={() => setShowPass(!showPass)} onChange={(v: string) => setFormData({ ...formData, confirmPassword: v })}/>
                  </>
                )}
                <SaveButton />
              </form>
            )}

            {/* INFO ADMIN - SAFE RENDER */}
            {activeSection === "admin" && (
              <div className="space-y-4">
                <Info text={`Terdapat ${Array.isArray(adminList) ? adminList.length : 0} administrator terdaftar.`}/>
                <div className="grid gap-3">
                  {Array.isArray(adminList) && adminList.map((a: any) => (
                    <div key={a.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 transition-hover hover:border-slate-300">
                       <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center font-bold text-[#1560bd] text-xs shadow-sm">
                         {a.name?.charAt(0).toUpperCase()}
                       </div>
                       <div>
                        <p className="font-bold text-slate-800 text-sm">{a.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{a.username} • {a.email}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BACKUP PANEL */}
            {activeSection === "backup" && (
              <div className="space-y-6">
                <Info text="Backup rutin sangat disarankan untuk mencegah kehilangan data akibat kegagalan sistem."/>
                <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center">
                  <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-tight">Status Terakhir</p>
                  <p className="font-bold text-slate-700">
                    {lastBackup ? lastBackup : "Belum ada riwayat backup"}
                  </p>
                </div>
                <button
                  onClick={handleBackupNow}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#1560bd] hover:bg-[#125495] shadow-blue-100"}`}
                >
                  {loading ? "Sedang Memproses..." : "Backup Sekarang"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB COMPONENTS TETAP SAMA --- */
const Menu = ({ icon, text, id, active, set }: any) => (
  <button onClick={() => set(id)} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 ${active === id ? "bg-[#1560bd] text-white shadow-lg shadow-blue-200 translate-x-1" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
    <span className={`${active === id ? "text-white" : "text-slate-400"}`}>{icon}</span>
    {text}
  </button>
);

const title = (s: string) => {
  const titles: any = { profile: "Profil Admin", security: "Keamanan Akun", admin: "Database Admin", backup: "Backup Sistem" };
  return titles[s] || "";
};

const Avatar = ({ name }: { name: string }) => (
  <div className="w-12 h-12 rounded-2xl bg-[#1560bd] text-white flex items-center justify-center font-bold text-lg shadow-xl shadow-blue-100">
    {name?.charAt(0).toUpperCase()}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#1560bd] outline-none transition-all font-medium text-slate-700"/>
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggle }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#1560bd] outline-none transition-all font-medium text-slate-700"/>
      <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold hover:text-[#1560bd] transition-colors">{show ? "HIDE" : "SHOW"}</button>
    </div>
  </div>
);

const SaveButton = () => (
  <button type="submit" className="w-full py-4 mt-4 rounded-2xl bg-[#1560bd] text-white font-bold shadow-lg shadow-blue-100 hover:bg-[#125495] transition-all active:scale-95">
    Simpan Perubahan
  </button>
);

const Info = ({ text }: { text: string }) => (
  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium leading-relaxed flex gap-3">
    <span>⚠️</span> {text}
  </div>
);

export default SettingsModal;