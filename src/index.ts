import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuarioRoute from "./routes/usuario.routes";
import { initializeDatabase } from "./config/database";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/usuario", usuarioRoute);

app.get("/", (req, res) => {
  res.json({ message: "API de inProv funcionando correctamente" });
});

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("💥 Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
