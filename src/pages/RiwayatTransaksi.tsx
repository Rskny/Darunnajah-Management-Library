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
    quantity: number;
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
        try {
            const res = await apiClient.get("/transactions");
            setHistory(res.data.filter((t: any) => t.status === "Dikembalikan"));
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => { fetchTransactions() }, []);

    const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID");

    const toggleSelect = (id: string) => {
        setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    };

    // Fungsi Select All yang disesuaikan dengan data yang sudah di-filter/sort (sorted)
    const toggleAll = (currentData: Transaction[]) => {
        if (selected.length === currentData.length && currentData.length > 0) {
            setSelected([]);
        } else {
            setSelected(currentData.map(i => i.id));
        }
    };

    // FUNGSI BARU: Untuk mengeksekusi penghapusan data ke API
    const deleteSelected = async () => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus ${selected.length} data ini?`);
        if (!confirmDelete) return;

        try {
            for (const id of selected) {
                await apiClient.delete(`/transactions/${id}`);
            }
            setSelected([]);
            setSelectMode(false);
            fetchTransactions(); // Refresh data tabel setelah berhasil dihapus
            alert("Data berhasil dihapus!");
        } catch (error) {
            console.error("Gagal menghapus data:", error);
            alert("Terjadi kesalahan saat menghapus data.");
        }
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
        /* KUNCI UTAMA: 
           1. w-full dan max-w-full agar tidak melebar melebihi sidebar.
           2. overflow-hidden untuk mematikan scroll browser utama.
        */
        <div className="p-8 h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-50">

            {/* HEADER SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-shrink-0 mb-6">
                <PageHeader
                    title="Riwayat Peminjaman"
                    subtitle="Histori transaksi buku"
                    onSortChange={setSort}
                    onLimitChange={setLimit}
                    right={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setSelectMode(!selectMode); setSelected([]); }}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                    selectMode ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"
                                }`}>
                                {selectMode ? "Batal" : "Pilih Data"}
                            </button>
                        </div>
                    }
                />
            </div>

            {/* AREA TABEL: flex-1 min-h-0 agar dia mengisi sisa ruang vertikal tanpa 'meledak' */}
            <div className="flex-1 min-h-0 w-full relative">
                <TableBox>
                    {/* KUNCI GULIR: 
                       - overflow-x-auto: scroll samping hanya di sini.
                       - overflow-y-auto: scroll bawah hanya di sini.
                       - absolute inset-0: memaksa div ini menempati area TableBox secara penuh.
                    */}
                    <div className="absolute inset-0 overflow-auto border border-slate-200 rounded-3xl bg-white shadow-sm">
                        <table className="w-full text-sm text-left border-collapse" style={{ minWidth: "1000px" }}>
                            <thead className="sticky top-0 z-30 bg-slate-100 text-slate-600 text-xs uppercase">
                                <tr>
                                    {selectMode && (
                                        <th className="px-6 py-5 bg-slate-100 border-b w-16 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selected.length === sorted.length && sorted.length > 0}
                                                onChange={() => toggleAll(sorted)}
                                            />
                                        </th>
                                    )}
                                    <th className="px-6 py-5 bg-slate-100 border-b w-12">No</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b whitespace-nowrap">Judul Buku</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b whitespace-nowrap">Nama Peminjam</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b">Role</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center">Qty</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b">Pinjam</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b">Kembali</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b">Status</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b">Deskripsi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {sorted.length === 0 ? (
                                    <tr>
                                        <td colSpan={selectMode ? 11 : 10} className="py-20 text-center text-slate-400">Data Kosong</td>
                                    </tr>
                                ) : (
                                    sorted.map((item, i) => {
                                        const today = new Date();
                                        const due = new Date(item.dueDate);
                                        const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
                                        const late = diff > 0 ? diff : 0;

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                {selectMode && (
                                                    <td className="px-6 py-4 text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selected.includes(item.id)} 
                                                            onChange={() => toggleSelect(item.id)} 
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-slate-400 font-bold">{i + 1}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">{item.bookTitle}</td>
                                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{item.studentName}</td>
                                                <td className="px-6 py-4 text-slate-500">{item.role}</td>
                                                <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(item.borrowDate)}</td>
                                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(item.dueDate)}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                        late === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {late === 0 ? "Tepat Waktu" : "Terlambat"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs whitespace-nowrap">
                                                    {late > 0 ? <span className="text-red-500 font-medium italic">Terlambat {late} hari</span> : "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </TableBox>
            </div>

            {/* INFO TERPILIH & TOMBOL EKSEKUSI HAPUS */}
            {selectMode && selected.length > 0 && (
                <div className="flex-shrink-0 pt-4 text-right">
                    <button 
                        onClick={deleteSelected}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg transition-colors"
                    >
                        Hapus {selected.length} Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default Riwayat;