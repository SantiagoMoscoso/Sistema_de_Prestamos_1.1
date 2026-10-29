import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool;
  }

  // El config se arma aqui dentro, no afuera de la función.
  // Así se lee process.env en el momento en que getPool() se llama,
  // no en el momento en que este archivo se importa
  const config: sql.config = {
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      trustServerCertificate: true,
      encrypt: false,
      instanceName: process.env.DB_INSTANCE,
    },
  };

  pool = await sql.connect(config);
  console.log("Conectado a SQL Server");
  return pool;
}