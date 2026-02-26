import {useState,useEffect} from "react";
import PageHeader from "../components/PageHeader";
import apiClient from "../apiClient";

export default function RiwayatKunjungan(){

const[data,setData]=useState<any[]>([]);
const[selectMode,setSelectMode]=useState(false);
const[selected,setSelected]=useState<number[]>([]);
const[sort,setSort]=useState<"asc"|"desc">("desc");
const[limit,setLimit]=useState(10);

const fetchHistory=async()=>{
const res=await apiClient.get("/visits");
setData(res.data);
};

useEffect(()=>{fetchHistory()},[]);

const toggleSelect=(id:number)=>{
setSelected(p=>p.includes(id)?p.filter(i=>i!==id):[...p,id]);
};

const toggleAll=()=>{
if(selected.length===data.length)setSelected([]);
else setSelected(data.map(i=>i.id));
};

const deleteSelected=async()=>{
for(const id of selected)
await apiClient.delete(`/visits/${id}`);
setSelected([]);
setSelectMode(false);
fetchHistory();
};

const sorted=[...data]
.sort((a,b)=>sort==="asc"?a.id-b.id:b.id-a.id)
.slice(0,limit);

return(
<div className="p-8">

<PageHeader
title="Riwayat Kunjungan"
subtitle="Data histori kunjungan"
onSortChange={setSort}
onLimitChange={setLimit}
right={
<>
<button
onClick={()=>{setSelectMode(!selectMode);setSelected([])}}
className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold">
{selectMode?"Cancel":"Select"}
</button>

{selectMode&&selected.length>0&&(
<button
onClick={deleteSelected}
className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold">
Hapus
</button>
)}
</>
}
/>

{sorted.length===0?(
<div className="bg-white rounded-xl p-6 text-sm text-slate-400">
Belum ada data kunjungan
</div>
):(
<div className="bg-white rounded-xl shadow overflow-hidden">
<table className="w-full text-sm">
<thead className="bg-slate-100">
<tr className="text-center">
{selectMode&&(
<th className="p-3">
<input type="checkbox"
checked={selected.length===sorted.length}
onChange={toggleAll}/>
</th>
)}
<th className="p-3">No</th>
<th className="p-3">Tanggal</th>
<th>Nama</th>
<th>Role</th>
<th>Kegiatan</th>
<th>Status</th>
</tr>
</thead>

<tbody>
{sorted.map((item,i)=>(
<tr key={item.id} className="border-t text-center">
{selectMode&&(
<td>
<input type="checkbox"
checked={selected.includes(item.id)}
onChange={()=>toggleSelect(item.id)}/>
</td>
)}
<td className="p-3">{i+1}</td>
<td>{new Date(item.date).toLocaleDateString("id-ID")}</td>
<td>{item.name}</td>
<td>{item.chosing}</td>
<td>{item.purpose||item.description}</td>
<td>
<span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
Kunjungan
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
)}

</div>
);
}