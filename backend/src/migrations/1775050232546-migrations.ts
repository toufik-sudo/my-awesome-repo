import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775050232546 implements MigrationInterface {
    name = 'Migrations1775050232546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`host_fee_absorptions\` (\`id\` varchar(36) NOT NULL, \`hostUserId\` int NOT NULL, \`scope\` varchar(30) NOT NULL DEFAULT 'all', \`targetPropertyGroupId\` varchar(255) NULL, \`targetServiceGroupId\` varchar(255) NULL, \`targetPropertyId\` varchar(255) NULL, \`targetServiceId\` varchar(255) NULL, \`absorptionPercent\` decimal(5,2) NOT NULL DEFAULT '100.00', \`validFrom\` date NULL, \`validTo\` date NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`description\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD \`targetServiceGroupId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD \`targetServiceId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`scope\` varchar(30) NOT NULL DEFAULT 'global'`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`targetHostId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`targetPropertyGroupId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`targetServiceGroupId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`targetPropertyId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`targetServiceId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD CONSTRAINT \`FK_f752f4744520c32259dfa85bbe0\` FOREIGN KEY (\`hostUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP FOREIGN KEY \`FK_f752f4744520c32259dfa85bbe0\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`targetServiceId\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`targetPropertyId\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`targetServiceGroupId\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`targetPropertyGroupId\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`targetHostId\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`scope\``);
        await queryRunner.query(`ALTER TABLE \`service_fee_rules\` DROP COLUMN \`targetServiceId\``);
        await queryRunner.query(`ALTER TABLE \`service_fee_rules\` DROP COLUMN \`targetServiceGroupId\``);
        await queryRunner.query(`DROP TABLE \`host_fee_absorptions\``);
    }

}
