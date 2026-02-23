import { useState } from "react";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-4 shadow-sm bg-white">

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



      {/* HERO */}
      <section
        className="h-[80vh] flex items-center justify-center text-center text-white relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-[#1F3A5F]/80" />

        <h2 className="relative text-4xl md:text-5xl font-bold leading-snug">
          Welcome to <br /> Darunnajah Library
        </h2>
      </section>



      {/* ABOUT */}
      <section className="py-24 px-6 md:px-20 bg-slate-50 grid md:grid-cols-2 gap-14">

        {/* KIRI */}
        <div className="text-left text-justify">
          <h3 className="text-xl font-bold mb-4 text-[#1F3A5F]">
            Profile Darunnajah Boarding School
          </h3>

          <p className="text-slate-600 leading-relaxed">
            Pondok Pesantren Darunnajah adalah lembaga pendidikan Islam modern
            terkemuka di Ulujami, Pesanggrahan, Jakarta Selatan, yang didirikan pada
            1 April 1974 oleh KH. Abdul Manaf Mukhayyar dkk. Pesantren ini menerapkan
            sistem berasrama (boarding school) dengan kurikulum terpadu (kombinasi
            pesantren tradisional, Gontor, dan nasional) serta menekankan pada
            pendidikan bahasa Arab dan Inggris.
          </p>
        </div>



        {/* KANAN */}
        <div className="text-right text-justify">
          <h3 className="text-xl font-bold mb-4 text-[#1F3A5F]">
            Address
          </h3>

          <p className="text-slate-600 leading-relaxed">
            Pondok Pesantren Darunnajah Jakarta berlokasi di Jl. Ulujami Raya No. 86,
            Pesanggrahan, Jakarta Selatan, DKI Jakarta 12250.
          </p>
        </div>



        {/* FOOTER */}
        <div className="col-span-2 flex justify-center mt-12">

          <footer className="text-center text-sm text-slate-500 border-t pt-4 max-w-md w-full">

            <p>Created by Riska Septiany</p>

            <a
              href="mailto:Riskaseptiany351@gmail.com"
              className="hover:underline block"
            >
              Riskaseptiany351@gmail.com
            </a>

          </footer>

        </div>

      </section>



      {/* LOGIN MODAL */}
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onSwitch={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
      )}



      {/* REGISTER MODAL */}
      {registerOpen && (
        <RegisterModal
          onClose={() => setRegisterOpen(false)}
          onSwitch={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />
      )}

    </div>
  );
}
