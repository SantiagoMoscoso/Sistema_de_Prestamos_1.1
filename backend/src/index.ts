import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./config/db";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "CrediFlow API funcionando",
  });
});

// Todas las rutas de userRoutes quedan activas a partir de aquí
app.use(userRoutes);

const PORT = process.env.PORT || 3000;

// Antes de levantar el servidor, probamos que la conexión a SQL Server funcione.
// Así, si algo está mal configurado, te enteras apenas arrancas, no a mitad
// de una petición de un endpoint
async function startServer() {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
}

startServer();