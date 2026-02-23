import React from "react";
import { Book } from "../types";

interface BookCardProps {
  book: Book;
  onLend: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onLend }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative">

      {/* status bar */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${book.available ? "bg-blue-500" : "bg-slate-300"}`} />

      {/* HEADER */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">
            {book.category}
          </span>

          <span className={`w-2.5 h-2.5 rounded-full ${book.available ? "bg-emerald-500" : "bg-slate-300"}`} />
        </div>

        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
          {book.title}
        </h3>

        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate">
          {book.author}
        </p>
      </div>

      {/* INFO MINI */}
      <div className="grid grid-cols-2 gap-2 my-3 text-[10px]">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-slate-400 font-bold">Tahun</p>
          <p className="font-bold text-slate-700">{book.year}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-slate-400 font-bold">Stok</p>
          <p className="font-bold text-slate-700">{book.stock}</p>
        </div>
      </div>

      {/* TAG */}
      {(book.classCode || book.major) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {book.classCode && (
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {book.classCode}
            </span>
          )}
          {book.major && (
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {book.major}
            </span>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">

        <div className="text-[9px] text-slate-300 font-semibold truncate max-w-[120px]">
          {book.publisher}
        </div>

        <button
          onClick={onLend}
          disabled={!book.available}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold transition ${
            book.available
              ? "bg-[#3b5998] text-white hover:bg-[#2d4373]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {book.available ? "Pinjam" : "Habis"}
        </button>

      </div>
    </div>
  );
};

export default BookCard;
