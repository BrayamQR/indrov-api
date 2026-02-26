import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt.util";

// Extender Request para agregar user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nombre: string;
      };
    }
  }
}

export const autenticar = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verificarToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error al verificar token",
    });
  }
};
