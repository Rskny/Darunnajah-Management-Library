import React, { useState, useEffect } from "react";
import LendingModal from "../components/LendingModal";
import TransactionTable from "../components/TransactionTable";
import apiClient from "../apiClient";

export default function Peminjaman() {
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
<<<<<<< Updated upstream

=======
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);

  /* ================= FETCH ================= */
>>>>>>> Stashed changes
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
    const interval = setInterval(fetchTransactions, 60 * 1000); // refresh tiap 1 menit
    window.addEventListener("transactionsUpdated", fetchTransactions);
    return () => {
      clearInterval(interval);
      window.removeEventListener("transactionsUpdated", fetchTransactions);
    };
  }, []);

  /* ================= ACTION ================= */
<<<<<<< Updated upstream
  const updateTransaction = async (
    id: string | number,
    action: "return" | "extend"
  ) => {
=======
  const updateTransaction = async (id: string | number, action: "return" | "extend") => {
>>>>>>> Stashed changes
    try {
      if (action === "return") {
        await apiClient.put(`/transactions/${id}`, { status: "Dikembalikan" });
      } else if (action === "extend") {
        // Option to extend via backend here
      }
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

<<<<<<< Updated upstream
  const handleDeleteSelected = async (selectedIds: string[]) => {
    try {
      for (const id of selectedIds) {
        await apiClient.delete(`/transactions/${id}`);
      }
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

=======
>>>>>>> Stashed changes
  const handleExtend = async (id: string, newDate: string) => {
    try {
      await apiClient.put(`/transactions/${id}`, { dueDate: newDate });
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SUBMIT PEMINJAMAN ================= */
  const handleSubmit = async (borrowerData: any) => {
    try {
<<<<<<< Updated upstream
      // Find bookId from books (we assume the form provides manualBookTitle or something)
      // Since backend requires bookId, we mock it or if borrowerData provides it. Let's send bookId 1 as fallback or look it up if needed.
      const bookDataRes = await apiClient.get('/books');
      const bookTitleRaw = manualBookTitle || borrowerData.manualBookTitle || borrowerData.bookTitle;
      const foundBook = bookDataRes.data.find((b: any) => b.title === bookTitleRaw);

      if (!foundBook) {
        alert("Buku tidak ditemukan di database!");
        return;
      }

=======
>>>>>>> Stashed changes
      const today = new Date();
      await apiClient.post("/transactions", {
        bookId: borrowerData.bookId,
        studentName: borrowerData.name,
        status: "Dipinjam",
<<<<<<< Updated upstream
        borrowDate: today.toISOString().split('T')[0]
=======
        borrowDate: today.toISOString(),
        qty: borrowerData.qty || 1
>>>>>>> Stashed changes
      });
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
<<<<<<< Updated upstream
    <div className="px-8 pt-6 pb-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          Data Peminjaman
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#3F5EA8] text-white px-6 py-2 rounded-full text-xs font-semibold"
        >
          + INPUT DATA
        </button>
=======
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
>>>>>>> Stashed changes
      </div>

      {/* TABLE */}
      <TransactionTable
<<<<<<< Updated upstream
        transactions={transactions.filter(t => t.status === "Dipinjam")}
=======
        transactions={sorted}
>>>>>>> Stashed changes
        onAction={updateTransaction}
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
