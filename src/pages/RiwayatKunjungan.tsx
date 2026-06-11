import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox";
import apiClient from "../apiClient";
import { useLocation } from "react-router-dom";

// Fungsi cek hari ini untuk menyaring riwayat lama
const isToday = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    );
};

export default function RiwayatKunjungan() {
    const [data, setData] = useState<any[]>([]);
    const [selectMode, setSelectMode] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [limit, setLimit] = useState(10);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const q = (searchParams.get("search") || "").toLowerCase();

    const fetchHistory = async () => {
        try {
            const res = await apiClient.get("/visits");
            const pastVisits = res.data.filter((item: any) => !isToday(item.date));
            setData(pastVisits);
        } catch (err) {
            console.error("Gagal memuat riwayat kunjungan:", err);
        }
    };

    useEffect(() => { fetchHistory() }, []);

    const toggleSelect = (id: number) => {
        setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    };

    const toggleAll = () => {
        if (selected.length === data.length) setSelected([]);
        else setSelected(data.map(i => i.id));
    };

    const deleteSelected = async () => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus ${selected.length} riwayat kunjungan ini?`);
        if (!confirmDelete) return;
        try {
            for (const id of selected)
                await apiClient.delete(`/visits/${id}`);
            setSelected([]);
            setSelectMode(false);
            fetchHistory();
            alert("Data riwayat kunjungan berhasil dihapus!");
        } catch (err) {
            console.error("Gagal menghapus data:", err);
            alert("Terjadi kesalahan saat menghapus data.");
        }
    };

    const sorted = [...data]
        .filter((item: any) =>
            !q ||
            item.name?.toLowerCase().includes(q) ||
            item.memberId?.toLowerCase().includes(q) || 
            item.nis?.toLowerCase().includes(q) ||
            item.chosing?.toLowerCase().includes(q) ||
            item.purpose?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
        )
        .sort((a, b) => sort === "asc" ? a.id - b.id : b.id - a.id)
        .slice(0, limit);

    return (
        // 1. TAMBAHKAN h-screen, w-full, flex flex-col, DAN overflow-hidden AGAR LAYOUT UTAMA TERKUNCI
        <div className="p-8 h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-50">
            
            {/* CARD HEADER */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-shrink-0 mb-6">
                <PageHeader
                    title="Riwayat Kunjungan"
                    subtitle="Data histori kunjungan"
                    onSortChange={setSort}
                    onLimitChange={setLimit}
                    right={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setSelectMode(!selectMode); setSelected([]) }}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                    selectMode ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"
                                }`}>
                                {selectMode ? "Batal" : "Delete"}
                            </button>
                        </div>
                    }
                />
            </div>

            {/* TABEL AREA DENGAN DUKUNGAN GULIR (SCROLLABLE) */}
            {/* 2. flex-1 DAN min-h-0 BERFUNGSI MENGAMBIL SISA RUANG LAYOUT SECARA DINAMIS */}
            <div className="flex-1 min-h-0 w-full relative">
                <TableBox>
                    {/* 3. absolute inset-0 DAN overflow-auto MEMBUAT SCROLLBAR VERTIKAL + HORIZONTAL AKTIF */}
                    <div className="absolute inset-0 overflow-auto border border-slate-200 rounded-3xl bg-white shadow-sm">
                        {/* minWidth diatur ke 1200px agar tabel memiliki ruang horizontal saat mengecil */}
                        <table className="w-full text-sm border-collapse" style={{ minWidth: "1200px" }}>
                            <thead className="sticky top-0 z-30 bg-slate-100 text-slate-600 text-xs uppercase">
                                <tr>
                                    {selectMode && (
                                        <th className="px-6 py-5 bg-slate-100 border-b w-16 text-center">
                                            <input type="checkbox"
                                                checked={selected.length === sorted.length && sorted.length > 0}
                                                onChange={toggleAll} />
                                        </th>
                                    )}
                                    <th className="px-6 py-5 bg-slate-100 border-b w-16 text-center">No</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center whitespace-nowrap w-40">Tanggal</th>
                                    
                                    {/* 4. HEADER DIUBAH MENJADI text-center AGAR POSISI DI TENGAH */}
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center whitespace-nowrap w-44">ID Anggota</th> 
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center whitespace-nowrap w-64">Nama</th>
                                    
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center whitespace-nowrap w-36">Role</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center whitespace-nowrap">Kegiatan</th>
                                    <th className="px-6 py-5 bg-slate-100 border-b text-center whitespace-nowrap w-36">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {sorted.length === 0 ? (
                                    <tr>
                                        <td colSpan={selectMode ? 8 : 7} 
                                            className="py-20 text-center text-slate-400 font-medium">
                                            Tidak ada riwayat kunjungan (data hari ini berada di menu Kunjungan)
                                        </td>
                                    </tr>
                                ) : (
                                    sorted.map((item, i) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            {selectMode && (
                                                <td className="px-6 py-4 text-center">
                                                    <input type="checkbox"
                                                        checked={selected.includes(item.id)}
                                                        onChange={() => toggleSelect(item.id)} />
                                                </td>
                                            )}

                                            <td className="px-6 py-4 text-center text-slate-400 font-bold">{i + 1}</td>
                                            <td className="px-6 py-4 text-center text-slate-500 whitespace-nowrap">
                                                {new Date(item.date).toLocaleDateString("id-ID")}
                                            </td>
                                            
                                            {/* 5. ISI TETAP text-left UNTUK KETERATURAN TEKS, DIIMBANGI PADDING KIRI (pl-...) AGAR VISUAL PAS DI TENGAH HEADER */}
                                            <td className="px-6 py-4 pl-14 text-left font-mono font-bold text-slate-700 tracking-wide">
                                                {item.memberId || item.nis || "-"}
                                            </td> 
                                            <td className="px-6 py-4 pl-16 text-left font-medium text-slate-800 whitespace-nowrap">
                                                {item.name}
                                            </td>
                                            
                                            <td className="px-6 py-4 text-center capitalize text-slate-500">{item.chosing}</td>
                                            <td className="px-6 py-4 text-center text-slate-600 whitespace-nowrap">
                                                {item.purpose || item.description}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                                                    Kunjungan
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </TableBox>
            </div>

            {/* FLOATING ACTION ACTION BUTTON UNTUK HAPUS */}
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
}