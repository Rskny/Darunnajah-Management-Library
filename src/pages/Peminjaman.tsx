import React, { useState, useEffect } from "react";
import LendingModal from "../components/LendingModal";
import TransactionTable from "../components/TransactionTable";

export default function Peminjaman() {
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("transactions");
      setTransactions(saved ? JSON.parse(saved) : []);
    };

    load();

    window.addEventListener("storage", load);
    window.addEventListener("transactionsUpdated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("transactionsUpdated", load);
    };
  }, []);

  /* ================= ACTION ================= */
  const updateTransaction = (
    id: string,
    action: "return" | "extend"
  ) => {
    const saved = JSON.parse(localStorage.getItem("transactions") || "[]");

    const updated = saved.map((t: any) => {
      if (t.id !== id) return t;

      if (action === "return") {
        return { ...t, status: "returned" };
      }

      if (action === "extend") {
        const due = new Date(t.dueDate);
        due.setDate(due.getDate() + 7);
        return { ...t, dueDate: due.toISOString() };
      }

      return t;
    });

    localStorage.setItem("transactions", JSON.stringify(updated));
    setTransactions(updated);

    window.dispatchEvent(new Event("transactionsUpdated"));
    window.dispatchEvent(new Event("storage"));
  };

  /* ================= SUBMIT MANUAL ================= */
  const handleSubmit = (borrowerData: any, days: number, manualBookTitle?: string) => {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + days);

    const newTransaction = {
      id: "TRX-" + Date.now(),
      bookTitle:
        manualBookTitle ||
        borrowerData.manualBookTitle ||
        borrowerData.bookTitle,
      studentName: borrowerData.name,
      role: borrowerData.role.toLowerCase(),
      borrowDate: today.toISOString(),
      dueDate: due.toISOString(),
      status: "borrowed",
    };

    const saved = JSON.parse(localStorage.getItem("transactions") || "[]");
    const updated = [newTransaction, ...saved];

    localStorage.setItem("transactions", JSON.stringify(updated));
    setTransactions(updated);

    window.dispatchEvent(new Event("transactionsUpdated"));
    window.dispatchEvent(new Event("storage"));

    setModalOpen(false);
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
        transactions={transactions.filter(t => t.status === "borrowed")}
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
