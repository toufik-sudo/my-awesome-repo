/**
 * Additive seed for escrow / disputes / payouts FRONTEND UI permissions.
 *
 * ⚠️ NEVER OVERWRITES — uses INSERT IGNORE on the unique `permission_key`
 *    index, so existing UI permission rows are left exactly as-is.
 *    Only missing keys are inserted.
 *
 * Covers the new pages/components:
 *   - MyDisputesPage
 *   - DisputeDetailPage
 *   - PayoutsDashboardPage
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-escrow-frontend-ui-permissions.ts
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

interface UiPerm {
  component: string;
  sub_view?: string;
  element_type?: string;
  action_name?: string;
  user_roles: string[];
  module: string;
  description: string;
}

const ESCROW_UI_PERMISSIONS: UiPerm[] = [
  // ── My Disputes (guest-facing) ─────────────────────────────────────────
  { component: 'MyDisputesPage', element_type: 'Page',   action_name: 'View',          user_roles: AUTHENTICATED, module: 'disputes', description: 'View my disputes & refund status list' },
  { component: 'MyDisputesPage', sub_view: 'Card', element_type: 'Link', action_name: 'OpenDetail', user_roles: AUTHENTICATED, module: 'disputes', description: 'Open dispute detail from list' },
  { component: 'MyDisputesPage', sub_view: 'Card', element_type: 'Link', action_name: 'OpenPayout', user_roles: AUTHENTICATED, module: 'disputes', description: 'Cross-link from a dispute card to its related payout' },

  // ── Dispute Detail ─────────────────────────────────────────────────────
  { component: 'DisputeDetailPage', element_type: 'Page',     action_name: 'View',         user_roles: AUTHENTICATED, module: 'disputes', description: 'View dispute detail page (timeline, breakdown)' },
  { component: 'DisputeDetailPage', sub_view: 'Timeline', element_type: 'Section', action_name: 'View', user_roles: AUTHENTICATED, module: 'disputes', description: 'View dispute timeline' },
  { component: 'DisputeDetailPage', sub_view: 'RefundBreakdown', element_type: 'Section', action_name: 'View', user_roles: AUTHENTICATED, module: 'disputes', description: 'View refund breakdown' },
  { component: 'DisputeDetailPage', sub_view: 'RefundBreakdown', element_type: 'Button', action_name: 'OpenPayout', user_roles: AUTHENTICATED, module: 'disputes', description: 'Cross-link from dispute detail to related payout in admin dashboard' },

  // ── Payouts Dashboard (admin/host) ─────────────────────────────────────
  { component: 'PayoutsDashboardPage', element_type: 'Page',   action_name: 'View',         user_roles: HOST,  module: 'payouts', description: 'View payouts dashboard (scoped by role)' },
  { component: 'PayoutsDashboardPage', sub_view: 'Totals',  element_type: 'Widget', action_name: 'View',     user_roles: HOST,  module: 'payouts', description: 'View totals widgets (gross / fees / net / released)' },
  { component: 'PayoutsDashboardPage', sub_view: 'Filters', element_type: 'Tab',    action_name: 'Filter',   user_roles: HOST,  module: 'payouts', description: 'Filter payouts by status' },
  { component: 'PayoutsDashboardPage', sub_view: 'Row',     element_type: 'Link',   action_name: 'OpenDispute', user_roles: HOST, module: 'payouts', description: 'Cross-link from a payout row to its related dispute(s)' },
  { component: 'PayoutsDashboardPage', sub_view: 'Row',     element_type: 'Row',    action_name: 'Focus',    user_roles: HOST,  module: 'payouts', description: 'Highlight payout row when navigated via ?focus=' },
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

    for (const perm of ESCROW_UI_PERMISSIONS) {
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
    console.log(`✅ Escrow frontend UI permissions seed complete`);
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
