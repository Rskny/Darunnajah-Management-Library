import React, { useState } from "react";
import { Visit } from "../../../types";
import { useHistory } from "../../context/HistoryContext";

const MAJORS = ["IPA", "IPS", "MAK", "TSANAWIYAH"];
const CLASSES = ["1", "2", "3", "4", "5", "6"];
const ROLES = ["Siswa", "Guru"];

interface VisitFormModalProps {
  onClose: () => void;
  onSubmit: (visit: Omit<Visit, "id" | "date" | "time">) => void;
}

const VisitFormModal: React.FC<VisitFormModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { addHistory } = useHistory();

  const [formData, setFormData] = useState({
    name: "",
    kelas: CLASSES[0],
    jurusan: MAJORS[0],
    chosing: ROLES[0],
    purpose: "Membaca" as Visit["purpose"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);

    addHistory({
      tanggal: new Date().toISOString(),
      nama: formData.name,
      kelas: formData.kelas,
      status: formData.chosing,
      detail: formData.purpose,
      jenis: "Kunjungan",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#3b5998]">Buku Tamu Siswa</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Nama */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3 bg-slate-50 rounded-2xl"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
            <select
              value={formData.chosing}
              onChange={(e) => setFormData({ ...formData, chosing: e.target.value })}
              className="w-full px-5 py-3 bg-slate-50 rounded-2xl"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas & Jurusan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Kelas</label>
              <select
                disabled={formData.chosing === "Guru"}
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className={`w-full px-5 py-3 rounded-2xl ${
                  formData.chosing === "Guru"
                    ? "bg-slate-200 cursor-not-allowed opacity-60"
                    : "bg-slate-50"
                }`}
              >
                {CLASSES.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Jurusan</label>
              <select
                disabled={formData.chosing === "Guru"}
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                className={`w-full px-5 py-3 rounded-2xl ${
                  formData.chosing === "Guru"
                    ? "bg-slate-200 cursor-not-allowed opacity-60"
                    : "bg-slate-50"
                }`}
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tujuan */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Tujuan Kunjungan</label>
            <select
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value as Visit["purpose"] })
              }
              className="w-full px-5 py-3 bg-slate-50 rounded-2xl"
            >
              <option value="Membaca">Membaca</option>
              <option value="Meminjam">Meminjam Buku</option>
              <option value="Mengembalikan">Mengembalikan Buku</option>
              <option value="Belajar">Belajar</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#3b5998] text-white rounded-2xl font-bold"
          >
            Catat Kehadiran
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitFormModal;
