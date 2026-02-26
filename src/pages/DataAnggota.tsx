import {useState,useEffect} from "react";
import PageHeader from "../components/PageHeader";
import MemberFormModal from "../components/MemberFormModal";
import apiClient from "../apiClient";

export interface Member{
id?:number;
nama:string;
nis:string;
kelas:string;
jurusan:string;
gender:string;
}

export default function DataAnggota(){

const[open,setOpen]=useState(false);
const[members,setMembers]=useState<Member[]>([]);
const[showSelect,setShowSelect]=useState(false);
const[selected,setSelected]=useState<number[]>([]);
const[sort,setSort]=useState<"asc"|"desc">("desc");
const[limit,setLimit]=useState(10);

/* FETCH */
const fetchMembers=async()=>{
const res=await apiClient.get("/members");
setMembers(res.data);
};

useEffect(()=>{fetchMembers()},[]);

/* SELECT */
const toggleSelect=(i:number)=>{
setSelected(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
};

const toggleAll=()=>{
if(selected.length===sorted.length)setSelected([]);
else setSelected(sorted.map((_,i)=>i));
};

/* DELETE */
const deleteSelected=async()=>{
for(const i of selected){
const m:any=sorted[i];
if(m?.id) await apiClient.delete(`/members/${m.id}`);
}
fetchMembers();
setSelected([]);
setShowSelect(false);
};

/* SORT + LIMIT */
const sorted=[...members]
.sort((a:any,b:any)=>sort==="asc"?a.id-b.id:b.id-a.id)
.slice(0,limit);

return(
<div className="p-8 space-y-6">

{/* ================= HEADER BOX ================= */}
<div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
<PageHeader
title="Data Anggota"
subtitle="Manajemen anggota perpustakaan"
onSortChange={setSort}
onLimitChange={setLimit}
right={
<>
<button
onClick={()=>{setShowSelect(!showSelect);setSelected([])}}
className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold">
{showSelect?"Cancel":"Select"}
</button>

{showSelect&&selected.length>0&&(
<button
onClick={deleteSelected}
className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold">
Hapus ({selected.length})
</button>
)}

<button
onClick={()=>setOpen(true)}
className="px-6 py-2 bg-[#3F5EA8] text-white rounded-xl text-xs font-bold shadow">
+ Input Data
</button>
</>
}
/>
</div>

{/* ================= TABLE BOX ================= */}
<div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-slate-100 text-xs uppercase text-slate-600">
<tr className="text-center">

{showSelect&&(
<th className="p-4 w-10">
<input
type="checkbox"
checked={selected.length===sorted.length && sorted.length>0}
onChange={toggleAll}
/>
</th>
)}

<th className="p-4 w-14">No</th>
<th className="p-4 text-left">Nama</th>
<th className="p-4">NIS</th>
<th className="p-4">Kelas</th>
<th className="p-4">Jurusan</th>
<th className="p-4">Gender</th>

</tr>
</thead>

<tbody>

{sorted.length===0?(
<tr>
<td
colSpan={showSelect?7:6}
className="py-20 text-center text-slate-400 font-medium">
Belum ada data anggota
</td>
</tr>
):(

sorted.map((m,i)=>(
<tr key={i} className="border-t hover:bg-slate-50 text-center">

{showSelect&&(
<td>
<input
type="checkbox"
checked={selected.includes(i)}
onChange={()=>toggleSelect(i)}
/>
</td>
)}

<td className="p-4 font-semibold text-slate-500">{i+1}</td>

<td className="text-left font-medium text-slate-700">
{m.nama}
</td>

<td>{m.nis}</td>
<td>{m.kelas}</td>
<td>{m.jurusan}</td>
<td>{m.gender}</td>

</tr>
))

)}

</tbody>
</table>

</div>

{/* ================= MODAL ================= */}
{open&&(
<MemberFormModal
onClose={()=>setOpen(false)}
onImport={async(data)=>{
for(const m of data)
await apiClient.post("/members",m);
fetchMembers();
setOpen(false);
}}
/>
)}

</div>
);
}