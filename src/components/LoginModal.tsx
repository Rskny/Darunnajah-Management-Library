import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import ikon dari lucide-react
import apiClient from "../apiClient";
import LogoDarunnajah from "../assets/logo darunnajah.png"; // Sesuaikan path logo

export default function LoginModal({ onClose, onSwitch }: any) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  
  const [isForgot, setIsForgot] = useState(false);
  const [emailForgot, setEmailForgot] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const ok = await login(username, password);
    if (ok) {
      onClose();
      navigate("/dashboard");
    } else {
      alert("Username atau password salah");
    }
  };

  const handleForgotPassword = async () => {
    if (!emailForgot) return alert("Masukkan email Anda terlebih dahulu");
    
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: emailForgot });
      alert("Link reset password telah dikirim ke email Anda!");
      setIsForgot(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose} 
      />

      <div className="relative bg-white p-10 rounded-[2.5rem] w-full max-w-sm space-y-6 shadow-2xl z-10">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 text-slate-300 hover:text-slate-500 transition-colors text-xl"
        >
          ✕
        </button>

        {!isForgot ? (
          <>
            {/* Header dengan Logo */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <img src={LogoDarunnajah} alt="Logo" className="w-8 h-8 object-contain" />
                <h2 className="font-black text-2xl text-slate-800">Login</h2>
              </div>
              <p className="text-xs text-slate-400 font-medium">Masuk ke sistem Darunnajah Library</p>
            </div>

            <div className="space-y-4 pt-2">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition text-sm"
                onChange={e => setUsername(e.target.value)}
              />

              {/* Password dengan Ikon Mata Profesional */}
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition text-sm"
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsForgot(true)}
                className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition uppercase"
              >
                Lupa Password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#1F3A5F] hover:bg-[#162a45] text-white py-3.5 rounded-2xl font-bold shadow-lg transition active:scale-[0.98]"
            >
              Sign In
            </button>

            <p className="text-xs text-center text-slate-500 font-medium pt-2">
              Belum punya akun?{" "}
              <span onClick={onSwitch} className="text-blue-600 font-bold cursor-pointer hover:underline">
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <h2 className="font-black text-2xl text-slate-800">Reset Password</h2>
              <p className="text-xs text-slate-400 font-medium">Masukkan email terdaftar Anda</p>
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none text-sm"
              value={emailForgot}
              onChange={e => setEmailForgot(e.target.value)}
            />

            <button
              disabled={loading}
              onClick={handleForgotPassword}
              className="w-full bg-[#1F3A5F] text-white py-3.5 rounded-2xl font-bold transition active:scale-[0.98]"
            >
              {loading ? "MENGIRIM..." : "KIRIM LINK"}
            </button>

            <button
              onClick={() => setIsForgot(false)}
              className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Kembali ke Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}