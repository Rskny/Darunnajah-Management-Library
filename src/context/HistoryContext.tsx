import { createContext, useContext, useState } from "react";

export interface HistoryItem {
  id: number;
  date: Date;
  name: string;
  role: string;
  activity: string;
  category: "transaksi" | "kunjungan";
  status?: "meminjam" | "tepat" | "telat";
  daysLate?: number;
  description?: string;
}

interface HistoryContextType {
  history: HistoryItem[];
  // Menggunakan Omit agar kita tidak perlu mengirim 'id' saat menambah history
  addHistory: (item: Omit<HistoryItem, 'id'>) => void;
  deleteHistory: (id: number) => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: Omit<HistoryItem, 'id'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now(), // Generate ID unik otomatis
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const deleteHistory = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory, deleteHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used inside provider");
  return ctx;
};