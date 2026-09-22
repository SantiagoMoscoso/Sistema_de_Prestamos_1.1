export type LoanStatus = "approved" | "mora" | "paid";

export type Payment = {
  id: string;
  amount: number;
  date: string; // guardamos como string ISO, simple de mostrar y ordenar
};

export type Loan = {
  id: string;
  userEmail: string;       // para saber a qué usuario pertenece
  amount: number;          // monto solicitado
  installments: number;    // número de cuotas
  installmentValue: number;// valor de cada cuota (calculado una vez, al crear)
  payments: Payment[];
  status: LoanStatus;
  createdAt: string;
};