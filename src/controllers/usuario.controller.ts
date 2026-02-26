import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { generarToken } from "../utils/jwt.util";

const usuarioService = new UsuarioService();

// REGISTRO DE USUARIO NORMAL
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

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    // Verificar si el email ya existe
    const emailExiste = await usuarioService.buscarPorEmail(email);
    if (emailExiste) {
      res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
      return;
    }

    // Crear usuario
    const nuevoUsuario = await usuarioService.crearUsuario({
      nombre,
      email,
      codigoPais,
      telefono,
      password,
      pais,
      terminos,
      privacidad,
    });

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

// REGISTRO DE CONDUCTOR
export const registrarConductor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      nombre,
      email,
      codigoPais,
      telefono,
      password,
      pais,
      terminos,
      privacidad,
    } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !telefono || !password) {
      res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios deben ser completados",
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

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    // Verificar si el email ya existe
    const emailExiste = await usuarioService.buscarPorEmail(email);
    if (emailExiste) {
      res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
      return;
    }

    // Crear conductor
    const nuevoConductor = await usuarioService.crearConductor({
      nombre,
      email,
      codigoPais,
      telefono,
      password,
      pais,
      terminos,
      privacidad,
    });

    res.status(201).json({
      success: true,
      message: "Conductor registrado exitosamente",
      data: {
        id: nuevoConductor.id,
        nombre: nuevoConductor.nombre,
        email: nuevoConductor.email,
        telefono: nuevoConductor.telefono,
        idTipoUsuario: nuevoConductor.idTipoUsuario,
        fechaRegistro: nuevoConductor.fechaRegistro,
      },
    });
  } catch (error) {
    console.error("Error en registrarConductor:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar conductor",
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email y contraseña son obligatorios",
      });
      return;
    }

    const usuario = await usuarioService.buscarPorEmail(email);
    if (!usuario) {
      res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
      return;
    }

    const passwordValida = await usuarioService.verificarPassword(
      password,
      usuario.password,
    );

    if (!passwordValida) {
      res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
      return;
    }

    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
    });

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: {
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          pais: usuario.pais,
          idTipoUsuario: usuario.idTipoUsuario, // Incluir tipo de usuario
        },
        token: token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
    });
  }
};

// OBTENER PERFIL (ruta protegida)
export const obtenerPerfil = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
      return;
    }

    const usuario = await usuarioService.buscarPorId(usuarioId);

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        pais: usuario.pais,
        telefono: usuario.telefono,
        codigoPais: usuario.codigoPais,
        idTipoUsuario: usuario.idTipoUsuario, // Incluir tipo de usuario
        fechaRegistro: usuario.fechaRegistro,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
    });
  }
};
