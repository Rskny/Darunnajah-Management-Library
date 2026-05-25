import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // Import ikon mata
import LogoDarunnajah from "../assets/logo darunnajah.png"; // Sesuaikan path logo

export default function RegisterModal({ onClose, onSwitch }: any) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async () => {
    if (!form.name || !form.username || !form.email || !form.password || !form.confirmPassword) {
      return alert("Isi semua field");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Password dan Konfirmasi Password tidak cocok!");
    }

    try {
      await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password
      });
      alert("Register berhasil!");
      onSwitch();
    } catch (err: any) {
      alert(err.message || "Register gagal!");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Kontainer Modal */}
      <div className="relative bg-white p-10 rounded-[2.5rem] w-full max-w-sm space-y-6 shadow-2xl z-10">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 text-slate-300 hover:text-slate-500 transition-colors text-xl"
        >
          ✕
        </button>

        {/* Header dengan Logo */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <img src={LogoDarunnajah} alt="Logo" className="w-8 h-8 object-contain" />
            <h2 className="font-black text-2xl text-slate-800">Register</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">Buat akun Darunnajah Library</p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <input 
            placeholder="Nama Lengkap" 
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none transition text-sm"
            onChange={e => setForm({ ...form, name: e.target.value })} 
          />
          <input 
            placeholder="Username" 
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none transition text-sm"
            onChange={e => setForm({ ...form, username: e.target.value })} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none transition text-sm"
            onChange={e => setForm({ ...form, email: e.target.value })} 
          />
          
          {/* Password Fields dengan Toggle */}
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password" 
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none transition text-sm"
              onChange={e => setForm({ ...form, password: e.target.value })} 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-3.5 text-slate-400 hover:text-slate-600">
              {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="relative">
            <input 
              type={showConfirm ? "text" : "password"} 
              placeholder="Konfirmasi Password" 
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none transition text-sm"
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} 
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-3.5 text-slate-400 hover:text-slate-600">
              {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Tombol Submit */}
        <button 
          onClick={submit} 
          className="w-full bg-[#1F3A5F] hover:bg-[#162a45] text-white py-3.5 rounded-2xl font-bold shadow-lg transition active:scale-[0.98]"
        >
          Create Account
        </button>

        {/* Footer Switch */}
        <p className="text-xs text-center text-slate-500 font-medium pt-2">
          Sudah punya akun?{" "}
          <span onClick={onSwitch} className="text-blue-600 font-bold cursor-pointer hover:underline">
            Login
          </span>
        </p>

      </div>
    </div>
  );
}