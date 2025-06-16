"use client";

import { createContext, useContext } from "react";

type User = { name: string; role: string };

// Nome fixo por enquanto; substitua depois pelo dado real de autenticação
const UserContext = createContext<User>({ name: "Usuário", role: "Admin" });

export const UserProvider = ({ children }: { children: React.ReactNode }) => (
  <UserContext.Provider value={{ name: "Usuário", role: "Admin" }}>
    {children}
  </UserContext.Provider>
);

export const useUser = () => useContext(UserContext);
