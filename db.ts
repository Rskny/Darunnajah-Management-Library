
import Dexie, { type Table } from 'https://esm.sh/dexie@4.0.1';
import { Book, Member, Transaction, Visit, Admin } from '../types';
import { INITIAL_BOOKS, INITIAL_MEMBERS, INITIAL_ADMINS } from './constants';

export class LibraryDatabase extends Dexie {
  books!: Table<Book>;
  members!: Table<Member>;
  transactions!: Table<Transaction>;
  visits!: Table<Visit>;
  admins!: Table<Admin>;

  constructor() {
    super('DarunnajahLibraryDB');
    
    // Inisialisasi skema database
    // Explicitly call this.version which is a method of Dexie class
    this.version(1).stores({
      books: '++id, title, author, category, available',
      members: '++id, name, nis, class',
      transactions: '++id, bookId, studentName, status, borrowDate',
      visits: '++id, name, nis, date',
      admins: '++id, username, email'
    });
  }

  // Fungsi untuk memasukkan data awal jika database kosong
  async seed() {
    try {
      const bookCount = await this.books.count();
      if (bookCount === 0) {
        await this.books.bulkAdd(INITIAL_BOOKS as any);
        await this.members.bulkAdd(INITIAL_MEMBERS as any);
        await this.admins.bulkAdd(INITIAL_ADMINS as any);
        console.log('Database Darunnajah berhasil di-seed.');
      }
    } catch (error) {
      console.error('Gagal melakukan seeding database:', error);
    }
  }
}

export const db = new LibraryDatabase();
// Trigger seeding secara otomatis
db.seed();
