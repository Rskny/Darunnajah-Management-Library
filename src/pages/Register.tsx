import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await apiClient.post("/auth/register", { username, email, password });
      alert("Registrasi sukses! Silakan login.");
      navigate("/login");
    } catch (err) {
      alert("Registrasi gagal!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full mb-3 p-2 border rounded" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 p-2 border rounded" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" />

        <button onClick={handleRegister} className="w-full bg-green-600 text-white py-2 rounded">
          Create Account
        </button>

        <p className="text-sm text-center mt-3">
          Sudah punya akun? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
}
