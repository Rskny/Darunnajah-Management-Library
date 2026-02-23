import { Book, Member, Admin } from "../types";

export const CATEGORIES = [
  "Tafsir",
  "Hadits",
  "Fiqh",
  "Sains",
  "Sastra",
  "Sejarah Islam",
  "Bahasa inggris",
  "Bahasa Arab",
  "Other",
];

export const CLASS_CODES = [
  "Kelas 1",
  "Kelas 2",
  "Kelas 3",
  "Kelas 4",
  "Kelas 5",
  "Kelas 6",
  "Kelas 7",
  "Kelas 8",
  "Kelas 9",
];

export const MAJORS = ["Tsanawiyah", "IPA", "IPS", "MAK"];

export const GENDERS = ["Laki-laki", "Perempuan"];

export const SOURCES = ["Pembelian", "Sumbangan", "Denda"];

/* ================= BOOKS ================= */

export const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    title: "Kitab Al-Umm",
    author: "Imam Syafi'i",
    year: "2015",
    publisher: "Darul Kutub",
    isbn: "978-602-1234-01",
    category: "Fiqh",
    classCode: "Kelas 5",
    major: "MAK",
    stock: 10,
    source: "Pembelian",
    inputDate: "2024-01-01",
    available: true,
  },
  {
    id: "2",
    title: "Ar-Raheeq Al-Makhtum",
    author: "Safiur Rahman Al-Mubarakpuri",
    year: "2018",
    publisher: "Ummul Qura",
    isbn: "978-602-1234-02",
    category: "Sejarah Islam",
    stock: 5,
    source: "Sumbangan",
    inputDate: "2024-01-05",
    available: false,
  },
];

/* ================= MEMBERS ================= */

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    nis: "12001",
    class: "12 IPA 1",
    joinDate: "2023-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Zainal Abidin",
    nis: "12002",
    class: "11 IPS 2",
    joinDate: "2023-02-10",
    status: "active",
  },
];

/* ================= ADMINS ================= */

export const INITIAL_ADMINS: Admin[] = [
  {
    id: "1",
    name: "User Abdullah",
    username: "abdullah",
    email: "abdullah@darunnajah.com",
    role: "Super Admin",
    lastLogin: "2024-05-20 08:30",
  },
  {
    id: "2",
    name: "Siti Aminah",
    username: "siti",
    email: "siti@darunnajah.com",
    role: "Librarian",
    lastLogin: "2024-05-20 09:15",
  },
];
