import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775159955024 implements MigrationInterface {
    name = 'Migrations1775159955024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP COLUMN \`handToHandOnly\``);
        // await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP COLUMN \`paymentMethods\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roles\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`roles\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roles\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`roles\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD \`paymentMethods\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD \`handToHandOnly\` tinyint NOT NULL DEFAULT '0'`);
    }

}
