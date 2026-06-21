import jsPDF from "jspdf";
import "jspdf-autotable";

// Interface untuk baris data laporan umum
export interface PDFRow {
  no: number;
  tanggal: string;
  nama: string;
  buku?: string;
  keperluan?: string;
  status?: string;
}

// Interface untuk data kunjungan
export interface VisitRow {
  no: number;
  tanggal: string;
  nama: string;
  kelas: string;
  keperluan: string;
}

/**
 * Fungsi untuk generate PDF Laporan Umum
 */
export const generatePDF = (title: string, month: string, year: string, rows: PDFRow[]) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  doc.text(`Periode: ${month}/${year}`, 14, 25);

  (doc as any).autoTable({
    startY: 30,
    head: [['No', 'Tanggal', 'Nama', 'Buku/Keperluan', 'Status']],
    body: rows.map(r => [r.no, r.tanggal, r.nama, r.buku || r.keperluan || "-", r.status]),
  });

  doc.save(`${title}_${month}_${year}.pdf`);
};

/**
 * Fungsi untuk generate PDF Laporan Kunjungan
 */
export const generateVisitPDF = (month: string, year: string, data: VisitRow[]) => {
  const doc = new jsPDF();
  doc.text("Laporan Kunjungan", 14, 15);
  doc.text(`Periode: ${month}/${year}`, 14, 25);

  (doc as any).autoTable({
    startY: 30,
    head: [['No', 'Tanggal', 'Nama', 'Kelas', 'Keperluan']],
    body: data.map(v => [v.no, v.tanggal, v.nama, v.kelas, v.keperluan]),
  });

  doc.save(`Laporan_Kunjungan_${month}_${year}.pdf`);
};