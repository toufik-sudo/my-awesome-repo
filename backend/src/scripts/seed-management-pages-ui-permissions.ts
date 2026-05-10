/**
 * Additive seed for management pages (Escrow Admin, Host Reactivation, RBAC Debug,
 * PaymentValidation actions) FRONTEND UI permissions and the corresponding
 * Sidebar link entries.
 *
 * ⚠️ NEVER OVERWRITES — uses INSERT IGNORE on the unique `permission_key`
 *    index, so existing UI permission rows are left exactly as-is.
 *    Only missing keys are inserted.
 *
 * This replaces the previous hardcoded `MANAGEMENT_ROLES` checks in:
 *   - src/routes/Routes.tsx
 *   - src/modules/shared/layout/MainLayout.tsx
 *   - src/modules/payments/pages/PaymentValidation.tsx
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-management-pages-ui-permissions.ts
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
const HOST = ['hyper_admin', 'hyper_manager', 'admin', 'manager']; // management roles
const ADMIN_UP = ['hyper_admin', 'hyper_manager', 'admin'];        // excludes manager
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

const MANAGEMENT_UI_PERMISSIONS: UiPerm[] = [
  // ── Page-level View permissions ───────────────────────────────────────────
  { component: 'RbacDebugPage',         element_type: 'Page', action_name: 'View', user_roles: HOST,  module: 'rbac',          description: 'View RBAC Debug page' },
  { component: 'EscrowAdminPage',       element_type: 'Page', action_name: 'View', user_roles: HOST,  module: 'escrow',        description: 'View Escrow Admin page' },
  { component: 'HostReactivationPage',  element_type: 'Page', action_name: 'View', user_roles: HOST,  module: 'reactivation',  description: 'View Host Reactivation page' },
  // MyDisputesPage / DisputeDetailPage / PayoutsDashboardPage already seeded in seed-escrow-frontend-ui-permissions.ts

  // ── Sidebar links (replaces hardcoded `roles: MANAGEMENT_ROLES`) ──────────
  { component: 'Sidebar', sub_view: 'RbacDebug',         element_type: 'Link', action_name: 'View', user_roles: HOST, module: 'sidebar', description: 'Show RBAC Debug link in sidebar' },
  { component: 'Sidebar', sub_view: 'Escrow',            element_type: 'Link', action_name: 'View', user_roles: HOST, module: 'sidebar', description: 'Show Escrow link in sidebar' },
  { component: 'Sidebar', sub_view: 'HostReactivation',  element_type: 'Link', action_name: 'View', user_roles: HOST, module: 'sidebar', description: 'Show Host Reactivation link in sidebar' },
  { component: 'Sidebar', sub_view: 'MyDisputes',        element_type: 'Link', action_name: 'View', user_roles: HOST, module: 'sidebar', description: 'Show My Disputes link in sidebar' },

  // ── PaymentValidation page action buttons (replaces isPaymentReviewer / isAccountManager) ──
  { component: 'PaymentValidation', sub_view: 'Receipts', element_type: 'Button', action_name: 'Approve', user_roles: HOST,     module: 'payments', description: 'Approve a payment receipt' },
  { component: 'PaymentValidation', sub_view: 'Receipts', element_type: 'Button', action_name: 'Reject',  user_roles: HOST,     module: 'payments', description: 'Reject a payment receipt' },
  { component: 'PaymentValidation', sub_view: 'Accounts', element_type: 'Button', action_name: 'Add',     user_roles: ADMIN_UP, module: 'payments', description: 'Add a transfer/platform account' },
  { component: 'PaymentValidation', sub_view: 'Accounts', element_type: 'Button', action_name: 'Edit',    user_roles: ADMIN_UP, module: 'payments', description: 'Edit a transfer/platform account' },
  { component: 'PaymentValidation', sub_view: 'Accounts', element_type: 'Button', action_name: 'Delete',  user_roles: ADMIN_UP, module: 'payments', description: 'Delete a transfer/platform account' },
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

    for (const perm of MANAGEMENT_UI_PERMISSIONS) {
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
    console.log(`✅ Management pages UI permissions seed complete`);
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
