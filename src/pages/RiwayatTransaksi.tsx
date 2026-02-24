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
}

const Riwayat: React.FC = () => {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get('/transactions');
      setHistory(res.data.filter((t: any) => t.status === "Dikembalikan"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    window.addEventListener("transactionsUpdated", fetchTransactions);
    return () => {
      window.removeEventListener("transactionsUpdated", fetchTransactions);
    };
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID");

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === history.length) {
      setSelected([]);
    } else {
      setSelected(history.map(i => i.id));
    }
  };

  const deleteSelected = async () => {
    try {
      for (const id of selected) {
        await apiClient.delete(`/transactions/${id}`);
      }
      setSelected([]);
      setSelectMode(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return { status: "Tepat Waktu", late: 0 };
    return { status: "Terlambat", late: diff };
  };

  return (
    <div className="p-10">

      {/* tombol kanan */}
      <div className="absolute right-10 mt-2 flex gap-3">
        <button
          onClick={() => setSelectMode(!selectMode)}
          className="bg-slate-200 px-4 py-2 rounded-full text-xs font-bold"
        >
          {selectMode ? "Cancel" : "Select"}
        </button>

        {selectMode && selected.length > 0 && (
          <button
            onClick={deleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold"
          >
            Hapus
          </button>
        )}
      </div>

      <h1 className="text-2xl font-black mb-6 text-slate-800">
        Riwayat Peminjaman
      </h1>

      {history.length === 0 ? (
        <div className="text-center text-slate-400 font-bold py-20">
          Belum ada riwayat
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow">

          <table className="w-full text-sm text-left bg-white">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                {selectMode && (
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.length === history.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Buku</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Role</th>
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
                  <tr key={item.id} className="border-b">

                    {selectMode && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                    )}

                    <td className="px-6 py-4 font-bold">{i + 1}</td>
                    <td className="px-6 py-4">{item.bookTitle}</td>
                    <td className="px-6 py-4">{item.studentName}</td>
                    <td className="px-6 py-4 capitalize">{item.role}</td>
                    <td className="px-6 py-4">{formatDate(item.borrowDate)}</td>
                    <td className="px-6 py-4">{formatDate(item.dueDate)}</td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.status === "Tepat Waktu"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                        {info.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {info.late > 0 ? `Terlambat ${info.late} hari` : "-"}
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
