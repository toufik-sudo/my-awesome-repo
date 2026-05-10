/**
 * Additive seed for the new booking-lifecycle / user-blame BACKEND permissions.
 *
 * ⚠️ NEVER OVERWRITES — uses INSERT IGNORE so any existing `permission_key`
 *    row is left exactly as-is. Only missing keys are added.
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-blame-backend-permissions.ts
 */

import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { generateBackendPermissionKey } from '../rbac/utils/generate-backend-permission-key';

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
const AUTHENTICATED = ALL;

interface BackendPerm {
  controller: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint_url: string;
  user_roles: string[];
  module: string;
  description: string;
  scope?: string;
}

const BLAME_BACKEND_PERMISSIONS: BackendPerm[] = [
  // UserBlameController — public/per-user views
  { controller: 'UserBlameController', endpoint: 'getPublic',  method: 'GET',    endpoint_url: '/api/user-blames/user/:userId/public', user_roles: ALL,           module: 'blames', description: 'Public non-serious badge data for a user' },
  { controller: 'UserBlameController', endpoint: 'getCounts',  method: 'GET',    endpoint_url: '/api/user-blames/counts',              user_roles: ALL,           module: 'blames', description: 'Bulk active blame counts for a list of user ids' },
  { controller: 'UserBlameController', endpoint: 'myBlames',   method: 'GET',    endpoint_url: '/api/user-blames/me',                  user_roles: AUTHENTICATED, module: 'blames', description: 'Current user own blames (active + removed)', scope: 'own' },

  // UserBlameController — admin actions
  { controller: 'UserBlameController', endpoint: 'list',       method: 'GET',    endpoint_url: '/api/user-blames',       user_roles: HYPER, module: 'blames', description: 'List all user blames with filters (hyper only)' },
  { controller: 'UserBlameController', endpoint: 'remove',     method: 'DELETE', endpoint_url: '/api/user-blames/:id',   user_roles: HYPER, module: 'blames', description: 'Remove (clear) a blame after support contact' },
  { controller: 'UserBlameController', endpoint: 'create',     method: 'POST',   endpoint_url: '/api/user-blames',       user_roles: HYPER, module: 'blames', description: 'Manually issue a blame to a user' },
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

    for (const p of BLAME_BACKEND_PERMISSIONS) {
      const permKey = generateBackendPermissionKey(p.controller, p.endpoint, p.method);
      try {
        const result: any = await qr.query(
          `INSERT IGNORE INTO rbac_backend_permissions
            (id, permission_key, user_roles, controller, endpoint, method, endpoint_url, module, description, scope, allowed)
           VALUES
            (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`,
          [
            permKey,
            JSON.stringify(p.user_roles),
            p.controller,
            p.endpoint,
            p.method,
            p.endpoint_url,
            p.module,
            p.description,
            p.scope ?? 'global',
          ],
        );
        if (result?.affectedRows > 0) inserted++;
        else skipped++;
      } catch (err: any) {
        errors.push(`${permKey}: ${err.message}`);
      }
    }

    await qr.commitTransaction();
    console.log(`✅ Blame backend permissions seed complete`);
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
