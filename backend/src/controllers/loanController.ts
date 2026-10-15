import { Request, Response } from "express";
import { getPool } from "../config/db";
import sql from "mssql";
import type { CreateLoanRequest, Loan } from "../types/loan";

export async function createLoan(req: Request, res: Response) {
  const { userId, amount, installments } = req.body as CreateLoanRequest;

  if (!userId) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "userId es obligatorio" });
  }

  // Regla: monto mayor a 0
  if (!amount || amount <= 0) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "El monto debe ser mayor a 0" });
  }

  // Regla: cuotas entre 1 y 60
  if (!installments || installments < 1 || installments > 60) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Las cuotas deben estar entre 1 y 60",
    });
  }

  try {
    const pool = await getPool();

    // Regla: no permitir préstamo nuevo si existe uno en mora.
    // Esto es el equivalente en SQL al "getUserLoans().some(l => l.status === 'mora')"
    const moraCheck = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT Id FROM Loans
        WHERE UserId = @userId AND Status = 'mora'
      `);

    if (moraCheck.recordset.length > 0) {
      return res.status(409).json({
        code: "CONFLICT",
        message: "Tienes un préstamo en mora, no puedes solicitar otro",
      });
    }

    // El cálculo de la cuota
    const installmentValue = amount / installments;

    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("amount", sql.Decimal(12, 2), amount)
      .input("installments", sql.Int, installments)
      .input("installmentValue", sql.Decimal(12, 2), installmentValue)
      .query<Loan>(`
        INSERT INTO Loans (UserId, Amount, Installments, InstallmentValue, Status)
        OUTPUT INSERTED.*
        VALUES (@userId, @amount, @installments, @installmentValue, 'approved')
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("Error creando préstamo:", error);
    res.status(500).json({ code: "SERVER_ERROR", message: "Error al crear el préstamo" });
  }
}