import React, { useState, useEffect } from "react";
import VisitFormModal from "../components/visits/VisitFormModal";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox";
import apiClient from "../apiClient";
import { useHistory } from "../context/HistoryContext";
import { useLocation } from "react-router-dom";

interface Visit {
  id: number;
  memberId: string; // <-- Ditambahkan properti memberId menggantikan nis
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
    const interval = setInterval(fetchVisits, 60000); 
    return () => clearInterval(interval);
  }, []);

  // PROSES SIMPAN KUNJUNGAN KE BACKEND
  const handleAddVisit = async (data: { memberId: string; name: string; kelas: string; chosing: string; purpose: string }) => {
    try {
      const now = new Date();
      await apiClient.post("/visits", {
        memberId: data.memberId, // <-- MENGIRIM MEMBER ID ASLI KE BACKEND
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
      v.memberId?.toLowerCase().includes(q) || // <-- SEKARANG BISA CARI BERDASARKAN ID / NIS JUGA
      v.chosing.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q) ||
      v.kelas.toLowerCase().includes(q)
    )
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  return (
    <div className="p-8 space-y-6">
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
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

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
        Data kunjungan hanya tampil 24 jam lalu otomatis masuk riwayat.
      </div>

      <div className="overflow-y-auto max-h-[58vh] rounded-3xl border border-slate-200 shadow-sm bg-white">
        <TableBox>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 text-center w-16">No</th>
                <th className="p-4 text-left">ID</th> {/* <-- KOLOM BARU DI TABLE */}
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
                  <td colSpan={8} className="py-20 text-center text-slate-400"> {/* Colspan diubah ke 8 */}
                    Belum ada kunjungan hari ini
                  </td>
                </tr>
              ) : (
                sorted.map((v, i) => (
                  <tr key={v.id} className="border-t hover:bg-slate-50">
                    <td className="p-4 text-center font-semibold text-slate-500">{i + 1}</td>
                    <td className="p-4 font-bold text-slate-700 font-mono">{v.memberId || "-"}</td> {/* <-- VALUE BARU DI TABLE */}
                    <td className="p-4 font-medium">{v.name}</td>
                    <td className="p-4">{v.kelas}</td>
                    <td className="p-4">{v.chosing}</td>
                    <td className="p-4">{v.purpose}</td>
                    <td className="p-4">{new Date(v.date).toLocaleDateString("id-ID")}</td>
                    <td className="p-4 text-slate-500">{v.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableBox>
      </div>

      {showModal && (
        <VisitFormModal onClose={() => setShowModal(false)} onSubmit={handleAddVisit} />
      )}
    </div>
  );
};

export default Visits;