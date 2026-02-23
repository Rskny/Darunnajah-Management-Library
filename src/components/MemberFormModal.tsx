import { useRef, useState } from "react";
import { Member } from "../pages/DataAnggota";

interface Props {
  onClose: () => void;
  onImport: (data: Member[]) => void;
}

const REQUIRED_HEADERS = ["nama", "nis", "kelas", "jurusan", "gender"];
const REQUIRED_FIELDS = ["nama", "kelas", "jurusan", "gender"];

const KELAS_LIST = ["1", "2", "3", "4", "5", "6"];
const JURUSAN_LIST = ["Tsanawiyah", "IPS", "IPA", "MAK"];

export default function MemberFormModal({ onClose, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [manualData, setManualData] = useState<Member>({
    nama: "",
    nis: "",
    kelas: "",
    jurusan: "",
    gender: "",
  });

  /* ================= CSV ================= */
  const handleCSVImport = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return alert("File kosong");

        const rows = text
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean);

        if (rows.length < 2)
          return alert("CSV harus punya header & minimal 1 data");

        const headers = rows[0]
          .split(",")
          .map((h) => h.trim().toLowerCase());

        if (REQUIRED_HEADERS.some((h) => !headers.includes(h))) {
          alert("Header wajib: nama, nis, kelas, jurusan, gender");
          return;
        }

        const data: Member[] = [];

        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",").map((v) => v.trim());

          const obj = Object.fromEntries(
            headers.map((h, idx) => [h, values[idx] || ""])
          ) as Member;

          const invalid = REQUIRED_FIELDS.some(
            (f) => !obj[f as keyof Member]
          );

          if (invalid) {
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

  /* ================= MANUAL ================= */
  const handleManualSubmit = () => {
    const invalid = REQUIRED_FIELDS.some(
      (f) => !manualData[f as keyof Member]
    );

    if (invalid) {
      alert("Lengkapi semua field wajib");
      return;
    }

    onImport([manualData]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[85vh] flex flex-col relative">

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute top-6 right-6
            w-10 h-10
            rounded-full
            bg-slate-100
            flex items-center justify-center
            text-slate-400 font-bold
            hover:bg-slate-900 hover:text-white
            transition
          "
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="pt-12 pb-6 px-10 text-center">
          <h2 className="text-xl font-black tracking-widest">
            INPUT DATA
          </h2>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-6">

          {/* CSV */}
          <div className="bg-blue-50 rounded-3xl p-6 text-center border border-blue-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="
                w-full py-4 rounded-full
                bg-white border border-blue-200
                text-blue-600 font-bold text-xs tracking-widest
                hover:bg-blue-600 hover:text-white transition
              "
            >
              ⬆ IMPORT CSV
            </button>

            <p className="text-[10px] text-blue-400 mt-3">
              Header: nama, nis (opsional), kelas, jurusan, gender
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleCSVImport(e.target.files[0])
              }
            />
          </div>

          {/* DIVIDER */}
          <div className="text-center text-[10px] text-slate-400 font-bold tracking-widest">
            ATAU INPUT MANUAL
          </div>

          {/* MANUAL FORM */}
          <div className="space-y-4">
            <input
              placeholder="Nama Lengkap *"
              className="w-full px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
              value={manualData.nama}
              onChange={(e) =>
                setManualData({ ...manualData, nama: e.target.value })
              }
            />

            <input
              placeholder="NIS (Opsional)"
              className="w-full px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
              value={manualData.nis}
              onChange={(e) =>
                setManualData({ ...manualData, nis: e.target.value })
              }
            />

            <select
              className="w-full px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
              value={manualData.kelas}
              onChange={(e) =>
                setManualData({ ...manualData, kelas: e.target.value })
              }
            >
              <option value="">Pilih Kelas *</option>
              {KELAS_LIST.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>

            <select
              className="w-full px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
              value={manualData.jurusan}
              onChange={(e) =>
                setManualData({ ...manualData, jurusan: e.target.value })
              }
            >
              <option value="">Pilih Jurusan *</option>
              {JURUSAN_LIST.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>

            <select
              className="w-full px-5 py-3 bg-slate-100 rounded-xl font-bold text-sm"
              value={manualData.gender}
              onChange={(e) =>
                setManualData({ ...manualData, gender: e.target.value })
              }
            >
              <option value="">Pilih Gender *</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>

            <button
              onClick={handleManualSubmit}
              className="
                w-full py-4 rounded-full
                bg-slate-900 text-white
                font-black text-xs tracking-widest
              "
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
