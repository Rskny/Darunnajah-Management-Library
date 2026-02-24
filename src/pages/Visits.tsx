import React, { useState, useEffect } from "react";
import VisitFormModal from "../components/visits/VisitFormModal";
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

/* ================= HELPER ================= */

// tanggal hari ini jam 00:00
const getStartOfToday = () => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
};

// cek apakah tanggal masih hari ini
const isToday = (dateString:string) => {
  const d = new Date(dateString);
  return d >= getStartOfToday();
};

const Visits: React.FC = () => {
  const { addHistory } = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("visits") || "[]");

    // hanya ambil kunjungan hari ini
    const todayVisits = saved.filter((v:Visit)=> isToday(v.date));

    setVisits(todayVisits);
  }, []);

  /* ================= SAVE + AUTO CLEAN ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("visits") || "[]");

    // gabung data lama + hari ini
    const merged = [...visits, ...saved.filter((v:Visit)=> !isToday(v.date))];

    localStorage.setItem("visits", JSON.stringify(merged));

    // trigger dashboard update realtime
    window.dispatchEvent(new Event("visitsUpdated"));

  }, [visits]);

  /* ================= ADD ================= */
  const handleAddVisit = (data: Omit<Visit, "id" | "date" | "time">) => {
    const now = new Date();

    const newVisit: Visit = {
      id: Date.now(),
      date: now.toISOString(),
      time: now.toLocaleTimeString("id-ID"),
      ...data,
    };

    setVisits(prev => [newVisit, ...prev]);

    // kirim ke history (untuk dashboard weekly)
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
  };

  /* ================= CHECKBOX ================= */
  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === visits.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visits.map(v => v.id));
    }
  };

  /* ================= DELETE ================= */
  const deleteSelected = () => {
    const filtered = visits.filter(v => !selectedIds.includes(v.id));
    setVisits(filtered);
    setSelectedIds([]);
  };

  /* ================= RENDER ================= */
  return (
    <div className="p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Kunjungan Hari Ini
        </h1>

        <div className="flex gap-3">

          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              className="px-5 py-3 bg-red-500 text-white rounded-2xl font-bold shadow"
            >
              Hapus ({selectedIds.length})
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#3b5998] text-white rounded-2xl font-bold shadow-lg"
          >
            + Tambah Kunjungan
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedIds.length === visits.length && visits.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Kelas</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Tujuan</th>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-left">Waktu</th>
            </tr>
          </thead>

          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Belum ada kunjungan hari ini
                </td>
              </tr>
            ) : (
              visits.map(v => (
                <tr
                  key={v.id}
                  className={`border-t ${selectedIds.includes(v.id) ? "bg-blue-50" : ""}`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(v.id)}
                      onChange={() => toggleSelect(v.id)}
                    />
                  </td>

                  <td className="p-4">{v.name}</td>
                  <td className="p-4">{v.kelas}</td>
                  <td className="p-4 capitalize">{v.chosing}</td>
                  <td className="p-4">{v.purpose}</td>
                  <td className="p-4">
                    {new Date(v.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">{v.time}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <VisitFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddVisit}
        />
      )}

    </div>
  );
};

export default Visits;
