import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Service bookings unified workflow:
 *  - Persist fee breakdown (subtotalAmount, serviceFeeAmount, hostAbsorptionAmount,
 *    pointsDiscount, referralDiscount) on service_bookings.
 *  - Add counter-offer fields (hostResponse, counterOfferPrice/Date/Time).
 *  - Add bookingType discriminator on host_payouts and booking_disputes
 *    (backfilled from existing bookingId / serviceBookingId FKs).
 */
export class ServiceBookingsWorkflow1781000000000 implements MigrationInterface {
  name = 'ServiceBookingsWorkflow1781000000000';

  private async hasColumn(qr: QueryRunner, table: string, column: string): Promise<boolean> {
    const rows: any[] = await qr.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column],
    );
    return rows.length > 0;
  }

  public async up(qr: QueryRunner): Promise<void> {
    // ── service_bookings additions ──────────────────────────────────────
    const sbCols: Array<[string, string]> = [
      ['subtotalAmount', 'decimal(12,2) NOT NULL DEFAULT 0'],
      ['serviceFeeAmount', 'decimal(12,2) NOT NULL DEFAULT 0'],
      ['hostAbsorptionAmount', 'decimal(12,2) NOT NULL DEFAULT 0'],
      ['pointsDiscount', 'decimal(12,2) NOT NULL DEFAULT 0'],
      ['referralDiscount', 'decimal(12,2) NOT NULL DEFAULT 0'],
      ['hostResponse', 'text NULL'],
      ['counterOfferPrice', 'decimal(12,2) NULL'],
      ['counterOfferDate', 'date NULL'],
      ['counterOfferTime', 'varchar(5) NULL'],
    ];
    for (const [name, type] of sbCols) {
      if (!(await this.hasColumn(qr, 'service_bookings', name))) {
        await qr.query(`ALTER TABLE \`service_bookings\` ADD \`${name}\` ${type}`);
      }
    }

    // ── host_payouts.bookingType ────────────────────────────────────────
    if (!(await this.hasColumn(qr, 'host_payouts', 'bookingType'))) {
      await qr.query(`ALTER TABLE \`host_payouts\` ADD \`bookingType\` varchar(20) NULL`);
      await qr.query(
        `UPDATE \`host_payouts\` SET \`bookingType\` = CASE
          WHEN \`bookingId\` IS NOT NULL THEN 'property'
          WHEN \`serviceBookingId\` IS NOT NULL THEN 'service'
          ELSE NULL END`,
      );
      await qr.query(`CREATE INDEX \`IDX_host_payouts_bookingType\` ON \`host_payouts\` (\`bookingType\`)`);
    }

    // ── booking_disputes.bookingType ────────────────────────────────────
    if (!(await this.hasColumn(qr, 'booking_disputes', 'bookingType'))) {
      await qr.query(`ALTER TABLE \`booking_disputes\` ADD \`bookingType\` varchar(20) NULL`);
      await qr.query(
        `UPDATE \`booking_disputes\` SET \`bookingType\` = CASE
          WHEN \`bookingId\` IS NOT NULL THEN 'property'
          WHEN \`serviceBookingId\` IS NOT NULL THEN 'service'
          ELSE NULL END`,
      );
      await qr.query(`CREATE INDEX \`IDX_booking_disputes_bookingType\` ON \`booking_disputes\` (\`bookingType\`)`);
    }
  }

  public async down(qr: QueryRunner): Promise<void> {
    // Best-effort drops (idempotent)
    const dropIfExists = async (table: string, col: string) => {
      if (await this.hasColumn(qr, table, col)) {
        await qr.query(`ALTER TABLE \`${table}\` DROP COLUMN \`${col}\``);
      }
    };
    for (const c of ['subtotalAmount','serviceFeeAmount','hostAbsorptionAmount','pointsDiscount','referralDiscount','hostResponse','counterOfferPrice','counterOfferDate','counterOfferTime']) {
      await dropIfExists('service_bookings', c);
    }
    await dropIfExists('host_payouts', 'bookingType').catch(() => {});
    await dropIfExists('booking_disputes', 'bookingType').catch(() => {});
  }
}
