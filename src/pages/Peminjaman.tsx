import React, { useState, useEffect } from "react";
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
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const updateTransaction = async (id: any) => {
    try {
      await apiClient.put(`/transactions/${id}`, { status: "Dikembalikan" });
      fetchTransactions();
    } catch (err) { console.error(err); }
  };

  const submitExtend = async (id: string) => {
    if (!newDate) return;
    try {
      await apiClient.put(`/transactions/${id}`, { dueDate: newDate });
      setExtendId(null);
      setNewDate("");
      fetchTransactions();
    } catch (err) { console.error(err); }
  };

  const sorted = [...transactions]
    .filter((t) => t.status === "Dipinjam")
    .filter((t) =>
      !q ||
      t.bookTitle?.toLowerCase().includes(q) ||
      t.studentName?.toLowerCase().includes(q)
    )
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  return (
    <div className="p-8 h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-50">
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-shrink-0 mb-6">
        <PageHeader
          title="Data Peminjaman"
          subtitle="Daftar transaksi buku yang sedang dipinjam"
          onSortChange={setSort}
          onLimitChange={setLimit}
        />
      </div>

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