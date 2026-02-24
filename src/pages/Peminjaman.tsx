import React, { useState, useEffect } from "react";
import LendingModal from "../components/LendingModal";
import TransactionTable from "../components/TransactionTable";
import apiClient from "../apiClient";

export default function Peminjaman() {
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

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

  /* ================= ACTION ================= */
  const updateTransaction = async (
    id: string | number,
    action: "return" | "extend"
  ) => {
    try {
      if (action === "return") {
        await apiClient.put(`/transactions/${id}`, { status: "Dikembalikan" });
      } else if (action === "extend") {
        // Here we could implement extend in backend, skipping for now as per minimal implementation
        // await apiClient.put(`/transactions/${id}`, { extend logic });
      }
      fetchTransactions();
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SUBMIT MANUAL ================= */
  const handleSubmit = async (borrowerData: any, days: number, manualBookTitle?: string) => {
    try {
      // Find bookId from books (we assume the form provides manualBookTitle or something)
      // Since backend requires bookId, we mock it or if borrowerData provides it. Let's send bookId 1 as fallback or look it up if needed.
      const bookDataRes = await apiClient.get('/books');
      const bookTitleRaw = manualBookTitle || borrowerData.manualBookTitle || borrowerData.bookTitle;
      const foundBook = bookDataRes.data.find((b: any) => b.title === bookTitleRaw);

      if (!foundBook) {
        alert("Buku tidak ditemukan di database!");
        return;
      }

      const today = new Date();
      await apiClient.post("/transactions", {
        bookId: foundBook.id,
        studentName: borrowerData.name,
        status: "Dipinjam",
        borrowDate: today.toISOString().split('T')[0]
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
      </div>

      {/* TABLE */}
      <TransactionTable
        transactions={transactions.filter(t => t.status === "Dipinjam")}
        onAction={updateTransaction}
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
