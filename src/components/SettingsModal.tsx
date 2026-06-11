import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Icons } from "../constants/icons";

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { user, updateUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "backup">("profile");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_BASE = "http://localhost:9602/api/settings";
  const DASHBOARD_BLUE = "#3b5998";

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.nama || user.nama_lengkap || "",
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (activeSection === "backup") {
        try {
          const res = await axios.get(`${API_BASE}/backup-info`, config);
          if (res.data && res.data.last_backup) {
            setLastBackup(new Date(res.data.last_backup).toLocaleString("id-ID"));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (user) fetchData();
  }, [activeSection, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeSection === "profile") {
        await axios.put(`${API_BASE}/profile`, {
          name: formData.name,
          username: formData.username,
          email: formData.email,
        }, config);

        // Update context & localStorage supaya langsung berubah tanpa refresh
        await updateUser({
          name: formData.name,
          username: formData.username,
          email: formData.email,
        });

        toast.success("Perubahan profil berhasil disimpan!");
      } else if (activeSection === "security") {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Konfirmasi password baru tidak cocok!");
          setLoading(false);
          return;
        }
        const res = await axios.post(`${API_BASE}/change-password-request`, {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }, config);
        toast.success(res.data.message);
        setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "", confirmPassword: "" }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Terjadi kesalahan proses");
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      const res = await axios.post(`${API_BASE}/backup`, {}, config);
      setLastBackup(new Date(res.data.time).toLocaleString("id-ID"));
      toast.success("Backup database berhasil disimulasikan!");
    } catch (err) {
      toast.error("Gagal mencadangkan database");
    }
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div ref={modalRef} className="w-full max-w-4xl h-[490px] rounded-[40px] overflow-hidden flex shadow-2xl bg-white border border-slate-100">

        {/* SIDEBAR */}
        <div className="w-72 bg-[#f8fafc] border-r p-6 pt-8 flex flex-col shrink-0">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-[#3b5998] animate-pulse"></div>
              <span className="font-black text-sm uppercase tracking-[0.2em] text-slate-700">Settings</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Menu icon={<Icons.Profile />} text="Profil" id="profile" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE} />
            <Menu icon={<Icons.Security />} text="Keamanan" id="security" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE} />
            <Menu icon={<Icons.Backup />} text="Backup" id="backup" active={activeSection} set={setActiveSection} color={DASHBOARD_BLUE} />
          </div>

          <button onClick={onClose} className="mt-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">
            Close Page
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="relative p-8 pb-6 bg-[#3b5998] overflow-hidden shrink-0">
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{title(activeSection)}</h1>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-0.5">Sistem Manajemen Perpustakaan</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black text-lg">
                {(formData.name || formData.username)?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>

          {/* ISI KONTEN */}
          <div className="flex-1 p-8 py-6 overflow-y-auto">
            <div className="max-w-md">
              {(activeSection === "profile" || activeSection === "security") && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeSection === "profile" && (
                    <>
                      <Input label="Username" value={formData.username} onChange={(v: string) => handleInputChange("username", v)} color={DASHBOARD_BLUE} />
                      <Input label="Nama Lengkap" value={formData.name} onChange={(v: string) => handleInputChange("name", v)} color={DASHBOARD_BLUE} />
                      <Input label="Alamat Email" value={formData.email} onChange={(v: string) => handleInputChange("email", v)} color={DASHBOARD_BLUE} />
                    </>
                  )}
                  {activeSection === "security" && (
                    <>
                      <Input label="Password Lama" type="password" value={formData.oldPassword} onChange={(v: string) => handleInputChange("oldPassword", v)} color={DASHBOARD_BLUE} />
                      <PasswordInput label="Password Baru" value={formData.newPassword} onChange={(v: string) => handleInputChange("newPassword", v)} show={showNewPass} toggle={() => setShowNewPass(!showNewPass)} color={DASHBOARD_BLUE} />
                      <PasswordInput label="Konfirmasi Password" value={formData.confirmPassword} onChange={(v: string) => handleInputChange("confirmPassword", v)} show={showConfirmPass} toggle={() => setShowConfirmPass(!showConfirmPass)} color={DASHBOARD_BLUE} />

                      <div className="flex gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] leading-relaxed text-slate-500 font-medium mt-1">
                        <span className="text-sm select-none">🔒</span>
                        <span><b>Catatan Keamanan:</b> Demi menjaga privasi akun, setiap riwayat perubahan kata sandi akan otomatis diinformasikan ke alamat email terdaftar Anda.</span>
                      </div>
                    </>
                  )}
                  <SaveButton color={DASHBOARD_BLUE} loading={loading} />
                </form>
              )}

              {activeSection === "backup" && (
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Terakhir Backup</p>
                    <p className="text-base font-black text-slate-700">{lastBackup || "Belum ada data"}</p>
                  </div>
                  <button onClick={handleBackup} className="w-full py-3.5 rounded-2xl bg-[#3b5998] text-white font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
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
      active === id ? `bg-white shadow-md shadow-slate-200 translate-x-2` : "text-slate-400 hover:text-slate-600"
    }`}
    style={{ color: active === id ? color : undefined }}
  >
    <span className="text-lg">{icon}</span>
    {text}
  </button>
);

const Input = ({ label, value, onChange, type = "text", color }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
      style={{ borderLeft: `4px solid ${color}` }}
    />
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggle, color }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
        style={{ borderLeft: `4px solid ${color}` }}
      />
      <button type="button" onClick={toggle} className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-slate-600">
        {show ? "HIDE" : "SHOW"}
      </button>
    </div>
  </div>
);

const SaveButton = ({ color, loading }: { color: string; loading: boolean }) => (
  <button type="submit" disabled={loading} className="w-full py-4 mt-2 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all" style={{ backgroundColor: color }}>
    {loading ? "Memproses..." : "Simpan Perubahan"}
  </button>
);

const title = (s: string) => {
  const titles: any = { profile: "Profil Admin", security: "Keamanan Akun", backup: "Backup Sistem" };
  return titles[s] || "";
};

export default SettingsModal;
