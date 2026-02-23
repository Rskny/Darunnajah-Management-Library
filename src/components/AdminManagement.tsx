import React from "react";
import { Admin } from "../types";

const AdminManagement: React.FC = () => {
  const admins: Admin[] = [
    {
      id: "1",
      name: "Super Admin",
      username: "superadmin",
      email: "admin@demo.com",
      role: "Super Admin",
      lastLogin: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6">

      <h3 className="text-xl font-bold">Daftar Admin Sistem</h3>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Nama Admin</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Login Terakhir</th>
            </tr>
          </thead>

          <tbody>
            {admins.map(a=>(
              <tr key={a.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-semibold">{a.name}</td>
                <td className="p-4">{a.username}</td>
                <td className="p-4 text-xs text-slate-500">
                  {new Date(a.lastLogin).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 font-semibold">
        Daftar admin hanya dapat dikelola melalui database sistem.
      </div>

    </div>
  );
};

export default AdminManagement;
