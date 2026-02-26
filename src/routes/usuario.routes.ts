import { Router } from "express";
import {
  login,
  obtenerPerfil,
  registrarConductor,
  registrarUsuario,
} from "../controllers/usuario.controller";
import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/registro-conductor", registrarConductor);
router.post("/login", login);

// Rutas protegidas (requieren token)
router.get("/perfil", autenticar, obtenerPerfil);

export default router;
