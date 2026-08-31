import React from "react";
import { useSearchParams } from "react-router-dom";

interface HistoryItem {
  tanggal: string;
  nama: string;
  kelas?: string;
  status?: string;
  detail: string;
  jenis: string;
  memberId?: string; // Ditambahkan untuk menampung ID Anggota
}

interface Props {
  data: HistoryItem[];
  onDelete?: (index: number) => void;
}

export default function HistoryTable({ data, onDelete }: Props) {
  // Ambil query search dari URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

  // Filter data berdasarkan kata kunci yang diketik
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;

    const namaMatch = item.nama?.toLowerCase().includes(searchQuery);
    const memberIdMatch = item.memberId?.toLowerCase().includes(searchQuery);
    const jenisMatch = item.jenis?.toLowerCase().includes(searchQuery);
    const detailMatch = item.detail?.toLowerCase().includes(searchQuery);

    return namaMatch || memberIdMatch || jenisMatch || detailMatch;
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <table className="w-full text-sm">

        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left">Tanggal</th>
            <th className="px-4 py-3 text-left">Jenis</th>
            <th className="px-4 py-3 text-left">ID Anggota</th> {/* Tambah Header ID Anggota */}
            <th className="px-4 py-3 text-left">Nama</th>
            <th className="px-4 py-3 text-left">Deskripsi</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
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

                  {/* ID Anggota */}
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                    {item.memberId || "-"}
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
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}