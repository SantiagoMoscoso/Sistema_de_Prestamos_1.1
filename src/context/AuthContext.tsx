import { createContext, useState, ReactNode } from "react";
import type { User } from "../types/user";

// Forma de lo que el Context va a exponer a quien lo use
type AuthContextType = {
  currentUser: User | null;
  users: User[]; // "base de datos" en memoria de usuarios registrados
  register: (newUser: User) => boolean; // devuelve true si se registró, false si el email ya existe
  login: (email: string, password: string) => boolean; // true si las credenciales son correctas
  logout: () => void;
};

// Valor inicial null: obliga a quien lo consuma a verificar que el Provider exista
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const register = (newUser: User): boolean => {
    // Evita registrar dos usuarios con el mismo correo
    const exists = users.some((u) => u.email === newUser.email);
    if (exists) return false;

    setUsers((prev) => [...prev, newUser]);
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return false;

    setCurrentUser(found);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}