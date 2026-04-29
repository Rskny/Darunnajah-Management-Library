import React, { useState, useEffect } from "react";
import { Visit } from "../../../types";
import { useHistory } from "../../context/HistoryContext";
import axios from "axios";
import Select from "react-select"; // Import react-select

interface VisitFormModalProps {
  onClose: () => void;
  onSubmit: (visit: Omit<Visit, "id" | "date" | "time">) => void;
}

const VisitFormModal: React.FC<VisitFormModalProps> = ({ onClose, onSubmit }) => {
  const { addHistory } = useHistory();
  
  // State untuk menyimpan daftar anggota dari backend
  const [memberOptions, setMemberOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    kelas: "-",
    jurusan: "-",
    chosing: "Student",
    purpose: "Membaca" as Visit["purpose"],
  });

  // 1. Ambil data anggota saat modal dibuka
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9602/api/members/selection", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Format data untuk react-select
        const formatted = res.data.map((m: any) => ({
          value: m.id,
          label: m.nama, // Apa yang muncul di pilihan
          // Simpan data asli untuk autofill
          raw: m 
        }));

        setMemberOptions(formatted);
      } catch (err) {
        console.error("Gagal mengambil data anggota", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // 2. Fungsi Autofill saat nama dipilih
  const handleSelectMember = (selected: any) => {
    if (selected) {
      const { nama, status, kelas, jurusan } = selected.raw;
      setFormData({
        ...formData,
        name: nama,
        chosing: status,
        kelas: kelas,
        jurusan: jurusan,
      });
    } else {
      // Jika pilihan dihapus (clear)
      setFormData({ ...formData, name: "", kelas: "-", jurusan: "-", chosing: "Student" });
    }
  };

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
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* Nama Lengkap - Searchable Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
            <Select
              isLoading={isLoading}
              options={memberOptions}
              onChange={handleSelectMember}
              placeholder="Cari nama siswa/guru..."
              isClearable
              className="mt-1"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '1rem',
                  padding: '4px',
                  border: 'none',
                  backgroundColor: '#f8fafc', // slate-50
                }),
              }}
            />
          </div>

          {/* Status (Autofill & Read Only) */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
            <input 
              readOnly 
              value={formData.chosing} 
              className="w-full px-5 py-3 bg-slate-100 text-slate-500 rounded-2xl mt-1 border-none outline-none cursor-not-allowed"
            />
          </div>

          {/* Kelas & Jurusan (Autofill & Read Only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Kelas</label>
              <input 
                readOnly 
                value={formData.kelas} 
                className="w-full px-5 py-3 bg-slate-100 text-slate-500 rounded-2xl mt-1 border-none outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Jurusan</label>
              <input 
                readOnly 
                value={formData.jurusan} 
                className="w-full px-5 py-3 bg-slate-100 text-slate-500 rounded-2xl mt-1 border-none outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Tujuan Kunjungan (Manual) */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tujuan Kunjungan</label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value as Visit["purpose"] })}
              className="w-full px-5 py-3 bg-slate-50 rounded-2xl mt-1 border-none outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="Membaca">Membaca</option>
              <option value="Meminjam">Meminjam Buku</option>
              <option value="Mengembalikan">Mengembalikan Buku</option>
              <option value="Belajar">Belajar</option>
            </select>
          </div>

          <button type="submit" className="w-full py-4 bg-[#3b5998] hover:bg-[#2d4373] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
            Catat Kehadiran
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitFormModal;