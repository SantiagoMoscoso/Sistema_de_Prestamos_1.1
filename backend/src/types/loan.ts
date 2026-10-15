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