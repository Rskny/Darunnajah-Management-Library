import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import BookCard from "../components/books/BookCard";
import BookFormModal from "../components/books/BookFormModal";
import BorrowForm from "../components/BorrowForm";
import { Book } from "../types";

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(10);

  const fetchBooks = async () => {
    const res = await apiClient.get("/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteSelected = async () => {
    for (const id of selected) {
      await apiClient.delete(`/books/${id}`);
    }
    fetchBooks();
    setSelected([]);
  };

  const sorted = [...books].sort((a, b) =>
    sort === "asc" ? a.id - b.id : b.id - a.id
  );

  const display = sorted.slice(0, limit);

  return (
    <div className="p-8 space-y-8">

      {/* ================= HEADER BOX ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Katalog Buku
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manajemen koleksi perpustakaan
          </p>
        </div>

        <div className="flex gap-3 items-center">

          {/* LIMIT */}
          <select
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 border rounded-xl text-xs font-bold"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          {/* SORT */}
          <button
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
            className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
          >
            {sort === "asc" ? "Ascending" : "Descending"}
          </button>

          {/* SELECT */}
          <button
            onClick={() => {
              setShowSelect(!showSelect);
              setSelected([]);
            }}
            className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
          >
            {showSelect ? "Cancel" : "Select"}
          </button>

          {/* DELETE */}
          {selected.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold"
            >
              Hapus ({selected.length})
            </button>
          )}

          {/* INPUT */}
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-full bg-[#3b5998] text-white font-semibold text-xs shadow-md"
          >
            + Input Buku
          </button>

        </div>
      </div>

      {/* ================= CARD CONTAINER OUTLINE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

        {display.length === 0 ? (
          <div className="text-center text-slate-400 font-bold py-20">
            Belum ada buku
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {display.map((book, i) => (
              <div key={book.id} className="relative">

                {/* NOMOR */}
                <div className="absolute -top-3 -right-3 bg-black text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                  {i + 1}
                </div>

                {/* CHECKBOX SELECT */}
                {showSelect && (
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 z-10 w-5 h-5"
                    checked={selected.includes(book.id)}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(book.id)
                          ? prev.filter((x) => x !== book.id)
                          : [...prev, book.id]
                      )
                    }
                  />
                )}

                <BookCard
                  book={book}
                  selected={selected.includes(book.id)}
                  onSelect={() =>
                    setSelected((prev) =>
                      prev.includes(book.id)
                        ? prev.filter((x) => x !== book.id)
                        : [...prev, book.id]
                    )
                  }
                  onLend={() => setSelectedBook(book)}
                  onRestock={() => {}}
                />

              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}
      {showForm && (
        <BookFormModal
          onClose={() => setShowForm(false)}
          onSubmit={() => {}}
          onBulkSubmit={() => {}}
        />
      )}

      {selectedBook && (
        <BorrowForm
          bookTitle={selectedBook.title}
          onClose={() => setSelectedBook(null)}
        />
      )}

    </div>
  );
};

export default Books;