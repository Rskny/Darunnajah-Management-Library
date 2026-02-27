import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

interface Transaction {
  id: string;
  bookTitle: string;
  studentName: string;
  role: string;
  borrowDate: string;
  dueDate: string;
  status: string;
  qty?: number;
}

const Riwayat: React.FC = () => {
  const [history, setHistory] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get("/transactions");
      setHistory(res.data.filter((t: Transaction) => t.status === "Dikembalikan"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    window.addEventListener("transactionsUpdated", fetchTransactions);
    return () => window.removeEventListener("transactionsUpdated", fetchTransactions);
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID");

  const getStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff <= 0) return { status: "Tepat Waktu", late: 0 };
    return { status: "Terlambat", late: diff };
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-black mb-6 text-slate-800">
        Riwayat Peminjaman
      </h1>

      {history.length === 0 ? (
        <div className="text-center text-slate-400 font-bold py-20">
          Belum ada riwayat
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow">

          <table className="w-full text-sm bg-white">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 text-center w-16">No</th>
                <th className="px-6 py-4">Buku</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4">Pinjam</th>
                <th className="px-6 py-4">Kembali</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Deskripsi</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, i) => {
                const info = getStatus(item.dueDate);

                return (
                  <tr key={item.id} className="border-b hover:bg-slate-50">

                    <td className="px-6 py-5 text-center font-bold text-slate-500">
                      {i + 1}
                    </td>

                    <td className="px-6 py-5">{item.bookTitle}</td>
                    <td className="px-6 py-5">{item.studentName}</td>
                    <td className="px-6 py-5 capitalize">{item.role}</td>

                    <td className="px-6 py-5 text-center font-semibold">
                      {item.qty ?? 1}
                    </td>

                    <td className="px-6 py-5">{formatDate(item.borrowDate)}</td>
                    <td className="px-6 py-5">{formatDate(item.dueDate)}</td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          info.status === "Tepat Waktu"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {info.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-500 whitespace-nowrap">
                      {info.late > 0
                        ? `Terlambat ${info.late} hari`
                        : "-"}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default Riwayat;