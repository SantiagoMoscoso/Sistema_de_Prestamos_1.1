import { createContext, useState, ReactNode } from "react";
import type { Loan } from "../types/loan";
import { requestLoan as apiRequestLoan, registerPayment as apiRegisterPayment, getUserLoans as apiGetUserLoans } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

type ActionResult = { success: boolean; message: string };

type LoansContextType = {
  loans: Loan[];
  isLoadingLoans: boolean;
  requestLoan: (amount: number, installments: number) => Promise<ActionResult>;
  registerPayment: (loanId: string, amount: number) => Promise<ActionResult>;
  refreshLoans: () => Promise<void>;
};

export const LoansContext = createContext<LoansContextType | null>(null);

export function LoansProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(false);
  const { currentUser } = useAuth();

  // Trae los préstamos del usuario actual desde el backend
  // Se llama manualmente (no con useEffect automático), porque queremos
  // controlar cuándo se refresca (ej. al entrar a History,
  // o justo después de pagar una cuota)
  const refreshLoans = async () => {
    if (!currentUser) return;

    setIsLoadingLoans(true);
    const result = await apiGetUserLoans(currentUser.id);
    setLoans(result);
    setIsLoadingLoans(false);
  };

  const requestLoan = async (amount: number, installments: number): Promise<ActionResult> => {
    if (!currentUser) {
      return { success: false, message: "Debes iniciar sesión" };
    }

    const result = await apiRequestLoan(currentUser.id, amount, installments);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // Después de crear el préstamo, refrescamos la lista para que
    // refleje el nuevo préstamo
    await refreshLoans();
    return { success: true, message: result.message };
  };

  const registerPayment = async (loanId: string, amount: number): Promise<ActionResult> => {
    const result = await apiRegisterPayment(loanId, amount);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // Igual aquí: refrescamos para que el balance actualizado se refleje
    await refreshLoans();
    return { success: true, message: result.message };
  };

  return (
    <LoansContext.Provider value={{ loans, isLoadingLoans, requestLoan, registerPayment, refreshLoans }}>
      {children}
    </LoansContext.Provider>
  );
}