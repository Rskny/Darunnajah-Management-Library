import React, { useState, useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import PageHeader from "../components/PageHeader";
import apiClient from "../apiClient";

export default function Peminjaman() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    window.addEventListener("transactionsUpdated", fetchTransactions);
    return () => {
      window.removeEventListener("transactionsUpdated", fetchTransactions);
    };
  }, []);

  const updateTransaction = async (id: any, action: "return" | "extend") => {
    try {
      if (action === "return") {
        await apiClient.put(`/transactions/${id}`, { status: "Dikembalikan" });
      }
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtend = async (id: string, newDate: string) => {
    try {
      await apiClient.put(`/transactions/${id}`, { dueDate: newDate });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Dipinjam + Sort + Limit
  const sorted = [...transactions]
    .filter((t) => t.status === "Dipinjam")
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <PageHeader
          title="Data Peminjaman"
          subtitle="Daftar transaksi buku yang sedang dipinjam"
          onSortChange={setSort}
          onLimitChange={setLimit}
          defaultOrder="desc"
          defaultLimit={10}
        />
      </div>

      {/* TABLE */}
      <TransactionTable
        transactions={sorted}
        onAction={updateTransaction}
        onExtend={handleExtend}
      />

    </div>
  );
}