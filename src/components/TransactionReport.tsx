import { useHistory } from "../context/HistoryContext";
import { generatePDF } from "../utils/generatePDF";

interface Props {
  month: string;
  year: string;
}

export default function TransactionReport({ month, year }: Props) {
  const { history } = useHistory();

  // Ambil semua transaksi (category === "transaksi") dan filter periode
  const transactions = history
  .filter(item => item.category === "transaksi")
  .filter(item => {
    const date = new Date(item.date); // pastikan ini valid
    return !isNaN(date.getTime()) && date.getMonth() + 1 === Number(month) && date.getFullYear() === Number(year);
  })
  .map((item, index) => {
    const date = new Date(item.date);
    return {
      no: index + 1,
      tanggal: date.getDate().toString().padStart(2, "0"),
      nama: item.name,
      buku: item.activity || "-",   // fallback
      status:
        item.status === "meminjam"
          ? "Dipinjam"
          : item.status === "tepat"
          ? "Dikembalikan"
          : item.status === "telat"
          ? "Terlambat"
          : "-",
    };
  });


  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-sm">
          Laporan Transaksi — {month}/{year}
        </p>

        <button
          onClick={() =>
            generatePDF("Laporan Transaksi", month, year, transactions)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ⬇ DOWNLOAD PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-center w-12">No</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Nama Anggota</th>
              <th className="px-4 py-3 text-left">Judul Buku / Aktivitas</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Tidak ada data transaksi
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.no}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-center font-bold">{t.no}</td>
                  <td className="px-4 py-3">
                    {t.tanggal}/{month}/{year}
                  </td>
                  <td className="px-4 py-3 font-semibold">{t.nama}</td>
                  <td className="px-4 py-3">{t.buku}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === "Terlambat"
                          ? "bg-red-100 text-red-600"
                          : t.status === "Dipinjam"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
