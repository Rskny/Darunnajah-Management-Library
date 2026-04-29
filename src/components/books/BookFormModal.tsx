import React, { useRef, useEffect, useState } from 'react';
import { Book } from '../../types';
import { CATEGORIES } from '../../constants/data';

interface BookFormModalProps {
  onClose: () => void;
  onSubmit: (book: any) => void;
  onBulkSubmit: (books: any[]) => void;
  initialData?: Book | null;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ onClose, onSubmit, onBulkSubmit, initialData }) => {
  const emptyForm = {
    title: '',
    author: '',
    year: '',
    publisher: '',
    isbn: '',
    category: CATEGORIES[0],
    stock: 1,
    source: 'Pembelian' as Book['source'],
    inputDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      const saved = localStorage.getItem("book-form");
      if (saved) setFormData(JSON.parse(saved));
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (!initialData) {
      localStorage.setItem("book-form", JSON.stringify(newData));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) localStorage.removeItem("book-form");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const books: any[] = [];
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
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800">{initialData ? "Edit Buku" : "Tambah Buku"}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {initialData ? `Update: ${initialData.title}` : "Input koleksi baru"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!initialData && (
            <div className="mb-10 p-6 bg-[#3b5998]/5 rounded-3xl border border-[#3b5998]/10 text-center">
              <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-[#3b5998] text-white rounded-xl font-black text-[10px] uppercase">
                Import CSV
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Judul Buku</label>
              <input required value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Pengarang</label>
              <input required value={formData.author} onChange={(e) => handleChange('author', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Tahun</label>
              <input required value={formData.year} onChange={(e) => handleChange('year', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Stok</label>
              <input type="number" value={formData.stock} onChange={(e) => handleChange('stock', parseInt(e.target.value))} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Kategori</label>
              <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-2xl font-bold">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 pt-6 flex gap-4">
              <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">
                {initialData ? "Simpan Perubahan" : "Simpan Buku"}
              </button>
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;