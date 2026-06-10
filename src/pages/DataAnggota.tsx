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

    // FUNGSI UPDATE MEMBER
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
        <div className="p-8 space-y-6">

            {/* HEADER */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <PageHeader
                    title="Data Anggota"
                    subtitle="Manajemen anggota perpustakaan"
                    onSortChange={setSort}
                    onLimitChange={setLimit}
                    right={
                        <>
                            <button
                                onClick={() => { setShowSelect(!showSelect); setSelected([]); }}
                                className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
                            >
                                {showSelect ? "Cancel" : "Select"}
                            </button>

                            {showSelect && selected.length > 0 && (
                                <button
                                    onClick={deleteSelected}
                                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold"
                                >
                                    Hapus ({selected.length})
                                </button>
                            )}

                            <button
                                onClick={() => { setEditMember(null); setOpen(true); }}
                                className="px-6 py-2 bg-[#3F5EA8] text-white rounded-xl text-xs font-bold shadow"
                            >
                                + Input Data
                            </button>
                        </>
                    }
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-auto max-h-[600px]">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-600 sticky top-0 z-10">
                        <tr className="text-center">
                            {showSelect && (
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selected.length === sorted.length && sorted.length > 0}
                                        onChange={toggleAll}
                                    />
                                </th>
                            )}
                            <th className="p-4 w-14">No</th>
                            <th className="p-4 text-left w-24">ID</th>
                            <th className="p-4 text-left">Nama</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Kelas</th>
                            <th className="p-4">Jurusan</th>
                            <th className="p-4">Gender</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sorted.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={showSelect ? 9 : 8}
                                    className="py-20 text-center text-slate-400 font-medium"
                                >
                                    Belum ada data anggota
                                </td>
                            </tr>
                        ) : (
                            sorted.map((m, i) => (
                                <tr key={i} className="border-t hover:bg-slate-50 text-center">
                                    {showSelect && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(i)}
                                                onChange={() => toggleSelect(i)}
                                            />
                                        </td>
                                    )}
                                    <td className="p-4 font-semibold text-slate-500">{i + 1}</td>
                                    <td className="p-4 text-left font-bold text-slate-700 tracking-wider">{m.id}</td>
                                    <td className="p-4 text-left font-medium text-slate-700">{m.nama}</td>
                                    <td className="p-4 capitalize">{m.status}</td>
                                    <td className="p-4">{m.kelas}</td>
                                    <td className="p-4">{m.jurusan}</td>
                                    <td className="p-4">{m.gender}</td>

                                    {/* TOMBOL EDIT PENSIL */}
                                    <td className="p-4">
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

            {/* MODAL — support mode tambah & edit */}
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