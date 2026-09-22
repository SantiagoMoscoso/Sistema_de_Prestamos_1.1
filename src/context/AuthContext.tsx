import { createContext, useState, useEffect, ReactNode } from "react";
import type { User } from "../types/user";
import { saveData, loadData, StorageKeys } from "../services/storageService";

type AuthContextType = {
  currentUser: User | null;
  users: User[];
  isLoading: boolean; // nuevo: para saber si ya terminamos de leer el storage
  register: (newUser: User) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Arranca en true: al abrir la app, todavía no sabemos qué hay guardado
  const [isLoading, setIsLoading] = useState(true);

  // Cargar los usuarios guardados, solo una vez al abrir la app
  useEffect(() => {
    async function loadStoredUsers() {
      const stored = await loadData<User[]>(StorageKeys.USERS);
      if (stored) {
        setUsers(stored);
      }
      setIsLoading(false);
    }
    loadStoredUsers();
  }, []);

  // Guardar automáticamente cada vez que "users" cambie.
  useEffect(() => {
    if (!isLoading) {
      saveData(StorageKeys.USERS, users);
    }
  }, [users, isLoading]);

  const register = (newUser: User): boolean => {
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
    <AuthContext.Provider value={{ currentUser, users, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}