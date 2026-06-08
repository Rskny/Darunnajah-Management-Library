import { useHistory } from "../context/HistoryContext";

interface Props {
  month: string;
  year: string;
}

export default function TransactionReport({ month, year }: Props) {
  const { history } = useHistory();

  // 1. FILTER DATA BERDASARKAN BULAN DAN TAHUN
  const transactions = history
    .filter(item => item.category === "transaksi")
    .filter(item => {
      // Mengantisipasi jika field tanggal di database menggunakan 'date' atau 'borrowDate'
      const dateStr = item.date || item.borrowDate;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && 
             date.getMonth() + 1 === Number(month) && 
             date.getFullYear() === Number(year);
    })
    .map((item, index) => {
      const dateStr = item.date || item.borrowDate;
      const date = new Date(dateStr);
      
      // Ambil status asli dari backend atau history context
      const statusAsli = item.status ? item.status.toLowerCase() : "";

      return {
        no: index + 1,
        tanggal: !isNaN(date.getTime()) ? date.getDate().toString().padStart(2, "0") : "00",
        memberId: item.memberId || item.idAnggota || "-", // Tambahan untuk memunculkan Member ID (Foto 3)
        nama: item.studentName || item.name || "-",
        buku: item.bookTitle || item.activity || "-",
        status:
          statusAsli === "meminjam" || statusAsli === "dipinjam" ? "Dipinjam" :
          statusAsli === "tepat" || statusAsli === "dikembalikan" ? "Dikembalikan" :
          statusAsli === "telat" || statusAsli === "terlambat" ? "Terlambat" : "-",
      };
    });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* TOMBOL DOWNLOAD */}
      <div className="flex justify-between items-center print:hidden bg-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="text-white">
          <h3 className="font-black text-sm uppercase tracking-widest">Laporan Siap Cetak</h3>
          <p className="text-[10px] text-slate-400 font-medium">Periode: {month} / {year}</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-blue-700 transition-all transform active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DOWNLOAD PDF SEKARANG
        </button>
      </div>

      {/* AREA KERTAS LAPORAN (Ukuran A4) */}
      <div className="bg-white mx-auto print:m-0 print:p-0 print:shadow-none shadow-2xl overflow-hidden" 
           style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}>
        
        {/* KOP SURAT / HEADER */}
        <div className="flex justify-between items-end border-b-[6px] border-slate-900 pb-8 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-2xl rotate-3 shadow-lg">
              <span className="text-white font-black text-4xl italic -rotate-3">D</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">Darunnajah</h1>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-2 uppercase">Library Management System</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-slate-900 px-4 py-1.5 mb-3 inline-block">
              <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Official Report</p>
            </div>
            <p className="text-4xl font-black text-slate-900 leading-none">{month} <span className="text-slate-300">/</span> {year}</p>
          </div>
        </div>

        {/* TABEL LAPORAN */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900">
              <th className="border-2 border-slate-900 px-4 py-4 text-[10px] uppercase font-black text-white w-12">No</th>
              <th className="border-2 border-slate-900 px-4 py-4 text-[10px] uppercase font-black text-white text-left">Tanggal</th>
              <th className="border-2 border-slate-900 px-4 py-4 text-[10px] uppercase font-black text-white text-left">ID Anggota</th> {/* REVISI FOTO 1 & 3 */}
              <th className="border-2 border-slate-900 px-4 py-4 text-[10px] uppercase font-black text-white text-left font-sans">Nama Anggota</th>
              <th className="border-2 border-slate-900 px-4 py-4 text-[10px] uppercase font-black text-white text-left">Aktivitas Buku</th>
              <th className="border-2 border-slate-900 px-4 py-4 text-[10px] uppercase font-black text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center text-slate-300 italic font-medium tracking-widest text-xs uppercase border-2 border-slate-100">
                  Data transaksi tidak tersedia
                </td>
              </tr>
            ) : (
              transactions.map((t, index) => (
                <tr key={index} className={index % 2 === 1 ? "bg-slate-50/80" : "bg-white"}>
                  <td className="border-2 border-slate-200 px-4 py-4 text-center text-[11px] font-black text-slate-400">{t.no}</td>
                  <td className="border-2 border-slate-200 px-4 py-4 text-[11px] font-bold text-slate-700">{t.tanggal}/{month}/{year}</td>
                  <td className="border-2 border-slate-200 px-4 py-4 text-[11px] font-bold text-slate-900 uppercase">{t.memberId}</td> {/* REVISI FOTO 3 */}
                  <td className="border-2 border-slate-200 px-4 py-4 text-[11px] font-black text-slate-900 uppercase tracking-tight">{t.nama}</td>
                  <td className="border-2 border-slate-200 px-4 py-4 text-[11px] text-slate-600 italic leading-snug">{t.buku}</td>
                  <td className="border-2 border-slate-200 px-4 py-4 text-center">
                    {/* SAFE GUARD: Menggunakan optional chaining (?.) agar tidak crash jika status kosong */}
                    <div className={`text-[9px] font-black px-3 py-1.5 inline-block border-2 rounded-md ${
                      t.status === "Terlambat" ? "bg-red-50 text-red-700 border-red-700" :
                      t.status === "Dipinjam" ? "bg-amber-50 text-amber-700 border-amber-700" :
                      "bg-emerald-50 text-emerald-700 border-emerald-700"
                    }`}>
                      {(t.status || "-").toUpperCase()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* TANDA TANGAN */}
        <div className="mt-24 hidden print:flex justify-end pr-10">
          <div className="text-center w-64">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-24">Dicetak Pada: {new Date().toLocaleDateString('id-ID')}</p>
            <div className="h-[2px] bg-slate-900 mb-2"></div>
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter italic">Admin Perpustakaan Digital</p>
            <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-1 uppercase leading-none">NIP. 20260429.001</p>
          </div>
        </div>

      </div>
    </div>
  );
}