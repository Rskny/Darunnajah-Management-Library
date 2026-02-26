import React,{useState} from "react";
import { Book } from "../types";

interface Props{
book:Book;
selected:boolean;
onSelect:()=>void;
onLend:()=>void;
onRestock:(qty:number)=>void;
}

const BookCard:React.FC<Props>=({
book,selected,onSelect,onLend,onRestock
})=>{

const[openRestock,setOpenRestock]=useState(false);
const[qty,setQty]=useState(1);

return(
<div className={`
relative bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between
${selected?"ring-2 ring-blue-500 shadow-lg":"border-slate-200 hover:shadow-md"}
`}>

{/* checkbox */}
<input
type="checkbox"
checked={selected}
onChange={onSelect}
className="absolute top-3 right-3 w-4 h-4 accent-blue-600"
/>

{/* status bar */}
<div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${
book.available?"bg-blue-500":"bg-slate-300"
}`} />

{/* HEADER */}
<div>
<div className="flex justify-between mb-2">

<span className="text-[9px] font-bold bg-slate-100 px-2 py-1 rounded uppercase">
{book.category}
</span>

<span className={`w-2.5 h-2.5 rounded-full ${
book.available?"bg-emerald-500":"bg-slate-300"
}`} />

</div>

<h3 className="font-bold text-sm text-slate-800 line-clamp-2">
{book.title}
</h3>

<p className="text-[11px] text-slate-400 font-semibold truncate">
{book.author}
</p>
</div>

{/* INFO BOX GRID */}
<div className="grid grid-cols-2 gap-2 my-3 text-[10px]">

<div className="bg-slate-50 rounded-lg p-2 text-center border">
<p className="text-slate-400 font-bold">Tahun</p>
<p className="font-bold text-slate-700">{book.year}</p>
</div>

<div className="bg-slate-50 rounded-lg p-2 text-center border">
<p className="text-slate-400 font-bold">Stok</p>
<p className="font-bold text-slate-700">{book.stock}</p>
</div>

</div>

{/* TAG */}
{(book.classCode||book.major)&&(
<div className="flex flex-wrap gap-1 mb-3">
{book.classCode&&(
<span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
{book.classCode}
</span>
)}
{book.major&&(
<span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
{book.major}
</span>
)}
</div>
)}

{/* FOOTER */}
<div className="pt-2 border-t flex justify-between items-center">

<p className="text-[9px] text-slate-400 truncate max-w-[120px]">
{book.publisher}
</p>

<div className="flex gap-2">

{/* RESTOCK */}
<button
onClick={()=>setOpenRestock(true)}
className="px-3 py-1.5 text-xs rounded-lg font-bold bg-emerald-500 text-white hover:bg-emerald-600">
Restock
</button>

{/* BORROW */}
<button
onClick={onLend}
disabled={!book.available}
className={`px-4 py-1.5 text-xs rounded-lg font-bold ${
book.available
?"bg-[#3b5998] text-white hover:bg-[#2d4373]"
:"bg-slate-100 text-slate-400 cursor-not-allowed"
}`}>
{book.available?"Pinjam":"Habis"}
</button>

</div>
</div>

{/* RESTOCK MODAL */}
{openRestock&&(
<div className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center gap-3 z-10">

<p className="font-bold text-sm">Tambah Stok</p>

<input
type="number"
value={qty}
min={1}
onChange={e=>setQty(Number(e.target.value))}
className="border rounded-lg px-3 py-2 w-24 text-center"
/>

<div className="flex gap-3">

<button
onClick={()=>setOpenRestock(false)}
className="px-4 py-2 text-xs rounded-lg bg-slate-200">
Batal
</button>

<button
onClick={()=>{
onRestock(qty);
setOpenRestock(false);
}}
className="px-4 py-2 text-xs rounded-lg bg-blue-600 text-white">
Submit
</button>

</div>
</div>
)}

</div>
);
};

export default BookCard;