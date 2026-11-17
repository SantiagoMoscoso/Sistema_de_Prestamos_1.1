export type LoanStatus = "pending" | "approved" | "rejected" | "mora" | "paid";

export type Payment = {
  id: string;
  amount: number;
  date: string; // guardamos como string ISO, simple de mostrar y ordenar
};

export type Loan = {
  id: string;
  userEmail: string;
  amount: number;
  installments: number;
  installmentValue: number;
  payments: Payment[];
  status: LoanStatus;
  createdAt: string;
  balance?: number; // nuevo: viene calculado directamente del backend
};

export type PendingLoan = {
  id: string;
  clientName: string;
  email: string;
  amount: number;
  installments: number;
  installmentValue: number;
  createdAt: string;
  // Lo que calcula el backend: si cumple las reglas y por qué no
  rules: { maxAmount: number; activeLoans: number; ok: boolean; reasons: string[] };
};