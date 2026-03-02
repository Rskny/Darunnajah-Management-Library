import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { user, users, updateUser, changePassword } = useAuth();
  if (!user) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<
    "profile" | "security" | "admin" | "backup"
  >("profile"); // hapus 'delete'

  const [showPass, setShowPass] = useState(false);

  /* ESC CLOSE */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* CLICK OUTSIDE CLOSE */
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === "profile") {
      updateUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
      });
      alert("Profil diperbarui");
      return;
    }
    if (activeSection === "security") {
      if (!formData.oldPassword) return alert("Masukkan password lama");
      if (formData.newPassword !== formData.confirmPassword)
        return alert("Konfirmasi password salah");
      const ok = changePassword(formData.oldPassword, formData.newPassword);
      if (!ok) return alert("Password lama salah");
      alert("Password diganti");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="w-full max-w-4xl rounded-3xl overflow-hidden flex shadow-2xl bg-white"
      >
        {/* SIDEBAR */}
        <div className="w-64 border-r p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-6">Pengaturan</h2>

          {/* ICONS POLOS, WARNA AKTIF DENIM */}
          <Menu icon="👤" text="Profil" id="profile" active={activeSection} set={setActiveSection}/>
          <Menu icon="🔒" text="Keamanan" id="security" active={activeSection} set={setActiveSection}/>
          <Menu icon="🛡" text="Info Admin" id="admin" active={activeSection} set={setActiveSection}/>
          <Menu icon="💾" text="Backup" id="backup" active={activeSection} set={setActiveSection}/>

          <button
            onClick={onClose}
            className="mt-auto text-xs text-slate-400 hover:text-black"
          >
            ESC untuk tutup
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 max-h-[80vh] overflow-y-auto">
          {/* HEADER */}
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">{title(activeSection)}</h1>
              <p className="text-sm text-slate-400">Pengaturan akun sistem</p>
            </div>
            <Avatar name={user.name}/>
          </div>

          {/* FORM */}
          {(activeSection === "profile" || activeSection === "security") && (
            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
              {activeSection === "profile" && (
                <>
                  <Input label="Username" value={formData.username} onChange={v => setFormData({ ...formData, username: v })}/>
                  <Input label="Nama" value={formData.name} onChange={v => setFormData({ ...formData, name: v })}/>
                  <Input label="Email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })}/>
                </>
              )}

              {activeSection === "security" && (
                <>
                  <Input label="Password Lama" type="password" value={formData.oldPassword} onChange={v => setFormData({ ...formData, oldPassword: v })}/>
                  <PasswordInput label="Password Baru" value={formData.newPassword} show={showPass} toggle={() => setShowPass(!showPass)} onChange={v => setFormData({ ...formData, newPassword: v })}/>
                  <PasswordInput label="Konfirmasi Password" value={formData.confirmPassword} show={showPass} toggle={() => setShowPass(!showPass)} onChange={v => setFormData({ ...formData, confirmPassword: v })}/>
                </>
              )}

              <SaveButton/>
            </form>
          )}

          {activeSection === "admin" && (
            <div className="space-y-4">
              <Info text={`Total admin: ${users.length}`}/>
              {users.map(a => (
                <div key={a.id} className="p-4 border rounded-xl">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm text-slate-500">{a.username}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === "backup" && <BackupPanel/>}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

/* ---------- COMPONENTS ---------- */
const Menu = ({ icon, text, id, active, set }: any) => (
  <button
    onClick={() => set(id)}
    className={`flex items-center gap-3 w-full px-4 py-3 mb-2 rounded-xl font-semibold transition
      ${active === id ? "bg-[#1560bd] text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
    <span>{icon}</span>
    {text}
  </button>
);

const title = (s: string) => {
  if (s === "profile") return "Profil Admin";
  if (s === "security") return "Keamanan";
  if (s === "admin") return "Data Admin";
  if (s === "backup") return "Backup Sistem";
  return "";
};

const Avatar = ({ name }: { name: string }) => (
  <div className="w-10 h-10 rounded-xl bg-[#1560bd]/20 flex items-center justify-center font-bold text-[#1560bd]">
    {name?.charAt(0)}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="text-xs text-slate-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#1560bd] outline-none"
    />
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggle }: any) => (
  <div>
    <label className="text-xs text-slate-400">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#1560bd] outline-none"
      />
      <span onClick={toggle} className="absolute right-3 top-3 cursor-pointer">
        {show ? "🙈" : "👁"}
      </span>
    </div>
  </div>
);

const SaveButton = () => (
  <button className="w-full py-3 rounded-xl bg-[#1560bd] text-white font-semibold hover:bg-[#125495]">
    Simpan Perubahan
  </button>
);

const Info = ({ text }: { text: string }) => (
  <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700 text-sm">⚠ {text}</div>
);

const BackupPanel = () => {
  const [time, setTime] = useState<string | null>(null);
  return (
    <div className="space-y-5 max-w-md">
      <Info text="Backup melindungi seluruh data sistem"/>
      <div className="p-4 border rounded-xl">
        {time ? `Backup terakhir: ${time}` : "Belum pernah backup"}
      </div>
      <button
        onClick={() => setTime(new Date().toLocaleString())}
        className="w-full py-3 rounded-xl bg-[#1560bd] text-white font-semibold"
      >
        Backup Sekarang
      </button>
    </div>
  );
};