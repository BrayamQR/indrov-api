import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("usuario")
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "nombre", type: "varchar", length: 100 })
  nombre: string;

  @Column({ name: "email", type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ name: "codigo_pais", type: "varchar", length: 10, default: "+51" })
  codigoPais: string;

  @Column({ name: "telefono", type: "varchar", length: 20 })
  telefono: string;

  @Column({ name: "password", type: "varchar", length: 255 })
  password: string;

  @Column({ name: "pais", type: "varchar", length: 10 })
  pais: string;

  @Column({ name: "terminos", type: "boolean", default: false })
  terminos: boolean;

  @Column({ name: "privacidad", type: "boolean", default: false })
  privacidad: boolean;

  @Column({ name: "id_tipousuario", type: "int", default: 1 })
  idTipoUsuario: number;

  @CreateDateColumn({ name: "fecha_registro" })
  fechaRegistro: Date;
}
