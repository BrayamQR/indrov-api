import { Usuario } from "../entities/usuario.entity";
import { UsuarioRepository } from "../repositories/usuario.repository";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async crearUsuario(datos: {
    nombre: string;
    email: string;
    codigoPais?: string;
    telefono: string;
    password: string;
    pais: string;
    terminos: boolean;
    privacidad: boolean;
  }): Promise<Usuario> {
    const passwordHasheada = await bcrypt.hash(datos.password, SALT_ROUNDS);
    return await this.usuarioRepository.create({
      nombre: datos.nombre,
      email: datos.email,
      codigoPais: datos.codigoPais,
      telefono: datos.telefono,
      password: passwordHasheada,
      pais: datos.pais,
      terminos: datos.terminos,
      privacidad: datos.privacidad,
    });
  }

  async crearConductor(datos: {
    nombre: string;
    email: string;
    codigoPais?: string;
    telefono: string;
    password: string;
    pais?: string;
    terminos: boolean;
    privacidad: boolean;
  }): Promise<Usuario> {
    const passwordHasheada = await bcrypt.hash(datos.password, SALT_ROUNDS);
    return await this.usuarioRepository.create({
      nombre: datos.nombre,
      email: datos.email,
      codigoPais: datos.codigoPais,
      telefono: datos.telefono,
      password: passwordHasheada,
      pais: datos.pais || "",
      terminos: datos.terminos,
      privacidad: datos.privacidad,
      idTipoUsuario: 2,
    });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmail(email);
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return await this.usuarioRepository.findById(id);
  }

  async verificarPassword(
    passwordPlano: string,
    passwordHasheada: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordPlano, passwordHasheada);
  }
}
