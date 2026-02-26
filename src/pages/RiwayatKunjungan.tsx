import {useState,useEffect} from "react";
import PageHeader from "../components/PageHeader";
import TableBox from "../components/ui/TableBox";
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
<div className="p-8 space-y-8">

<div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
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
Hapus ({selected.length})
</button>
)}
</>
}
/>
</div>

<TableBox>
<table className="w-full text-sm">

<thead className="bg-slate-100 text-xs uppercase text-slate-600">
<tr className="text-center">
{selectMode&&(
<th className="p-4 w-10">
<input type="checkbox"
checked={selected.length===sorted.length&&sorted.length>0}
onChange={toggleAll}/>
</th>
)}
<th className="p-4 w-14">No</th>
<th className="p-4">Tanggal</th>
<th className="p-4 text-left">Nama</th>
<th className="p-4 text-left">Role</th>
<th className="p-4 text-left">Kegiatan</th>
<th className="p-4">Status</th>
</tr>
</thead>

<tbody>
{sorted.length===0?(
<tr>
<td colSpan={selectMode?7:6}
className="py-20 text-center text-slate-400 font-medium">
Tidak ada riwayat kunjungan
</td>
</tr>
):(
sorted.map((item,i)=>(
<tr key={item.id} className="border-t text-center hover:bg-slate-50">

{selectMode&&(
<td>
<input type="checkbox"
checked={selected.includes(item.id)}
onChange={()=>toggleSelect(item.id)}/>
</td>
)}

<td className="p-4 font-semibold text-slate-500">{i+1}</td>
<td>{new Date(item.date).toLocaleDateString("id-ID")}</td>
<td className="text-left font-medium">{item.name}</td>
<td className="text-left capitalize">{item.chosing}</td>
<td className="text-left max-w-[240px] truncate">
{item.purpose||item.description}
</td>
<td>
<span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
Kunjungan
</span>
</td>

</tr>
))
)}
</tbody>

</table>
</TableBox>

</div>
);
}