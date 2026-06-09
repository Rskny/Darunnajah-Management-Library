import { useState, useEffect } from "react";
import jsPDF from "jsPDF";
import autoTable from "jspdf-autotable";
import apiClient from "../apiClient";

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const formatReportDate = (dateStr: any) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toLocaleDateString("id-ID");
  const parts = String(dateStr).split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) return dateStr;
    const testDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
    if (!isNaN(testDate.getTime())) return testDate.toLocaleDateString("id-ID");
  }
  return String(dateStr);
};

export default function Reports() {
  const [type, setType] = useState<"transaksi" | "kunjungan">("transaksi");
  const [month, setMonth] = useState<number | "all">(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const monthParam = month === "all" ? "all" : month;
        
        console.log("=== LAPORAN PDF DEBUG ===");
        console.log("📤 Mengirim request dengan parameter:", {
          type,
          month: monthParam,
          year
        });
        
        const response = await apiClient.get("/reports", {
          params: { type, month: monthParam, year, _t: Date.now() }
        });
        
        console.log("📥 Response dari server:", response.data);
        console.log("📊 Jumlah data:", response.data?.length || 0);
        
        if (response.data && response.data.length > 0) {
          console.log("🔍 Struktur data (item pertama):", response.data[0]);
          console.log("🏷️ Field-field yang ada:", Object.keys(response.data[0]));
        }
        
        setReportData(response.data || []);
        setError(null);
        
      } catch (err: any) {
        console.error("❌ ERROR:", err.message);
        console.error("Status:", err.response?.status);
        console.error("Data error:", err.response?.data);
        
        setError(err.response?.data?.error || "Gagal memuat laporan");
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [type, month, year]);

  const downloadPDF = () => {
    console.log("📄 Generate PDF dengan data:", reportData.length, "items");
    
    if (reportData.length === 0) {
      alert("⚠️ Tidak ada data untuk di-download!");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const isTransaksi = type === "transaksi";
    
    /* 1. HEADER PDF */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DARUNNAJAH", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("LIBRARY MANAGEMENT SYSTEM", 20, 27);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); 
    doc.setFontSize(11);
    doc.text(isTransaksi ? "LAPORAN TRANSAKSI" : "LAPORAN KUNJUNGAN", pageWidth - 20, 20, { align: "right" });
    
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(month === "all" ? `Tahun ${year}` : `${months[typeof month === 'number' ? month - 1 : 0]} ${year}`, pageWidth - 20, 27, { align: "right" });
    
    doc.setDrawColor(0);
    doc.line(20, 33, pageWidth - 20, 33);
    
    /* 2. KONFIGURASI KOLOM & TABEL */
    const tableHeaders = isTransaksi
      ? [["NO", "ID", "TGL", "NAMA", "ROLE", "BUKU", "QTY", "STATUS"]]
      : [["NO", "ID", "TGL", "NAMA", "ROLE", "KELAS", "TUJUAN"]];
    
    const columnStyles = isTransaksi
      ? {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 17, halign: "center" },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 40, halign: "left" },
          4: { cellWidth: 16, halign: "center" },
          5: { cellWidth: 40, halign: "left" },
          6: { cellWidth: 12, halign: "center" },
          7: { cellWidth: 29, halign: "center" }
        }
      : {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 17, halign: "center" },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 32, halign: "left" },
          4: { cellWidth: 16, halign: "center" },
          5: { cellWidth: 16, halign: "center" },
          6: { cellWidth: 58, halign: "left" }
        };
    
    const tableBody = reportData.map((item, index) => {
      const tgl = formatReportDate(item.date || item.borrowDate || item.tanggal);
      const nama = String(item.name || item.nama || item.studentName || "-").substring(0, 28).toUpperCase();
      
      if (isTransaksi) {
        return [
          String(index + 1),
          item.memberId || "-",
          tgl,
          nama,
          item.role || "-",
          String(item.bookTitle || item.activity || "-").substring(0, 30),
          item.quantity || "1",
          String(item.status || "-").toUpperCase()
        ];
      }
      return [
        String(index + 1),
        item.memberId || "-",
        tgl,
        nama,
        item.role || "-",
        item.kelas || item.class || "-",
        String(item.tujuan || item.purpose || "-").substring(0, 40)
      ];
    });
    
    autoTable(doc, {
      startY: 40,
      margin: { left: 12, right: 12 },
      head: tableHeaders,
      body: tableBody,
      styles: { 
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle', 
        halign: 'left',
        overflow: 'hidden',
        textColor: [0, 0, 0]
      },
      headStyles: { 
        fillColor: [15, 23, 42], 
        textColor: [255, 255, 255], 
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold',
        fontSize: 8,
        minCellHeight: 8
      },
      bodyStyles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3
      },
      columnStyles: columnStyles,
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      didParseCell: (data) => {
        if (data.section === "head") {
          data.cell.styles.fillColor = [15, 23, 42];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.overflow = 'hidden';
        }
        
        if (isTransaksi && data.section === "body" && data.column.index === 7) {
          const s = String(data.cell.raw || "").toUpperCase();
          if (s.includes("TEPAT") || s.includes("KEMBALI")) {
            data.cell.styles.textColor = [22, 163, 74];
            data.cell.styles.fontStyle = 'bold';
          } else if (s.includes("TERLAMBAT") || s.includes("TELAT")) {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = 'bold';
          } else if (s.includes("PINJAM")) {
            data.cell.styles.textColor = [217, 119, 6];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Ditemukan ${reportData.length} Data`, 12, finalY + 8);
    
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Cetak: ${new Date().toLocaleDateString('id-ID')}`, pageWidth - 12, finalY + 8, { align: "right" });
    
    doc.save(`Laporan_${type}_${year}.pdf`);
    console.log("✅ PDF berhasil di-download!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Laporan PDF</h1>
      
      <div className="flex gap-3 flex-wrap bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
        <select 
          value={type} 
          onChange={e => {
            const newType = e.target.value as any;
            console.log("🔄 Tipe diubah ke:", newType);
            setType(newType);
          }} 
          className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="transaksi">Riwayat Transaksi</option>
          <option value="kunjungan">Riwayat Kunjungan</option>
        </select>
        
        <select 
          value={month} 
          onChange={e => {
            const newMonth = e.target.value === "all" ? "all" : Number(e.target.value);
            console.log("🔄 Bulan diubah ke:", newMonth);
            setMonth(newMonth as any);
          }} 
          className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">One Year Report</option>
          {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        
        <select 
          value={year} 
          onChange={e => {
            const newYear = Number(e.target.value);
            console.log("🔄 Tahun diubah ke:", newYear);
            setYear(newYear);
          }} 
          className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {[2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
        </select>
        
        <button 
          onClick={downloadPDF} 
          disabled={loading}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "LOADING..." : "DOWNLOAD PDF"}
        </button>
      </div>

      {/* STATUS MESSAGE */}
      {loading && (
        <div className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-4 py-2 rounded-full mb-4">
          ⏳ Loading data...
        </div>
      )}
      
      {error && (
        <div className="text-sm font-semibold text-red-600 bg-red-50 inline-block px-4 py-2 rounded-full mb-4">
          ❌ {error}
        </div>
      )}
      
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 inline-block px-2 rounded-lg">
        📊 Ditemukan {reportData.length} Data
      </div>
    </div>
  );
}