import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ResetPassword from "./ResetPassword"; 

// IMPORT ASET GAMBAR & LOGO
import LogoDarunnajah from "../assets/logo darunnajah.png";
import BackgroundPerpus from "../assets/perpustakaan.jpeg";
import StudentPerpus from "../assets/student perpustakaan.jpeg";
import BICornerImg from "../assets/BI corner.jpg"; 

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const homeRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetOpen(true);
    }
  }, [searchParams]);

  return (
    <div ref={homeRef} className="w-full bg-[#F9F6F0] flex flex-col justify-between overflow-x-hidden">

      {/* NAVBAR MODERN */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-3 bg-[#0A1128] text-white sticky top-0 z-50 shadow-md w-full">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-1.5 rounded-full shadow-md w-14 h-14 flex items-center justify-center border border-slate-700/50 shrink-0">
            <img src={LogoDarunnajah} alt="Logo Darunnajah" className="w-11 h-11 object-contain" />
          </div>
          <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase py-2 px-3 rounded-lg text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Beranda
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setRegisterOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-cyan-400 group">
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">Register</span>
          </button>
          <button onClick={() => setLoginOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-cyan-400 group">
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">Login</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION - Posisi sudah dinaikkan dan diseimbangkan */}
      <section
        className="h-[75vh] min-h-[550px] flex flex-col items-center justify-start text-center text-white relative px-4 overflow-hidden pt-16 shrink-0"
        style={{
          backgroundImage: `url(${BackgroundPerpus})`,
          backgroundSize: "cover", 
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-[#0F1E36]/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F1E36]/30 to-[#F9F6F0]" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl mt-4">
          <button className="border border-cyan-500/50 bg-cyan-950/40 text-cyan-400 px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase mb-3 backdrop-blur-sm shadow-inner">
            Explore Our Services
          </button>
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-2 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            Darunnajah Library
          </h2>
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-bold text-cyan-400 drop-shadow-md max-w-2xl px-4">
            Elevating Knowledge At Pondok Pesantren Darunnajah
          </p>
        </div>

        {/* 3 GELEMBUNG FOTO - Jarak lebar (gap-12) agar tidak padat */}
        <div className="relative z-10 flex items-center justify-center gap-8 md:gap-12 mt-12 w-full max-w-5xl px-4">
          <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 transform -rotate-6 translate-y-2 hover:rotate-0 hover:scale-105 transition duration-300 shrink-0">
            <img src={BICornerImg} alt="BI Corner" className="w-full h-full object-cover object-center" />
          </div>
          <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 transform rotate-3 -translate-y-1 hover:rotate-0 hover:scale-105 transition duration-300 shrink-0">
            <img src={BackgroundPerpus} alt="Rak Perpustakaan" className="w-full h-full object-cover object-center" />
          </div>
          <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 transform -rotate-3 translate-y-3 hover:rotate-0 hover:scale-105 transition duration-300 shrink-0">
            <img src={StudentPerpus} alt="Santri Belajar" className="w-full h-full object-cover object-bottom" />
          </div>
        </div>
      </section>

      {/* PEMBATAS */}
      <div className="w-full relative flex justify-center shrink-0">
        <div className="w-1/3 h-[1px] bg-slate-300/70" />
      </div>

      {/* SECTION PROFILE & LOCATION */}
      <section ref={serviceRef} className="pt-8 pb-8 px-6 md:px-24 max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-start w-full shrink-0">
        <div className="md:col-span-7 flex flex-col items-start w-full">
          <div className="bg-[#0A1128] text-white px-4 py-2 rounded-t-xl text-xs font-bold tracking-wider flex items-center gap-2 shadow-sm">
            <span>MODERN LIBRARY ECOSYSTEM</span>
          </div>
          <div className="bg-white p-8 rounded-b-3xl rounded-r-3xl shadow-lg border border-slate-100 w-full text-justify">
            <h3 className="text-2xl font-black text-[#0A1128] mb-1">PROFILE</h3>
            <h3 className="text-2xl font-black text-cyan-600 border-b-4 border-cyan-500 pb-2 inline-block w-full mb-6">DARUNNAJAH</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              Pondok Pesantren Darunnajah adalah lembaga pendidikan Islam modern
              terkemuka di Ulujami, Pesanggrahan, Jakarta Selatan. Sejak didirikan oleh <strong>KH. Abdul Manaf Mukhayyar</strong>, 
              kami berkomitmen melahirkan generasi yang memiliki pemahaman agama mendalam dan wawasan modern yang luas.
            </p>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6 w-full">
          <div>
            <h4 className="text-xs font-black tracking-widest text-[#0A1128] uppercase mb-2 flex items-center gap-2">
               <div className="w-8 h-[2px] bg-cyan-600" /> Location
            </h4>
            <div className="bg-[#0A1128] text-white p-6 rounded-3xl shadow-lg flex flex-col gap-4">
              <p className="text-xs text-slate-300 leading-relaxed">Jl. Ulujami Raya No. 86, Pesanggrahan, Jakarta Selatan, DKI Jakarta 12250.</p>
              <a href="#" className="text-[11px] font-bold text-cyan-400 hover:underline uppercase tracking-widest transition">Buka Google Maps →</a>
            </div>
          </div>

          <div className="bg-[#E9E6DD] p-6 rounded-3xl border border-slate-300 shadow-sm flex flex-col gap-4">
            <div>
              <h5 className="text-xs font-black text-[#0A1128] uppercase tracking-widest">Support Developer</h5>
            </div>
            <div className="bg-white p-3.5 rounded-2xl shadow-sm flex items-center gap-4">
              <a href="mailto:Riskaseptiany351@gmail.com" className="text-xs font-bold text-[#0A1128] hover:text-cyan-600 transition">Riskaseptiany351@gmail.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* MODALS */}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSwitch={() => { setLoginOpen(false); setRegisterOpen(true); }} />}
      {registerOpen && <RegisterModal onClose={() => setRegisterOpen(false)} onSwitch={() => { setRegisterOpen(false); setLoginOpen(true); }} />}
    </div>
  );
}