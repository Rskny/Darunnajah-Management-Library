import React,{useState,useEffect} from "react";
import VisitFormModal from "../components/visits/VisitFormModal";
import PageHeader from "../components/PageHeader";
import apiClient from "../apiClient";
import { useHistory } from "../context/HistoryContext";

interface Visit{
id:number;
name:string;
kelas:string;
chosing:string;
purpose:string;
date:string;
time:string;
}

const isToday=(dateString:string)=>{
const d=new Date(dateString);
const now=new Date();
return d.getDate()===now.getDate()
&&d.getMonth()===now.getMonth()
&&d.getFullYear()===now.getFullYear();
};

const Visits:React.FC=()=>{
const{addHistory}=useHistory();

const[showModal,setShowModal]=useState(false);
const[visits,setVisits]=useState<Visit[]>([]);
const[selectedIds,setSelectedIds]=useState<number[]>([]);

const[sort,setSort]=useState<"asc"|"desc">("desc");
const[limit,setLimit]=useState(10);

const fetchVisits=async()=>{
const res=await apiClient.get("/visits");
setVisits(res.data.filter((v:Visit)=>isToday(v.date)));
};

useEffect(()=>{fetchVisits()},[]);

const toggleSelect=(id:number)=>{
setSelectedIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
};

const toggleSelectAll=()=>{
if(selectedIds.length===visits.length)setSelectedIds([]);
else setSelectedIds(visits.map(v=>v.id));
};

const deleteSelected=async()=>{
for(const id of selectedIds)
await apiClient.delete(`/visits/${id}`);
fetchVisits();
setSelectedIds([]);
};

const sorted=[...visits]
.sort((a,b)=>sort==="asc"?a.id-b.id:b.id-a.id)
.slice(0,limit);

return(
<div className="p-10">

<PageHeader
title="Kunjungan Hari Ini"
subtitle="Data pengunjung perpustakaan"
onSortChange={setSort}
onLimitChange={setLimit}
right={
<>
{selectedIds.length>0&&(
<button onClick={deleteSelected}
className="px-5 py-3 bg-red-500 text-white rounded-2xl font-bold">
Hapus ({selectedIds.length})
</button>
)}
<button
onClick={()=>setShowModal(true)}
className="px-6 py-3 bg-[#3b5998] text-white rounded-2xl font-bold shadow">
+ Tambah Kunjungan
</button>
</>
}
/>

<div className="bg-white rounded-3xl shadow overflow-hidden">
<table className="w-full text-sm">

<thead className="bg-slate-50 text-xs uppercase">
<tr>
<th className="p-4">
<input type="checkbox"
checked={selectedIds.length===sorted.length&&sorted.length>0}
onChange={toggleSelectAll}/>
</th>
<th className="p-4 text-left">Nama</th>
<th className="p-4 text-left">Kelas</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Tujuan</th>
<th className="p-4 text-left">Tanggal</th>
<th className="p-4 text-left">Waktu</th>
</tr>
</thead>

<tbody>
{sorted.length===0?(
<tr>
<td colSpan={7} className="p-6 text-center text-slate-400">
Belum ada kunjungan hari ini
</td>
</tr>
):sorted.map(v=>(
<tr key={v.id} className="border-t">
<td className="p-4 text-center">
<input type="checkbox"
checked={selectedIds.includes(v.id)}
onChange={()=>toggleSelect(v.id)}/>
</td>
<td className="p-4">{v.name}</td>
<td className="p-4">{v.kelas}</td>
<td className="p-4">{v.chosing}</td>
<td className="p-4">{v.purpose}</td>
<td className="p-4">{new Date(v.date).toLocaleDateString("id-ID")}</td>
<td className="p-4">{v.time}</td>
</tr>
))}
</tbody>

</table>
</div>

{showModal&&(
<VisitFormModal
onClose={()=>setShowModal(false)}
onSubmit={()=>{}}
/>
)}

</div>
);
};

export default Visits;