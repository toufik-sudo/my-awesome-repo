import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds support for the on-behalf booking flow that requires the target guest
 * to confirm before the booking is auto-accepted on the host's behalf.
 */
export class OnBehalfGuestConfirmation1781100000000 implements MigrationInterface {
  name = 'OnBehalfGuestConfirmation1781100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`bookings\`
      ADD COLUMN \`awaitingGuestConfirmation\` TINYINT(1) NOT NULL DEFAULT 0,
      ADD COLUMN \`guestConfirmedAt\` DATETIME NULL,
      ADD COLUMN \`createdByAdminId\` INT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`bookings\`
      DROP COLUMN \`awaitingGuestConfirmation\`,
      DROP COLUMN \`guestConfirmedAt\`,
      DROP COLUMN \`createdByAdminId\`
    `);
  }
}
