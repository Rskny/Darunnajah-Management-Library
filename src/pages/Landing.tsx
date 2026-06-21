import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ResetPassword from "./ResetPassword";

import AOS from "aos";
import "aos/dist/aos.css";

import LogoDarunnajah from "../assets/logo darunnajah.png";
import LogoBuku from "../assets/logo buku.png";
import BackgroundPerpus from "../assets/perpustakaan.jpeg";
import BICornerImg from "../assets/BI corner.jpg";
import LayarImg from "../assets/layar.jpg";
import RakBukuImg from "../assets/rak buku.jpg";

import PerpusPutri1 from "../assets/perpus putri 1.jpg";
import PerpusPutri2 from "../assets/perpus putri 2.jpg";
import PerpusPutri3 from "../assets/perpus putri 3.jpg";
import PerpusPutri4 from "../assets/perpus putri 4.jpg";

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const homeRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 120 });
    const token = searchParams.get("token");
    if (token) setResetOpen(true);
  }, [searchParams]);

  return (
    <div ref={homeRef} className="w-full bg-[#F9F6F0] flex flex-col overflow-x-hidden min-h-screen">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-12 py-3 bg-[#0A1128] text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => scrollToSection(homeRef)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-[#22D3EE]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase hidden sm:inline">Beranda</span>
          </button>

          <button
            onClick={() => scrollToSection(galleryRef)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-[#22D3EE]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase hidden sm:inline">Gallery</span>
          </button>

          <button
            onClick={() => scrollToSection(serviceRef)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-[#22D3EE]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63" />
            </svg>
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase hidden sm:inline">Layanan</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setRegisterOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-[#22D3EE]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase hidden sm:inline">Register</span>
          </button>

          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition border border-slate-700/60 text-[#22D3EE]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase hidden sm:inline">Login</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        className="w-full h-screen flex flex-col items-center justify-center relative text-center text-white px-4"
        style={{
          backgroundImage: `url(${BackgroundPerpus})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#0F1E36]/70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F9F6F0] to-transparent" />

        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4">
          {/* LOGO */}
          <div className="flex items-center gap-6 md:gap-10 mb-8">
            {[LogoDarunnajah, LogoBuku].map((logo, i) => (
              <div
                key={i}
                className="rounded-full border-2 border-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center bg-white/10 backdrop-blur-sm hover:scale-105 transition-transform"
                style={{ width: "clamp(4rem, 8vw, 7rem)", height: "clamp(4rem, 8vw, 7rem)" }}
              >
                <img src={logo} alt="Logo" className="object-contain w-[62%] h-[62%]" />
              </div>
            ))}
          </div>

          <h3
            className="font-black tracking-widest text-white uppercase drop-shadow-lg mb-2"
            style={{ fontSize: "clamp(0.85rem, 2vw, 1.5rem)" }}
          >
            Welcome To
          </h3>

          <h1
            className="font-black tracking-tight leading-none text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] mb-5"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6.5rem)" }}
          >
            Darunnajah Library
          </h1>

          <p
            className="uppercase font-bold text-cyan-400 drop-shadow-md max-w-3xl leading-relaxed"
            style={{
              fontSize: "clamp(0.6rem, 1.2vw, 1rem)",
              letterSpacing: "clamp(0.1em, 0.25vw, 0.3em)",
            }}
          >
            Elevating Knowledge At Pondok Pesantren Darunnajah
          </p>
        </div>
      </section>

      {/* SECTION GALLERY */}
      <section ref={galleryRef} className="bg-[#F9F6F0] pt-16 pb-24 px-4 sm:px-8 md:px-12 flex flex-col items-center relative z-10 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full pointer-events-none opacity-90 select-none z-0"
          style={{
            background: "radial-gradient(ellipse 75% 60% at 50% 50%, #5073A2 0%, #7CA0CE 35%, #AEC5E3 60%, transparent 75%)",
            filter: "blur(10px)",
          }}
        />

        <div className="text-center mb-12 relative z-10" data-aos="fade-up">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-[#0A1128] uppercase drop-shadow-sm">
              Library Gallery
            </h3>
            <img src={LogoBuku} alt="Logo Buku" className="h-7 md:h-10 w-auto object-contain" />
          </div>
          <div className="w-48 sm:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#0A1128] to-transparent mx-auto mt-3 opacity-80" />
        </div>

        <div className="w-full relative z-10 flex justify-center max-w-[1440px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" data-aos="fade-up" data-aos-delay="200">
            {[
              { img: BICornerImg, alt: "BI Corner" },
              { img: LayarImg, alt: "Layar Presentasi" },
              { img: BackgroundPerpus, alt: "Rak Perpustakaan" },
              { img: RakBukuImg, alt: "Rak Buku" },
              { img: PerpusPutri1, alt: "Perpustakaan Putri 1" },
              { img: PerpusPutri2, alt: "Perpustakaan Putri 2" },
              { img: PerpusPutri3, alt: "Perpustakaan Putri 3" },
              { img: PerpusPutri4, alt: "Perpustakaan Putri 4" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white lg:hover:scale-105 lg:hover:rotate-1 transition duration-300 cursor-pointer"
              >
                <img src={item.img} alt={item.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PROFILE & LAYANAN */}
      <section ref={serviceRef} className="pt-10 pb-40 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full bg-[#F9F6F0]">
        <div className="w-full lg:col-span-7 flex flex-col items-start" data-aos="fade-right">
          <div className="bg-[#0A1128] text-white px-4 py-2 rounded-t-xl text-[10px] sm:text-xs font-bold tracking-wider flex items-center gap-2">
            <span>MODERN LIBRARY ECOSYSTEM</span>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-b-3xl rounded-r-3xl shadow-lg border border-slate-100 w-full text-justify">
            <h3 className="text-xl sm:text-2xl font-black text-[#0A1128] mb-1">PROFILE</h3>
            <h3 className="text-xl sm:text-2xl font-black text-cyan-600 border-b-4 border-cyan-500 pb-2 inline-block w-full mb-6 uppercase">Darunnajah</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              Pondok Pesantren Darunnajah adalah lembaga pendidikan Islam modern terkemuka di Ulujami, Pesanggrahan, Jakarta Selatan.
              Sejak didirikan oleh <strong>KH. Abdul Manaf Mukhayyar</strong>, kami berkomitmen melahirkan generasi yang memiliki
              pemahaman agama mendalam dan wawasan modern yang luas.
            </p>
          </div>
        </div>

        <div className="w-full lg:col-span-5 flex flex-col gap-6" data-aos="fade-left">
          <div>
            <h4 className="text-xs font-black tracking-widest text-[#0A1128] uppercase mb-2 flex items-center gap-2">
              <div className="w-8 h-[2px] bg-cyan-600" /> Location
            </h4>
            <div className="bg-[#0A1128] text-white p-6 rounded-3xl shadow-lg flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jl. Ulujami Raya No. 86, Pesanggrahan, Jakarta Selatan, DKI Jakarta 12250.
                </p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-cyan-400 hover:underline uppercase tracking-widest transition">
                Buka Google Maps →
              </a>
            </div>
          </div>

          <div className="bg-[#E9E6DD] p-6 rounded-3xl border border-slate-300 shadow-sm flex flex-col gap-4">
            <div>
              <h5 className="text-xs font-black text-[#0A1128] uppercase tracking-widest">Support Developer</h5>
              <p className="text-[9px] font-bold text-cyan-800 uppercase mt-0.5">Wanna ask something?</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
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

      {/* MODALS */}
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