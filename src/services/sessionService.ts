import * as SecureStore from "expo-secure-store";
import type { User } from "../types/user";

const TOKEN_KEY = "crediflow_token";
const USER_KEY = "crediflow_user";

// Guarda el token y los datos del usuario (nunca la contraseña) en el almacén seguro
export async function saveSession(token: string, user: User) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// Se usa al abrir la app: si hay sesión guardada, devuelve el usuario
export async function loadSession(): Promise<User | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const userJson = await SecureStore.getItemAsync(USER_KEY);

  if (!token || !userJson) return null;
  return JSON.parse(userJson) as User;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}