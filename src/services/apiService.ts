import { API_URL } from "./apiConfig";
import type { User } from "../types/user";

// El backend devuelve los campos en PascalCase (Name, LastName, Email, Id numérico)
// porque así se llaman las columnas en SQL Server. El frontend espera
// camelCase y un id como texto. Esta función "traduce" entre ambos formatos,
// así el resto de la app (Context, pantallas)
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

    // response.ok es true solo si el status es 2xx (200-299).
    // Un 400 o 409 (que tu backend ya maneja) hace que esto sea false
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