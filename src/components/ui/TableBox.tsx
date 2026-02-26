import React from "react";

interface Props{
children:React.ReactNode;
}

const TableBox:React.FC<Props>=({children})=>{
return(
<div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
<div className="overflow-x-auto max-h-[500px]">
{children}
</div>
</div>
);
};

export default TableBox;