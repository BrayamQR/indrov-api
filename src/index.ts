import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import registroRoutes from "./routes/registro.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/registro", registroRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API de inProv funcionando correctamente" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
