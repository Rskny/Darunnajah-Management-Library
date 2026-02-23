interface Props {
  month: string;
  year: string;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
}

export default function ReportFilter({
  month,
  year,
  onMonthChange,
  onYearChange,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl flex gap-4 items-center">
      <select
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-slate-100 font-semibold"
      >
        {Array.from({ length: 12 }, (_, i) => {
          const m = String(i + 1).padStart(2, "0");
          return (
            <option key={m} value={m}>
              Bulan {m}
            </option>
          );
        })}
      </select>

      <select
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-slate-100 font-semibold"
      >
        {["2023", "2024", "2025"].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
