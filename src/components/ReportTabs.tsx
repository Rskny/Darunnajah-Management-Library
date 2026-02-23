import { useState } from "react";
import TransactionReport from "./TransactionReport";
import VisitReport from "./VisitReport";

interface Props {
  month: string;
  year: string;
}

export default function ReportTabs({ month, year }: Props) {
  const [tab, setTab] = useState<"trx" | "visit">("trx");

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("trx")}
          className={`px-4 py-2 rounded-full text-xs font-bold ${
            tab === "trx"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          Transaksi
        </button>

        <button
          onClick={() => setTab("visit")}
          className={`px-4 py-2 rounded-full text-xs font-bold ${
            tab === "visit"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          Kunjungan
        </button>
      </div>

      {tab === "trx" ? (
        <TransactionReport month={month} year={year} />
      ) : (
        <VisitReport month={month} year={year} />
      )}
    </div>
  );
}
