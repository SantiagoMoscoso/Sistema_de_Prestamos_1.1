import { createContext, useState, ReactNode } from "react";
import type { Loan, Payment } from "../types/loan";
import { calculateInstallmentValue, calculateBalance } from "../utils/loanCalculations";
import { useAuth } from "../hooks/useAuth";

type ActionResult = { success: boolean; message: string };

type LoansContextType = {
  loans: Loan[];
  requestLoan: (amount: number, installments: number) => ActionResult;
  registerPayment: (loanId: string, amount: number) => ActionResult;
  markAsMora: (loanId: string) => void; // botón manual, ver nota arriba
  getUserLoans: () => Loan[];
};

export const LoansContext = createContext<LoansContextType | null>(null);

export function LoansProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  // LoansContext necesita saber quién es el usuario actual, por eso
  // este Provider debe ir ANIDADO dentro de AuthProvider (ver App.tsx)
  const { currentUser } = useAuth();

  const getUserLoans = (): Loan[] => {
    if (!currentUser) return [];
    return loans.filter((l) => l.userEmail === currentUser.email);
  };

  const requestLoan = (amount: number, installments: number): ActionResult => {
    if (!currentUser) {
      return { success: false, message: "Debes iniciar sesión" };
    }

    // Regla: monto mayor a 0
    if (amount <= 0) {
      return { success: false, message: "El monto debe ser mayor a 0" };
    }

    // Regla: cuotas entre 1 y 60
    if (installments < 1 || installments > 60) {
      return { success: false, message: "Las cuotas deben estar entre 1 y 60" };
    }

    // Regla: no permitir préstamo nuevo si existe uno en mora
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
      status: "approved", // se aprueba automáticamente al crearse, como en la versión de Flutter
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

    // Regla: no permitir pago superior al saldo pendiente
    if (amount > currentBalance) {
      return { success: false, message: "El pago no puede ser mayor al saldo pendiente" };
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
    };

    // Recalculamos el saldo YA CON el nuevo pago incluido, para decidir el status
    const updatedPayments = [...loan.payments, newPayment];
    const newBalance = loan.amount - updatedPayments.reduce((sum, p) => sum + p.amount, 0);

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              payments: updatedPayments,
              // tolerancia de 0.01 por errores de precisión decimal, igual que en Flutter
              status: newBalance <= 0.01 ? "paid" : l.status,
            }
          : l
      )
    );

    return { success: true, message: "Pago registrado" };
  };

  const markAsMora = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: "mora" } : l))
    );
  };

  return (
    <LoansContext.Provider
      value={{ loans, requestLoan, registerPayment, markAsMora, getUserLoans }}
    >
      {children}
    </LoansContext.Provider>
  );
}