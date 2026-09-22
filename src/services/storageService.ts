import AsyncStorage from "@react-native-async-storage/async-storage";

// Claves fijas para no escribir el string a mano en cada lugar y arriesgar un typo
const KEYS = {
  USERS: "@crediflow_users",
  LOANS: "@crediflow_loans",
};

// Funciones genéricas: reciben una clave y el tipo de dato a guardar/leer.

export async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.error("Error guardando en storage:", error);
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    // Si nunca se ha guardado nada con esa clave, getItem devuelve null
    return json ? (JSON.parse(json) as T) : null;
  } catch (error) {
    console.error("Error leyendo storage:", error);
    return null;
  }
}

export const StorageKeys = KEYS;