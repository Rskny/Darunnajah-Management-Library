import { useState, useEffect, useRef } from "react";
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

// ─── Komponen Dropdown Download Button ───────────────────────────────────────
function DownloadDropdown({
  label,
  loading,
  onDownloadPDF,
  onDownloadCSV,
}: {
  label: string;
  loading: boolean;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div className="flex rounded-full overflow-hidden shadow-lg shadow-slate-900/20">
        {/* Tombol utama */}
        <button
          onClick={onDownloadPDF}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black tracking-widest uppercase hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "LOADING..." : `⬇ ${label}`}
        </button>
        {/* Divider tipis */}
        <div className="w-px bg-blue-500 self-stretch" />
        {/* Tombol arrow dropdown */}
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={loading}
          className="px-3.5 bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-50"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Format</p>
          </div>
          <button
            onClick={() => { onDownloadPDF(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition group"
          >
            <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-sm group-hover:bg-red-100 transition">📄</span>
            <span className="uppercase tracking-wide">Download PDF</span>
          </button>
          <div className="h-px bg-slate-100 mx-4" />
          <button
            onClick={() => { onDownloadCSV(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition group"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-sm group-hover:bg-emerald-100 transition">📊</span>
            <span className="uppercase tracking-wide">Download CSV</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Helper CSV ───────────────────────────────────────────────────────────────
function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Section: Download Katalog Buku ──────────────────────────────────────────
function KatalogBukuDownload() {
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/books");
      return res.data as any[];
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = async () => {
    const data = await fetchBooks();
    if (!data || data.length === 0) { alert("⚠️ Tidak ada data buku!"); return; }

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DARUNNAJAH", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("LIBRARY MANAGEMENT SYSTEM", 20, 27);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(11);
    doc.text("KATALOG BUKU", pageWidth - 20, 20, { align: "right" });
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - 20, 27, { align: "right" });
    doc.setDrawColor(0);
    doc.line(20, 33, pageWidth - 20, 33);

    autoTable(doc, {
      startY: 40,
      margin: { left: 15, right: 15 },
      head: [["NO", "KODE BUKU", "JUDUL", "PENGARANG", "PENERBIT", "TAHUN", "ISBN", "KATEGORI", "STOK"]],
      body: data.map((b, i) => [
        String(i + 1),
        b.bookCode || "-",
        String(b.title || "-").substring(0, 40),
        String(b.author || "-").substring(0, 25),
        String(b.publisher || "-").substring(0, 20),
        b.year || "-",
        b.isbn || "-",
        b.category || "-",
        String(b.stock ?? "-"),
      ]),
      styles: { fontSize: 7.5, cellPadding: 3, valign: "middle", overflow: "hidden" },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], halign: "center", fontStyle: "bold", fontSize: 8 },
      bodyStyles: { lineColor: [200, 200, 200], lineWidth: 0.3 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 28, halign: "center" },
        2: { cellWidth: 65 },
        3: { cellWidth: 45 },
        4: { cellWidth: 38 },
        5: { cellWidth: 16, halign: "center" },
        6: { cellWidth: 36, halign: "center" },
        7: { cellWidth: 28, halign: "center" },
        8: { cellWidth: 14, halign: "center" },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Total: ${data.length} buku`, 15, finalY + 8);
    doc.save(`Katalog_Buku_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.pdf`);
  };

  const handleCSV = async () => {
    const data = await fetchBooks();
    if (!data || data.length === 0) { alert("⚠️ Tidak ada data buku!"); return; }
    downloadCSV(
      `Katalog_Buku_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.csv`,
      ["NO", "KODE BUKU", "JUDUL", "PENGARANG", "PENERBIT", "TAHUN", "ISBN", "KATEGORI", "STOK", "SUMBER", "TERSEDIA"],
      data.map((b, i) => [
        String(i + 1), b.bookCode || "", b.title || "", b.author || "",
        b.publisher || "", b.year || "", b.isbn || "", b.category || "",
        String(b.stock ?? ""), b.source || "", b.available ? "Ya" : "Tidak",
      ])
    );
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-lg shadow-slate-900/10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">📚</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Export Data</p>
          <h2 className="text-sm font-black text-white uppercase tracking-tight leading-tight">Katalog Buku</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Seluruh koleksi buku perpustakaan</p>
        </div>
      </div>
      <DownloadDropdown
        label="DOWNLOAD KATALOG"
        loading={loading}
        onDownloadPDF={handlePDF}
        onDownloadCSV={handleCSV}
      />
    </div>
  );
}

// ─── Section: Download Data Anggota ──────────────────────────────────────────
function DataAnggotaDownload() {
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/members");
      return res.data as any[];
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = async () => {
    const data = await fetchMembers();
    if (!data || data.length === 0) { alert("⚠️ Tidak ada data anggota!"); return; }

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DARUNNAJAH", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("LIBRARY MANAGEMENT SYSTEM", 20, 27);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(11);
    doc.text("DATA ANGGOTA", pageWidth - 20, 20, { align: "right" });
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - 20, 27, { align: "right" });
    doc.setDrawColor(0);
    doc.line(20, 33, pageWidth - 20, 33);

    autoTable(doc, {
      startY: 40,
      margin: { left: 15, right: 15 },
      head: [["NO", "ID ANGGOTA", "NAMA LENGKAP", "STATUS / ROLE", "KELAS", "JURUSAN", "GENDER"]],
      body: data.map((m, i) => [
        String(i + 1),
        m.id || "-",
        String(m.nama || "-").toUpperCase().substring(0, 40),
        String(m.status || "-").toUpperCase(),
        m.kelas ? `Kelas ${m.kelas}` : "-",
        m.jurusan || "-",
        m.gender || "-",
      ]),
      styles: { fontSize: 8, cellPadding: 3, valign: "middle", overflow: "hidden" },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], halign: "center", fontStyle: "bold", fontSize: 8 },
      bodyStyles: { lineColor: [200, 200, 200], lineWidth: 0.3 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        0: { cellWidth: 14, halign: "center" },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 90 },
        3: { cellWidth: 28, halign: "center" },
        4: { cellWidth: 22, halign: "center" },
        5: { cellWidth: 30, halign: "center" },
        6: { cellWidth: 25, halign: "center" },
      },
      didParseCell: (cellData) => {
        if (cellData.section === "body" && cellData.column.index === 3) {
          const val = String(cellData.cell.raw || "").toUpperCase();
          if (val === "TEACHER") {
            cellData.cell.styles.textColor = [217, 119, 6];
            cellData.cell.styles.fontStyle = "bold";
          } else if (val === "STUDENT") {
            cellData.cell.styles.textColor = [37, 99, 235];
            cellData.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Total: ${data.length} anggota`, 15, finalY + 8);
    doc.save(`Data_Anggota_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.pdf`);
  };

  const handleCSV = async () => {
    const data = await fetchMembers();
    if (!data || data.length === 0) { alert("⚠️ Tidak ada data anggota!"); return; }
    downloadCSV(
      `Data_Anggota_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.csv`,
      ["NO", "ID ANGGOTA", "NAMA LENGKAP", "STATUS", "KELAS", "JURUSAN", "GENDER"],
      data.map((m, i) => [
        String(i + 1), m.id || "", m.nama || "",
        m.status || "", m.kelas || "", m.jurusan || "", m.gender || "",
      ])
    );
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-lg shadow-slate-900/10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">👥</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Export Data</p>
          <h2 className="text-sm font-black text-white uppercase tracking-tight leading-tight">Data Anggota</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Seluruh anggota perpustakaan</p>
        </div>
      </div>
      <DownloadDropdown
        label="DOWNLOAD ANGGOTA"
        loading={loading}
        onDownloadPDF={handlePDF}
        onDownloadCSV={handleCSV}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
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

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const isTransaksi = type === "transaksi";

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
      pageWidth - 20, 20, { align: "right" }
    );
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      month === "all"
        ? `Tahun ${year}`
        : `${months[typeof month === "number" ? month - 1 : 0]} ${year}`,
      pageWidth - 20, 27, { align: "right" }
    );
    doc.setDrawColor(0);
    doc.line(20, 33, pageWidth - 20, 33);

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
          5: { cellWidth: 60, halign: "left" },
          6: { cellWidth: 28, halign: "center" },
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

    const tableBody = reportData.map((item, index) => {
      const tgl = formatReportDate(item.date || item.borrowDate || item.tanggal);
      const nama = String(item.name || item.nama || item.studentName || "-")
        .substring(0, 30)
        .toUpperCase();

      if (isTransaksi) {
        return [
          String(index + 1), tgl, item.memberId || "-", nama,
          item.role || "-",
          String(item.bookTitle || item.activity || "-").substring(0, 38),
          item.bookCode || "-", item.quantity || "1",
          String(item.status || "-").toUpperCase(),
        ];
      }
      return [
        String(index + 1), tgl, item.memberId || "-", nama,
        String(item.chosing || "-").toUpperCase(),
        item.kelas || item.class || "-",
        String(item.tujuan || item.purpose || "-").substring(0, 55),
      ];
    });

    autoTable(doc, {
      startY: 40,
      margin: { left: 15, right: 15 },
      tableWidth: "wrap",
      halign: "center",
      head: tableHeaders,
      body: tableBody,
      styles: { fontSize: 8, cellPadding: 3, valign: "middle", overflow: "hidden", textColor: [0, 0, 0] },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], halign: "center", fontStyle: "bold", fontSize: 8 },
      bodyStyles: { lineColor: [200, 200, 200], lineWidth: 0.3 },
      columnStyles,
      alternateRowStyles: { fillColor: [248, 248, 248] },
      didParseCell: (data) => {
        if (isTransaksi && data.section === "body" && data.column.index === 8) {
          const s = String(data.cell.raw || "").toUpperCase();
          if (s.includes("KEMBALI")) { data.cell.styles.textColor = [22, 163, 74]; data.cell.styles.fontStyle = "bold"; }
          else if (s.includes("TERLAMBAT")) { data.cell.styles.textColor = [220, 38, 38]; data.cell.styles.fontStyle = "bold"; }
          else if (s.includes("PINJAM")) { data.cell.styles.textColor = [217, 119, 6]; data.cell.styles.fontStyle = "bold"; }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Ditemukan ${reportData.length} Data`, 15, finalY + 8);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Cetak: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - 15, finalY + 8, { align: "right" });
    doc.save(`Laporan_${type}_${year}.pdf`);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
        Laporan PDF
      </h1>

      {/* ── Filter Laporan Transaksi / Kunjungan ── */}
      <div className="bg-slate-900 rounded-2xl p-5 shadow-lg shadow-slate-900/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">📋</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Laporan Berkala</p>
            <h2 className="text-sm font-black text-white uppercase tracking-tight leading-tight">Riwayat Transaksi & Kunjungan</h2>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap items-center">
          {/* Select dengan chevron custom */}
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="pl-4 pr-9 py-2 rounded-full text-xs font-black bg-white/10 text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/60 appearance-none cursor-pointer"
            >
              <option value="transaksi" className="text-slate-800 bg-white">Riwayat Transaksi</option>
              <option value="kunjungan" className="text-slate-800 bg-white">Riwayat Kunjungan</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
          </div>

          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="pl-4 pr-9 py-2 rounded-full text-xs font-black bg-white/10 text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/60 appearance-none cursor-pointer"
            >
              <option value="all" className="text-slate-800 bg-white">One Year Report</option>
              {months.map((m, i) => (
                <option key={i} value={i + 1} className="text-slate-800 bg-white">{m}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
          </div>

          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="pl-4 pr-9 py-2 rounded-full text-xs font-black bg-white/10 text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/60 appearance-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} className="text-slate-800 bg-white">{y}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
          </div>

          <button
            onClick={downloadPDF}
            disabled={loading}
            className="px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {loading ? "LOADING..." : "⬇ DOWNLOAD PDF"}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          {loading && (
            <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full">
              ⏳ Loading data...
            </span>
          )}
          {error && (
            <span className="text-[11px] font-bold text-red-300 bg-red-500/20 px-3 py-1 rounded-full">
              ❌ {error}
            </span>
          )}
          {!loading && !error && (
            <span className="text-[11px] font-black text-slate-300 bg-white/10 px-3 py-1 rounded-full">
              📊 Ditemukan {reportData.length} Data
            </span>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Export Data Lainnya</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* ── Section Katalog Buku & Data Anggota ── */}
      <KatalogBukuDownload />
      <DataAnggotaDownload />
    </div>
  );
}
