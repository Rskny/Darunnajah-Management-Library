import React, { useState, useEffect } from "react";
import { Visit } from "../../../types";
import { useHistory } from "../../context/HistoryContext";
import apiClient from "../../apiClient"; // Menggunakan apiClient yang sama agar konsisten
import Select from "react-select";

interface VisitFormModalProps {
  onClose: () => void;
  onSubmit: (visit: Omit<Visit, "id" | "date" | "time">) => void;
}

const VisitFormModal: React.FC<VisitFormModalProps> = ({ onClose, onSubmit }) => {
  const { addHistory } = useHistory();
  
  const [memberOptions, setMemberOptions] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const [formData, setFormData] = useState({
    memberId: "", 
    name: "",
    chosing: "Student", // Berperan sebagai Status / Role
    kelas: "-",
    jurusan: "-",
    purpose: "Membaca" as Visit["purpose"],
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/members/selection");
        const formatted = res.data.map((m: any) => ({
          value: m.id,
          label: m.nama, // Hanya menampilkan nama saja di dropdown utama
          raw: m 
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
      const { memberId, nis, id, nama, status, kelas, jurusan } = selected.raw;
      setFormData({
        ...formData,
        memberId: memberId || nis || String(id) || "-", 
        name: nama,
        chosing: status,
        kelas: kelas,
        jurusan: jurusan,
      });
    } else {
      setFormData({
        ...formData,
        memberId: "",
        name: "",
        chosing: "Student",
        kelas: "-",
        jurusan: "-",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.memberId) {
      alert("Harap pilih nama pengunjung yang valid!");
      return;
    }

    onSubmit(formData);
    addHistory({
      tanggal: new Date().toISOString(),
      nama: formData.name,
      kelas: formData.kelas,
      status: formData.chosing,
      detail: formData.purpose,
      jenis: "Kunjungan",
      memberId: formData.memberId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER (Disamakan style dengan sebelah) */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/30">
          <h3 className="text-2xl font-bold text-slate-800">Buku Tamu Kunjungan</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">✕</button>
        </div>

        {/* BODY (Ditambahkan scroll wrapper max-h-[70vh] overflow-y-auto) */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* SEARCHABLE DROPDOWN NAMA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Nama Lengkap <span className="text-red-500">*</span>
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
                    borderRadius: '0.75rem',
                    padding: '3px',
                    border: 'none',
                    backgroundColor: '#f1f5f9', 
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

            {/* STATUS / ROLE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Status</label>
              <input 
                readOnly 
                value={formData.chosing} 
                className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* KELAS & JURUSAN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Kelas</label>
                <input 
                  readOnly 
                  value={formData.kelas} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Jurusan</label>
                <input 
                  readOnly 
                  value={formData.jurusan} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 opacity-70 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
                />
              </div>
            </div>

            {/* TUJUAN KUNJUNGAN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Tujuan Kunjungan</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value as Visit["purpose"] })}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium border-none outline-none appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
              >
                <option value="Membaca">Membaca</option>
                <option value="Meminjam">Meminjam Buku</option>
                <option value="Mengembalikan">Mengembalikan Buku</option>
                <option value="Belajar">Belajar</option>
              </select>
            </div>

            {/* BUTTON SUBMIT */}
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4 hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200">
              Catat Kehadiran
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default VisitFormModal;