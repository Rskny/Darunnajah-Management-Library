import React,{useState} from "react";

export default function TransactionTable({ transactions, onAction }: any) {

  const [showSelect,setShowSelect]=useState(false);
  const [selected,setSelected]=useState<string[]>([]);
  const [extendId,setExtendId]=useState<string|null>(null);
  const [newDate,setNewDate]=useState("");

  const toggle=(id:string)=>{
    setSelected(prev=> prev.includes(id)
      ? prev.filter(x=>x!==id)
      : [...prev,id]
    );
  };

  const calcLate=(dueDate:string)=>{
    const today=new Date();
    const due=new Date(dueDate);
    const diff=Math.ceil((today.getTime()-due.getTime())/(1000*60*60*24));
    return diff>0?diff:0;
  };

  /* delete selected */
  const handleDelete=()=>{
    const saved=JSON.parse(localStorage.getItem("transactions")||"[]");

    const filtered=saved.filter((t:any)=>!selected.includes(t.id));

    localStorage.setItem("transactions",JSON.stringify(filtered));
    setSelected([]);

    window.dispatchEvent(new Event("transactionsUpdated"));
    window.dispatchEvent(new Event("storage"));
  };

  /* submit extend */
  const submitExtend=(id:string)=>{
    if(!newDate) return;

    const saved=JSON.parse(localStorage.getItem("transactions")||"[]");

    const updated=saved.map((t:any)=>
      t.id===id ? {...t,dueDate:new Date(newDate).toISOString()} : t
    );

    localStorage.setItem("transactions",JSON.stringify(updated));

    setExtendId(null);
    setNewDate("");

    window.dispatchEvent(new Event("transactionsUpdated"));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      {/* ACTION BAR */}
      <div className="mb-3 flex gap-3">

        <button
          onClick={()=>{
            setShowSelect(!showSelect);
            setSelected([]);
          }}
          className="px-4 py-1 bg-slate-200 rounded-lg text-xs font-bold"
        >
          {showSelect ? "Cancel" : "Select"}
        </button>

        {selected.length>0 && (
          <button
            onClick={handleDelete}
            className="px-4 py-1 bg-red-500 text-white rounded-lg text-xs font-bold"
          >
            Hapus ({selected.length})
          </button>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-slate-100">
          <tr>
            {showSelect && <th></th>}
            <th>No</th>
            <th>Buku</th>
            <th>Peminjam</th>
            <th>Role</th>
            <th>Pinjam</th>
            <th>Jatuh Tempo</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t:any,i:number)=>{
            const late=calcLate(t.dueDate);

            return(
              <tr key={t.id} className="text-center border-t">

                {showSelect && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(t.id)}
                      onChange={()=>toggle(t.id)}
                    />
                  </td>
                )}

                <td>{i+1}</td>
                <td>{t.bookTitle}</td>
                <td>{t.studentName}</td>
                <td className="capitalize">{t.role}</td>
                <td>{new Date(t.borrowDate).toLocaleDateString("id-ID")}</td>
                <td>{new Date(t.dueDate).toLocaleDateString("id-ID")}</td>

                <td>
                  {late>0
                    ? <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Telat {late}</span>
                    : <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Dipinjam</span>
                  }
                </td>

                <td>
                  {extendId===t.id ? (
                    <div className="flex gap-1 justify-center">
                      <input
                        type="date"
                        value={newDate}
                        onChange={e=>setNewDate(e.target.value)}
                        className="border px-2 text-xs rounded"
                      />
                      <button
                        onClick={()=>submitExtend(t.id)}
                        className="px-2 text-xs bg-blue-500 text-white rounded"
                      >
                        OK
                      </button>
                    </div>
                  ):(
                    <div className="flex gap-2 justify-center">

                      <button
                        onClick={()=>setExtendId(t.id)}
                        className="px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-700 font-bold"
                      >
                        Perpanjang
                      </button>

                      <button
                        onClick={()=>onAction(t.id,"return")}
                        className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 font-bold"
                      >
                        Return
                      </button>

                    </div>
                  )}
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  );
}
