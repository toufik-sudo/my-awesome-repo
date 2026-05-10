/**
 * Seed for sidebar navigation UI permissions.
 *
 * Adds an `ui.Sidebar.<NavItem>.Link.View` permission row for every nav item
 * defined in src/config/navigation.config.ts. Uses INSERT IGNORE on the unique
 * `permission_key` index so existing rows are never overwritten.
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-sidebar-nav-ui-permissions.ts
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
  entities: [
    // Add your entity paths here if needed for the DataSource to initialize
    // e.g., __dirname + '/../entities/*.ts'
  ],
});

const ALL          = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
const AUTH         = ALL;
const HOST         = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
const ADMIN_UP     = ['hyper_admin', 'hyper_manager', 'admin'];
const HYPER_ADMIN  = ['hyper_admin'];
const BOOKERS      = ['admin', 'manager', 'user', 'guest'];

interface NavPerm {
  subView: string;
  user_roles: string[];
  description: string;
}

const NAV_PERMS: NavPerm[] = [
  { subView: 'Home',               user_roles: ALL,        description: 'Sidebar: Home' },
  { subView: 'MyBookings',         user_roles: BOOKERS,    description: 'Sidebar: My Bookings' },
  { subView: 'Dashboard',          user_roles: AUTH,       description: 'Sidebar: Dashboard' },
  { subView: 'Components',         user_roles: ALL,        description: 'Sidebar: Components demo' },
  { subView: 'GridDemo',           user_roles: ALL,        description: 'Sidebar: Grid demo' },
  { subView: 'FilterDemo',         user_roles: ALL,        description: 'Sidebar: Filter demo' },
  { subView: 'Map',                user_roles: ALL,        description: 'Sidebar: Map' },
  { subView: 'MapSearch',          user_roles: ALL,        description: 'Sidebar: Map → Search' },
  { subView: 'MapSaved',           user_roles: AUTH,       description: 'Sidebar: Map → Saved locations' },
  { subView: 'Calendar',           user_roles: AUTH,       description: 'Sidebar: Calendar' },
  { subView: 'CalendarEvents',     user_roles: AUTH,       description: 'Sidebar: Calendar → Events' },
  { subView: 'CalendarBookings',   user_roles: HOST,       description: 'Sidebar: Calendar → Bookings' },
  { subView: 'Pages',              user_roles: ADMIN_UP,   description: 'Sidebar: Pages' },
  { subView: 'PagesList',          user_roles: ADMIN_UP,   description: 'Sidebar: Pages → All' },
  { subView: 'PagesCreate',        user_roles: ADMIN_UP,   description: 'Sidebar: Pages → Create' },
  { subView: 'Media',              user_roles: ADMIN_UP,   description: 'Sidebar: Media library' },
  { subView: 'Messages',           user_roles: AUTH,       description: 'Sidebar: Messages' },
  { subView: 'MyDisputes',         user_roles: AUTH,       description: 'Sidebar: My Disputes' },
  { subView: 'PaymentValidation',  user_roles: HOST,       description: 'Sidebar: Payment Validation' },
  { subView: 'Payouts',            user_roles: HOST,       description: 'Sidebar: Payouts dashboard' },
  { subView: 'Escrow',             user_roles: HOST,       description: 'Sidebar: Escrow & Disputes' },
  { subView: 'HostReactivation',   user_roles: HOST,       description: 'Sidebar: Host Reactivation' },
  { subView: 'BookingCalendar',    user_roles: HOST,       description: 'Sidebar: Booking calendar' },
  { subView: 'AdminDashboard',     user_roles: ADMIN_UP,   description: 'Sidebar: Administration' },
  { subView: 'CancellationRules',  user_roles: HOST,       description: 'Sidebar: Cancellation rules' },
  { subView: 'SupportChat',        user_roles: ADMIN_UP,   description: 'Sidebar: Support chat (admin)' },
  { subView: 'Users',              user_roles: ADMIN_UP,   description: 'Sidebar: Users management' },
  { subView: 'Analytics',          user_roles: ADMIN_UP,   description: 'Sidebar: Analytics' },
  { subView: 'Security',           user_roles: HYPER_ADMIN, description: 'Sidebar: Security' },
  { subView: 'Appearance',         user_roles: ADMIN_UP,   description: 'Sidebar: Appearance' },
  { subView: 'RbacSettings',       user_roles: ADMIN_UP,   description: 'Sidebar: RBAC Settings' },
  { subView: 'RbacDebug',          user_roles: HOST,       description: 'Sidebar: RBAC Debug' },
  { subView: 'Settings',           user_roles: AUTH,       description: 'Sidebar: Settings' },
  { subView: 'Profile',            user_roles: AUTH,       description: 'User menu: Profile' },
  { subView: 'Notifications',      user_roles: AUTH,       description: 'User menu: Notifications' },
  { subView: 'Help',               user_roles: ALL,        description: 'User menu: Help & Support' },
];

async function run(): Promise<void> {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const qr = AppDataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  let inserted = 0;
  let skipped  = 0;

  try {
    for (const p of NAV_PERMS) {
      const key = generateUiPermissionKey('Sidebar', p.subView, 'Link', 'View');
      const result: any = await qr.query(
        `INSERT IGNORE INTO rbac_frontend_permissions
           (permission_key, component, sub_view, element_type, action_name, allowed, user_roles, module, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          key, 'Sidebar', p.subView, 'Link', 'View', 1,
          JSON.stringify(p.user_roles), 'sidebar', p.description,
        ],
      );
      if (result?.affectedRows > 0) {
        inserted++;
        console.log(`  + ${key}  [${p.user_roles.join(', ')}]`);
      } else {
        skipped++;
      }
    }

    await qr.commitTransaction();
    console.log(`\n✅ Done — inserted: ${inserted}, skipped (already exists): ${skipped}, total: ${NAV_PERMS.length}`);
  } catch (e) {
    await qr.rollbackTransaction();
    console.error('❌ Failed:', e);
    process.exit(1);
  } finally {
    await qr.release();
    await AppDataSource.destroy();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
