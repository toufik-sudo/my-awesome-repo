import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775146251997 implements MigrationInterface {
    name = 'Migrations1775146251997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP COLUMN \`handToHandOnly\``);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP COLUMN \`paymentMethods\``);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD \`paymentMethods\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD \`handToHandOnly\` tinyint NOT NULL DEFAULT '0'`);
    }

}
