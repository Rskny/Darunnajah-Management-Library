
import { db } from './db';
import { Book, Member, Transaction, Visit, Admin } from './types';

export const API = {
  // Books API
  books: {
    getAll: () => db.books.toArray(),
    add: (book: Omit<Book, 'id'>) => db.books.add(book as Book),
    update: (id: string, data: Partial<Book>) => db.books.update(id, data),
    delete: (id: string) => db.books.delete(id),
  },
  
  // Members API
  members: {
    getAll: () => db.members.toArray(),
    add: (member: Omit<Member, 'id'>) => db.members.add(member as Member),
  },

  // Transactions API
  transactions: {
    getAll: () => db.transactions.reverse().toArray(),
    add: (trans: Omit<Transaction, 'id'>) => db.transactions.add(trans as Transaction),
    update: (id: string, data: Partial<Transaction>) => db.transactions.update(id, data),
  },

  // Visits API
  visits: {
    getAll: () => db.visits.reverse().toArray(),
    add: (visit: Omit<Visit, 'id'>) => db.visits.add(visit as Visit),
  },

  // Admins & Auth API
  auth: {
    getAdmins: () => db.admins.toArray(),
    addAdmin: (admin: Omit<Admin, 'id'>) => db.admins.add(admin as Admin),
    updateAdmin: (id: string, data: Partial<Admin>) => db.admins.update(id, data),
    login: async (username: string) => {
      return await db.admins.where('username').equals(username).first();
    }
  },

  // System
  backup: async () => {
    const data = {
      books: await db.books.toArray(),
      members: await db.members.toArray(),
      transactions: await db.transactions.toArray(),
      visits: await db.visits.toArray(),
      admins: await db.admins.toArray(),
      exportDate: new Date().toISOString()
    };
    return data;
  }
};
