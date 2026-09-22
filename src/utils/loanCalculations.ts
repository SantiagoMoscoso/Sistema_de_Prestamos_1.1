import type { Loan } from "../types/loan";

// Fórmula simple, sin interés: monto dividido entre número de cuotas
export function calculateInstallmentValue(amount: number, installments: number): number {
  return amount / installments;
}

// Saldo pendiente = monto total - suma de todos los pagos registrados
export function calculateBalance(loan: Loan): number {
  const totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0);
  return loan.amount - totalPaid;
}