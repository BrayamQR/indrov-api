import { Router } from "express";
import { registrarUsuario } from "../controllers/registro.controller";

const router = Router();

router.post("/", registrarUsuario);

export default router;
