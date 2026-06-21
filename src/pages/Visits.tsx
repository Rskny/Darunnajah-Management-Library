import React, { useState, useEffect } from "react";
import VisitFormModal from "../components/visits/VisitFormModal";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox";
import apiClient from "../apiClient";
import { useHistory } from "../context/HistoryContext";
import { useLocation } from "react-router-dom";

// IMPORT AOS DAN CSS ANIMASINYA
import AOS from "aos";
import "aos/dist/aos.css";

interface Visit {
  id: number;
  memberId: string;
  name: string;
  kelas: string;
  chosing: string;
  purpose: string;
  date: string;
  time: string;
}

const isToday = (dateString: string) => {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const Visits: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get("search") || "").toLowerCase();

  const { addHistory } = useHistory();

  const fetchVisits = async () => {
    try {
      const res = await apiClient.get("/visits");
      setVisits(res.data.filter((v: Visit) => isToday(v.date)));
    } catch (err) {
      console.error("Gagal memuat data kunjungan", err);
    }
  };

  useEffect(() => {
    fetchVisits();
    
    // INISIALISASI AOS
    AOS.init({
      duration: 700,
      once: true,
    });

    const interval = setInterval(fetchVisits, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleAddVisit = async (data: { memberId: string; name: string; kelas: string; chosing: string; purpose: string }) => {
    try {
      const now = new Date();
      await apiClient.post("/visits", {
        memberId: data.memberId,
        name: data.name,
        kelas: data.kelas,
        chosing: data.chosing,
        purpose: data.purpose,
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      });

      fetchVisits();

      addHistory({
        id: Date.now(),
        date: new Date(),
        name: data.name,
        role: data.chosing,
        activity: "Kunjungan",
        category: "kunjungan",
        description: `Tujuan: ${data.purpose} (ID: ${data.memberId})`,
      });

      setShowModal(false);
    } catch (err) {
      console.error("Gagal menambahkan kunjungan:", err);
    }
  };

  const sorted = [...visits]
    .filter((v) =>
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.memberId?.toLowerCase().includes(q) ||
      v.chosing.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q) ||
      v.kelas.toLowerCase().includes(q)
    )
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  return (
    // PERBAIKAN 1: Menjadikan container utama fleksibel penuh dan mengatur padding yang responsif
    <div data-aos="fade-up" className="w-full min-h-full p-6 md:p-8 flex flex-col box-border">
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
        <PageHeader
          title="Kunjungan Hari Ini"
          subtitle="Data pengunjung perpustakaan"
          onSortChange={setSort}
          onLimitChange={setLimit}
          right={
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#3b5998] text-white rounded-2xl font-bold shadow hover:bg-[#2d4373] transition-all"
            >
              + Tambah Kunjungan
            </button>
          }
        />
      </div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6 flex-shrink-0">
        Data kunjungan hanya tampil 24 jam lalu otomatis masuk riwayat.
      </div>

      {/* PERBAIKAN 2: Menggunakan flex-1 min-h-0 agar tabel mengambil sisa ruang kosong secara fleksibel */}
      <div className="flex-1 min-h-0 rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
        <TableBox>
          {/* PERBAIKAN 3: Menambahkan container scrollable internal untuk tabel */}
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 text-center w-16">No</th>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Nama</th>
                  <th className="p-4 text-left">Kelas</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Tujuan</th>
                  <th className="p-4 text-left">Tanggal</th>
                  <th className="p-4 text-left">Waktu</th>
                </tr>
              </thead>

              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-slate-400 font-medium">
                      Belum ada kunjungan hari ini
                    </td>
                  </tr>
                ) : (
                  sorted.map((v, i) => (
                    <tr key={v.id} className="border-t hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-center font-semibold text-slate-500">{i + 1}</td>
                      <td className="p-4 font-bold text-slate-700 font-mono tracking-wider">{v.memberId || "-"}</td>
                      <td className="p-4 font-medium">{v.name}</td>
                      <td className="p-4 text-slate-600">{v.kelas}</td>
                      <td className="p-4">{v.chosing}</td>
                      <td className="p-4 text-slate-600">{v.purpose}</td>
                      <td className="p-4">{new Date(v.date).toLocaleDateString("id-ID")}</td>
                      <td className="p-4 text-slate-500">{v.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TableBox>
      </div>

      {showModal && (
        <VisitFormModal onClose={() => setShowModal(false)} onSubmit={handleAddVisit} />
      )}
    </div>
  );
};

export default Visits;