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
        
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanFields = matches.map(field => field.replace(/^"|"$/g, '').trim());

        const [title, isbn, author, year, publisher, category, stock, source] = cleanFields;

        books.push({
          title: title || 'Judul Kosong',
          isbn: isbn || '-',
          author: author || 'Unknown',
          year: year || new Date().getFullYear().toString(),
          publisher: publisher || '-',
          category: category || CATEGORIES[0],
          stock: parseInt(stock) || 1,
          source: (source as Book['source']) || 'Pembelian',
          inputDate: new Date().toISOString().split('T')[0]
        });
      }
      onBulkSubmit(books);
    };
    reader.readAsText(file);
  };

  // Class CSS untuk input agar seragam dan rapi
  const inputClassName = "w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{initialData ? "Edit Buku" : "Tambah Buku"}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {initialData ? `Update: ${initialData.title}` : "Input koleksi baru"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition">✕</button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* AREA IMPORT CSV */}
          {!initialData && (
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-dashed border-blue-200 text-center">
              <div className="max-w-md mx-auto space-y-2.5">
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()} 
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-blue-100 transition active:scale-95"
                >
                  📤 Upload File CSV
                </button>
                <p className="text-[11px] text-blue-500 font-medium leading-relaxed">
                  Struktur header wajib: <br />
                  <code className="inline-block bg-blue-100/80 px-1.5 py-0.5 mt-1 rounded font-mono text-[10px] text-blue-700">
                    title, isbn, author, year, publisher, category, stock, source
                  </code>
                </p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            </div>
          )}

          {/* DIVIDER */}
          {!initialData && (
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atau Isi Form Manual</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          )}

          {/* FORM MANUAL */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* JUDUL BUKU */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Judul Buku <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                value={formData.title} 
                onChange={(e) => handleChange('title', e.target.value)} 
                placeholder="Contoh: Laskar Pelangi"
                className={inputClassName} 
              />
            </div>
            
            {/* ISBN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                ISBN
              </label>
              <input 
                value={formData.isbn} 
                onChange={(e) => handleChange('isbn', e.target.value)} 
                placeholder="Contoh: 978-602-8519 (Opsional)"
                className={inputClassName} 
              />
            </div>

            {/* PENGARANG */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Pengarang <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                value={formData.author} 
                onChange={(e) => handleChange('author', e.target.value)} 
                placeholder="Contoh: Andrea Hirata"
                className={inputClassName} 
              />
            </div>

            {/* PENERBIT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Penerbit <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                value={formData.publisher} 
                onChange={(e) => handleChange('publisher', e.target.value)} 
                placeholder="Contoh: Bentang Pustaka"
                className={inputClassName} 
              />
            </div>

            {/* TAHUN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Tahun <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                value={formData.year} 
                onChange={(e) => handleChange('year', e.target.value)} 
                placeholder="Contoh: 2005"
                className={inputClassName} 
              />
            </div>

            {/* STOK */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Stok <span className="text-red-500">*</span>
              </label>
              <input 
                required
                type="number" 
                min="1" 
                value={formData.stock} 
                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)} 
                placeholder="Jumlah stok"
                className={inputClassName} 
              />
            </div>

            {/* KATEGORI */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  required
                  value={formData.category} 
                  onChange={(e) => handleChange('category', e.target.value)} 
                  className={`${inputClassName} appearance-none pr-10 cursor-pointer font-bold`}
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="font-medium">{c}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* BUTTON ACTIONS */}
            <div className="md:col-span-2 pt-4 flex gap-4">
              <button type="submit" className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 transition-colors text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                {initialData ? "Simpan Perubahan" : "Simpan Buku"}
              </button>
              <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98]">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;