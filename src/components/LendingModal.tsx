import React, { useState } from "react";
import { Book } from "../types";
import { CLASS_CODES, MAJORS } from "../constants/data";
import { useHistory } from "../context/HistoryContext";

const ROLES = ["Siswa", "Guru"];
const GENDERS = ["Laki-laki", "Perempuan"];

interface LendingModalProps {
  book?: Book | null;
  onClose: () => void;
  onSubmit?: (borrowerData: any, days: number, bookTitle?: string) => void;
}

const LendingModal: React.FC<LendingModalProps> = ({ book, onClose, onSubmit }) => {
  const { addHistory } = useHistory();
  const [useManual, setUseManual] = useState(!book);

  const [formData, setFormData] = useState({
    name: "",
    role: ROLES[0],
    class: CLASS_CODES[0],
    major: MAJORS[0],
    gender: GENDERS[0],
    manualBookTitle: "",
    quantity: 1
  });

  const [days, setDays] = useState(7);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookTitle = useManual
      ? formData.manualBookTitle
      : book?.title ?? "";

    if (!formData.name || !bookTitle) return;

    // validasi stok kalau dari katalog
    if (!useManual && book && formData.quantity > book.stock) {
      alert(`Stok hanya tersedia ${book.stock}`);
      return;
    }

    addHistory({
      id: Date.now(),
      date: new Date(),
      name: formData.name,
      role: formData.role,
      activity: `Meminjam ${bookTitle} (${formData.quantity})`,
      category: "transaksi",
      status: "meminjam",
      description: `Dipinjam oleh ${formData.name}`,
    });

    if (onSubmit) onSubmit(formData, days, bookTitle);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/30">
          <h3 className="text-2xl font-bold text-slate-800">Peminjaman Buku</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {book && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setUseManual(!useManual)}
                className="px-3 py-1 bg-slate-200 rounded-lg hover:bg-slate-300 transition text-xs"
              >
                {useManual ? "Gunakan Buku Terpilih" : "Input Manual"}
              </button>
            </div>
          )}

          {/* BOOK INFO */}
          {useManual ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Judul Buku *
              </label>
              <input
                required
                type="text"
                value={formData.manualBookTitle}
                onChange={(e) => handleChange("manualBookTitle", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-bold"
                placeholder="Ketik Judul Buku..."
              />
            </div>
          ) : (
            book && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                  Buku Terpilih
                </p>
                <h4 className="font-bold text-blue-800">{book.title}</h4>
                <p className="text-xs text-slate-500">
                  {book.author} • Stok: {book.stock}
                </p>
              </div>
            )
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAMA */}
              <label className="text-xs font-bold uppercase text-slate-500">
                 Nama Peminjam*
              </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nama Peminjam"
              className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium"
            />

            {/* JUMLAH */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">
                Jumlah Pinjam
              </label>
              <input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>

            {/* ROLE */}
            <div className="flex space-x-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange("role", r)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs ${
                    formData.role === r
                      ? "bg-indigo-700 text-white"
                      : "bg-slate-50 text-slate-400 border"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* CLASS + MAJOR */}
            <div className="grid grid-cols-2 gap-4">
              <select
                disabled={formData.role === "Guru"}
                value={formData.class}
                onChange={(e) => handleChange("class", e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-100 font-bold"
              >
                {CLASS_CODES.map(c => <option key={c}>{c}</option>)}
              </select>

              <select
                disabled={formData.role === "Guru"}
                value={formData.major}
                onChange={(e) => handleChange("major", e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-100 font-bold"
              >
                {MAJORS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            {/* GENDER */}
            <div className="flex space-x-2">
              {GENDERS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleChange("gender", g)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs ${
                    formData.gender === g
                      ? "bg-blue-800 text-white"
                      : "bg-slate-50 text-slate-400 border"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* DURASI */}
            <div className="flex space-x-2">
              {[3,7,14].map(d=>(
                <button
                  key={d}
                  type="button"
                  onClick={()=>setDays(d)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs ${
                    days===d
                    ?"bg-slate-800 text-white"
                    :"bg-slate-50 text-slate-400"
                  }`}
                >
                  {d} Hari
                </button>
              ))}
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
              Konfirmasi Peminjaman
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LendingModal;