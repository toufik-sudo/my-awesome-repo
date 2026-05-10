/**
 * Additive seed for booking-lifecycle / blames FRONTEND UI permissions.
 *
 * ⚠️ NEVER OVERWRITES — uses INSERT IGNORE on the unique `permission_key`
 *    index, so existing UI permission rows are left exactly as-is.
 *
 * Covers the new UI surfaces:
 *   - BlamesAdminPage (hyper admin/manager moderation)
 *   - NonSeriousBadge (public visibility)
 *   - MyBookings: "To Pay" tab + Pay Now / host-unresponsive cancel
 *   - HostBookings: Accept / Decline / Counter-Offer / Cancel / deadline alerts
 *   - BookingCalendarPage: status modal actions
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-blame-frontend-ui-permissions.ts
 */

import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { generateUiPermissionKey } from '../rbac/utils/generate-ui-permission-key';

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

const ALL = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
const HYPER = ['hyper_admin', 'hyper_manager'];
const HOST = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
const AUTHENTICATED = ALL;
const BOOKERS = ['manager', 'user', 'guest'];

interface UiPerm {
  component: string;
  sub_view?: string;
  element_type?: string;
  action_name?: string;
  user_roles: string[];
  module: string;
  description: string;
}

const BLAME_UI_PERMISSIONS: UiPerm[] = [
  // ── Blames Admin Page ──────────────────────────────────────────────────
  { component: 'BlamesAdminPage', element_type: 'Page', action_name: 'View', user_roles: HYPER, module: 'blames', description: 'View blames moderation page' },
  { component: 'BlamesAdminPage', sub_view: 'Filters', element_type: 'Tab', action_name: 'Filter', user_roles: HYPER, module: 'blames', description: 'Filter blames by active/removed/type' },
  { component: 'BlamesAdminPage', sub_view: 'Row', element_type: 'Button', action_name: 'Remove', user_roles: HYPER, module: 'blames', description: 'Clear a blame after support contact' },
  { component: 'BlamesAdminPage', sub_view: 'Row', element_type: 'Button', action_name: 'Create', user_roles: HYPER, module: 'blames', description: 'Manually issue a blame' },

  // ── Non-Serious Badge (publicly visible) ───────────────────────────────
  { component: 'NonSeriousBadge', element_type: 'Badge', action_name: 'View', user_roles: ALL, module: 'blames', description: 'View "non-serious" badge on user profile / cards' },

  // ── My Bookings (guest) — new lifecycle states ─────────────────────────
  { component: 'MyBookings', sub_view: 'Tabs', element_type: 'Tab', action_name: 'ToPay', user_roles: BOOKERS, module: 'bookings', description: 'View "To Pay" tab (accepted bookings awaiting payment)' },
  { component: 'MyBookings', sub_view: 'Card', element_type: 'Banner', action_name: 'PaymentCountdown', user_roles: BOOKERS, module: 'bookings', description: '24h payment countdown banner on accepted bookings' },
  { component: 'MyBookings', sub_view: 'Card', element_type: 'Banner', action_name: 'HostUnresponsive', user_roles: BOOKERS, module: 'bookings', description: 'Host-unresponsive banner allowing free cancel' },
  { component: 'MyBookings', sub_view: 'Card', element_type: 'Button', action_name: 'PayNow', user_roles: BOOKERS, module: 'bookings', description: 'Pay Now button on accepted bookings' },
  { component: 'MyBookings', sub_view: 'Card', element_type: 'Button', action_name: 'CancelHostUnresponsive', user_roles: BOOKERS, module: 'bookings', description: 'Cancel free of charge after host acceptance deadline' },

  // ── Host Bookings — new actions ────────────────────────────────────────
  { component: 'HostBookings', sub_view: 'Card', element_type: 'Banner', action_name: 'AcceptCountdown', user_roles: HOST, module: 'bookings', description: '48h accept-deadline countdown banner' },
  { component: 'HostBookings', sub_view: 'Card', element_type: 'Banner', action_name: 'AcceptExpired', user_roles: HOST, module: 'bookings', description: 'Expired-acceptance warning (guest may cancel without penalty)' },
  { component: 'HostBookings', sub_view: 'Card', element_type: 'Button', action_name: 'Accept', user_roles: HOST, module: 'bookings', description: 'Accept pending booking request' },
  { component: 'HostBookings', sub_view: 'Card', element_type: 'Button', action_name: 'Decline', user_roles: HOST, module: 'bookings', description: 'Decline pending booking request' },
  { component: 'HostBookings', sub_view: 'Card', element_type: 'Button', action_name: 'CounterOffer', user_roles: HOST, module: 'bookings', description: 'Send counter-offer for booking request' },
  { component: 'HostBookings', sub_view: 'Card', element_type: 'Button', action_name: 'Cancel', user_roles: HOST, module: 'bookings', description: 'Cancel a confirmed booking' },

  // ── Booking Calendar (admin/host) ──────────────────────────────────────
  { component: 'BookingCalendarPage', sub_view: 'Modal', element_type: 'Dialog', action_name: 'View', user_roles: HOST, module: 'bookings', description: 'Open booking detail modal from calendar event' },
  { component: 'BookingCalendarPage', sub_view: 'Modal', element_type: 'Button', action_name: 'Accept', user_roles: HOST, module: 'bookings', description: 'Accept booking from calendar modal' },
  { component: 'BookingCalendarPage', sub_view: 'Modal', element_type: 'Button', action_name: 'Decline', user_roles: HOST, module: 'bookings', description: 'Decline booking from calendar modal' },
  { component: 'BookingCalendarPage', sub_view: 'Modal', element_type: 'Button', action_name: 'Cancel', user_roles: HOST, module: 'bookings', description: 'Cancel confirmed booking from calendar modal' },
];

async function run(): Promise<void> {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const qr = AppDataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const perm of BLAME_UI_PERMISSIONS) {
      const permKey = generateUiPermissionKey(
        perm.component,
        perm.sub_view,
        perm.element_type,
        perm.action_name,
      );

      try {
        const result: any = await qr.query(
          `INSERT IGNORE INTO rbac_frontend_permissions
            (id, permission_key, user_roles, component, sub_view, element_type, action_name, module, description, allowed)
           VALUES
            (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true)`,
          [
            permKey,
            JSON.stringify(perm.user_roles),
            perm.component,
            perm.sub_view ?? null,
            perm.element_type ?? null,
            perm.action_name ?? null,
            perm.module,
            perm.description,
          ],
        );
        if (result?.affectedRows > 0) inserted++;
        else skipped++;
      } catch (err: any) {
        errors.push(`${permKey}: ${err.message}`);
      }
    }

    await qr.commitTransaction();
    console.log(`✅ Blame frontend UI permissions seed complete`);
    console.log(`   • Inserted (new): ${inserted}`);
    console.log(`   • Skipped (already exists, untouched): ${skipped}`);
    if (errors.length) console.warn(`⚠️ ${errors.length} errors:`, errors);
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
