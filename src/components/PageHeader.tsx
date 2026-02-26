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
    <div className="mb-6">

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
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold"
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          )}

          {onSortChange && (
            <button
              onClick={changeOrder}
              className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold"
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