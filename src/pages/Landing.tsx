import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ResetPassword from "./ResetPassword"; 

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Inisialisasi Refs untuk fitur scroll otomatis interaktif
  const homeRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetOpen(true);
    }
  }, [searchParams]);

  // Fungsi untuk handle smooth scroll ke elemen tujuan
  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={homeRef} className="min-h-screen font-sans bg-[#F9F6F0]">

      {/* NAVBAR MODERN */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-[#0A1128] text-white sticky top-0 z-50 shadow-md">
        {/* Sisi Kiri: Tombol Akses Autentikasi dengan Teks & Ikon SVG */}
        <div className="flex items-center gap-4">
          {/* Tombol Register */}
          <button 
            onClick={() => setRegisterOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-cyan-400 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">Register</span>
          </button>
          
          {/* Tombol Login (Sudah Diperbaiki Jadi Ikon Panah MASUK) */}
          <button 
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-cyan-400 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">Login</span>
          </button>
        </div>

        {/* Sisi Kanan: Menu Navigasi Interaktif */}
        <div className="flex items-center gap-6 md:gap-8 text-xs font-bold tracking-widest uppercase">
          <button 
            onClick={() => scrollToSection(homeRef)} 
            className="flex items-center gap-2 hover:text-cyan-400 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Beranda
          </button>
          <div className="h-4 w-[1px] bg-slate-700" />
          <button 
            onClick={() => scrollToSection(serviceRef)} 
            className="flex items-center gap-2 hover:text-cyan-400 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 .512 1.349l-.041.02-.041.02a.75.75 0 1 1-.512-1.349l.041-.02ZM12 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Layanan
          </button>
        </div>
      </nav>

      {/* HERO SECTION (Background ditarik penuh ke bawah) */}
      <section
        className="h-[92vh] flex flex-col items-center justify-center text-center text-white relative px-4"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Overlay Gelap Sinematik */}
        <div className="absolute inset-0 bg-[#0F1E36]/75" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          {/* Button Transparan Biru */}
          <button className="border border-cyan-500/50 bg-cyan-950/40 text-cyan-400 px-4 py-1.5 rounded text-[11px] font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Explore Our Services
          </button>

          {/* Judul Utama Putih Murni */}
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-5 text-white drop-shadow-lg">
            Welcome to <br /> Darunnajah Library
          </h2>

          {/* Slogan Teks (Warna Biru Cyan Cerah) */}
          <p className="text-[12px] md:text-sm tracking-[0.3em] uppercase font-bold text-cyan-400 drop-shadow-md">
            Elevating Knowledge At Pondok Pesantren Darunnajah
          </p>
        </div>
      </section>

      {/* SECTION CONTENT: PROFILE & LOCATION */}
      <section ref={serviceRef} className="py-20 px-6 md:px-24 max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-start">
        
        {/* Kiri: Bagian Profil */}
        <div className="md:col-span-7 flex flex-col items-start">
          <div className="bg-[#0A1128] text-white px-4 py-2 rounded-t-xl text-xs font-bold tracking-wider flex items-center gap-2 shadow-sm">
            <span>MODERN LIBRARY ECOSYSTEM</span>
          </div>
          
          <div className="bg-white p-10 rounded-b-3xl rounded-r-3xl shadow-sm border border-slate-100 w-full text-justify">
            <h3 className="text-3xl font-black text-[#0A1128] mb-1">PROFILE</h3>
            <h3 className="text-3xl font-black text-cyan-600 border-b-4 border-cyan-500 pb-3 inline-block w-full mb-8">DARUNNAJAH</h3>
            <p className="text-slate-700 leading-relaxed text-base">
              Pondok Pesantren Darunnajah adalah lembaga pendidikan Islam modern
              terkemuka di Ulujami, Pesanggrahan, Jakarta Selatan. Sejak didirikan oleh <strong>KH. Abdul Manaf Mukhayyar</strong>, 
              kami berkomitmen melahirkan generasi yang memiliki pemahaman agama mendalam dan wawasan modern yang luas.
            </p>
          </div>
        </div>

        {/* Kanan: Bagian Informasi & Kontak Developer */}
        <div className="md:col-span-5 flex flex-col gap-8 w-full">
          {/* Box Lokasi */}
          <div>
            <h4 className="text-xs font-black tracking-widest text-[#0A1128] uppercase mb-3 flex items-center gap-2">
               <div className="w-8 h-[2px] bg-cyan-600" /> Location
            </h4>
            <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-lg flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Jl. Ulujami Raya No. 86, Pesanggrahan, Jakarta Selatan, DKI Jakarta 12250.
                </p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-400 hover:underline uppercase tracking-widest transition">
                Buka Google Maps →
              </a>
            </div>
          </div>

          {/* Box Support Developer */}
          <div className="bg-[#E9E6DD] p-8 rounded-3xl border border-slate-300 flex flex-col gap-5">
            <div>
              <h5 className="text-xs font-black text-[#0A1128] uppercase tracking-widest">Support Developer</h5>
              <p className="text-[10px] font-bold text-cyan-800 uppercase mt-1">Melayani kendala teknis anda</p>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
              {/* Email Icon SVG */}
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400">Email Coordinator</p>
                <a href="mailto:Riskaseptiany351@gmail.com" className="text-xs font-bold text-[#0A1128] hover:text-cyan-600 transition">
                  Riskaseptiany351@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODAL OVERLAYS --- */}
      {loginOpen && (
        <LoginModal 
          onClose={() => setLoginOpen(false)} 
          onSwitch={() => { setLoginOpen(false); setRegisterOpen(true); }} 
        />
      )}
      
      {registerOpen && (
        <RegisterModal 
          onClose={() => setRegisterOpen(false)} 
          onSwitch={() => { setRegisterOpen(false); setLoginOpen(true); }} 
        />
      )}
      
      {resetOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A1128]/70 backdrop-blur-sm" onClick={() => setResetOpen(false)} />
          <div className="relative z-10 w-full max-w-md">
            <ResetPassword onClose={() => setResetOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}