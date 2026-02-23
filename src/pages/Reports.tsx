import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useHistory } from "../context/HistoryContext";

const months = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

export default function Reports() {
  const { history } = useHistory();

  const [type, setType] = useState<"transaksi"|"kunjungan">("transaksi");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const filtered = history.filter(item=>{
  const rawDate =
    item.date ||
    item.borrowDate ||
    item.createdAt ||
    item.returnDate;

  if(!rawDate) return false;

  const d = new Date(rawDate);

  return (
    d.getMonth()===month &&
    d.getFullYear()===year &&
    item.category===type
  );
});

const normalized = filtered.map(item=>({
  ...item,
  bookTitle: item.bookTitle || item.manualBookTitle || "-",
  activity: item.activity || item.bookTitle || item.manualBookTitle || "-"
}));

  const statusColor = (status?:string)=>{
    if(!status) return [230,230,230];

    const s = status.toLowerCase();

    if(s.includes("meminjam")) return [219,234,254];
    if(s.includes("tepat")) return [220,252,231];
    if(s.includes("terlambat")) return [254,226,226];
    if(s.includes("kunjungan")) return [219,234,254];

    return [230,230,230];
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    /* ===== HEADER MODERN ===== */
    doc.setFillColor(37,99,235);
    doc.rect(0,0,220,4,"F");

    doc.setFont("helvetica","bold");
    doc.setTextColor(30,41,59);
    doc.setFontSize(16);
    doc.text("Laporan Perpustakaan",20,18);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${months[month]} ${year}`,190,15,{align:"right"});
    doc.text(
      type==="transaksi"?"Riwayat Transaksi":"Riwayat Kunjungan",
      190,22,
      {align:"right"}
    );

    doc.setDrawColor(220);
    doc.line(20,28,190,28);

    /* ===== TABLE ===== */
    autoTable(doc,{
      startY:35,
      head:[["Tanggal","Nama","Role","Aktivitas","Status","Keterangan"]],
      body: normalized.map(item=>{
        const d = new Date(item.date);
        return [
          d.toLocaleDateString("id-ID"),
          item.name,
          item.role,
          item.activity,
          item.status || "-",
          item.description || "-"
        ];
      }),
      styles:{
        fontSize:10,
        cellPadding:6,
      },
      headStyles:{
        fillColor:[241,245,249],
        textColor:[30,41,59],
        fontStyle:"bold"
      },
      didParseCell: (data)=>{
        if(data.section==="body" && data.column.index===4){
          const status = data.cell.raw as string;
          const c = statusColor(status);
          data.cell.styles.fillColor = c;
        }
      }
    });

    /* ===== FOOTER ===== */
    const pageHeight = doc.internal.pageSize.height;

    doc.setDrawColor(230);
    doc.line(20,pageHeight-20,190,pageHeight-20);

    doc.setFontSize(9);
    doc.setTextColor(120);

    doc.text(
      `Dicetak otomatis oleh sistem • ${new Date().toLocaleString("id-ID")}`,
      20,
      pageHeight-10
    );

    doc.text(
      "Perpustakaan Digital",
      190,
      pageHeight-10,
      {align:"right"}
    );

    /* ===== SAVE ===== */
    doc.save(`laporan-${type}-${month+1}-${year}.pdf`);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-bold text-slate-700">
        Laporan PDF
      </h1>

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap">

        {/* TYPE */}
        <select
          value={type}
          onChange={e=>setType(e.target.value as any)}
          className="px-4 py-2 rounded-xl border text-sm"
        >
          <option value="transaksi">Riwayat Transaksi</option>
          <option value="kunjungan">Riwayat Kunjungan</option>
        </select>

        {/* MONTH */}
        <select
          value={month}
          onChange={e=>setMonth(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border text-sm"
        >
          {months.map((m,i)=>(
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        {/* YEAR */}
        <select
          value={year}
          onChange={e=>setYear(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border text-sm"
        >
          {[2024,2025,2026,2027].map(y=>(
            <option key={y}>{y}</option>
          ))}
        </select>

        {/* BUTTON */}
        <button
          onClick={downloadPDF}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          Download PDF
        </button>

      </div>

      {/* PREVIEW INFO */}
      <div className="text-sm text-slate-500">
        Total data: {filtered.length}
      </div>

    </div>
  );
}
