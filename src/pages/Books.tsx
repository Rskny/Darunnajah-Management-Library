import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import BookFormModal from "../components/books/BookFormModal";
import BorrowForm from "../components/BorrowForm";
import PageHeader from "../components/PageHeader";
import { Book } from "../types";
import { useLocation } from "react-router-dom";

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState<number>(10);

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

  useEffect(() => { fetchBooks(); }, []);

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
      for (const book of booksArray) {
        await apiClient.post("/books", book);
      }
      fetchBooks();
      setShowForm(false);
      alert(`Berhasil mengimpor ${booksArray.length} buku ke database!`);
    } catch (err) {
      console.error("Gagal mengimpor CSV:", err);
      alert("Ada masalah saat mengimpor data buku.");
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
      b.category?.toLowerCase().includes(q) ||
      (b.bookCode && b.bookCode.toLowerCase().includes(q))
    )
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));

  const display = limit === 1000 ? sorted : sorted.slice(0, limit);

  return (
    <div className="p-8 h-screen w-full max-w-full flex flex-col overflow-hidden bg-slate-50">

      {/* HEADER BOX - White container dengan PageHeader di dalamnya */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-shrink-0 mb-6">
        <PageHeader
          title="Katalog Buku"
          subtitle="Manajemen koleksi perpustakaan"
          defaultLimit={10}
          defaultOrder="desc"
          onLimitChange={(newLimit) => setLimit(newLimit)}
          onSortChange={(newSort) => setSort(newSort)}
          right={
            <div className="flex gap-2 items-center">
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

              <button
                onClick={() => { setShowForm(true); setIsEditing(false); }}
                className="px-6 py-2 rounded-full bg-[#3b5998] text-white font-semibold text-xs shadow-md"
              >
                + Input Buku
              </button>
            </div>
          }
        />
      </div>

      {/* CONTAINER TABEL - STRUKTUR DISAMAKAN DENGAN RIWAYAT PEMINJAMAN */}
      <div className="flex-1 min-h-0 w-full relative">
        <div className="absolute inset-0 overflow-auto border border-slate-200 rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse" style={{ minWidth: "1300px" }}>
            <thead className="sticky top-0 z-30 bg-slate-100">
              <tr className="border-b border-slate-100 font-bold text-[11px] text-slate-400 uppercase bg-slate-100">
                {showSelect && (
                  <th className="p-4 w-12 text-center">
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
                <th className="px-6 py-5 w-12 text-center">No</th>
                <th className="px-6 py-5 whitespace-nowrap">Kode Buku</th>
                <th className="px-6 py-5">Judul Buku</th>
                <th className="px-6 py-5">ISBN</th>
                <th className="px-6 py-5">Penerbit</th>
                <th className="px-6 py-5 text-center">Kategori</th>
                <th className="px-6 py-5 text-center">Asal Buku</th>
                <th className="px-6 py-5 text-center">Tahun</th>
                <th className="px-6 py-5 text-center">Stok</th>
                <th className="px-6 py-5 text-center w-40">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {display.length === 0 ? (
                <tr>
                  <td
                    colSpan={showSelect ? 11 : 10}
                    className="py-20 text-center text-slate-400"
                  >
                    Data Kosong
                  </td>
                </tr>
              ) : (
                display.map((book, i) => (
                  <tr
                    key={book.id}
                    className={`transition-colors ${
                      selected.includes(book.id.toString()) ? "bg-slate-50" : "hover:bg-slate-50/50"
                    }`}
                  >
                    {showSelect && (
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 accent-[#0d9488] cursor-pointer"
                          checked={selected.includes(book.id.toString())}
                          onChange={() =>
                            setSelected((prev) =>
                              prev.includes(book.id.toString())
                                ? prev.filter((id) => id !== book.id.toString())
                                : [...prev, book.id.toString()]
                            )
                          }
                        />
                      </td>
                    )}

                    <td className="px-6 py-4 text-xs font-bold text-slate-400 text-center">{i + 1}</td>

                    {/* KODE BUKU */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg whitespace-nowrap">
                        {book.bookCode || "-"}
                      </span>
                    </td>

                    {/* JUDUL BUKU */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 leading-tight whitespace-nowrap">{book.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium italic whitespace-nowrap">{book.author}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {book.isbn || "-"}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                      {book.publisher || "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap">
                        {book.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                        {book.source || "Pembelian"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-500 text-center">
                      {book.year}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-black ${book.stock > 0 ? "text-emerald-500" : "text-red-400"}`}>
                        {book.stock}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
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

      {selectedBook && !isEditing && (
        <BorrowForm
          bookTitle={selectedBook.title}
          bookCode={selectedBook.bookCode || "-"}
          onClose={() => setSelectedBook(null)}
          onSubmit={handleBorrow}
        />
      )}
    </div>
  );
};

export default Books;