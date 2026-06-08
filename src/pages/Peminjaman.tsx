import { useState, useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox"; 
import apiClient from "../apiClient";
import { useLocation } from "react-router-dom";

export default function Peminjaman() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);
  
  const [extendId, setExtendId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get("search") || "").toLowerCase();

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get("/transactions");
      setTransactions(res.data);
    } catch (err) { 
      console.error("Gagal mengambil data transaksi:", err); 
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // FUNGSI UTAMA RETURN BUKU
  const updateTransaction = async (id: any) => {
    try {
      // Mengirimkan payload status 'Dikembalikan' ke backend route PUT /:id
      const res = await apiClient.put(`/transactions/${id}`, { status: "Dikembalikan" });
      alert(res.data.message || "Buku berhasil dikembalikan!");
      
      // Ambil ulang data terbaru dari database agar tampilan langsung update
      fetchTransactions();
      window.dispatchEvent(new Event("booksUpdated")); 
    } catch (err) { 
      console.error("Gagal melakukan return transaksi:", err);
      alert("Gagal memproses pengembalian buku. Periksa koneksi backend Anda.");
    }
  };

  // FUNGSI UTAMA PERPANJANG BUKU
  const submitExtend = async (id: string) => {
    if (!newDate) {
      alert("Pilih tanggal baru terlebih dahulu!");
      return;
    }
    try {
      const res = await apiClient.put(`/transactions/${id}`, { dueDate: newDate });
      alert(res.data.message || "Berhasil diperpanjang!");
      setExtendId(null);
      setNewDate("");
      fetchTransactions();
    } catch (err) { 
      console.error("Gagal memperpanjang durasi:", err); 
      alert("Gagal memperpanjang transaksi.");
    }
  };

  // Filter Client-Side untuk menampilkan data status 'Dipinjam' saja
  const sorted = [...transactions]
    .filter((t) => t.status === "Dipinjam" || t.status === "meminjam")
    .filter((t) =>
      !q ||
      (t.bookTitle && t.bookTitle.toLowerCase().includes(q)) ||
      (t.activity && t.activity.toLowerCase().includes(q)) ||
      (t.studentName && t.studentName.toLowerCase().includes(q)) ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.memberId && t.memberId.toLowerCase().includes(q))
    )
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  return (
    <div className="p-8 h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-50">
      
      {/* HEADER PAGE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-shrink-0 mb-6">
        <PageHeader
          title="Data Peminjaman"
          subtitle="Daftar transaksi buku yang sedang dipinjam"
          onSortChange={setSort}
          onLimitChange={setLimit}
        />
      </div>

      {/* CONTAINER TABEL */}
      <div className="flex-1 min-h-0 w-full relative">
        <TableBox>
          <div className="absolute inset-0 overflow-auto border border-slate-200 rounded-3xl bg-white shadow-sm">
            <TransactionTable
              transactions={sorted} 
              onAction={updateTransaction}
              extendId={extendId}
              setExtendId={setExtendId}
              newDate={newDate}
              setNewDate={setNewDate}
              submitExtend={submitExtend}
            />
          </div>
        </TableBox>
      </div>
    </div>
  );
}