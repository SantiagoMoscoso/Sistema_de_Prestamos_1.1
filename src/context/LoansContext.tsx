import { createContext, useState, useEffect, ReactNode } from "react";
import type { Loan, Payment } from "../types/loan";
import { calculateInstallmentValue, calculateBalance } from "../utils/loanCalculations";
import { useAuth } from "../hooks/useAuth";
import { saveData, loadData, StorageKeys } from "../services/storageService";

type ActionResult = { success: boolean; message: string };

type LoansContextType = {
  loans: Loan[];
  requestLoan: (amount: number, installments: number) => ActionResult;
  registerPayment: (loanId: string, amount: number) => ActionResult;
  markAsMora: (loanId: string) => void;
  getUserLoans: () => Loan[];
};

export const LoansContext = createContext<LoansContextType | null>(null);

export function LoansProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function loadStoredLoans() {
      const stored = await loadData<Loan[]>(StorageKeys.LOANS);
      if (stored) {
        setLoans(stored);
      }
      setIsLoading(false);
    }
    loadStoredLoans();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveData(StorageKeys.LOANS, loans);
    }
  }, [loans, isLoading]);

  const getUserLoans = (): Loan[] => {
    if (!currentUser) return [];
    return loans.filter((l) => l.userEmail === currentUser.email);
  };

  const requestLoan = (amount: number, installments: number): ActionResult => {
    if (!currentUser) {
      return { success: false, message: "Debes iniciar sesión" };
    }
    if (amount <= 0) {
      return { success: false, message: "El monto debe ser mayor a 0" };
    }
    if (installments < 1 || installments > 60) {
      return { success: false, message: "Las cuotas deben estar entre 1 y 60" };
    }
    const hasLoanInMora = getUserLoans().some((l) => l.status === "mora");
    if (hasLoanInMora) {
      return { success: false, message: "Tienes un préstamo en mora, no puedes solicitar otro" };
    }

    const newLoan: Loan = {
      id: Date.now().toString(),
      userEmail: currentUser.email,
      amount,
      installments,
      installmentValue: calculateInstallmentValue(amount, installments),
      payments: [],
      status: "approved",
      createdAt: new Date().toISOString(),
    };

    setLoans((prev) => [...prev, newLoan]);
    return { success: true, message: "Préstamo aprobado" };
  };

  const registerPayment = (loanId: string, amount: number): ActionResult => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: "Préstamo no encontrado" };
    }
    if (amount <= 0) {
      return { success: false, message: "El monto del pago debe ser mayor a 0" };
    }

    const currentBalance = calculateBalance(loan);
    if (amount > currentBalance) {
      return { success: false, message: "El pago no puede ser mayor al saldo pendiente" };
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
    };

    const updatedPayments = [...loan.payments, newPayment];
    const newBalance = loan.amount - updatedPayments.reduce((sum, p) => sum + p.amount, 0);

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? { ...l, payments: updatedPayments, status: newBalance <= 0.01 ? "paid" : l.status }
          : l
      )
    );

    return { success: true, message: "Pago registrado" };
  };

  const markAsMora = (loanId: string) => {
    setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, status: "mora" } : l)));
  };

  return (
    <LoansContext.Provider value={{ loans, requestLoan, registerPayment, markAsMora, getUserLoans }}>
      {children}
    </LoansContext.Provider>
  );
}