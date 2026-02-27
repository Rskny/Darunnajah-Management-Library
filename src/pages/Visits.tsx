import React, { useState, useEffect } from "react";
import VisitFormModal from "../components/visits/VisitFormModal";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox";
import apiClient from "../apiClient";
import { useHistory } from "../context/HistoryContext";

interface Visit {
  id: number;
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

  const { addHistory } = useHistory();

  const fetchVisits = async () => {
    const res = await apiClient.get("/visits");
    setVisits(res.data.filter((v: Visit) => isToday(v.date)));
  };

  useEffect(() => {
    fetchVisits();
    const interval = setInterval(fetchVisits, 60000); // refresh setiap 60 detik
    return () => clearInterval(interval);
  }, []);

  // TAMBAH VISIT
  const handleAddVisit = async (data: Omit<Visit, "id" | "date" | "time">) => {
    try {
      const now = new Date();
      await apiClient.post("/visits", {
        name: data.name,
        nis: data.chosing === "Siswa" ? "N/A" : data.chosing,
        kelas: data.kelas,
        chosing: data.chosing,
        purpose: data.purpose,
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      });

      // Refresh tabel kunjungan
      fetchVisits();

      // Simpan ke history lokal
      addHistory({
        id: Date.now(),
        date: new Date(),
        name: data.name,
        role: data.chosing,
        activity: "Kunjungan",
        category: "kunjungan",
        description: data.purpose,
      });

      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sorted = [...visits]
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  return (
    <div className="p-8 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <PageHeader
          title="Kunjungan Hari Ini"
          subtitle="Data pengunjung perpustakaan"
          onSortChange={setSort}
          onLimitChange={setLimit}
          right={
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#3b5998] text-white rounded-2xl font-bold shadow"
            >
              + Tambah Kunjungan
            </button>
          }
        />
      </div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
        Data kunjungan hanya tampil 24 jam lalu otomatis masuk riwayat.
      </div>

      <TableBox>
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-xs uppercase">
            <tr>
              <th className="p-4 text-center w-16">No</th>
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
                <td colSpan={7} className="py-20 text-center text-slate-400">
                  Belum ada kunjungan hari ini
                </td>
              </tr>
            ) : (
              sorted.map((v, i) => (
                <tr key={v.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 text-center font-semibold text-slate-500">{i + 1}</td>
                  <td className="p-4">{v.name}</td>
                  <td className="p-4">{v.kelas}</td>
                  <td className="p-4">{v.chosing}</td>
                  <td className="p-4">{v.purpose}</td>
                  <td className="p-4">{new Date(v.date).toLocaleDateString("id-ID")}</td>
                  <td className="p-4">{v.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableBox>

      {showModal && (
        <VisitFormModal onClose={() => setShowModal(false)} onSubmit={handleAddVisit} />
      )}
    </div>
  );
};

export default Visits;