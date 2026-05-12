import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import BookFormModal from "../components/books/BookFormModal";
import BorrowForm from "../components/BorrowForm";
import { Book } from "../types";
import { useLocation } from "react-router-dom";

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State baru untuk mode edit

  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState<number | string>(10);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get("search") || "").toLowerCase();

  const fetchBooks = async () => {
    try {
      const res = await apiClient.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (book: any) => {
    try {
      await apiClient.post("/books", book);
      fetchBooks();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkAddBooks = async (booksArray: any[]) => {
    try {
      // Mengirim data buku satu per satu sesuai dengan API backend POST /books
      for (const book of booksArray) {
        await apiClient.post("/books", book);
      }
      fetchBooks(); // Refresh tabel setelah semua data masuk
      setShowForm(false);
      alert(`Berhasil mengimpor ${booksArray.length} buku ke database!`);
    } catch (err) {
      console.error("Gagal mengimpor CSV:", err);
      alert("Ada masalah saat mengimpor data buku. Periksa koneksi backend.");
    }
  };

  const handleUpdateBook = async (bookData: any) => {
    try {
      await apiClient.put(`/books/${selectedBook?.id}`, bookData);
      fetchBooks();
      setIsEditing(false);
      setSelectedBook(null);
    } catch (err) {
      console.error("Gagal update buku:", err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Hapus ${selected.length} buku terpilih?`)) return;
    try {
      for (const id of selected) {
        await apiClient.delete(`/books/${id}`);
      }
      fetchBooks();
      setSelected([]);
      setShowSelect(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBorrow = (data: any) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.title === data.bookTitle
          ? { ...b, stock: b.stock - 1, available: b.stock - 1 > 0 }
          : b
      )
    );
  };

  const sorted = [...books]
    .filter((b) =>
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q)
    )
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));

  const display = limit === "all" ? sorted : sorted.slice(0, Number(limit));

  return (
    <div className="p-8 space-y-8 text-slate-800">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Katalog Buku</h1>
          <p className="text-sm text-slate-400 font-medium">Manajemen koleksi perpustakaan</p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="px-4 py-2 border rounded-xl text-xs font-bold bg-slate-50 outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">Semua</option>
          </select>

          <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            {sort === "asc" ? "Ascending" : "Descending"}
          </button>

          <button 
            onClick={() => { setShowSelect(!showSelect); setSelected([]); }} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              showSelect ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {showSelect ? "Cancel" : "Select"}
          </button>

          {selected.length > 0 && (
            <button 
              onClick={handleDeleteSelected} 
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-md animate-in zoom-in duration-200"
            >
              Hapus ({selected.length})
            </button>
          )}

          <button onClick={() => { setShowForm(true); setIsEditing(false); }} className="px-6 py-2 rounded-full bg-[#3b5998] text-white font-semibold text-xs shadow-md">
            + Input Buku
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-[11px] text-slate-400 uppercase bg-slate-50/30">
                {showSelect && (
                  <th className="p-4 w-12 text-center animate-in slide-in-from-left duration-200">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 accent-[#0d9488]"
                      checked={selected.length === display.length && display.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelected(display.map((b) => b.id.toString()));
                        else setSelected([]);
                      }}
                    />
                  </th>
                )}
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Nama Buku</th>
                <th className="p-4">Penerbit</th>
                <th className="p-4 text-center">Kategori</th>
                <th className="p-4 text-center">Asal Buku</th>
                <th className="p-4 text-center">Tahun</th>
                <th className="p-4 text-center">Stok</th>
                <th className="p-4 text-center w-40">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {display.map((book, i) => (
                <tr 
                  key={book.id} 
                  className={`transition-colors ${selected.includes(book.id.toString()) ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                >
                  {showSelect && (
                    <td className="p-4 text-center animate-in slide-in-from-left duration-200">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 accent-[#0d9488] cursor-pointer"
                        checked={selected.includes(book.id.toString())}
                        onChange={() => setSelected(prev => 
                          prev.includes(book.id.toString()) 
                          ? prev.filter(id => id !== book.id.toString()) 
                          : [...prev, book.id.toString()]
                        )}
                      />
                    </td>
                  )}
                  <td className="p-4 text-xs font-bold text-slate-400 text-center">{i + 1}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 leading-tight">{book.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium italic">{book.author}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-medium">{book.publisher || "-"}</td>
                  <td className="p-4 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {book.source || "Pembelian"}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-500 text-center">{book.year}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-black ${book.stock > 0 ? "text-emerald-500" : "text-red-400"}`}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* TOMBOL EDIT (Icon Pensil) */}
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setIsEditing(true);
                        }}
                        className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 border border-amber-200 transition-all"
                        title="Edit Buku"
                      >
                        <span className="text-xs">✎</span>
                      </button>

                      {/* TOMBOL PINJAM */}
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setIsEditing(false);
                        }}
                        disabled={!book.available}
                        className={`w-20 py-1.5 text-[10px] rounded-lg font-bold transition-all ${
                          book.available 
                          ? "bg-[#3b5998] text-white hover:bg-[#2d4373]" 
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                      >
                        {book.available ? "Pinjam" : "Habis"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION - Dinamis untuk Tambah/Edit */}
      {(showForm || isEditing) && (
        <BookFormModal 
          onClose={() => {
            setShowForm(false);
            setIsEditing(false);
            setSelectedBook(null);
          }} 
          onSubmit={isEditing ? handleUpdateBook : handleAddBook} 
          initialData={isEditing ? selectedBook : null}
          onBulkSubmit={handleBulkAddBooks} 
        />
      )}

      {/* MODAL PINJAM - Muncul hanya jika tidak sedang editing */}
      {selectedBook && !isEditing && (
        <BorrowForm 
          bookTitle={selectedBook.title} 
          onClose={() => setSelectedBook(null)} 
          onSubmit={handleBorrow} 
        />
      )}
    </div>
  );
};

export default Books;