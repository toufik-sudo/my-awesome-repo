import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775040861085 implements MigrationInterface {
    name = 'Migrations1775040861085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_fee_rules\` (\`id\` varchar(36) NOT NULL, \`createdByUserId\` int NOT NULL, \`scope\` varchar(30) NOT NULL, \`targetHostId\` int NULL, \`targetPropertyGroupId\` varchar(255) NULL, \`targetPropertyId\` varchar(255) NULL, \`calculationType\` varchar(30) NOT NULL, \`percentageRate\` decimal(5,2) NOT NULL DEFAULT '0.00', \`fixedAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`minFee\` decimal(10,2) NULL, \`maxFee\` decimal(10,2) NULL, \`isDefault\` tinyint NOT NULL DEFAULT 0, \`isActive\` tinyint NOT NULL DEFAULT 1, \`description\` varchar(255) NULL, \`priority\` int NOT NULL DEFAULT '100', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`points_rules\` (\`id\` varchar(36) NOT NULL, \`createdByUserId\` int NOT NULL, \`ruleType\` varchar(20) NOT NULL, \`targetRole\` varchar(20) NOT NULL, \`action\` varchar(50) NOT NULL, \`pointsAmount\` int NOT NULL DEFAULT '0', \`conversionRate\` decimal(10,2) NULL, \`currency\` varchar(5) NOT NULL DEFAULT 'MAD', \`minPointsForConversion\` int NULL, \`maxPointsPerPeriod\` int NOT NULL DEFAULT '0', \`period\` varchar(20) NULL, \`multiplier\` decimal(5,2) NOT NULL DEFAULT '1.00', \`isDefault\` tinyint NOT NULL DEFAULT 0, \`isActive\` tinyint NOT NULL DEFAULT 1, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`badges\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(50) NOT NULL, \`name\` json NOT NULL, \`description\` json NOT NULL, \`icon\` varchar(10) NOT NULL, \`category\` varchar(20) NOT NULL, \`pointsThreshold\` int NOT NULL DEFAULT '0', \`actionRequired\` varchar(50) NULL, \`actionCountRequired\` int NOT NULL DEFAULT '0', \`bonusPoints\` int NOT NULL DEFAULT '0', \`sortOrder\` int NOT NULL DEFAULT '0', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_48fe47e292737e09162b08c4f7\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_badges\` (\`id\` varchar(36) NOT NULL, \`userId\` int NOT NULL, \`badgeId\` varchar(255) NOT NULL, \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_badges\` ADD CONSTRAINT \`FK_7043fd1cb64ec3f5ebdb878966c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_badges\` ADD CONSTRAINT \`FK_bd34ef334baea6f589a53438a1e\` FOREIGN KEY (\`badgeId\`) REFERENCES \`badges\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_badges\` DROP FOREIGN KEY \`FK_bd34ef334baea6f589a53438a1e\``);
        await queryRunner.query(`ALTER TABLE \`user_badges\` DROP FOREIGN KEY \`FK_7043fd1cb64ec3f5ebdb878966c\``);
        await queryRunner.query(`DROP TABLE \`user_badges\``);
        await queryRunner.query(`DROP INDEX \`IDX_48fe47e292737e09162b08c4f7\` ON \`badges\``);
        await queryRunner.query(`DROP TABLE \`badges\``);
        await queryRunner.query(`DROP TABLE \`points_rules\``);
        await queryRunner.query(`DROP TABLE \`service_fee_rules\``);
    }

}
