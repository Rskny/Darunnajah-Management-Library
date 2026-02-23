// HistoryPDFButton.tsx
import React from "react";
import { useHistory } from "../context/HistoryContext";
import { generatePDF, PDFRow } from "./generatePDF";

const HistoryPDFButton = () => {
  const { history } = useHistory();

  const handleDownloadPDF = () => {
    if (history.length === 0) {
      alert("Riwayat kosong!");
      return;
    }

    // Map HistoryItem ke PDFRow
    const rows: PDFRow[] = history.map((item, index) => ({
      no: index + 1,
      tanggal: new Date(item.date).toLocaleString(),
      nama: item.name,
      // Untuk transaksi peminjaman / pengembalian isi 'buku', untuk kunjungan isi 'keperluan'
      buku:
        item.category === "transaksi"
          ? item.activity // bisa diganti dengan judul buku jika ada
          : undefined,
      keperluan: item.category === "kunjungan" ? item.activity : undefined,
      status: item.status ?? "-"
    }));

    // Panggil generatePDF
    generatePDF("Laporan Riwayat", "02", "2026", rows);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Download Laporan PDF
    </button>
  );
};

export default HistoryPDFButton;
