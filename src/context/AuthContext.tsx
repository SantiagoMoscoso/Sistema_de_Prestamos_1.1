import { createContext, useState, ReactNode } from "react";
import type { User } from "../types/user";
import { registerUser, loginUser } from "../services/apiService";

type ActionResult = { success: boolean; message: string };

type AuthContextType = {
  currentUser: User | null;
  register: (name: string, lastName: string, email: string, password: string) => Promise<ActionResult>;
  login: (email: string, password: string) => Promise<ActionResult>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Ahora es async: espera la respuesta del backend antes de devolver un resultado
  const register = async (
    name: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<ActionResult> => {
    const result = await registerUser(name, lastName, email, password);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // Si el registro fue exitoso, logueamos automático con los datos que
    // el backend devolvió
    setCurrentUser(result.user!);
    return { success: true, message: result.message };
  };

  const login = async (email: string, password: string): Promise<ActionResult> => {
    const result = await loginUser(email, password);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    setCurrentUser(result.user!);
    return { success: true, message: result.message };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}