import React, { useState } from "react";
import LendingModal from "./LendingModal";
import { Book } from "../types";

const sampleBooks: Book[] = [
  { id: 1, title: "Matematika Dasar", author: "Budi", stock: 5 },
  { id: 2, title: "Fisika Lanjutan", author: "Ani", stock: 3 },
  { id: 3, title: "Kimia Organik", author: "Citra", stock: 2 },
];

const LendingDemo: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (book: Book | null = null) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleSubmit = (data: any, days: number, bookTitle?: string) => {
    console.log("Peminjaman:", data, days, bookTitle);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Daftar Buku</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {sampleBooks.map((b) => (
          <div key={b.id} className="p-4 rounded-xl border shadow-sm">
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-sm">{b.author}</p>
            <p className="text-xs text-slate-400">Stok {b.stock}</p>

            <button
              onClick={() => openModal(b)}
              className="mt-3 w-full py-2 bg-blue-600 text-white rounded-xl"
            >
              Pinjam
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => openModal(null)}
        className="px-4 py-2 bg-green-600 text-white rounded-xl"
      >
        Input Manual
      </button>

      {modalOpen && (
        <LendingModal
          book={selectedBook}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default LendingDemo;
