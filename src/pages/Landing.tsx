import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ResetPassword from "./ResetPassword"; // Sesuaikan path file ResetPassword kamu

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  
  // State khusus untuk mengontrol Modal Reset Password
  const [resetOpen, setResetOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Logic: Jika ada 'token' di URL, otomatis buka modal Reset Password
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen font-sans">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-4 shadow-sm bg-white sticky top-0 z-50">
        <h1 className="font-bold text-lg text-[#1F3A5F]">
          Darunnajah Library
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLoginOpen(true)}
            className="text-sm font-semibold text-slate-600 hover:text-[#1F3A5F] transition"
          >
            Sign In
          </button>

          <button
            onClick={() => setRegisterOpen(true)}
            className="bg-[#1F3A5F] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        className="h-[80vh] flex items-center justify-center text-center text-white relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-[#1F3A5F]/80" />
        <h2 className="relative text-4xl md:text-5xl font-bold leading-snug">
          Welcome to <br /> Darunnajah Library
        </h2>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 px-6 md:px-20 bg-slate-50 grid md:grid-cols-2 gap-14">
        <div className="text-left text-justify">
          <h3 className="text-xl font-bold mb-4 text-[#1F3A5F]">
            Profile Darunnajah Boarding School
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Pondok Pesantren Darunnajah adalah lembaga pendidikan Islam modern
            terkemuka di Ulujami, Pesanggrahan, Jakarta Selatan, yang didirikan pada
            1 April 1974 oleh KH. Abdul Manaf Mukhayyar dkk.
          </p>
        </div>

        <div className="text-right text-justify">
          <h3 className="text-xl font-bold mb-4 text-[#1F3A5F]">
            Address
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Jl. Ulujami Raya No. 86, Pesanggrahan, Jakarta Selatan, DKI Jakarta 12250.
          </p>
        </div>

        <div className="col-span-2 flex justify-center mt-12">
          <footer className="text-center text-sm text-slate-500 border-t pt-4 max-w-md w-full">
            <p>Created by Riska Septiany</p>
            <a href="mailto:Riskaseptiany351@gmail.com" className="hover:underline block">
              Riskaseptiany351@gmail.com
            </a>
          </footer>
        </div>
      </section>

      {/* --- MODAL OVERLAYS --- */}

      {/* 1. LOGIN MODAL */}
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onSwitch={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
      )}

      {/* 2. REGISTER MODAL */}
      {registerOpen && (
        <RegisterModal
          onClose={() => setRegisterOpen(false)}
          onSwitch={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />
      )}

      {/* 3. RESET PASSWORD MODAL (Muncul Otomatis via URL Token) */}
      {resetOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay Gelap dengan Blur agar fokus ke Modal */}
          <div 
            className="absolute inset-0 bg-[#1F3A5F]/60 backdrop-blur-sm" 
            onClick={() => setResetOpen(false)} 
          />
          
          {/* Box Reset Password */}
          <div className="relative z-10 w-full max-w-md">
            <ResetPassword onClose={() => setResetOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}