import { Request, Response } from "express";
import { getPool } from "../config/db";
import sql from "mssql";
import type { CreateLoanRequest, RegisterPaymentRequest, Loan, Payment } from "../types/loan";

export async function createLoan(req: Request, res: Response) {
  const { userId, amount, installments } = req.body as CreateLoanRequest;
  

  if (!userId) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "userId es obligatorio" });
  }

  // Regla de negocio 1: monto mayor a 0
  if (!amount || amount <= 0) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "El monto debe ser mayor a 0" });
  }

  // Regla de negocio 2: cuotas entre 1 y 60
  if (!installments || installments < 1 || installments > 60) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Las cuotas deben estar entre 1 y 60",
    });
  }

  try {
    const pool = await getPool();

    // Regla de negocio 3: no permitir préstamo nuevo si existe uno en mora.
    // Consultamos ANTES de insertar, porque esta regla depende de datos
    // que ya existen guardados
    const moraCheck = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT Id FROM Loans
        WHERE UserId = @userId AND Status = 'mora'
      `);

    // Si la consulta devolvió al menos una fila, hay un préstamo en mora
    if (moraCheck.recordset.length > 0) {
      return res.status(409).json({
        code: "CONFLICT",
        message: "Tienes un préstamo en mora, no puedes solicitar otro",
      });
    }

    // Calculamos el valor de cada cuota
    const installmentValue = amount / installments;

    // Insertamos el préstamo nuevo. OUTPUT INSERTED.* devuelve la fila completa
    // recién creada
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

    // Se aprueba automáticamente al crearse, por eso 'approved' va fijo en el VALUES
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("Error creando préstamo:", error);
    res.status(500).json({ code: "SERVER_ERROR", message: "Error al crear el préstamo" });
  }
}

export async function registerPayment(req: Request, res: Response) {
  // req.params trae los valores que van en la URL misma
  const loanId = Number(req.params.id);
  const { amount } = req.body as RegisterPaymentRequest;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "El monto del pago debe ser mayor a 0",
    });
  }

  try {
    const pool = await getPool();

    // Traer el préstamo, para saber su monto total
    const loanResult = await pool
      .request()
      .input("loanId", sql.Int, loanId)
      .query<Loan>("SELECT * FROM Loans WHERE Id = @loanId");

    // Si no existe ningún préstamo con ese Id, mostrar error
    if (loanResult.recordset.length === 0) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Préstamo no encontrado" });
    }

    const loan = loanResult.recordset[0];

    // Sumar todos los pagos ya registrados para este préstamo.
    // SUM(Amount) es una función de SQL que suma esa columna para todas
    // las filas que cumplen el WHERE
    const paidResult = await pool
      .request()
      .input("loanId", sql.Int, loanId)
      .query<{ TotalPaid: number }>(`
        SELECT ISNULL(SUM(Amount), 0) AS TotalPaid
        FROM Payments
        WHERE LoanId = @loanId
      `);

    const totalPaid = paidResult.recordset[0].TotalPaid;

    // Calcular el saldo pendiente
    const balance = loan.Amount - totalPaid;

    // Regla de negocio: no permitir pago superior al saldo pendiente
    if (amount > balance) {
      return res.status(400).json({
        code: "BAD_REQUEST",
        message: "El pago no puede ser mayor al saldo pendiente",
      });
    }

    // Registrar el pago nuevo
    const paymentResult = await pool
      .request()
      .input("loanId", sql.Int, loanId)
      .input("amount", sql.Decimal(12, 2), amount)
      .query<Payment>(`
        INSERT INTO Payments (LoanId, Amount)
        OUTPUT INSERTED.*
        VALUES (@loanId, @amount)
      `);

    // Si con este pago el saldo llega a 0, se actualiza el préstamo a "paid".
    // Este UPDATE es un query aparte porque ya insertamos el pago arriba
    const newBalance = balance - amount;
    if (newBalance <= 0.01) {
      await pool
        .request()
        .input("loanId", sql.Int, loanId)
        .query("UPDATE Loans SET Status = 'paid' WHERE Id = @loanId");
    }

    res.status(201).json(paymentResult.recordset[0]);
  } catch (error) {
    console.error("Error registrando pago:", error);
    res.status(500).json({ code: "SERVER_ERROR", message: "Error al registrar el pago" });
  }
}
export async function getUserLoans(req: Request, res: Response) {
  const userId = Number(req.params.id);

  try {
    const pool = await getPool();

    const loansResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query<Loan>(`
        SELECT * FROM Loans
        WHERE UserId = @userId
        ORDER BY CreatedAt DESC
      `);

    // Por cada préstamo, calculamos cuánto se ha pagado y el saldo pendiente.
    // Usamos Promise.all para hacer todas las consultas en paralelo,
    // en vez de esperar una por una
    const loansWithBalance = await Promise.all(
      loansResult.recordset.map(async (loan) => {
        const paidResult = await pool
          .request()
          .input("loanId", sql.Int, loan.Id)
          .query<{ TotalPaid: number }>(`
            SELECT ISNULL(SUM(Amount), 0) AS TotalPaid
            FROM Payments
            WHERE LoanId = @loanId
          `);

        const totalPaid = paidResult.recordset[0].TotalPaid;

        // Agregamos dos campos nuevos al objeto del préstamo, sin tocar
        // los que ya vienen de la tabla
        return {
          ...loan,
          totalPaid,
          balance: loan.Amount - totalPaid,
        };
      })
    );

    res.status(200).json(loansWithBalance);
  } catch (error) {
    console.error("Error obteniendo préstamos:", error);
    res.status(500).json({ code: "SERVER_ERROR", message: "Error al obtener los préstamos" });
  }
}