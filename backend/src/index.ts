import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carga las variables del archivo .env antes de usarlas (ej. puerto, credenciales de BD)
dotenv.config();

const app = express();

// Permite que la app de React Native (que corre en otro origen) pueda
// hacerle peticiones a este servidor sin que el navegador/fetch las bloquee
app.use(cors());

// Permite que Express entienda JSON en el body de las peticiones (igual que en el ejemplo inicial)
app.use(express.json());

// Endpoint de prueba, para confirmar que el servidor está vivo
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "CrediFlow API funcionando",
  });
});

// Si no hay PORT en el .env, usa 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});