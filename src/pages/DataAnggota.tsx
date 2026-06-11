import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import MemberFormModal from "../components/MemberFormModal";
import apiClient from "../apiClient";
import { useLocation } from "react-router-dom";

export interface Member {
    id?: string;
    nama: string;
    status: string;
    kelas: string;
    jurusan: string;
    gender: string;
}

export default function DataAnggota() {
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [showSelect, setShowSelect] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [limit, setLimit] = useState(10);
    const [editMember, setEditMember] = useState<Member | null>(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const q = (searchParams.get("search") || "").toLowerCase();

    const fetchMembers = async () => {
        const res = await apiClient.get("/members");
        setMembers(res.data);
    };

    useEffect(() => { fetchMembers(); }, []);

    const toggleSelect = (i: number) => {
        setSelected(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
    };

    const toggleAll = () => {
        if (selected.length === sorted.length) setSelected([]);
        else setSelected(sorted.map((_, i) => i));
    };

    const deleteSelected = async () => {
        if (!window.confirm(`Hapus ${selected.length} anggota terpilih?`)) return;
        for (const i of selected) {
            const m: any = sorted[i];
            if (m?.id) await apiClient.delete(`/members/${m.id}`);
        }
        fetchMembers();
        setSelected([]);
        setShowSelect(false);
    };

    const handleUpdateMember = async (id: string, data: Partial<Member>) => {
        try {
            await apiClient.put(`/members/${id}`, data);
            fetchMembers();
            setEditMember(null);
        } catch (err) {
            console.error("Gagal update anggota:", err);
            alert("Gagal memperbarui data anggota.");
        }
    };

    const sorted = [...members]
        .filter((m: any) =>
            !q ||
            m.nama.toLowerCase().includes(q) ||
            m.status.toLowerCase().includes(q) ||
            m.kelas.toLowerCase().includes(q) ||
            m.jurusan.toLowerCase().includes(q) ||
            m.gender.toLowerCase().includes(q)
        )
        .sort((a: any, b: any) => {
            if (!a.id || !b.id) return 0;
            return sort === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        })
        .slice(0, limit);

    return (
        <div className="p-8 h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-50">

            {/* HEADER */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-shrink-0 mb-6">
                <PageHeader
                    title="Data Anggota"
                    subtitle="Manajemen anggota perpustakaan"
                    onSortChange={setSort}
                    onLimitChange={setLimit}
                    right={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setShowSelect(!showSelect); setSelected([]); }}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                    showSelect ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"
                                }`}
                            >
                                {showSelect ? "Batal" : "Delete"}
                            </button>

                            <button
                                onClick={() => { setEditMember(null); setOpen(true); }}
                                className="px-6 py-2 bg-[#3F5EA8] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#334e8c] transition-all"
                            >
                                + Input Data
                            </button>
                        </div>
                    }
                />
            </div>

            {/* TABEL DENGAN VIEWPORT GULIR (SCROLLABLE) */}
            <div className="flex-1 min-h-0 w-full relative">
                <div className="absolute inset-0 overflow-auto border border-slate-200 rounded-3xl bg-white shadow-sm">
                    
                    {/* Mengunci lebar minimal tabel agar tidak menabrak / gepeng */}
                    <table className="w-full text-sm border-collapse" style={{ minWidth: "1100px" }}>
                        <thead className="sticky top-0 z-30 bg-slate-100 text-slate-600 text-xs uppercase border-b border-slate-200">
                            <tr>
                                {showSelect && (
                                    <th className="px-6 py-5 w-16 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.length === sorted.length && sorted.length > 0}
                                            onChange={toggleAll}
                                        />
                                    </th>
                                )}
                                <th className="px-6 py-5 w-16 text-center">No</th>
                                <th className="px-6 py-5 text-left w-32 whitespace-nowrap">ID Anggota</th>
                                <th className="px-6 py-5 text-left w-72 whitespace-nowrap">Nama Lengkap</th>
                                
                                {/* KEMBALI KE STRUKTUR ANGGOTA ASLI */}
                                <th className="px-6 py-5 text-center w-40 whitespace-nowrap">Status / Role</th>
                                <th className="px-6 py-5 text-left w-44 whitespace-nowrap">Kelas</th>
                                <th className="px-6 py-5 text-center w-48 whitespace-nowrap">Jurusan</th>
                                
                                <th className="px-6 py-5 text-center w-28 whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {sorted.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={showSelect ? 8 : 7}
                                        className="py-20 text-center text-slate-400 font-medium"
                                    >
                                        Belum ada data anggota
                                    </td>
                                </tr>
                            ) : (
                                sorted.map((m, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        {showSelect && (
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(i)}
                                                    onChange={() => toggleSelect(i)}
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-center text-slate-400 font-bold">{i + 1}</td>
                                        <td className="px-6 py-4 text-left font-mono font-bold text-slate-800 tracking-wider">
                                            {m.id}
                                        </td>
                                        <td className="px-6 py-4 text-left font-semibold text-slate-700">
                                            {m.nama}
                                        </td>
                                        
                                        {/* KONDISI BADGE UNTUK STATUS (TEACHER / STUDENT) */}
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                m.status.toLowerCase() === 'teacher' || m.status.toLowerCase() === 'guru'
                                                    ? 'bg-amber-100 text-amber-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-left text-slate-600 whitespace-nowrap">
                                            {m.kelas}
                                        </td>
                                        
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {m.jurusan && m.jurusan !== "-" ? (
                                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                                                    {m.jurusan}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => {
                                                    setEditMember(m);
                                                    setOpen(true);
                                                }}
                                                className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 border border-amber-200 transition-all"
                                                title="Edit Anggota"
                                            >
                                                <span className="text-xs">✎</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* BUTTON ACTION HAPUS MASSAL */}
            {showSelect && selected.length > 0 && (
                <div className="flex-shrink-0 pt-4 text-right">
                    <button
                        onClick={deleteSelected}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg transition-colors"
                    >
                        Hapus {selected.length} Anggota Terpilih
                    </button>
                </div>
            )}

            {/* MODAL FORM */}
            {open && (
                <MemberFormModal
                    onClose={() => {
                        setOpen(false);
                        setEditMember(null);
                    }}
                    onImport={async (data) => {
                        for (const m of data) await apiClient.post("/members", m);
                        fetchMembers();
                        setOpen(false);
                    }}
                    onUpdate={handleUpdateMember}
                    initialData={editMember}
                />
            )}
        </div>
    );
}