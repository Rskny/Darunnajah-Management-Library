import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { user, users, updateUser, changePassword } = useAuth();

  if (!user) return null;

  const [activeSection, setActiveSection] = useState<
    "profile" | "security" | "admin" | "backup"
  >("profile");

  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* PROFILE */
    if (activeSection === "profile") {
      updateUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
      });
      alert("Profil berhasil diperbarui");
      return;
    }

    /* PASSWORD */
    if (activeSection === "security") {
      if (!formData.oldPassword)
        return alert("Masukkan password lama");

      if (formData.newPassword !== formData.confirmPassword)
        return alert("Konfirmasi password tidak cocok");

      const ok = changePassword(
        formData.oldPassword,
        formData.newPassword
      );

      if (!ok) return alert("Password lama salah");

      alert("Password berhasil diganti");
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">

      <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl flex overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-72 bg-slate-50 p-10 border-r">
          <h3 className="font-black text-xl mb-8">Pengaturan</h3>

          <Menu text="Profil" active={activeSection==="profile"} onClick={()=>setActiveSection("profile")}/>
          <Menu text="Keamanan" active={activeSection==="security"} onClick={()=>setActiveSection("security")}/>
          <Menu text="Info Admin" active={activeSection==="admin"} onClick={()=>setActiveSection("admin")}/>
          <Menu text="Backup" active={activeSection==="backup"} onClick={()=>setActiveSection("backup")}/>

          <button onClick={onClose} className="mt-20 text-xs text-slate-400">
            Tutup Menu
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-10 overflow-y-auto">

          {/* HEADER */}
          <div className="flex justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black">
                {activeSection==="profile" && "Identitas Admin"}
                {activeSection==="security" && "Keamanan"}
                {activeSection==="admin" && "Info Admin"}
                {activeSection==="backup" && "Backup Sistem"}
              </h2>

              <p className="text-sm text-slate-400 font-semibold">
                Pengaturan akun sistem
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-700">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>

          {/* FORM */}
          {(activeSection==="profile" || activeSection==="security") && (
            <form onSubmit={handleSubmit} className="space-y-6">

              {activeSection==="profile" && (
                <>
                  <Input label="Username" value={formData.username}
                    onChange={v=>setFormData({...formData,username:v})}/>

                  <Input label="Nama" value={formData.name}
                    onChange={v=>setFormData({...formData,name:v})}/>

                  <Input label="Email" value={formData.email}
                    onChange={v=>setFormData({...formData,email:v})}/>
                </>
              )}

              {activeSection==="security" && (
                <>
                  <Input label="Password Lama" type="password"
                    value={formData.oldPassword}
                    onChange={v=>setFormData({...formData,oldPassword:v})}/>

                  <PasswordInput label="Password Baru"
                    value={formData.newPassword}
                    show={showPass}
                    toggle={()=>setShowPass(!showPass)}
                    onChange={v=>setFormData({...formData,newPassword:v})}/>

                  <PasswordInput label="Konfirmasi Password"
                    value={formData.confirmPassword}
                    show={showPass}
                    toggle={()=>setShowPass(!showPass)}
                    onChange={v=>setFormData({...formData,confirmPassword:v})}/>

                  <Warning text="Pastikan password mudah diingat tapi sulit ditebak"/>
                </>
              )}

              <button className="w-full py-4 bg-[#3b5998] text-white rounded-2xl font-bold">
                Simpan
              </button>
            </form>
          )}

          {/* ADMIN INFO */}
          {activeSection==="admin" && (
            <div className="space-y-4">

              <Warning text={`Total akun admin terdaftar: ${users.length}`}/>

              {users.map(a=>(
                <div key={a.id} className="p-5 rounded-2xl border flex justify-between">
                  <div>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-sm text-slate-500">{a.username}</p>
                  </div>
                  <div className="text-xs text-slate-400">
                    ID: {a.id}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BACKUP */}
          {activeSection==="backup" && <BackupPanel/>}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;


/* COMPONENTS */

const Menu=({text,active,onClick}:{text:string;active:boolean;onClick:()=>void})=>(
  <button onClick={onClick}
    className={`w-full text-left px-4 py-3 mb-2 rounded-xl font-bold
    ${active?"bg-[#3b5998] text-white":"text-slate-500 hover:bg-white"}`}>
    {text}
  </button>
);

const Input=({label,value,onChange,type="text"}:any)=>(
  <div>
    <label className="text-xs text-slate-400">{label}</label>
    <input type={type} value={value}
      onChange={e=>onChange(e.target.value)}
      className="w-full p-4 bg-slate-50 rounded-xl"/>
  </div>
);

const PasswordInput=({label,value,onChange,show,toggle}:any)=>(
  <div>
    <label className="text-xs text-slate-400">{label}</label>

    <div className="relative">
      <input
        type={show?"text":"password"}
        value={value}
        onChange={e=>onChange(e.target.value)}
        className="w-full p-4 bg-slate-50 rounded-xl"
      />

      <span
        onClick={toggle}
        className="absolute right-4 top-4 cursor-pointer"
      >
        {show?"🙈":"👁"}
      </span>
    </div>
  </div>
);

const Warning=({text}:{text:string})=>(
  <div className="p-4 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
    ⚠ {text}
  </div>
);

const BackupPanel=()=>{
  const [time,setTime]=useState<string|null>(null);

  return(
    <div className="space-y-6">
      <Warning text="Backup melindungi seluruh data sistem"/>

      <div className="p-6 border rounded-2xl">
        {time
          ? `Backup terakhir: ${time}`
          : "Belum pernah backup"}
      </div>

      <button
        onClick={()=>setTime(new Date().toLocaleString())}
        className="w-full py-4 bg-[#3b5998] text-white rounded-2xl font-bold">
        Backup Sekarang
      </button>
    </div>
  );
};
