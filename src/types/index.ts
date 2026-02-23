export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  publisher: string;
  isbn?: string;
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
  kelas: string;
  chosing: string;
  purpose: string;
  date: string;
  time: string;
}

export interface HistoryItem {
  id?: string;
  name: string;
  date: string;

  status?: "Siswa" | "Guru" | "Tepat Waktu" | "Terlambat";
  activity?: "Peminjaman" | "Pengembalian" | "Membaca" | "Diskusi" | "Meminjam";
  type: "Transaksi" | "Kunjungan";
}


export interface Member {
  id: string;
  name: string;
  nis: string;
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
