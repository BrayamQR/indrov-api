import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdTipoUsuario1771019843512 implements MigrationInterface {
    name = 'AddIdTipoUsuario1771019843512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuario\` ADD \`id_tipousuario\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuario\` DROP COLUMN \`id_tipousuario\``);
    }

}
