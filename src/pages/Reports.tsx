import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiClient from "../apiClient";

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
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
        const response = await apiClient.get("/reports", {
          params: { type, month: monthParam, year, _t: Date.now() },
        });
        setReportData(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Gagal memuat laporan");
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [type, month, year]);

  const downloadPDF = () => {
    if (reportData.length === 0) {
      alert("⚠️ Tidak ada data untuk di-download!");
      return;
    }

    // LANDSCAPE untuk muat semua kolom
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const isTransaksi = type === "transaksi";

    /* HEADER */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DARUNNAJAH", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("LIBRARY MANAGEMENT SYSTEM", 20, 27);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(11);
    doc.text(
      isTransaksi ? "LAPORAN TRANSAKSI" : "LAPORAN KUNJUNGAN",
      pageWidth - 20,
      20,
      { align: "right" }
    );

    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      month === "all"
        ? `Tahun ${year}`
        : `${months[typeof month === "number" ? month - 1 : 0]} ${year}`,
      pageWidth - 20,
      27,
      { align: "right" }
    );

    doc.setDrawColor(0);
    doc.line(20, 33, pageWidth - 20, 33);

    /* HEADER TABEL & KOLOM */
    const tableHeaders = isTransaksi
      ? [["NO", "TGL", "ID", "NAMA", "ROLE", "JUDUL BUKU", "KODE BUKU", "QTY", "STATUS"]]
      : [["NO", "TANGGAL", "ID ANGGOTA", "NAMA", "ROLE", "KELAS", "TUJUAN"]];

    const columnStyles: any = isTransaksi
      ? {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 22, halign: "center" },
          2: { cellWidth: 22, halign: "center" },
          3: { cellWidth: 55, halign: "left" },
          4: { cellWidth: 18, halign: "center" },
          5: { cellWidth: 60, halign: "left" },   // Judul Buku
          6: { cellWidth: 28, halign: "center" },  // Kode Buku
          7: { cellWidth: 12, halign: "center" },
          8: { cellWidth: 38, halign: "center" },
        }
      : {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 35, halign: "center" },
          3: { cellWidth: 87, halign: "left" },
          4: { cellWidth: 25, halign: "center" },
          5: { cellWidth: 25, halign: "center" },
          6: { cellWidth: 50, halign: "left" },
        };
console.log("ISI DATA KUNJUNGAN:", reportData[0]);
    /* DATA TABEL */
    const tableBody = reportData.map((item, index) => {
      const tgl = formatReportDate(item.date || item.borrowDate || item.tanggal);
      const nama = String(item.name || item.nama || item.studentName || "-")
        .substring(0, 30)
        .toUpperCase();

      if (isTransaksi) {
        return [
          String(index + 1),
          tgl,
          item.memberId || "-",
          nama,
          item.role || "-",
          String(item.bookTitle || item.activity || "-").substring(0, 38),
          item.bookCode || "-",
          item.quantity || "1",
          String(item.status || "-").toUpperCase(),
        ];
      }
      return [
        String(index + 1),
        tgl,
        item.memberId || "-",
        nama,
        String(item.chosing || "-").toUpperCase(),
        item.kelas || item.class || "-",
        String(item.tujuan || item.purpose || "-").substring(0, 55),
      ];
    });

autoTable(doc, {
      startY: 40,
      // 1. Mengubah margin agar presisi tengah & mengaktifkan auto-center
      margin: { left: 15, right: 15 },
      tableWidth: "wrap", // Membungkus tabel sesuai ukuran total kolomStyles
      halign: "center",   // Membuat posisi tabel otomatis rata tengah kertas
      head: tableHeaders,
      body: tableBody,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
        overflow: "hidden",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      columnStyles,
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      didParseCell: (data) => {
        // Warna status di kolom terakhir transaksi (index 8)
        if (isTransaksi && data.section === "body" && data.column.index === 8) {
          const s = String(data.cell.raw || "").toUpperCase();
          if (s.includes("KEMBALI")) {
            data.cell.styles.textColor = [22, 163, 74];
            data.cell.styles.fontStyle = "bold";
          } else if (s.includes("TERLAMBAT")) {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = "bold";
          } else if (s.includes("PINJAM")) {
            data.cell.styles.textColor = [217, 119, 6];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Ditemukan ${reportData.length} Data`, 15, finalY + 8);

    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Cetak: ${new Date().toLocaleDateString("id-ID")}`,
      pageWidth - 15,
      finalY + 8,
      { align: "right" }
    );

    doc.save(`Laporan_${type}_${year}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">
        Laporan PDF
      </h1>

      <div className="flex gap-3 flex-wrap bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="transaksi">Riwayat Transaksi</option>
          <option value="kunjungan">Riwayat Kunjungan</option>
        </select>

        <select
          value={month}
          onChange={(e) =>
            setMonth(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">One Year Report</option>
          {months.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={downloadPDF}
          disabled={loading}
          className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "LOADING..." : "DOWNLOAD PDF"}
        </button>
      </div>

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