import React, { useState, useEffect } from "react";
import LendingModal from "../components/LendingModal";
import TransactionTable from "../components/TransactionTable";
import PageHeader from "../components/PageHeader";
import apiClient from "../apiClient";

export default function Peminjaman() {
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);

  /* ================= FETCH ================= */
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

  /* ================= ACTIONS ================= */
  const updateTransaction = async (id: string | number, action: "return" | "extend") => {
    try {
      if (action === "return") {
        await apiClient.put(`/transactions/${id}`, { status: "Dikembalikan" });
      }
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await apiClient.delete(`/transactions/${id}`);
      }
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtend = async (id: string, newDate: string) => {
    try {
      await apiClient.put(`/transactions/${id}`, { dueDate: newDate });
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SUBMIT MANUAL ================= */
  const handleSubmit = async (borrowerData: any, days: number, manualBookTitle?: string) => {
    try {
      const bookRes = await apiClient.get("/books");
      const bookTitleRaw = manualBookTitle || borrowerData.manualBookTitle || borrowerData.bookTitle;
      const foundBook = bookRes.data.find((b: any) => b.title === bookTitleRaw);

      if (!foundBook) {
        alert("Buku tidak ditemukan di database!");
        return;
      }

      const today = new Date();
      await apiClient.post("/transactions", {
        bookId: foundBook.id,
        studentName: borrowerData.name,
        status: "Dipinjam",
        borrowDate: today.toISOString().split("T")[0],
      });

      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SORT & LIMIT ================= */
  const sorted = [...transactions]
    .filter((t) => t.status === "Dipinjam")
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))
    .slice(0, limit);

  /* ================= UI ================= */
  return (
    <div className="p-8 space-y-8">

      {/* HEADER BOX */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <PageHeader
          title="Data Peminjaman"
          subtitle="Daftar transaksi buku yang sedang dipinjam"
          onSortChange={setSort}
          onLimitChange={setLimit}
          defaultOrder="desc"
          defaultLimit={10}
          right={
            <div className="flex gap-3">
              <button
                onClick={() => setSelectMode(!selectMode)}
                className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
              >
                {selectMode ? "Cancel" : "Select"}
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#3F5EA8] text-white px-6 py-2 rounded-full text-xs font-semibold"
              >
                + INPUT DATA
              </button>
            </div>
          }
        />
      </div>

      {/* TABLE */}
      <TransactionTable
        transactions={sorted}
        selectMode={selectMode}
        onAction={updateTransaction}
        onDeleteSelected={handleDeleteSelected}
        onExtend={handleExtend}
      />

      {/* MODAL */}
      {modalOpen && (
        <LendingModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  );
}