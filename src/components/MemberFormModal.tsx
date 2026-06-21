import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Member } from "../../types"; 
import apiClient from "../apiClient";

interface Props {
  onClose: () => void;
  onImport: (data: Member[]) => void;
  onUpdate?: (id: string, data: Partial<Member>) => void;
  initialData?: Member | null;
}

const REQUIRED_HEADERS = ["name", "status", "class", "major", "gender"];
const REQUIRED_FIELDS = ["name", "status", "class", "major", "gender"];
const KELAS_LIST = ["1", "2", "3", "4", "5", "6", "Intensive", "-"];
const JURUSAN_LIST = ["Tsanawiyah", "IPS", "IPA", "MAK", "-"];

export default function MemberFormModal({ onClose, onImport, onUpdate, initialData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialData;

  const [manualData, setManualData] = useState<Member>({
    id: "",
    name: "",
    role: "Siswa", // Default role
    class: "",
    joinDate: new Date().toISOString(),
    status: "active",
    major: "",
    gender: "",
  });

  const [generatedId, setGeneratedId] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setManualData(initialData);
      setGeneratedId(initialData.id || "");
    }
  }, [initialData]);

  const handleCSVImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return alert("File kosong");
        const rows = text.split("\n").map((r) => r.trim()).filter(Boolean);
        if (rows.length < 2) return alert("CSV harus punya header & minimal 1 data");
        const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());
        
        if (REQUIRED_HEADERS.some((h) => !headers.includes(h))) {
          alert("Header wajib: name, status, class, major, gender");
          return;
        }
        
        const data: Member[] = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",").map((v) => v.trim());
          const obj = Object.fromEntries(headers.map((h, idx) => [h, values[idx] || ""]));
          
          const isDataValid = REQUIRED_FIELDS.every(field => obj[field] && obj[field].trim() !== "");
          if (!isDataValid) {
            alert(`Data tidak lengkap pada baris ${i + 1}`);
            return; 
          }
          data.push(obj as unknown as Member);
        }
        onImport(data);
        onClose();
      } catch {
        alert("Gagal membaca CSV");
      }
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = () => {
    if (!manualData.name) {
      alert("Nama wajib diisi");
      return;
    }

    if (isEditMode && onUpdate && initialData?.id) {
      onUpdate(initialData.id, {
        name: manualData.name,
        class: manualData.class,
        major: manualData.major,
        gender: manualData.gender,
        status: manualData.status,
      });
    } else {
      onImport([manualData]);
    }
    onClose();
  };

  const inputClass = "w-full pl-4 pr-10 py-3 bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium text-sm rounded-xl border-none outline-none transition appearance-none cursor-pointer";

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm m-0">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Data Anggota" : "Tambah Anggota Baru"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {!isEditMode && (
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-dashed border-blue-200 text-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
                📤 Upload File CSV
              </button>
              <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files && handleCSVImport(e.target.files[0])} />
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Status</label>
              <select className={inputClass} value={manualData.status} onChange={(e) => setManualData({ ...manualData, status: e.target.value as "active" | "inactive" })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Nama Lengkap</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-100 rounded-xl outline-none" value={manualData.name} onChange={(e) => setManualData({ ...manualData, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Kelas</label>
                <select className={inputClass} value={manualData.class} onChange={(e) => setManualData({ ...manualData, class: e.target.value })}>
                  <option value="">Pilih Kelas</option>
                  {KELAS_LIST.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Jurusan</label>
                <select className={inputClass} value={manualData.major} onChange={(e) => setManualData({ ...manualData, major: e.target.value })}>
                  <option value="">Pilih Jurusan</option>
                  {JURUSAN_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
            </div>

            <button type="button" onClick={handleManualSubmit} className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg mt-6">
              Simpan Data Anggota
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}