import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  register: (data: Omit<User,"id">) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  changePassword:(oldPass:string,newPass:string)=>boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users,setUsers] = useState<User[]>([]);
  const [user,setUser] = useState<User|null>(null);

  /* LOAD STORAGE */
  useEffect(()=>{
    const savedUsers = localStorage.getItem("users");
    const savedUser = localStorage.getItem("auth_user");

    if(savedUsers) setUsers(JSON.parse(savedUsers));
    if(savedUser) setUser(JSON.parse(savedUser));
  },[]);

  /* SAVE USERS */
  useEffect(()=>{
    localStorage.setItem("users",JSON.stringify(users));
  },[users]);

  /* LOGIN */
  const login=(username:string,password:string)=>{
    const found = users.find(
      u=>u.username===username && u.password===password
    );
    if(!found) return false;

    setUser(found);
    localStorage.setItem("auth_user",JSON.stringify(found));
    return true;
  };

  /* REGISTER */
  const register=(data:Omit<User,"id">)=>{
    if(users.find(u=>u.username===data.username)) return false;

    const newUser={...data,id:Date.now().toString()};
    setUsers(prev=>[...prev,newUser]);
    return true;
  };

  /* LOGOUT */
  const logout=()=>{
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  /* UPDATE PROFILE */
  const updateUser=(data:Partial<User>)=>{
    if(!user) return;

    const updated={...user,...data};
    setUser(updated);

    const updatedUsers=users.map(u=>u.id===user.id?updated:u);
    setUsers(updatedUsers);

    localStorage.setItem("auth_user",JSON.stringify(updated));
  };

  /* CHANGE PASSWORD */
  const changePassword=(oldPass:string,newPass:string)=>{
    if(!user) return false;
    if(user.password!==oldPass) return false;

    updateUser({password:newPass});
    return true;
  };

  return(
    <AuthContext.Provider value={{
      user,
      users,
      login,
      register,
      logout,
      updateUser,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error("useAuth must inside provider");
  return ctx;
}
