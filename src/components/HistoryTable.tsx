import React from "react";

interface HistoryItem {
  tanggal: string;
  nama: string;
  kelas?: string;
  status?: string;
  detail: string;
  jenis: string;
}

interface Props {
  data: HistoryItem[];
  onDelete?: (index: number) => void;
}

export default function HistoryTable({ data, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <table className="w-full text-sm">

        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left">Tanggal</th>
            <th className="px-4 py-3 text-left">Jenis</th>
            <th className="px-4 py-3 text-left">Nama</th>
            <th className="px-4 py-3 text-left">Deskripsi</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            const validDate = item.tanggal
              ? new Date(item.tanggal).toLocaleDateString("id-ID")
              : "-";

            return (
              <tr
                key={index}
                className="border-t hover:bg-slate-50 transition"
              >
                {/* Tanggal */}
                <td className="px-4 py-3">
                  {validDate}
                </td>

                {/* Jenis */}
                <td className="px-4 py-3 font-medium">
                  {item.jenis}
                </td>

                {/* Nama */}
                <td className="px-4 py-3">
                  {item.nama}
                </td>

                {/* Detail */}
                <td className="px-4 py-3 text-slate-600">
                  {item.detail}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {item.status ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        item.status === "Terlambat"
                          ? "bg-red-100 text-red-700"
                          : item.status === "Dikembalikan"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  ) : "-"}
                </td>

                {/* ACTION DELETE */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      if (confirm("Hapus riwayat ini?")) {
                        onDelete?.(index);
                      }
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
