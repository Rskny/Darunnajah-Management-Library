import React, { useState, useEffect } from "react";
import { CLASS_CODES, MAJORS } from "../constants/data";
import { useHistory } from "../context/HistoryContext";
import apiClient from "../apiClient";
import Select from "react-select";

const GENDERS = ["Laki-laki", "Perempuan"];

interface Props {
  bookTitle: string;
  bookCode?: string;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const BorrowForm: React.FC<Props> = ({ bookTitle, bookCode, onClose }) => {
  const { addHistory } = useHistory();

  const [memberOptions, setMemberOptions] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const [formData, setFormData] = useState({
    memberId: "",
    name: "",
    role: "Siswa",
    class: "-",
    major: "-",
    gender: GENDERS[0],
    quantity: 1,
  });

  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/members/selection");
        const formatted = res.data.map((m: any) => ({
          value: m.id,
          label: m.nama,
          raw: m,
        }));
        setMemberOptions(formatted);
      } catch (err) {
        console.error("Gagal memuat anggota:", err);
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSelectMember = (selected: any) => {
    if (selected) {
      const { id, nis, nama, status, kelas, jurusan, gender } = selected.raw;
      setFormData({
        ...formData,
        memberId: nis || String(id),
        name: nama,
        role: status,
        class: kelas || "-",
        major: jurusan || "-",
        gender: gender || GENDERS[0], // Sekarang akan dapat gender dari API
      });
    } else {
      setFormData({
        ...formData,
        memberId: "",
        name: "",
        role: "Siswa",
        class: "-",
        major: "-",
        gender: GENDERS[0],
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.memberId) {
      alert("Harap pilih nama anggota yang valid!");
      return;
    }

    try {
      const booksRes = await apiClient.get("/books");
      const foundBook = booksRes.data.find((b: any) => b.title === bookTitle);

      if (!foundBook) {
        alert("Buku tidak ditemukan di database!");
        return;
      }

      if (formData.quantity > foundBook.stock) {
        alert(`Stok tersedia hanya ${foundBook.stock}.`);
        return;
      }

      const today = new Date();
      const due = new Date();
      due.setDate(today.getDate() + days);

      await apiClient.post("/transactions", {
        memberId: formData.memberId,
        bookId: foundBook.id,
        studentName: formData.name,
        role: formData.role.toLowerCase(),
        class: formData.class,
        major: formData.major,
        gender: formData.gender,
        quantity: formData.quantity,
        status: "Dipinjam",
        borrowDate: today.toISOString().split("T")[0],
        dueDate: due.toISOString().split("T")[0],
      });

      addHistory({
        date: new Date().toISOString(),
        name: formData.name,
        role: formData.role.toLowerCase(),
        activity: `Meminjam ${bookTitle}`,
        status: "Meminjam",
        category: "transaksi",
        description: `ID Anggota: ${formData.memberId}`,
      });

      window.dispatchEvent(new Event("transactionsUpdated"));
      window.dispatchEvent(new Event("booksUpdated"));
      onClose();
      window.location.reload();
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
          <button
            onClick={() => { onClose(); window.location.reload(); }}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* INFO BUKU — kode di atas judul */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Kode Buku
            </p>
            <p className="font-mono font-bold text-blue-600 text-sm">
              {bookCode || "-"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-2">
              Buku Dipilih
            </p>
            <h4 className="font-bold text-blue-800">{bookTitle}</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAMA PEMINJAM */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Nama Peminjam <span className="text-red-500">*</span>
              </label>
              <Select
                isLoading={isLoadingMembers}
                options={memberOptions}
                onChange={handleSelectMember}
                placeholder="Cari nama anggota..."
                isClearable
                className="font-medium"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    padding: "3px",
                    border: "none",
                    backgroundColor: "#f1f5f9",
                  }),
                }}
              />
            </div>

            {/* ID ANGGOTA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">ID Anggota</label>
              <input
                readOnly
                value={formData.memberId || "Belum memilih nama"}
                className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed text-slate-600"
              />
            </div>

            {/* JUMLAH */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium border-none outline-none"
              />
            </div>

            {/* KELAS + JURUSAN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Kelas</label>
                <input
                  readOnly
                  value={formData.class}
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Jurusan</label>
                <input
                  readOnly
                  value={formData.major}
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* ROLE + GENDER */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Role</label>
                <input
                  readOnly
                  value={formData.role}
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Gender</label>
                <input
                  readOnly
                  value={formData.gender}
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* DURASI */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Durasi Pinjam</label>
              <div className="flex space-x-2 mt-1">
                {[3, 7, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition ${
                      days === d ? "bg-slate-800 text-white shadow" : "bg-slate-50 text-slate-400 border"
                    }`}
                  >
                    {d} Hari
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4 hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200"
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
