import React, { useState, useEffect } from "react";
import VisitFormModal from "../components/visits/VisitFormModal";
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

const Visits: React.FC = () => {
  const { addHistory } = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // LOAD DATA (dummy + localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("visits");

    if (saved) {
      setVisits(JSON.parse(saved));
    } else {
      const dummy: Visit[] = [
        { id:1,name:"Ahmad",kelas:"10A",chosing:"siswa",purpose:"Membaca",date:"01/02/2026",time:"08.10"},
        { id:2,name:"Budi",kelas:"11B",chosing:"siswa",purpose:"Pinjam Buku",date:"02/02/2026",time:"09.00"},
        { id:3,name:"Citra",kelas:"12A",chosing:"siswa",purpose:"Belajar",date:"03/02/2026",time:"09.30"},
        { id:4,name:"Dina",kelas:"10C",chosing:"siswa",purpose:"Diskusi",date:"05/02/2026",time:"10.00"},
        { id:5,name:"Eka",kelas:"11A",chosing:"siswa",purpose:"Mengerjakan Tugas",date:"07/02/2026",time:"11.15"},
        { id:6,name:"Farhan",kelas:"10B",chosing:"siswa",purpose:"Membaca",date:"10/02/2026",time:"08.45"},
        { id:7,name:"Gita",kelas:"12C",chosing:"siswa",purpose:"Referensi",date:"12/02/2026",time:"09.20"},
        { id:8,name:"Hadi",kelas:"11C",chosing:"siswa",purpose:"Pinjam Buku",date:"15/02/2026",time:"10.40"},

        { id:9,name:"Intan",kelas:"10A",chosing:"siswa",purpose:"Membaca",date:"03/03/2026",time:"08.30"},
        { id:10,name:"Joko",kelas:"12B",chosing:"siswa",purpose:"Belajar",date:"10/03/2026",time:"09.10"},
        { id:11,name:"Kiki",kelas:"11A",chosing:"siswa",purpose:"Diskusi",date:"15/03/2026",time:"10.00"},
      ];

      setVisits(dummy);
      localStorage.setItem("visits", JSON.stringify(dummy));
    }
  }, []);

  // SAVE otomatis tiap berubah
  useEffect(() => {
    localStorage.setItem("visits", JSON.stringify(visits));
  }, [visits]);

  // TAMBAH VISIT
  const handleAddVisit = (data: Omit<Visit, "id" | "date" | "time">) => {
    const now = new Date();

    const newVisit: Visit = {
      id: Date.now(),
      date: now.toLocaleDateString("id-ID"),
      time: now.toLocaleTimeString("id-ID"),
      ...data,
    };

    setVisits(prev => [newVisit, ...prev]);

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

  // CHECKBOX
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

  // DELETE
  const deleteSelected = () => {
    const filtered = visits.filter(v => !selectedIds.includes(v.id));
    setVisits(filtered);
    setSelectedIds([]);
  };

  return (
    <div className="p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">
          List Kunjungan Perpustakaan
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
                  Belum ada data kunjungan
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
                  <td className="p-4">{v.date}</td>
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
