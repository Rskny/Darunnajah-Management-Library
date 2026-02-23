import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterModal({ onClose, onSwitch }: any) {
  const { register } = useAuth();

  const [form,setForm]=useState({
    name:"",
    username:"",
    password:"",
  });

  const submit=()=>{
    if(!form.name||!form.username||!form.password)
      return alert("Isi semua field");

    const ok = register(form);

    if(!ok) return alert("Username sudah dipakai");

    alert("Register berhasil!");
    onSwitch();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[350px] rounded-2xl p-8 relative shadow-xl">

        <button onClick={onClose} className="absolute top-3 right-4">✕</button>

        <h2 className="text-xl font-bold mb-6 text-center">Register</h2>

        <input placeholder="Nama" className="input"
          onChange={e=>setForm({...form,name:e.target.value})}/>

        <input placeholder="Username" className="input"
          onChange={e=>setForm({...form,username:e.target.value})}/>

        <input type="password" placeholder="Password" className="input"
          onChange={e=>setForm({...form,password:e.target.value})}/>

        <button onClick={submit} className="btn-primary">Create Account</button>

        <p className="text-center text-sm mt-4">
          Sudah punya akun?
          <span onClick={onSwitch} className="text-blue-600 cursor-pointer"> Login</span>
        </p>

      </div>

      <style>{`
        .input{width:100%;padding:14px;margin-bottom:12px;border-radius:12px;background:#f1f5f9;}
        .btn-primary{width:100%;background:#1F3A5F;color:white;padding:12px;border-radius:12px;font-weight:700;}
      `}</style>
    </div>
  );
}
