import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "db_indrov",
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false, // 👈 cambiar aquí
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión a MySQL establecida correctamente");
  } catch (error) {
    console.error("❌ Error al conectar con MySQL:", error);
    throw error;
  }
};
