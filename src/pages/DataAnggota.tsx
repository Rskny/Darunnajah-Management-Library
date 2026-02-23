import { useState } from "react";
import MemberFormModal from "../components/MemberFormModal";
import useLocalStorage from "../hooks/useLocalStorage";

export interface Member {
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  gender: string;
}

export default function DataAnggota() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useLocalStorage<Member[]>("members", []);

  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (index:number) => {
    setSelected(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const deleteSelected = () => {
    setMembers(prev => prev.filter((_,i)=> !selected.includes(i)));
    setSelected([]);
    setShowSelect(false);
  };

  return (
    <div className="p-8 relative">

      {/* tombol */}
      <div className="absolute top-8 right-8 flex gap-3">

        <button
          onClick={()=> setShowSelect(!showSelect)}
          className="bg-slate-200 px-4 py-2 rounded-full text-xs font-bold"
        >
          Select
        </button>

        {showSelect && selected.length>0 && (
          <button
            onClick={deleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold"
          >
            Hapus
          </button>
        )}

        <button
          onClick={()=> setOpen(true)}
          className="bg-[#3F5EA8] text-white px-6 py-3 rounded-full text-xs font-semibold shadow-lg"
        >
          + INPUT DATA
        </button>
      </div>

      <h1 className="text-xl font-bold mb-6">Data Anggota</h1>

      {members.length===0 ? (
        <div className="bg-white rounded-xl p-6 text-sm text-slate-400">
          Belum ada data anggota
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 text-sm">
          <table className="w-full">
            <thead className="text-slate-400 text-xs uppercase">
              <tr>
                {showSelect && <th></th>}
                <th>No</th>
                <th className="text-left">Nama</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Jurusan</th>
                <th>Gender</th>
              </tr>
            </thead>

            <tbody>
              {members.map((m,i)=>(
                <tr key={i} className="border-t">

                  {showSelect && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(i)}
                        onChange={()=> toggleSelect(i)}
                      />
                    </td>
                  )}

                  <td>{i+1}</td>
                  <td>{m.nama}</td>
                  <td className="text-center">{m.nis}</td>
                  <td className="text-center">{m.kelas}</td>
                  <td className="text-center">{m.jurusan}</td>
                  <td className="text-center">{m.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <MemberFormModal
          onClose={()=> setOpen(false)}
          onImport={(data)=>{
            setMembers(prev=> [...prev,...data]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
