/* ResetPassword.tsx - Versi FIX No Error */

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ResetPasswordProps {
  onClose: () => void;
}

const ResetPassword = ({ onClose }: ResetPasswordProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage("Password tidak cocok!");
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:9602/api/auth/reset-password', {
        token,
        newPassword: password
      });
      alert("Password berhasil diubah!");
      onClose();
      navigate('/');
    } catch (err: any) {
      setMessage("Gagal reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 py-16 rounded-[2.5rem] shadow-2xl w-full max-w-md mx-auto relative animate-in fade-in zoom-in duration-300">
      
      {/* Tombol X */}
      <button 
        type="button"
        onClick={onClose}
        className="absolute top-8 right-10 text-slate-300 hover:text-slate-500 transition-colors text-xl font-light"
      >
        ✕
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-[#1F3A5F] mb-3 tracking-tight">
          Password Baru
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Silakan masukkan password baru Anda.
        </p>
      </div>

      {message && (
        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-xs text-center border border-red-100 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">
            Password Baru
          </label>
          <input
            type="password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#1F3A5F]/10 outline-none transition-all text-sm"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">
            Konfirmasi Password
          </label>
          <input
            type="password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#1F3A5F]/10 outline-none transition-all text-sm"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F3A5F] hover:bg-[#162a45] text-white font-bold py-4 rounded-2xl transition-all shadow-lg mt-4 active:scale-95 disabled:opacity-50"
        >
          {loading ? "MEMPROSES..." : "SIMPAN PASSWORD"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;