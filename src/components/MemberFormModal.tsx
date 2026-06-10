import { useRef, useState, useEffect } from "react";
import { Member } from "../pages/DataAnggota";
import apiClient from "../apiClient";

interface Props {
  onClose: () => void;
  onImport: (data: Member[]) => void;
  onUpdate?: (id: string, data: Partial<Member>) => void;
  initialData?: Member | null;
}

const REQUIRED_HEADERS = ["nama", "status", "kelas", "jurusan", "gender"];
const REQUIRED_FIELDS = ["nama", "status", "kelas", "jurusan", "gender"];
const KELAS_LIST = ["1", "2", "3", "4", "5", "6", "Intensive", "-"];
const JURUSAN_LIST = ["Tsanawiyah", "IPS", "IPA", "MAK", "-"];

export default function MemberFormModal({ onClose, onImport, onUpdate, initialData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialData;

  const [manualData, setManualData] = useState<Member>({
    nama: "",
    status: "",
    kelas: "",
    jurusan: "",
    gender: "",
  });

  const [generatedId, setGeneratedId] = useState<string>("");

  // Jika mode edit, isi form dengan data yang sudah ada
  useEffect(() => {
    if (initialData) {
      setManualData(initialData);
      setGeneratedId(initialData.id || "");
    }
  }, [initialData]);

  // Fetch next ID hanya saat mode tambah baru
  useEffect(() => {
    if (isEditMode) return;
    const fetchNextId = async () => {
      if (manualData.status === "student" || manualData.status === "teacher") {
        try {
          const res = await apiClient.get(`/members/next-id?status=${manualData.status}`);
          setGeneratedId(res.data.nextId);
        } catch (err) {
          setGeneratedId("Gagal memuat ID");
        }
      } else {
        setGeneratedId("");
      }
    };
    fetchNextId();
  }, [manualData.status, isEditMode]);

  /* CSV */
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
          alert("Header wajib: nama, status, kelas, jurusan, gender");
          return;
        }
        const data: Member[] = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",").map((v) => v.trim());
          const obj = Object.fromEntries(headers.map((h, idx) => [h, values[idx] || ""])) as Member;
          if (REQUIRED_FIELDS.some((f) => !obj[f as keyof Member])) {
            alert(`Field wajib kosong di baris ${i + 1}`);
            return;
          }
          data.push(obj);
        }
        onImport(data);
        onClose();
      } catch {
        alert("Gagal membaca CSV");
      }
    };
    reader.readAsText(file);
  };

  /* SUBMIT */
  const handleManualSubmit = () => {
    if (!manualData.nama) {
      alert("Nama wajib diisi");
      return;
    }

    if (isEditMode && onUpdate && initialData?.id) {
      // MODE EDIT — hanya kirim field yang bisa diubah
      onUpdate(initialData.id, {
        nama: manualData.nama,
        kelas: manualData.kelas,
        jurusan: manualData.jurusan,
        gender: manualData.gender,
      });
    } else {
      // MODE TAMBAH BARU
      const invalid = REQUIRED_FIELDS.some((f) => !manualData[f as keyof Member]);
      if (invalid) { alert("Lengkapi semua field wajib"); return; }
      onImport([manualData]);
    }
    onClose();
  };

  const inputClass = "w-full pl-4 pr-10 py-3 bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium text-sm rounded-xl border-none outline-none transition appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Data Anggota" : "Tambah Anggota Baru"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? `Edit data: ${initialData?.nama}`
                : "Pilih metode import berkas atau isi form secara manual"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">✕</button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* CSV — hanya tampil di mode tambah */}
          {!isEditMode && (
            <>
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-dashed border-blue-200 text-center">
                <div className="max-w-sm mx-auto space-y-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-blue-100 transition active:scale-95"
                  >
                    📤 Upload File CSV
                  </button>
                  <p className="text-[11px] text-blue-500 font-medium">
                    Struktur header wajib:{" "}
                    <code className="bg-blue-100/80 px-1.5 py-0.5 rounded font-mono text-blue-700">
                      nama, status, kelas, jurusan, gender
                    </code>
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files && handleCSVImport(e.target.files[0])}
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atau Input Manual</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </>
          )}

          {/* FORM */}
          <div className="space-y-4">

            {/* STATUS — readonly saat edit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Status / Peran {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              {isEditMode ? (
                <input
                  disabled
                  value={manualData.status}
                  className="w-full px-4 py-3 bg-slate-200 text-slate-500 font-bold text-sm rounded-xl border-none outline-none cursor-not-allowed capitalize"
                />
              ) : (
                <div className="relative">
                  <select
                    className={`${inputClass} ${manualData.status === "" ? "text-slate-400" : "text-slate-800"}`}
                    value={manualData.status}
                    onChange={(e) => setManualData({ ...manualData, status: e.target.value })}
                  >
                    <option value="">Pilih Status / Peran</option>
                    <option value="student">Student (Siswa)</option>
                    <option value="teacher">Teacher (Guru)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* ID — selalu readonly */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">
                ID Anggota {isEditMode ? "" : "(Otomatis)"}
              </label>
              <input
                disabled
                className="w-full px-4 py-3 bg-slate-200 text-slate-500 font-bold text-sm rounded-xl border-none outline-none cursor-not-allowed tracking-wider"
                value={
                  isEditMode
                    ? generatedId
                    : generatedId || "Pilih Status / Peran Terlebih Dahulu..."
                }
              />
            </div>

            {/* NAMA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap..."
                className="w-full px-4 py-3 bg-slate-100 focus:ring-2 focus:ring-blue-600 font-medium text-sm rounded-xl border-none outline-none transition placeholder-slate-400 text-slate-800"
                value={manualData.nama}
                onChange={(e) => setManualData({ ...manualData, nama: e.target.value })}
              />
            </div>

            {/* KELAS + JURUSAN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className={`${inputClass} ${manualData.kelas === "" ? "text-slate-400" : "text-slate-800"}`}
                    value={manualData.kelas}
                    onChange={(e) => setManualData({ ...manualData, kelas: e.target.value })}
                  >
                    <option value="">Pilih Kelas</option>
                    {KELAS_LIST.map((k) => (
                      <option key={k} value={k}>Kelas {k}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className={`${inputClass} ${manualData.jurusan === "" ? "text-slate-400" : "text-slate-800"}`}
                    value={manualData.jurusan}
                    onChange={(e) => setManualData({ ...manualData, jurusan: e.target.value })}
                  >
                    <option value="">Pilih Jurusan</option>
                    {JURUSAN_LIST.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* GENDER */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} ${manualData.gender === "" ? "text-slate-400" : "text-slate-800"}`}
                  value={manualData.gender}
                  onChange={(e) => setManualData({ ...manualData, gender: e.target.value })}
                >
                  <option value="">Pilih Gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualSubmit}
              className="w-full py-3.5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs tracking-widest uppercase rounded-xl shadow-lg shadow-slate-200 transition active:scale-[0.98] mt-6"
            >
              {isEditMode ? "Simpan Perubahan" : "Simpan Data Anggota"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}