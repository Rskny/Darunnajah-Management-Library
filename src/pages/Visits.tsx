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

const Visits: React.FC = () => {
  const { addHistory } = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchVisits = async () => {
    try {
      const res = await apiClient.get('/visits');
      setVisits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // TAMBAH VISIT
  const handleAddVisit = async (data: Omit<Visit, "id" | "date" | "time">) => {
    try {
      const now = new Date();
      await apiClient.post('/visits', {
        name: data.name,
        nis: data.chosing === 'siswa' ? 'N/A' : data.chosing, // Adjust according to your form data
        date: now.toISOString().split('T')[0]
      });
      fetchVisits();

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
  const deleteSelected = async () => {
    try {
      for (const id of selectedIds) {
        await apiClient.delete(`/visits/${id}`);
      }
      fetchVisits();
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
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
