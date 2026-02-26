import {useState,useEffect} from "react";
import PageHeader from "../components/PageHeader";
import MemberFormModal from "../components/MemberFormModal";
import apiClient from "../apiClient";

export interface Member{
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

const fetchMembers=async()=>{
const res=await apiClient.get("/members");
setMembers(res.data);
};

useEffect(()=>{fetchMembers()},[]);

const toggleSelect=(i:number)=>{
setSelected(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
};

const deleteSelected=async()=>{
for(const i of selected){
const m:any=members[i];
if(m?.id) await apiClient.delete(`/members/${m.id}`);
}
fetchMembers();
setSelected([]);
setShowSelect(false);
};

const sorted=[...members]
.sort((a:any,b:any)=>sort==="asc"?a.id-b.id:b.id-a.id)
.slice(0,limit);

return(
<div className="p-8">

<PageHeader
title="Data Anggota"
subtitle="Manajemen anggota perpustakaan"
onSortChange={setSort}
onLimitChange={setLimit}
right={
<>
<button
onClick={()=>setShowSelect(!showSelect)}
className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold">
Select
</button>

{showSelect&&selected.length>0&&(
<button
onClick={deleteSelected}
className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold">
Hapus
</button>
)}

<button
onClick={()=>setOpen(true)}
className="px-6 py-3 bg-[#3F5EA8] text-white rounded-xl text-xs font-bold shadow">
+ Input Data
</button>
</>
}
/>

{sorted.length===0?(
<div className="bg-white rounded-xl p-6 text-sm text-slate-400">
Belum ada data anggota
</div>
):(
<div className="bg-white rounded-xl p-6 text-sm">
<table className="w-full">
<thead className="text-slate-400 text-xs uppercase">
<tr>
{showSelect&&<th></th>}
<th>No</th>
<th className="text-left">Nama</th>
<th>NIS</th>
<th>Kelas</th>
<th>Jurusan</th>
<th>Gender</th>
</tr>
</thead>

<tbody>
{sorted.map((m,i)=>(
<tr key={i} className="border-t">
{showSelect&&(
<td>
<input type="checkbox"
checked={selected.includes(i)}
onChange={()=>toggleSelect(i)}/>
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