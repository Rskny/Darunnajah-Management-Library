import React, { useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Book } from '../../types';
import { CATEGORIES } from '../../constants/data';

interface BookFormModalProps {
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id' | 'available'>) => void;
  onBulkSubmit: (books: Omit<Book, 'id' | 'available'>[]) => void;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ onClose, onSubmit, onBulkSubmit }) => {

  const [formData, setFormData] = useLocalStorage(
    "book-form",
    {
      title: '',
      author: '',
      year: '',
      publisher: '',
      isbn: '',
      category: CATEGORIES[0],
      stock: 1,
      source: 'Pembelian' as Book['source'],
      inputDate: new Date().toISOString().split('T')[0]
    }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);

    // reset form setelah submit
    setFormData({
      title: '',
      author: '',
      year: '',
      publisher: '',
      isbn: '',
      category: CATEGORIES[0],
      stock: 1,
      source: 'Pembelian',
      inputDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');

      const books: Omit<Book, 'id' | 'available'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [title, isbn, author, year, publisher, category, stock, source] = line.split(',');

        books.push({
          title: title?.trim() || 'Judul Kosong',
          author: author?.trim() || 'Penulis Kosong',
          year: year?.trim() || '2025',
          publisher: publisher?.trim() || 'Penerbit',
          isbn: isbn?.trim() || 'ISBN',
          category: category?.trim() || CATEGORIES[0],
          stock: parseInt(stock?.trim()) || 1,
          source: (source?.trim() as Book['source']) || 'Pembelian',
          inputDate: new Date().toISOString().split('T')[0]
        });
      }

      onBulkSubmit(books);
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Manajemen Koleksi</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Tambah Buku Baru atau Import From
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* IMPORT CSV */}
          <div className="mb-10 p-8 bg-[#3b5998]/5 rounded-3xl border border-[#3b5998]/10 flex flex-col items-center text-center">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2">
              Import via CSV
            </h4>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
              Unggah daftar buku dalam format CSV
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-[#3b5998] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
            >
              Pilih File CSV
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />

            <p className="mt-4 text-[9px] text-slate-300 font-bold italic">
              Format: judul, ISBN, pengarang, tahun, penerbit, kategori, stok, asal
            </p>
          </div>

          {/* DIVIDER */}
          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="px-5 bg-white text-slate-300 font-black">
                Input Manual Per Judul
              </span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Nama Buku *
                </label>

                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  placeholder="Judul Buku"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  ISBN <span className="text-slate-300">(Opsional)</span>
                </label>

                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  placeholder="ISBN"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Pengarang *
                </label>

                <input
                  required
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  placeholder="Nama Pengarang"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Tahun Terbit *
                </label>

                <input
                  required
                  type="text"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  placeholder="2026"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Penerbit
                </label>

                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleChange('publisher', e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                  placeholder="Penerbit"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Kategori *
                </label>

                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Stok *
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value) || 1)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  Asal Buku *
                </label>

                <select
                  required
                  value={formData.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                >
                  <option value="Pembelian">Pembelian</option>
                  <option value="Sumbangan">Sumbangan</option>
                  <option value="Denda">Denda</option>
                </select>
              </div>

            </div>

            <div className="pt-8 flex flex-col md:flex-row gap-4">
              <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">
                Simpan Buku
              </button>

              <button type="button" onClick={onClose} className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase">
                Batalkan
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
