export type LoanStatus = "approved" | "mora" | "paid";

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