export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  publisher: string;
  isbn?: string;
  bookCode?: string;
  category: string;
  classCode?: string;
  major?: string;
  stock: number;
  source: "Pembelian" | "Sumbangan" | "Denda";
  inputDate: string;
  available: boolean;
  coverImage?: string;
}



export interface Transaction {
  id: string;
  bookId?: string;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
}

export interface Visit {
  id: number;
  name: string;
  class: string;
  chosing: string;
  purpose: string;
  date: string;
  time: string;
}

export interface HistoryItem {
  id?: string;
  name: string;
  date: string;
  type: "Transaksi" | "Kunjungan";
  // Properti tambahan untuk mengatasi error di laporan
  borrowDate?: string;
  memberId?: string;
  idAnggota?: string;
  studentName?: string;
  bookTitle?: string;
  status?: string;
  className?: string; // Untuk VisitReport
  purpose?: string;   // Untuk VisitReport
  category?: "transaksi" | "kunjungan";
}

export interface Member {
  id: string;
  name: string;
  nis: string;
  role: string;
  class: string;
  joinDate: string;
  status: "active" | "inactive";
  major?: string;
  gender?: string;
}

export interface Admin {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "Super Admin" | "Librarian";
  lastLogin: string;
  profileImage?: string;
}

export interface Statistics {
  totalBooks: number;
  activeLoans: number;
  overdueCount: number;
  totalMembers: number;
  weeklyVisits: number;
}