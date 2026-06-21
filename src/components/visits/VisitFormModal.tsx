import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import apiClient from "../../apiClient"; 
import { useHistory } from "../../context/HistoryContext";
import Select from "react-select";

interface VisitFormModalProps {
  onClose: () => void;
  onSubmit: (visit: {
    memberId: string;
    name: string;
    chosing: string;
    kelas: string;
    jurusan: string;
    purpose: string;
  }) => void;
}

const VisitFormModal: React.FC<VisitFormModalProps> = ({ onClose, onSubmit }) => {
  const { addHistory } = useHistory();
  
  const [memberOptions, setMemberOptions] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const [formData, setFormData] = useState({
    memberId: "", 
    name: "",
    chosing: "Student", 
    kelas: "-",
    jurusan: "-",
    purpose: "Membaca",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/members/selection");
        const formatted = res.data.map((m: any) => ({
          value: m.id,
          label: m.nama, 
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
        chosing: status || "Student",
        kelas: kelas || "-",
        jurusan: jurusan || "-",
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
    
    if (addHistory) {
  addHistory({
    // 1. Ubah toISOString() (string) menjadi new Date() (objek tanggal)
    date: new Date(), 
    name: formData.name,
    role: "Siswa", // Sesuaikan dengan yang ada di formData
    activity: "Kunjungan",
    category: "kunjungan",
    // 2. Pastikan status sesuai dengan pilihan yang diizinkan di interface
    status: (formData.chosing === "tepat" || formData.chosing === "telat") 
            ? formData.chosing 
            : undefined, 
    description: formData.purpose,
  });
}
    
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      
      {/* CARD MODAL */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER MODAL */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/30 shrink-0">
          <h3 className="text-2xl font-bold text-slate-800">Buku Tamu Kunjungan</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* CONTAINER FORM BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* DROPDOWN NAMA */}
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
                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    padding: '3px',
                    border: 'none',
                    backgroundColor: '#f1f5f9', 
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 99999 })
                }}
              />
            </div>

            {/* ID ANGGOTA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">ID Anggota</label>
              <input 
                disabled 
                readOnly 
                value={formData.memberId || "Belum memilih nama"} 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* STATUS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Status</label>
              <input 
                disabled 
                readOnly 
                value={formData.chosing} 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* KELAS & JURUSAN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Kelas</label>
                <input 
                  disabled 
                  readOnly 
                  value={formData.kelas} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Jurusan</label>
                <input 
                  disabled 
                  readOnly 
                  value={formData.jurusan} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 font-bold border-none outline-none cursor-not-allowed text-slate-600" 
                />
              </div>
            </div>

            {/* TUJUAN KUNJUNGAN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Tujuan Kunjungan</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
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
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4 hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200 shrink-0"
            >
              Catat Kehadiran
            </button>
          </form>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default VisitFormModal;