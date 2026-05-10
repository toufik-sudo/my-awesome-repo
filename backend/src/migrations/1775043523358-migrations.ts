import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775043523358 implements MigrationInterface {
    name = 'Migrations1775043523358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`referrals\` (\`id\` varchar(36) NOT NULL, \`referrerId\` int NOT NULL, \`referredUserId\` int NULL, \`code\` varchar(20) NOT NULL, \`inviteeContact\` varchar(100) NULL, \`method\` varchar(20) NOT NULL DEFAULT 'link', \`status\` varchar(20) NOT NULL DEFAULT 'pending', \`referrerPointsAwarded\` int NOT NULL DEFAULT '0', \`referredPointsAwarded\` int NOT NULL DEFAULT '0', \`sharedPropertyId\` varchar(255) NULL, \`expiresAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a53a83849f95cbcf3fbcf32fd0\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`property_shares\` (\`id\` varchar(36) NOT NULL, \`userId\` int NOT NULL, \`propertyId\` varchar(255) NOT NULL, \`method\` varchar(30) NOT NULL, \`recipient\` varchar(100) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD \`fixedThreshold\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`minNights\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`validFrom\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`points_rules\` ADD \`validTo\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD CONSTRAINT \`FK_59de462f9ce130da142e3b5a9f4\` FOREIGN KEY (\`referrerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`referrals\` ADD CONSTRAINT \`FK_a398d03f3cf515627a7f5360bab\` FOREIGN KEY (\`referredUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`property_shares\` ADD CONSTRAINT \`FK_f7b22e96cac4b75e474dd34a0b6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`property_shares\` DROP FOREIGN KEY \`FK_f7b22e96cac4b75e474dd34a0b6\``);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP FOREIGN KEY \`FK_a398d03f3cf515627a7f5360bab\``);
        await queryRunner.query(`ALTER TABLE \`referrals\` DROP FOREIGN KEY \`FK_59de462f9ce130da142e3b5a9f4\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`validTo\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`validFrom\``);
        await queryRunner.query(`ALTER TABLE \`points_rules\` DROP COLUMN \`minNights\``);
        await queryRunner.query(`ALTER TABLE \`service_fee_rules\` DROP COLUMN \`fixedThreshold\``);
        await queryRunner.query(`DROP TABLE \`property_shares\``);
        await queryRunner.query(`DROP INDEX \`IDX_a53a83849f95cbcf3fbcf32fd0\` ON \`referrals\``);
        await queryRunner.query(`DROP TABLE \`referrals\``);
    }

}
