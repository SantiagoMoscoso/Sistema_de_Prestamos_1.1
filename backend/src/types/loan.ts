export type CreateLoanRequest = {
  userId: number;
  amount: number;
  installments: number;
};

export type Loan = {
  Id: number;
  UserId: number;
  Amount: number;
  Installments: number;
  InstallmentValue: number;
  Status: "approved" | "mora" | "paid";
  CreatedAt: string;
};

export type RegisterPaymentRequest = {
  amount: number;
};

export type Payment = {
  Id: number;
  LoanId: number;
  Amount: number;
  PaymentDate: string;
};