import React, { useState } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";
import BookCard from '../components/books/BookCard';
import BookFormModal from '../components/books/BookFormModal';
import BorrowForm from "../components/BorrowForm";
import { Book } from '../types';

const Books: React.FC = () => {

  // STORAGE
  const [books, setBooks] = useLocalStorage<Book[]>("books", []);

  // SELECT MODE
  const [showSelect,setShowSelect]=useState(false);
  const [selected,setSelected]=useState<string[]>([]);

  // MODAL
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // ADD BOOK
  const handleAddBook = (book: Omit<Book, 'id' | 'available'>) => {
    setBooks(prev => [
      ...prev,
      {
        ...book,
        id: crypto.randomUUID(),
        available: true
      }
    ]);
    setShowForm(false);
  };

  // BULK IMPORT
  const handleBulkAdd = (booksData: Omit<Book, 'id' | 'available'>[]) => {
    const newBooks = booksData.map(b => ({
      ...b,
      id: crypto.randomUUID(),
      available: true
    }));
    setBooks(prev => [...prev, ...newBooks]);
    setShowForm(false);
  };

  // BORROW BOOK
  const handleBorrow = (data: any) => {
    setBooks(prev =>
      prev.map(b =>
        b.title === data.bookTitle
          ? { ...b, stock: b.stock - 1, available: b.stock - 1 > 0 }
          : b
      )
    );
  };

  // DELETE SELECTED
  const handleDeleteSelected = () => {
    const filtered = books.filter(b => !selected.includes(b.id));
    setBooks(filtered);
    setSelected([]);
  };
  React.useEffect(() => {
  const syncBooks = () => {
    const saved = localStorage.getItem("books");
    if (saved) setBooks(JSON.parse(saved));
  };

  window.addEventListener("booksUpdated", syncBooks);
  return () => window.removeEventListener("booksUpdated", syncBooks);
}, [setBooks]);


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

          {/* SELECT BUTTON */}
          <button
            onClick={()=>{
              setShowSelect(!showSelect);
              setSelected([]);
            }}
            className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
          >
            {showSelect ? "Cancel" : "Select"}
          </button>

          {/* DELETE BUTTON */}
          {selected.length>0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold"
            >
              Hapus ({selected.length})
            </button>
          )}

          {/* ADD BOOK */}
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
          {books.map(book => (
            <div key={book.id} className="relative">

              {/* CHECKBOX */}
              {showSelect && (
                <input
                  type="checkbox"
                  className="absolute top-2 left-2 z-10 w-5 h-5"
                  checked={selected.includes(book.id)}
                  onChange={()=>{
                    setSelected(prev=>
                      prev.includes(book.id)
                        ? prev.filter(x=>x!==book.id)
                        : [...prev,book.id]
                    )
                  }}
                />
              )}

              <BookCard
                book={book}
                onLend={() => setSelectedBook(book)}
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

    </div>
  );
};

export default Books;
