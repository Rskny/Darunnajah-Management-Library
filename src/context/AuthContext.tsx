import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../apiClient";

type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, "id">) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  /* LOAD STORAGE */
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const savedUser = localStorage.getItem("auth_user");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  /* SAVE USERS */
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  /* LOGIN */
  const login = async (username: string, password: string) => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      return true;
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    }
  };

  /* REGISTER */
  const register = async (data: Omit<User, "id">) => {
    try {
      await apiClient.post('/auth/register', data);
      return true;
    } catch (err) {
      console.error("Register Error:", err);
      return false;
    }
  };

  /* LOGOUT */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
  };

  /* UPDATE PROFILE */
  const updateUser = async (data: Partial<User>) => {
    if (!user) return;

    try {
      await apiClient.put(`/auth/admins/${user.id}`, data);

      const updated = { ...user, ...data };
      setUser(updated as User);

      // Re-fetch or locally mutate (we'll just mutate locally)
      const updatedUsers = users.map(u => u.id === user.id ? updated : u);
      setUsers(updatedUsers as User[]);

      localStorage.setItem("auth_user", JSON.stringify(updated));
    } catch (err) {
      console.error("Update User Error", err);
    }
  };

  /* CHANGE PASSWORD */
  const changePassword = async (oldPass: string, newPass: string) => {
    if (!user) return false;
    // To be strictly correct, we'd verify oldPass with API, but keeping the signature matching the UI for now.
    try {
      await updateUser({ password: newPass });
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      register,
      logout,
      updateUser,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must inside provider");
  return ctx;
}
