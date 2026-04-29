import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiClient from "../apiClient";

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function Reports() {
  const [type, setType] = useState<"transaksi" | "kunjungan">("transaksi");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await apiClient.get("/reports", {
          params: { type, month, year }
        });
        setReportData(response.data);
      } catch (err) {
        console.error("Gagal memuat laporan", err);
      }
    };
    fetchReport();
  }, [type, month, year]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    /* 1. HEADER / KOP SURAT */
    doc.setFillColor(30, 41, 59); 
    doc.rect(0, 0, pageWidth, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("DARUNNAJAH", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("LIBRARY MANAGEMENT SYSTEM", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); 
    doc.text(type === "transaksi" ? "LAPORAN TRANSAKSI" : "LAPORAN KUNJUNGAN", pageWidth - 20, 20, { align: "right" });
    
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`${months[month]} ${year}`, pageWidth - 20, 25, { align: "right" });

    doc.setDrawColor(226, 232, 240); 
    doc.line(20, 32, pageWidth - 20, 32);

    /* 2. TABLE DENGAN KOLOM TERPISAH */
    autoTable(doc, {
      startY: 40,
      margin: { left: 20, right: 20 },
      head: [["NO", "TANGGAL", "NAMA", "ROLE", "BUKU", "QTY", "STATUS"]],
      body: reportData.map((item, index) => {
        const d = new Date(item.date);
        
        // Membersihkan teks "(1 buah)" dari nama buku agar lebih rapi
        const cleanBookTitle = item.activity 
          ? item.activity.replace(/\(\d+\sbuah\)/gi, "").trim() 
          : "-";

        return [
          index + 1,
          d.toLocaleDateString("id-ID"),
          item.name.toUpperCase(),
          item.role || "-",
          cleanBookTitle, 
          item.quantity || "1", // Menampilkan QTY di kolom sendiri
          item.status ? item.status.toUpperCase() : "-"
        ];
      }),
      styles: {
        fontSize: 8.5,
        cellPadding: 4,
        valign: 'middle',
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: 'center'
      },
     /* Cari bagian columnStyles di dalam autoTable dan ganti dengan ini */
columnStyles: {
  0: { halign: 'center', cellWidth: 15 }, // NO: dinaikkan ke 15 agar tidak patah
  1: { halign: 'center', cellWidth: 28 }, // TANGGAL: dinaikkan ke 28 agar "29/4/2026" muat satu baris
  2: { fontStyle: 'bold', cellWidth: 35 }, 
  3: { cellWidth: 20 },
  4: { cellWidth: 'auto' }, 
  5: { halign: 'center', cellWidth: 15 }, // QTY: dinaikkan ke 15 agar teks "QTY" aman
  6: { halign: 'center', cellWidth: 30 }
},
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 6) {
          const status = data.cell.raw as string;
          if (status.includes("TEPAT") || status.includes("KEMBALI")) {
            data.cell.styles.textColor = [22, 163, 74]; 
          } else if (status.includes("TERLAMBAT") || status.includes("TELAT")) {
            data.cell.styles.textColor = [220, 38, 38]; 
          } else if (status.includes("PINJAM") || status.includes("DIPINJAM")) {
            data.cell.styles.textColor = [217, 119, 6]; 
          }
        }
      }
    });

    /* 3. FOOTER */
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    const pageHeight = doc.internal.pageSize.height;

    let signY = finalY + 20;
    if (signY > pageHeight - 50) {
        doc.addPage();
        signY = 30;
    }

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Jakarta, ${new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 70, signY);
    doc.setFont("helvetica", "bold");
    doc.text("Admin Perpustakaan", pageWidth - 70, signY + 7);
    
    doc.setDrawColor(30, 41, 59);
    doc.line(pageWidth - 70, signY + 30, pageWidth - 20, signY + 30);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("NIP. 2026.04.29.001", pageWidth - 70, signY + 35);

    doc.save(`Laporan_${type}_${month + 1}_${year}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        Laporan PDF
      </h1>

      <div className="flex gap-3 flex-wrap bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <select value={type} onChange={e => setType(e.target.value as any)} className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="transaksi">Riwayat Transaksi</option>
          <option value="kunjungan">Riwayat Kunjungan</option>
        </select>

        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>

        <select value={year} onChange={e => setYear(Number(e.target.value))} className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
          {[2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
        </select>

        <button onClick={downloadPDF} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
          DOWNLOAD PDF
        </button>
      </div>

      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full">
        Ditemukan {reportData.length} Data
      </div>
    </div>
  );
}