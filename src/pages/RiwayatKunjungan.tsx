import { useState, useEffect } from "react";
import { useHistory } from "../context/HistoryContext";

export default function RiwayatKunjungan() {
  const { history, deleteHistory } = useHistory();

  const [data, setData] = useState<any[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  /* sync data */
  useEffect(() => {
    setData(history.filter(i => i.category === "kunjungan"));
  }, [history]);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map(i => i.id));
    }
  };

  const deleteSelected = () => {
    selected.forEach(id => deleteHistory(id));
    setSelected([]);
    setSelectMode(false);
  };

  return (
    <div className="p-8">

      {/* tombol kanan */}
      <div className="flex justify-end gap-3 mb-4">

        <button
          onClick={() => {
            setSelectMode(!selectMode);
            setSelected([]);
          }}
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

      <h1 className="font-bold mb-6 text-lg">Riwayat Kunjungan</h1>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-sm text-slate-400">
          Belum ada data kunjungan
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr className="text-center">

                {selectMode && (
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.length === data.length}
                      onChange={toggleAll}
                    />
                  </th>
                )}

                <th className="p-3">No</th>
                <th className="p-3">Tanggal</th>
                <th>Nama</th>
                <th>Role</th>
                <th>Kegiatan</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={item.id} className="border-t text-center">

                  {selectMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                  )}

                  <td className="p-3">{i + 1}</td>

                  <td>{new Date(item.date).toLocaleDateString("id-ID")}</td>

                  <td>{item.name}</td>

                  <td className="capitalize">{item.role}</td>

                  <td>{item.description}</td>

                  <td>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                      Kunjungan
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}
