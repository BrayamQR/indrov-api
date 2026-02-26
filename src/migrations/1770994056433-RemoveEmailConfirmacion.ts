import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailConfirmacion1770994056433 implements MigrationInterface {
    name = 'RemoveEmailConfirmacion1770994056433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuario\` DROP COLUMN \`email_confirmacion\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuario\` ADD \`email_confirmacion\` varchar(150) NOT NULL`);
    }

}
