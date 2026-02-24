import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ onClose, onSwitch }: any) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);


  const handleLogin = async () => {
    const ok = await login(username, password);
    if (ok) {
      onClose();
      navigate("/dashboard");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 space-y-4">
        <h2 className="font-bold text-lg">Login</h2>

        <input
          placeholder="Username"
          className="border w-full p-2 rounded"
          onChange={e => setUsername(e.target.value)}
        />

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="border w-full p-2 rounded"
            onChange={e => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 cursor-pointer text-sm"
          >
            {show ? "🙈" : "👁"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#1F3A5F] text-white py-2 rounded"
        >
          Sign In
        </button>

        <p className="text-sm text-center">
          Belum punya akun?{" "}
          <span onClick={onSwitch} className="text-blue-600 cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
