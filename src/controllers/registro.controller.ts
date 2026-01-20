import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

// Interfaz para el usuario
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  emailConfirmacion: string;
  codigoPais: string;
  telefono: string;
  password: string; // Contraseña hasheada
  pais: string;
  terminos: boolean;
  privacidad: boolean;
  fechaRegistro: string;
}

// Ruta del archivo JSON
const usuariosPath = path.join(__dirname, "../data/usuarios.json");

// Número de rondas para el salt de bcrypt
const SALT_ROUNDS = 10;

// Función para leer usuarios del JSON
const leerUsuarios = (): Usuario[] => {
  try {
    if (!fs.existsSync(usuariosPath)) {
      return [];
    }
    const data = fs.readFileSync(usuariosPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer usuarios:", error);
    return [];
  }
};

// Función para guardar usuarios en el JSON
const guardarUsuarios = (usuarios: Usuario[]): void => {
  try {
    const dir = path.dirname(usuariosPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2), "utf-8");
  } catch (error) {
    console.error("Error al guardar usuarios:", error);
    throw error;
  }
};

// Controlador para registrar usuario
export const registrarUsuario = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      nombre,
      email,
      emailConfirmacion,
      codigoPais,
      telefono,
      password,
      pais,
      terminos,
      privacidad,
    } = req.body;

    // Validaciones básicas
    if (
      !nombre ||
      !email ||
      !emailConfirmacion ||
      !telefono ||
      !password ||
      !pais
    ) {
      res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
      });
      return;
    }

    if (email !== emailConfirmacion) {
      res.status(400).json({
        success: false,
        message: "Los emails no coinciden",
      });
      return;
    }

    if (!terminos || !privacidad) {
      res.status(400).json({
        success: false,
        message: "Debes aceptar los términos y la política de privacidad",
      });
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    // Leer usuarios existentes
    const usuarios = leerUsuarios();

    // Verificar si el email ya existe
    const emailExiste = usuarios.find((u) => u.email === email);
    if (emailExiste) {
      res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
      return;
    }

    // Hashear la contraseña
    const passwordHasheada = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear nuevo usuario
    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre,
      email,
      emailConfirmacion,
      codigoPais: codigoPais || "+34",
      telefono,
      password: passwordHasheada, // Contraseña hasheada
      pais,
      terminos,
      privacidad,
      fechaRegistro: new Date().toISOString(),
    };

    // Agregar el nuevo usuario
    usuarios.push(nuevoUsuario);

    // Guardar en el JSON
    guardarUsuarios(usuarios);

    // Responder con éxito (sin enviar la contraseña)
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        fechaRegistro: nuevoUsuario.fechaRegistro,
      },
    });
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
    });
  }
};
