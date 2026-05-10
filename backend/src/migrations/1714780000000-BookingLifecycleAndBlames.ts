import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookingLifecycleAndBlames1714780000000 implements MigrationInterface {
  name = 'BookingLifecycleAndBlames1714780000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── bookings: new lifecycle columns ───────────────────────────
    await queryRunner.query(`
      ALTER TABLE \`bookings\`
        ADD COLUMN \`acceptedAt\` DATETIME NULL,
        ADD COLUMN \`archivedAt\` DATETIME NULL,
        ADD COLUMN \`paymentDeadlineAt\` DATETIME NULL,
        ADD COLUMN \`acceptDeadlineAt\` DATETIME NULL,
        ADD COLUMN \`paymentReminderCount\` INT NOT NULL DEFAULT 0,
        ADD COLUMN \`acceptReminderCount\` INT NOT NULL DEFAULT 0
    `);

    // ── service_bookings: same lifecycle columns ──────────────────
    await queryRunner.query(`
      ALTER TABLE \`service_bookings\`
        ADD COLUMN \`acceptedAt\` DATETIME NULL,
        ADD COLUMN \`archivedAt\` DATETIME NULL,
        ADD COLUMN \`paymentDeadlineAt\` DATETIME NULL,
        ADD COLUMN \`acceptDeadlineAt\` DATETIME NULL,
        ADD COLUMN \`paymentReminderCount\` INT NOT NULL DEFAULT 0,
        ADD COLUMN \`acceptReminderCount\` INT NOT NULL DEFAULT 0
    `);

    // ── user_blames table ─────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE \`user_blames\` (
        \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
        \`userId\` INT NOT NULL,
        \`type\` VARCHAR(30) NOT NULL,
        \`reason\` TEXT NULL,
        \`bookingRef\` VARCHAR(64) NULL,
        \`createdByUserId\` INT NULL,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`removedAt\` DATETIME NULL,
        \`removedByUserId\` INT NULL,
        \`removalNote\` TEXT NULL,
        INDEX \`IDX_user_blames_userId\` (\`userId\`),
        CONSTRAINT \`FK_user_blames_user\` FOREIGN KEY (\`userId\`)
          REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_blames\``);
    await queryRunner.query(`
      ALTER TABLE \`service_bookings\`
        DROP COLUMN \`acceptedAt\`,
        DROP COLUMN \`archivedAt\`,
        DROP COLUMN \`paymentDeadlineAt\`,
        DROP COLUMN \`acceptDeadlineAt\`,
        DROP COLUMN \`paymentReminderCount\`,
        DROP COLUMN \`acceptReminderCount\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`bookings\`
        DROP COLUMN \`acceptedAt\`,
        DROP COLUMN \`archivedAt\`,
        DROP COLUMN \`paymentDeadlineAt\`,
        DROP COLUMN \`acceptDeadlineAt\`,
        DROP COLUMN \`paymentReminderCount\`,
        DROP COLUMN \`acceptReminderCount\`
    `);
  }
}
