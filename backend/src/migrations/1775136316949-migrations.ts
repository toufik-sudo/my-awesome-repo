import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775136316949 implements MigrationInterface {
    name = 'Migrations1775136316949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rewards\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`type\` varchar(30) NOT NULL, \`pointsCost\` int NOT NULL, \`discountPercent\` decimal(5,2) NOT NULL DEFAULT '0.00', \`discountAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`currency\` varchar(5) NOT NULL DEFAULT 'DZD', \`icon\` varchar(10) NOT NULL DEFAULT '🎁', \`imageUrl\` varchar(255) NULL, \`requiredTier\` varchar(20) NULL, \`maxRedemptions\` int NULL, \`currentRedemptions\` int NOT NULL DEFAULT '0', \`maxPerUser\` int NULL, \`validFrom\` date NULL, \`validTo\` date NULL, \`status\` varchar(20) NOT NULL DEFAULT 'active', \`category\` varchar(30) NOT NULL DEFAULT 'general', \`sortOrder\` int NOT NULL DEFAULT '100', \`createdByUserId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reward_redemptions\` (\`id\` varchar(36) NOT NULL, \`userId\` int NOT NULL, \`rewardId\` varchar(255) NOT NULL, \`pointsSpent\` int NOT NULL, \`code\` varchar(20) NOT NULL, \`status\` varchar(20) NOT NULL DEFAULT 'pending', \`usedAt\` timestamp NULL, \`usedOnReferenceId\` varchar(255) NULL, \`usedOnReferenceType\` varchar(30) NULL, \`expiresAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_553bfafb7a7cc1ff1ba2c71f65\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payout_accounts\` (\`id\` varchar(36) NOT NULL, \`hostUserId\` int NOT NULL, \`accountType\` varchar(50) NOT NULL, \`bankName\` varchar(255) NOT NULL, \`accountNumber\` varchar(255) NOT NULL, \`accountKey\` varchar(255) NULL, \`holderName\` varchar(255) NOT NULL, \`agencyName\` varchar(255) NULL, \`rib\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`sortOrder\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD \`handToHandOnly\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD \`paymentMethods\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`reward_redemptions\` ADD CONSTRAINT \`FK_5490172918e20aa466c63c9ac12\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reward_redemptions\` ADD CONSTRAINT \`FK_7405900a3e5b2843630b0a83cbe\` FOREIGN KEY (\`rewardId\`) REFERENCES \`rewards\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payout_accounts\` ADD CONSTRAINT \`FK_ed63f4722abdd4b21b44bc0ab25\` FOREIGN KEY (\`hostUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payout_accounts\` DROP FOREIGN KEY \`FK_ed63f4722abdd4b21b44bc0ab25\``);
        await queryRunner.query(`ALTER TABLE \`reward_redemptions\` DROP FOREIGN KEY \`FK_7405900a3e5b2843630b0a83cbe\``);
        await queryRunner.query(`ALTER TABLE \`reward_redemptions\` DROP FOREIGN KEY \`FK_5490172918e20aa466c63c9ac12\``);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP COLUMN \`paymentMethods\``);
        await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` DROP COLUMN \`handToHandOnly\``);
        await queryRunner.query(`DROP TABLE \`payout_accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_553bfafb7a7cc1ff1ba2c71f65\` ON \`reward_redemptions\``);
        await queryRunner.query(`DROP TABLE \`reward_redemptions\``);
        await queryRunner.query(`DROP TABLE \`rewards\``);
    }

}
