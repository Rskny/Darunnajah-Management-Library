import React, { useState } from "react";
import { CLASS_CODES, MAJORS } from "../constants/data";
import { useHistory } from "../context/HistoryContext";
import apiClient from "../apiClient";

const ROLES = ["Siswa", "Guru"];
const GENDERS = ["Laki-laki", "Perempuan"];

interface Props {
  bookTitle: string;
  onClose: () => void;
}

const BorrowForm: React.FC<Props> = ({ bookTitle, onClose }) => {
  const { addHistory } = useHistory();

  const [formData, setFormData] = useState({
    name: "",
    role: "Siswa",
    class: CLASS_CODES[0],
    major: MAJORS[0],
    gender: GENDERS[0],
    quantity: 1
  });

  const [days, setDays] = useState(7);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      // Find exact bookId for the title
      const booksRes = await apiClient.get('/books');
      const foundBook = booksRes.data.find((b: any) => b.title === bookTitle);

      if (!foundBook) {
        alert("Buku tidak ditemukan di database!");
        return;
      }

      if (formData.quantity > foundBook.stock) {
        alert(`Request ditolak! Anda meminjam ${formData.quantity} buku, tapi stok yang tersedia hanya ${foundBook.stock}.`);
        return;
      }

      const today = new Date();
      const due = new Date();
      due.setDate(today.getDate() + days);

      // POST ke Backend API
      await apiClient.post("/transactions", {
        bookId: foundBook.id,
        studentName: formData.name,
        role: formData.role.toLowerCase(),
        class: formData.class,
        major: formData.major,
        gender: formData.gender,
        quantity: formData.quantity,
        status: "Dipinjam",
        borrowDate: today.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0]
      });

      /* ===== SAVE TO HISTORY ===== */
      addHistory({
        date: new Date().toISOString(),
        name: formData.name,
        role: formData.role.toLowerCase(),
        activity: `Meminjam ${bookTitle}`,
        status: "Meminjam",
        category: "transaksi",
        description: "-"
      });

      /* ===== TRIGGER REALTIME REFRESH ===== */
      window.dispatchEvent(new Event("transactionsUpdated"));
      window.dispatchEvent(new Event("booksUpdated"));

      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal memproses peminjaman buku!");
    }
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

          {/* BOOK INFO */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
              Buku Dipilih
            </p>
            <h4 className="font-bold text-blue-800">{bookTitle}</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAMA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Nama Lengkap *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium"
                placeholder="Nama Peminjam"
              />
            </div>

            {/* JUMLAH */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Jumlah *
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Role</label>
              <div className="flex space-x-2 mt-1">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleChange("role", r)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition ${formData.role === r
                      ? "bg-indigo-700 text-white shadow"
                      : "bg-slate-50 text-slate-400 border"
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* KELAS + JURUSAN */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Kelas</label>
                <select
                  disabled={formData.role === "Guru"}
                  value={formData.class}
                  onChange={(e) => handleChange("class", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl font-bold ${formData.role === "Guru"
                    ? "bg-slate-200 opacity-60"
                    : "bg-slate-100"
                    }`}
                >
                  {CLASS_CODES.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Jurusan</label>
                <select
                  disabled={formData.role === "Guru"}
                  value={formData.major}
                  onChange={(e) => handleChange("major", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl font-bold ${formData.role === "Guru"
                    ? "bg-slate-200 opacity-60"
                    : "bg-slate-100"
                    }`}
                >
                  {MAJORS.map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* GENDER */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Gender</label>
              <div className="flex space-x-2 mt-1">
                {GENDERS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange("gender", g)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs ${formData.gender === g
                      ? "bg-blue-800 text-white shadow"
                      : "bg-slate-50 text-slate-400 border"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* DURASI */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Durasi Pinjam</label>
              <div className="flex space-x-2 mt-1">
                {[3, 7, 14].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs ${days === d
                      ? "bg-slate-800 text-white shadow"
                      : "bg-slate-50 text-slate-400"
                      }`}
                  >
                    {d} Hari
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4 hover:bg-blue-700 transition active:scale-95"
            >
              Konfirmasi Peminjaman
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BorrowForm;