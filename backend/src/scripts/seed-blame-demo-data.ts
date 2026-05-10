/**
 * Demo data seed for the booking-lifecycle + user-blame features.
 *
 * Idempotent — safe to re-run. Only inserts rows that aren't already there
 * (matched by deterministic markers in `reason` / `bookingRef`).
 *
 *  • Stamps `acceptDeadlineAt` + `paymentDeadlineAt` on the most recent
 *    `pending` / `accepted` bookings (and service_bookings) that don't have
 *    them yet, so countdown banners and the BullMQ workers have something
 *    to react to.
 *  • Inserts a small set of demo `user_blames` (one of each type) for the
 *    first non-hyper users in the database, so BlamesAdminPage and
 *    NonSeriousBadge have data to render.
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-blame-demo-data.ts
 */

import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { randomUUID } from 'crypto';

dotenvConfig({ path: '.env' });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
});

const ACCEPT_WINDOW_HOURS = 48;
const PAYMENT_WINDOW_HOURS = 24;

const DEMO_BLAMES: Array<{ type: string; reason: string; bookingRef: string }> = [
  { type: 'guest_no_payment', reason: '[demo] Guest did not pay within 24h after host acceptance.', bookingRef: 'demo-blame-guest-no-pay' },
  { type: 'host_no_response', reason: '[demo] Host did not respond within 48h to the booking request.', bookingRef: 'demo-blame-host-no-resp' },
  { type: 'manual',           reason: '[demo] Manual blame issued by hyper admin for repeated abuse.', bookingRef: 'demo-blame-manual' },
];

async function stampDeadlines(qr: any, table: 'bookings' | 'service_bookings') {
  // pending → set acceptDeadlineAt = createdAt + 48h (if null)
  const pendingRes: any = await qr.query(
    `UPDATE \`${table}\`
        SET acceptDeadlineAt = DATE_ADD(createdAt, INTERVAL ${ACCEPT_WINDOW_HOURS} HOUR)
      WHERE status = 'pending'
        AND acceptDeadlineAt IS NULL`,
  );
  // accepted → set paymentDeadlineAt = COALESCE(acceptedAt, NOW()) + 24h (if null)
  const acceptedRes: any = await qr.query(
    `UPDATE \`${table}\`
        SET paymentDeadlineAt = DATE_ADD(COALESCE(acceptedAt, NOW()), INTERVAL ${PAYMENT_WINDOW_HOURS} HOUR)
      WHERE status = 'accepted'
        AND paymentDeadlineAt IS NULL`,
  );
  return {
    pending: pendingRes?.affectedRows ?? 0,
    accepted: acceptedRes?.affectedRows ?? 0,
  };
}

async function run(): Promise<void> {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const qr = AppDataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    // ── 1. Stamp deadlines on existing bookings ────────────────────────
    const b = await stampDeadlines(qr, 'bookings');
    const sb = await stampDeadlines(qr, 'service_bookings');
    console.log(
      `🕒 Deadlines stamped → bookings: ${b.pending} pending / ${b.accepted} accepted` +
      `  •  service_bookings: ${sb.pending} pending / ${sb.accepted} accepted`,
    );

    // ── 2. Pick 3 demo target users (non-hyper) ────────────────────────
    const users: Array<{ id: number }> = await qr.query(
      `SELECT u.id
         FROM users u
         LEFT JOIN user_roles ur ON ur.userId = u.id
                                AND ur.role IN ('hyper_admin','hyper_manager')
        WHERE ur.id IS NULL
        ORDER BY u.id ASC
        LIMIT 3`,
    );

    if (users.length === 0) {
      console.warn('⚠️ No non-hyper users found — skipping demo blames.');
    } else {
      let inserted = 0;
      let skipped = 0;
      for (let i = 0; i < DEMO_BLAMES.length; i++) {
        const target = users[i % users.length];
        const tpl = DEMO_BLAMES[i];

        const existing: any[] = await qr.query(
          `SELECT id FROM user_blames
            WHERE userId = ? AND bookingRef = ? LIMIT 1`,
          [target.id, tpl.bookingRef],
        );
        if (existing.length) { skipped++; continue; }

        await qr.query(
          `INSERT INTO user_blames
            (id, userId, type, reason, bookingRef, createdByUserId, createdAt)
           VALUES (?, ?, ?, ?, ?, NULL, NOW())`,
          [randomUUID(), target.id, tpl.type, tpl.reason, tpl.bookingRef],
        );
        inserted++;
      }
      console.log(`🚩 Demo blames → inserted: ${inserted}, skipped: ${skipped}`);
    }

    await qr.commitTransaction();
    console.log('✅ Blame demo data seed complete');
  } catch (e) {
    await qr.rollbackTransaction();
    console.error('❌ Seed failed:', e);
    throw e;
  } finally {
    await qr.release();
    await AppDataSource.destroy();
  }
}

run();
