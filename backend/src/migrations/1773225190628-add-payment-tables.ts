import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTables1773225190628 implements MigrationInterface {
    name = 'AddPaymentTables1773225190628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transfer_accounts\` (\`id\` varchar(36) NOT NULL, \`bankName\` varchar(100) NOT NULL, \`accountType\` varchar(20) NOT NULL, \`accountNumber\` varchar(100) NOT NULL, \`accountKey\` varchar(20) NULL, \`holderName\` varchar(255) NOT NULL, \`agencyName\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`sortOrder\` int NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_receipts\` (\`id\` varchar(36) NOT NULL, \`bookingId\` varchar(255) NOT NULL, \`uploadedByUserId\` int NOT NULL, \`transferAccountId\` varchar(255) NULL, \`receiptUrl\` varchar(1000) NOT NULL, \`originalFileName\` varchar(255) NULL, \`amount\` decimal(12,2) NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'DZD', \`status\` varchar(20) NOT NULL DEFAULT 'pending', \`reviewedByUserId\` int NULL, \`reviewedAt\` datetime NULL, \`reviewNote\` text NULL, \`guestNote\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` ADD CONSTRAINT \`FK_pr_bookingId\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` ADD CONSTRAINT \`FK_pr_uploadedByUserId\` FOREIGN KEY (\`uploadedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` ADD CONSTRAINT \`FK_pr_transferAccountId\` FOREIGN KEY (\`transferAccountId\`) REFERENCES \`transfer_accounts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` ADD CONSTRAINT \`FK_pr_reviewedByUserId\` FOREIGN KEY (\`reviewedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` DROP FOREIGN KEY \`FK_pr_reviewedByUserId\``);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` DROP FOREIGN KEY \`FK_pr_transferAccountId\``);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` DROP FOREIGN KEY \`FK_pr_uploadedByUserId\``);
        await queryRunner.query(`ALTER TABLE \`payment_receipts\` DROP FOREIGN KEY \`FK_pr_bookingId\``);
        await queryRunner.query(`DROP TABLE \`payment_receipts\``);
        await queryRunner.query(`DROP TABLE \`transfer_accounts\``);
    }
}
