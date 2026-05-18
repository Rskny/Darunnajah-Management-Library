import React, { useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onSortChange?: (order: "asc" | "desc") => void;
  onLimitChange?: (limit: number) => void;
  defaultOrder?: "asc" | "desc";
  defaultLimit?: number;
}

const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  right,
  onSortChange,
  onLimitChange,
  defaultOrder = "desc",
  defaultLimit = 10,
}) => {
  const [order, setOrder] = useState<"asc" | "desc">(defaultOrder);
  const [limit, setLimit] = useState<number>(defaultLimit);

  const changeOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onSortChange?.(newOrder);
  };

  const changeLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setLimit(val);
    onLimitChange?.(val);
  };

  return (
    /* PERUBAHAN DI SINI:
      - Mengubah mb-6 menjadi pb-4 (agar jarak ke garis bawah konsisten)
      - Menambahkan `sticky top-0 z-30 bg-white` supaya dia mengunci di atas area konten.
      - Ditambahkan `-mx-8 px-8 pt-4` (opsional) jika kamu ingin background putih header ini melebar rata dengan padding halaman utamamu.
    */
    <div className="sticky top-0 z-30 bg-white pt-4 pb-2 mb-6">

      {/* HEADER ROW */}
      <div className="flex items-start justify-between">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-slate-400 font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {onLimitChange && (
            <select
              value={limit}
              onChange={changeLimit}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold bg-white cursor-pointer outline-none"
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
              <option value={1000}>Top 1000</option> 
              <option value={5000}>Semua Data</option>
            </select>
          )}

          {onSortChange && (
            <button
              onClick={changeOrder}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              {order === "asc" ? "Ascending" : "Descending"}
            </button>
          )}

          {right}
        </div>
      </div>

      {/* OUTLINE LINE */}
      <div className="mt-4 border-t border-slate-200" />

    </div>
  );
};

export default PageHeader;