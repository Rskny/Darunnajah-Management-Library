import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox";
import apiClient from "../apiClient";
import { useLocation } from "react-router-dom";

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
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [limit, setLimit] = useState(10);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const q = (searchParams.get("search") || "").toLowerCase();

    const fetchTransactions = async () => {
        const res = await apiClient.get("/transactions");
        setHistory(res.data.filter((t: any) => t.status === "Dikembalikan"));
    };

    useEffect(() => { fetchTransactions() }, []);

    const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID");

    const toggleSelect = (id: string) => {
        setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    };

    const toggleAll = () => {
        if (selected.length === history.length) setSelected([]);
        else setSelected(history.map(i => i.id));
    };

    const sorted = [...history]
        .filter((t: any) =>
            !q ||
            t.bookTitle?.toLowerCase().includes(q) ||
            t.studentName?.toLowerCase().includes(q) ||
            t.role?.toLowerCase().includes(q)
        )
        .sort((a, b) => sort === "asc" ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id))
        .slice(0, limit);

    return (
        <div className="p-8 space-y-8">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <PageHeader
                    title="Riwayat Peminjaman"
                    subtitle="Histori transaksi buku"
                    onSortChange={setSort}
                    onLimitChange={setLimit}
                    right={
                        <button
                            onClick={() => setSelectMode(!selectMode)}
                            className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold">
                            {selectMode ? "Cancel" : "Select"}
                        </button>
                    }
                />
            </div>

            <TableBox>
                <table className="w-full text-sm bg-white">

                    <thead className="bg-slate-100 text-xs uppercase">
                        <tr>
                            {selectMode && (
                                <th className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selected.length === sorted.length && sorted.length > 0}
                                        onChange={toggleAll}
                                    />
                                </th>
                            )}
                            <th className="px-6 py-4">No</th>
                            <th className="px-6 py-4">Buku</th>
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Jumlah</th> {/* KOLOM BARU */}
                            <th className="px-6 py-4">Pinjam</th>
                            <th className="px-6 py-4">Kembali</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Deskripsi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sorted.length === 0 ? (
                            <tr>
                                <td colSpan={selectMode ? 10 : 9}
                                    className="py-20 text-center text-slate-400">
                                    Tidak ada riwayat peminjaman
                                </td>
                            </tr>
                        ) : (
                            sorted.map((item, i) => {

                                const today = new Date();
                                const due = new Date(item.dueDate);
                                const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
                                const late = diff > 0 ? diff : 0;

                                return (
                                    <tr key={item.id} className="border-t">

                                        {selectMode && (
                                            <td className="px-6">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                />
                                            </td>
                                        )}

                                        <td className="px-6 py-4 font-bold">{i + 1}</td>
                                        <td className="px-6">{item.bookTitle}</td>
                                        <td className="px-6">{item.studentName}</td>
                                        <td className="px-6">{item.role}</td>

                                        {/* JUMLAH */}
                                        <td className="px-6 font-semibold">{item.quantity}</td>

                                        <td className="px-6">{formatDate(item.borrowDate)}</td>
                                        <td className="px-6">{formatDate(item.dueDate)}</td>

                                        <td className="px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${late === 0
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"}`}>
                                                {late === 0 ? "Tepat Waktu" : "Terlambat"}
                                            </span>
                                        </td>

                                        <td className="px-6 text-slate-500">
                                            {late > 0 ? `Terlambat ${late} hari` : "-"}
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                </table>
            </TableBox>

        </div>
    );
};

export default Riwayat;