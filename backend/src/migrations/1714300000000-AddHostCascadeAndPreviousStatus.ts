import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds host-cascade tracking columns to properties, tourism_services and bookings.
 *
 *  • previousStatus / hostCascade  → on properties + tourism_services
 *      Lets us remember the prior status when a host pause/archive cascades
 *      to their inventory, so resume restores the exact previous state.
 *  • videos (JSON)                 → on properties + tourism_services
 *      Optional gallery videos used by the map popup carousel.
 *  • hostCascadeFlag, cancelledBy  → on bookings
 *      Marks bookings frozen by a host pause/archive so the guest can free-cancel
 *      with auto-approval (no host validation). Refund logic uses these.
 */
export class AddHostCascadeAndPreviousStatus1714300000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── properties ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE \`properties\`
      ADD COLUMN \`previousStatus\` varchar(20) NULL,
      ADD COLUMN \`hostCascade\` tinyint(1) NOT NULL DEFAULT 0,
      ADD COLUMN \`videos\` json NULL
    `);

    // ── tourism_services ─────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE \`tourism_services\`
      ADD COLUMN \`previousStatus\` varchar(20) NULL,
      ADD COLUMN \`hostCascade\` tinyint(1) NOT NULL DEFAULT 0,
      ADD COLUMN \`videos\` json NULL
    `);

    // ── bookings ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE \`bookings\`
      ADD COLUMN \`hostCascadeFlag\` tinyint(1) NOT NULL DEFAULT 0,
      ADD COLUMN \`cancelledBy\` varchar(30) NULL
    `);

    // ── service_bookings ─────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE \`service_bookings\`
      ADD COLUMN \`hostCascadeFlag\` tinyint(1) NOT NULL DEFAULT 0,
      ADD COLUMN \`cancelledBy\` varchar(30) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`service_bookings\`
      DROP COLUMN \`hostCascadeFlag\`,
      DROP COLUMN \`cancelledBy\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`bookings\`
      DROP COLUMN \`hostCascadeFlag\`,
      DROP COLUMN \`cancelledBy\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`tourism_services\`
      DROP COLUMN \`previousStatus\`,
      DROP COLUMN \`hostCascade\`,
      DROP COLUMN \`videos\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`properties\`
      DROP COLUMN \`previousStatus\`,
      DROP COLUMN \`hostCascade\`,
      DROP COLUMN \`videos\`
    `);
  }
}
