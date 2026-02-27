import React, { useState } from "react";

<<<<<<< Updated upstream
export default function TransactionTable({ transactions, onAction, onDeleteSelected, onExtend }: any) {

  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
=======
export default function TransactionTable({ transactions = [], onAction, onExtend }: any) {
>>>>>>> Stashed changes
  const [extendId, setExtendId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
    );
  };

  const calcLate = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  /* delete selected */
  const handleDelete = () => {
    if (onDeleteSelected) {
      onDeleteSelected(selected);
      setSelected([]);
      setShowSelect(false);
    }
  };

  /* submit extend */
  const submitExtend = (id: string) => {
    if (!newDate) return;
<<<<<<< Updated upstream

    if (onExtend) {
      onExtend(id, new Date(newDate).toISOString());
      setExtendId(null);
      setNewDate("");
    }
  };

  return (
    <>
      {/* ACTION BAR */}
      <div className="mb-3 flex gap-3">

        <button
          onClick={() => {
            setShowSelect(!showSelect);
            setSelected([]);
          }}
          className="px-4 py-1 bg-slate-200 rounded-lg text-xs font-bold"
        >
          {showSelect ? "Cancel" : "Select"}
        </button>

        {selected.length > 0 && (
          <button
            onClick={handleDelete}
            className="px-4 py-1 bg-red-500 text-white rounded-lg text-xs font-bold"
          >
            Hapus ({selected.length})
          </button>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-slate-100">
          <tr>
            {showSelect && <th></th>}
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

                {showSelect && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(t.id)}
                      onChange={() => toggle(t.id)}
                    />
                  </td>
                )}

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
    </>
=======
    onExtend?.(id, new Date(newDate).toISOString());
    setExtendId(null);
    setNewDate("");
  };

  return (
    <div className="border rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-sm table-auto min-w-[800px]">
        <thead className="bg-slate-100 sticky top-0 z-10 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Buku</th>
            <th className="px-4 py-3">Peminjam</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Jumlah</th>
            <th className="px-4 py-3">Pinjam</th>
            <th className="px-4 py-3">Jatuh Tempo</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Aksi</th>
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
                <tr key={t.id} className="border-t hover:bg-slate-50 transition" style={{ lineHeight: "2rem" }}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{t.bookTitle}</td>
                  <td className="px-4 py-2">{t.studentName}</td>
                  <td className="px-4 py-2 capitalize">{t.role}</td>
                  <td className="px-4 py-2 font-bold">{t.qty || 1}</td>
                  <td className="px-4 py-2">{new Date(t.borrowDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-2">{new Date(t.dueDate).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${late === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {late === 0 ? "Tepat Waktu" : `Terlambat ${late} hari`}
                    </span>
                  </td>
                  <td className="px-4 py-2">
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
>>>>>>> Stashed changes
  );
}
