import React, { useState } from "react";

export default function TransactionTable({ transactions = [], onAction, onExtend }: any) {
  const [extendId, setExtendId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  const calcLate = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const submitExtend = (id: string) => {
    if (!newDate) return;
    onExtend?.(id, newDate);
    setExtendId(null);
    setNewDate("");
  };

  return (
    <div className="border rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-sm table-auto min-w-[800px]">
        <thead className="bg-slate-100 sticky top-0 z-10 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Book</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Borrow</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-slate-400">
                Tidak ada data peminjaman
              </td>
            </tr>
          ) : (
            transactions.map((t: any, i: number) => {
              const late = calcLate(t.dueDate);
              return (
                <tr
                  key={t.id}
                  className="border-t hover:bg-slate-50 transition"
                  style={{ lineHeight: "2.2rem" }} // lebih lega antar row
                >
                  <td className="px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{t.bookTitle}</td>
                  <td className="px-4 py-3 text-center">{t.studentName}</td>
                  <td className="px-4 py-3 text-center capitalize">{t.role}</td>
                  <td className="px-4 py-3 text-center font-bold">{t.quantity || 1}</td>
                  <td className="px-4 py-3 text-center">{new Date(t.borrowDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3 text-center">{new Date(t.dueDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap inline-block`}
                      style={{ minWidth: "90px" }} // biar kolom status nggak terlalu sempit
                    >
                      {late === 0 ? "Tepat Waktu" : `Terlambat ${late} hari`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {extendId === t.id ? (
                      <div className="flex gap-1 justify-center">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="border px-2 text-xs rounded"
                        />
                        <button
                          onClick={() => submitExtend(t.id)}
                          className="px-2 text-xs bg-blue-500 text-white rounded"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setExtendId(t.id)}
                          className="px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-700 font-bold hover:scale-105 transition"
                        >
                          Perpanjang
                        </button>
                        <button
                          onClick={() => onAction?.(t.id, "return")}
                          className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 font-bold hover:scale-105 transition"
                        >
                          Return
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}