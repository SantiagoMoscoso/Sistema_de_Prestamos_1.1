import { API_URL } from "./apiConfig";
import type { User } from "../types/user";
import type { Loan } from "../types/loan";

// El backend devuelve los campos en PascalCase (Name, LastName, Email, Id numérico)
// porque así se llaman las columnas en SQL Server. El frontend espera
// camelCase y un id como texto.
function mapUserFromApi(apiUser: any): User {
  return {
    id: String(apiUser.Id),
    name: apiUser.Name,
    lastName: apiUser.LastName,
    email: apiUser.Email,
    password: "", // nunca viene del backend, no lo necesitamos guardado localmente
  };
}

export async function registerUser(
  name: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastName, email, password }),
    });

    const data = await response.json();

    // response.ok es true solo si el status es 2xx (200-299)
    // Un 400 o 409 hace que esto sea false
    if (!response.ok) {
      return { success: false, message: data.message || "Error al registrar" };
    }

    return { success: true, message: "Registro exitoso", user: mapUserFromApi(data) };
  } catch (error) {
    // Esto captura errores de RED (backend apagado, IP mal escrita, sin WiFi),
    // distinto de los errores que el backend mismo devuelve con un status 4xx
    console.error("Error de red en registerUser:", error);
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Credenciales incorrectas" };
    }

    return { success: true, message: "Login exitoso", user: mapUserFromApi(data) };
  } catch (error) {
    console.error("Error de red en loginUser:", error);
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

// Mismo concepto que mapUserFromApi: traduce PascalCase + ids numéricos
// del backend, al camelCase + ids como texto que ya usaba el resto de tu app
function mapLoanFromApi(apiLoan: any): Loan {
  return {
    id: String(apiLoan.Id),
    userEmail: "", // el backend no lo devuelve directo, no lo necesitamos para mostrar
    amount: apiLoan.Amount,
    installments: apiLoan.Installments,
    installmentValue: apiLoan.InstallmentValue,
    payments: [], // el backend no incluye el detalle de pagos aquí, solo el total
    status: apiLoan.Status,
    createdAt: apiLoan.CreatedAt,
    balance: apiLoan.balance, // viene calculado del backend
  };
}

export async function requestLoan(
  userId: string,
  amount: number,
  installments: number
): Promise<{ success: boolean; message: string; loan?: Loan }> {
  try {
    const response = await fetch(`${API_URL}/loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(userId), amount, installments }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Error al solicitar el préstamo" };
    }

    return { success: true, message: "Préstamo aprobado", loan: mapLoanFromApi(data) };
  } catch (error) {
    console.error("Error de red en requestLoan:", error);
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

export async function registerPayment(
  loanId: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/loans/${loanId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Error al registrar el pago" };
    }

    return { success: true, message: "Pago registrado" };
  } catch (error) {
    console.error("Error de red en registerPayment:", error);
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

export async function getUserLoans(userId: string): Promise<Loan[]> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/loans`);
    const data = await response.json();

    if (!response.ok) {
      return [];
    }

    // .map() aquí traduce CADA préstamo del arreglo que devuelve el backend
    return data.map(mapLoanFromApi);
  } catch (error) {
    console.error("Error de red en getUserLoans:", error);
    return [];
  }
}