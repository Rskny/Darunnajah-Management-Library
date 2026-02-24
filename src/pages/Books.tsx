import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import BookCard from '../components/books/BookCard';
import BookFormModal from '../components/books/BookFormModal';
import BorrowForm from "../components/BorrowForm";
import { Book } from '../types';

const Books: React.FC = () => {

  const [books, setBooks] = useState<Book[]>([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [restockBook, setRestockBook] = useState<Book | null>(null);
  const [restockValue, setRestockValue] = useState(1);

  // FETCH
  const fetchBooks = async () => {
    try {
      const res = await apiClient.get('/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ADD
  const handleAddBook = async (book: Omit<Book, 'id' | 'available'>) => {
    await apiClient.post('/books', book);
    fetchBooks();
    setShowForm(false);
  };

  // BULK
  const handleBulkAdd = async (booksData: Omit<Book, 'id' | 'available'>[]) => {
    for (const b of booksData) {
      await apiClient.post('/books', b);
    }
    fetchBooks();
    setShowForm(false);
  };

  // DELETE
  const handleDeleteSelected = async () => {
    for (const id of selected) {
      await apiClient.delete(`/books/${id}`);
    }
    fetchBooks();
    setSelected([]);
  };

  // RESTOCK API
  const handleRestock = async () => {
    if (!restockBook) return;

    await apiClient.patch(`/books/${restockBook.id}/restock`, {
      amount: restockValue
    });

    setRestockBook(null);
    setRestockValue(1);
    fetchBooks();
  };

  return (
    <div className="p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Katalog Buku
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Manajemen koleksi perpustakaan
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => {
              setShowSelect(!showSelect);
              setSelected([]);
            }}
            className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
          >
            {showSelect ? "Cancel" : "Select"}
          </button>

          {selected.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold"
            >
              Hapus ({selected.length})
            </button>
          )}

          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-2xl bg-[#3b5998] text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all"
          >
            + Input Buku
          </button>

        </div>
      </div>

      {/* GRID */}
      {books.length === 0 ? (
        <div className="text-center text-slate-400 font-bold py-20">
          Belum ada buku
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {books.map((book, i) => (
            <div key={book.id} className="relative">

              {/* NUMBER */}
              <div className="absolute -top-3 -right-3 bg-black text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {i + 1}
              </div>

              {/* CHECKBOX */}
              {showSelect && (
                <input
                  type="checkbox"
                  className="absolute top-2 left-2 z-10 w-5 h-5"
                  checked={selected.includes(book.id)}
                  onChange={() => {
                    setSelected(prev =>
                      prev.includes(book.id)
                        ? prev.filter(x => x !== book.id)
                        : [...prev, book.id]
                    )
                  }}
                />
              )}

              <BookCard
                book={book}
                onLend={() => setSelectedBook(book)}
                onRestock={() => setRestockBook(book)}
              />
            </div>
          ))}
        </div>
      )}

      {/* MODAL INPUT */}
      {showForm && (
        <BookFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleAddBook}
          onBulkSubmit={handleBulkAdd}
        />
      )}

      {/* MODAL PINJAM */}
      {selectedBook && (
        <BorrowForm
          bookTitle={selectedBook.title}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* MODAL RESTOCK */}
      {restockBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">

            <h2 className="font-bold text-lg mb-4">
              Restock Buku
            </h2>

            <input
              type="number"
              min={1}
              value={restockValue}
              onChange={e => setRestockValue(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRestockBook(null)}
                className="px-4 py-2 bg-slate-200 rounded-lg text-sm"
              >
                Batal
              </button>

              <button
                onClick={handleRestock}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Books;