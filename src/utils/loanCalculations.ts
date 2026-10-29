import type { Loan } from "../types/loan";

// Fórmula simple, sin interés: monto dividido entre número de cuotas
export function calculateInstallmentValue(amount: number, installments: number): number {
  return amount / installments;
}