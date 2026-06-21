import Dexie, { Table } from "dexie";
import { Book, Member, Transaction, Visit, Admin } from "./types";
import { INITIAL_BOOKS, INITIAL_MEMBERS, INITIAL_ADMINS } from "./constants/data";

export class LibraryDatabase extends Dexie {
  books!: Table<Book>;
  members!: Table<Member>;
  transactions!: Table<Transaction>;
  visits!: Table<Visit>;
  admins!: Table<Admin>;

  constructor() {
    super("DarunnajahLibraryDB");

    this.version(1).stores({
      books: "++id, title, author, category, available",
      members: "++id, name, class",
      transactions: "++id, bookId, studentName, status, borrowDate",
      visits: "++id, name, date",
      admins: "++id, username, email",
    });
  }

  async seed() {
    try {
      const bookCount = await this.books.count();
      if (bookCount === 0) {
        await this.books.bulkAdd(INITIAL_BOOKS as any);
        await this.members.bulkAdd(INITIAL_MEMBERS as any);
        await this.admins.bulkAdd(INITIAL_ADMINS as any);
        console.log("Database Darunnajah berhasil di-seed.");
      }
    } catch (error) {
      console.error("Gagal melakukan seeding database:", error);
    }
  }
}

export const db = new LibraryDatabase();
db.seed();