import React from "react";

export default function TransactionTable({
  transactions = [],
  onAction,
  extendId,
  setExtendId,
  newDate,
  setNewDate,
  submitExtend,
}: any) {

  const calcLate = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <table className="w-full text-sm text-left border-collapse" style={{ minWidth: "1350px" }}>
      <thead className="sticky top-0 z-30 bg-slate-100 text-slate-600 text-xs uppercase">
        <tr>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 w-12 text-center">No</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 whitespace-nowrap">ID Anggota</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 whitespace-nowrap">Nama Peminjam</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 whitespace-nowrap">Judul Buku</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 whitespace-nowrap">Kode Buku</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 text-center">Role</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 text-center">Qty</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 text-center">Pinjam</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 text-center">Deadline</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 text-center">Status</th>
          <th className="px-6 py-5 bg-slate-100 border-b border-slate-200 text-center">Action</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {transactions.length === 0 ? (
          <tr>
            <td colSpan={11} className="py-20 text-center text-slate-400">Data Kosong</td>
          </tr>
        ) : (
          transactions.map((t: any, i: number) => {
            const late = calcLate(t.dueDate);
            return (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 text-slate-400 font-bold text-center border-b border-slate-100">{i + 1}</td>

                <td className="px-6 py-4 font-bold text-slate-800 border-b border-slate-100 font-mono">
                  {t.memberId || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600 whitespace-nowrap border-b border-slate-100">
                  {t.studentName || t.name}
                </td>

                <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap border-b border-slate-100">
                  {t.bookTitle || t.activity}
                </td>

                {/* KOLOM KODE BUKU */}
                <td className="px-6 py-4 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg whitespace-nowrap">
                    {t.bookCode || "-"}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-500 text-center capitalize italic border-b border-slate-100">
                  {t.role}
                </td>

                <td className="px-6 py-4 text-center font-bold border-b border-slate-100">
                  {t.quantity || 1}
                </td>

                <td className="px-6 py-4 text-slate-500 text-center whitespace-nowrap border-b border-slate-100">
                  {t.borrowDate
                    ? new Date(t.borrowDate).toLocaleDateString("id-ID")
                    : new Date(t.date).toLocaleDateString("id-ID")}
                </td>

                <td className="px-6 py-4 text-slate-500 text-center whitespace-nowrap border-b border-slate-100">
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString("id-ID") : "-"}
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-100">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    late === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {late === 0 ? "Tepat Waktu" : "Terlambat"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center border-b border-slate-100">
                  {extendId === t.id ? (
                    <div className="flex gap-1 justify-center">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="border border-slate-200 px-2 py-1 text-[10px] rounded-lg outline-none"
                      />
                      <button
                        onClick={() => submitExtend(t.id)}
                        className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setExtendId(t.id)}
                        className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl text-[10px] font-bold"
                      >
                        Perpanjang
                      </button>
                      <button
                        onClick={() => onAction?.(t.id)}
                        className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-bold"
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
  );
}