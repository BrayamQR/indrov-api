import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import { AppDataSource } from "../config/database";

export class UsuarioRepository {
  private repository: Repository<Usuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Usuario | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async create(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.repository.create(usuarioData);
    return await this.repository.save(usuario);
  }
}
