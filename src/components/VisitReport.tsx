import { useHistory } from "../context/HistoryContext";
import { generatePDF } from "../utils/generatePDF";


interface Props {
  month: string;
  year: string;
}

export default function VisitReport({ month, year }: Props) {
  const { history } = useHistory();
  console.log("HISTORY:", history);


  // ambil hanya data kunjungan
  const visits = history
    .filter((item) => item.type === "Kunjungan")
    .filter((item) => {
      const date = new Date(item.date);
      return (
        date.getMonth() + 1 === Number(month) &&
        date.getFullYear() === Number(year)
      );
    })
    .map((item, index) => {
      const date = new Date(item.date);

      return {
        no: index + 1,
        tanggal: date.getDate().toString().padStart(2, "0"),
        nama: item.name,
        kelas: item.className,
        keperluan: item.purpose,
      };
    });

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-sm">
          Laporan Kunjungan — {month}/{year}
        </p>

        <button
          onClick={() => generateVisitPDF(month, year, visits)}
          className="
            px-5 py-2
            rounded-full
            bg-[#3F5EA8]
            text-white
            text-xs
            font-bold
            tracking-widest
            hover:bg-[#364F8F]
          "
        >
          ⬇ DOWNLOAD PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left w-12">No</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Kelas</th>
              <th className="px-4 py-3 text-left">Keperluan</th>
            </tr>
          </thead>

          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Tidak ada data kunjungan
                </td>
              </tr>
            ) : (
              visits.map((v) => (
                <tr
                  key={v.no}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-semibold text-slate-500">
                    {v.no}
                  </td>
                  <td className="px-4 py-3">
                    {v.tanggal}/{month}/{year}
                  </td>
                  <td className="px-4 py-3 font-semibold">{v.nama}</td>
                  <td className="px-4 py-3">{v.kelas}</td>
                  <td className="px-4 py-3">{v.keperluan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
