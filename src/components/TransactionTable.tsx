import React, { useState } from "react";

export default function TransactionTable({ transactions, onAction, onExtend }: any) {

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

    if (onExtend) {
      onExtend(id, new Date(newDate).toISOString());
      setExtendId(null);
      setNewDate("");
    }
  };

  return (
    <table className="w-full text-sm border rounded-xl overflow-hidden">
      <thead className="bg-slate-100">
        <tr>
          <th>No</th>
          <th>Buku</th>
          <th>Peminjam</th>
          <th>Role</th>
          <th>Pinjam</th>
          <th>Jatuh Tempo</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((t: any, i: number) => {
          const late = calcLate(t.dueDate);

          return (
            <tr key={t.id} className="text-center border-t">

              <td>{i + 1}</td>
              <td>{t.bookTitle}</td>
              <td>{t.studentName}</td>
              <td className="capitalize">{t.role}</td>
              <td>{new Date(t.borrowDate).toLocaleDateString("id-ID")}</td>
              <td>{new Date(t.dueDate).toLocaleDateString("id-ID")}</td>

              <td>
                {late > 0
                  ? <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Telat {late}</span>
                  : <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Dipinjam</span>
                }
              </td>

              <td>
                {extendId === t.id ? (
                  <div className="flex gap-1 justify-center">
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
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
                      className="px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-700 font-bold"
                    >
                      Perpanjang
                    </button>

                    <button
                      onClick={() => onAction(t.id, "return")}
                      className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 font-bold"
                    >
                      Return
                    </button>

                  </div>
                )}
              </td>

            </tr>
          )
        })}
      </tbody>
    </table>
  );
}