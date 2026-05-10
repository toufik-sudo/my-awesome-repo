import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Escrow & dispute infrastructure:
 *  - platform_accounts: hyper-admin escrow bank accounts
 *  - host_payouts: split + scheduled release of funds to the host
 *  - booking_disputes: guest claims that can freeze a payout
 *  - host_fee_debts: ledger of fees the host owes the platform
 *  - users: suspendedAt / suspendedReason / archivedAt / reactivationDueAmount
 */
export class EscrowMigration1777000000000 implements MigrationInterface {
  name = 'EscrowMigration1777000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── platform_accounts ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`platform_accounts\` (
        \`id\` varchar(36) NOT NULL,
        \`accountType\` varchar(50) NOT NULL,
        \`bankName\` varchar(255) NOT NULL,
        \`accountNumber\` varchar(255) NOT NULL,
        \`accountKey\` varchar(255) NULL,
        \`holderName\` varchar(255) NOT NULL,
        \`agencyName\` varchar(255) NULL,
        \`rib\` varchar(255) NULL,
        \`currency\` varchar(3) NOT NULL DEFAULT 'DZD',
        \`instructions\` text NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`acceptsGuestPayments\` tinyint NOT NULL DEFAULT 1,
        \`acceptsReactivationPayments\` tinyint NOT NULL DEFAULT 1,
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // ── host_payouts ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`host_payouts\` (
        \`id\` varchar(36) NOT NULL,
        \`bookingId\` varchar(36) NULL,
        \`serviceBookingId\` varchar(36) NULL,
        \`receiptId\` varchar(36) NULL,
        \`hostUserId\` int NOT NULL,
        \`grossAmount\` decimal(12,2) NOT NULL,
        \`platformFee\` decimal(12,2) NOT NULL DEFAULT 0,
        \`guestServiceFee\` decimal(12,2) NOT NULL DEFAULT 0,
        \`netAmount\` decimal(12,2) NOT NULL,
        \`releasedAmount\` decimal(12,2) NOT NULL DEFAULT 0,
        \`currency\` varchar(3) NOT NULL DEFAULT 'DZD',
        \`releaseAt\` datetime NOT NULL,
        \`status\` varchar(30) NOT NULL DEFAULT 'scheduled',
        \`releasedAt\` datetime NULL,
        \`releasedByUserId\` int NULL,
        \`externalTransferRef\` varchar(255) NULL,
        \`notes\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_host_payouts_bookingId\` (\`bookingId\`),
        INDEX \`IDX_host_payouts_serviceBookingId\` (\`serviceBookingId\`),
        INDEX \`IDX_host_payouts_hostUserId_status\` (\`hostUserId\`, \`status\`),
        INDEX \`IDX_host_payouts_releaseAt\` (\`releaseAt\`),
        CONSTRAINT \`FK_host_payouts_booking\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_host_payouts_service_booking\` FOREIGN KEY (\`serviceBookingId\`) REFERENCES \`service_bookings\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_host_payouts_receipt\` FOREIGN KEY (\`receiptId\`) REFERENCES \`payment_receipts\`(\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_host_payouts_host\` FOREIGN KEY (\`hostUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_host_payouts_released_by\` FOREIGN KEY (\`releasedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    // ── booking_disputes ─────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`booking_disputes\` (
        \`id\` varchar(36) NOT NULL,
        \`bookingId\` varchar(36) NULL,
        \`serviceBookingId\` varchar(36) NULL,
        \`guestUserId\` int NOT NULL,
        \`subject\` varchar(200) NOT NULL,
        \`description\` text NOT NULL,
        \`attachments\` json NULL,
        \`status\` varchar(20) NOT NULL DEFAULT 'open',
        \`severity\` varchar(20) NOT NULL DEFAULT 'moderate',
        \`resolution\` varchar(30) NULL,
        \`refundAmount\` decimal(12,2) NOT NULL DEFAULT 0,
        \`resolvedByUserId\` int NULL,
        \`resolvedAt\` datetime NULL,
        \`resolutionNote\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_booking_disputes_status\` (\`status\`),
        INDEX \`IDX_booking_disputes_bookingId\` (\`bookingId\`),
        INDEX \`IDX_booking_disputes_serviceBookingId\` (\`serviceBookingId\`),
        INDEX \`IDX_booking_disputes_guestUserId\` (\`guestUserId\`),
        CONSTRAINT \`FK_disputes_booking\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_disputes_service_booking\` FOREIGN KEY (\`serviceBookingId\`) REFERENCES \`service_bookings\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_disputes_guest\` FOREIGN KEY (\`guestUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_disputes_resolved_by\` FOREIGN KEY (\`resolvedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    // ── host_fee_debts ───────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`host_fee_debts\` (
        \`id\` varchar(36) NOT NULL,
        \`hostUserId\` int NOT NULL,
        \`origin\` varchar(30) NOT NULL,
        \`disputeId\` varchar(36) NULL,
        \`amount\` decimal(12,2) NOT NULL,
        \`settledAmount\` decimal(12,2) NOT NULL DEFAULT 0,
        \`currency\` varchar(3) NOT NULL DEFAULT 'DZD',
        \`status\` varchar(30) NOT NULL DEFAULT 'pending',
        \`dueAt\` datetime NULL,
        \`archiveAt\` datetime NULL,
        \`description\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_host_fee_debts_hostUserId_status\` (\`hostUserId\`, \`status\`),
        INDEX \`IDX_host_fee_debts_disputeId\` (\`disputeId\`),
        CONSTRAINT \`FK_debts_host\` FOREIGN KEY (\`hostUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_debts_dispute\` FOREIGN KEY (\`disputeId\`) REFERENCES \`booking_disputes\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    // ── users sanction columns (idempotent) ──────────────────────────────
    const cols: { COLUMN_NAME: string }[] = await queryRunner.query(`
      SELECT COLUMN_NAME FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
        AND COLUMN_NAME IN ('suspendedAt','suspendedReason','archivedAt','reactivationDueAmount')
    `);
    const present = new Set(cols.map(c => c.COLUMN_NAME));
    if (!present.has('suspendedAt'))
      await queryRunner.query(`ALTER TABLE \`users\` ADD \`suspendedAt\` datetime NULL`);
    if (!present.has('suspendedReason'))
      await queryRunner.query(`ALTER TABLE \`users\` ADD \`suspendedReason\` varchar(255) NULL`);
    if (!present.has('archivedAt'))
      await queryRunner.query(`ALTER TABLE \`users\` ADD \`archivedAt\` datetime NULL`);
    if (!present.has('reactivationDueAmount'))
      await queryRunner.query(`ALTER TABLE \`users\` ADD \`reactivationDueAmount\` decimal(12,2) NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN IF EXISTS \`reactivationDueAmount\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN IF EXISTS \`archivedAt\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN IF EXISTS \`suspendedReason\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN IF EXISTS \`suspendedAt\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`host_fee_debts\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`booking_disputes\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`host_payouts\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`platform_accounts\``);
  }
}
