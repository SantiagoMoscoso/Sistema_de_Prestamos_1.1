import { Request, Response } from "express";
import { getPool } from "../config/db";
import sql from "mssql";
import type { CreateUserRequest, LoginRequest, User } from "../types/user";

export async function createUser(req: Request, res: Response) {
  const { name, lastName, email, password } = req.body as CreateUserRequest;
}   

  // Misma validación que ya hacías en el AuthContext del frontend
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginRequest;

  if (!email || !password) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Correo y contraseña son obligatorios",
    });
  }

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .query<User>(`
        SELECT Id, Name, LastName, Email
        FROM Users
        WHERE Email = @email AND Password = @password
      `);

    // Si no hay ninguna fila, las credenciales no coinciden con ningún usuario
    if (result.recordset.length === 0) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Correo o contraseña incorrectos",
      });
    }

    // Hay exactamente una fila (el Email es UNIQUE), esa es la cuenta
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ code: "SERVER_ERROR", message: "Error al iniciar sesión" });
  }
}