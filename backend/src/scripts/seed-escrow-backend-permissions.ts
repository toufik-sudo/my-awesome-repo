/**
 * Additive seed for escrow / disputes / payouts BACKEND permissions.
 *
 * ⚠️ NEVER OVERWRITES — uses INSERT IGNORE so any existing `permission_key`
 *    row is left exactly as-is. Only missing keys are added.
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-escrow-backend-permissions.ts
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
const ADMIN_UP = ['hyper_admin', 'hyper_manager', 'admin'];
const HOST = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
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

// One row per route in EscrowController (backend/src/payments/escrow.controller.ts).
const ESCROW_BACKEND_PERMISSIONS: BackendPerm[] = [
  // Platform accounts
  { controller: 'EscrowController', endpoint: 'listForGuests',          method: 'GET',    endpoint_url: '/api/escrow/platform-accounts',                user_roles: ALL,        module: 'escrow',    description: 'List platform escrow accounts shown to guests' },
  { controller: 'EscrowController', endpoint: 'listForReactivation',    method: 'GET',    endpoint_url: '/api/escrow/platform-accounts/reactivation',   user_roles: HOST,       module: 'escrow',    description: 'List accounts available for host reactivation payment' },
  { controller: 'EscrowController', endpoint: 'listAll',                method: 'GET',    endpoint_url: '/api/escrow/platform-accounts/all',            user_roles: HYPER,      module: 'escrow',    description: 'List all platform accounts (hyper only)' },
  { controller: 'EscrowController', endpoint: 'upsertPlatformAccount',  method: 'POST',   endpoint_url: '/api/escrow/platform-accounts',                user_roles: HYPER,      module: 'escrow',    description: 'Create or update a platform escrow account' },
  { controller: 'EscrowController', endpoint: 'removePlatformAccount',  method: 'DELETE', endpoint_url: '/api/escrow/platform-accounts/:id',            user_roles: HYPER,      module: 'escrow',    description: 'Delete a platform escrow account' },

  // Payouts
  { controller: 'EscrowController', endpoint: 'listPayouts',            method: 'GET',    endpoint_url: '/api/escrow/payouts',                          user_roles: HOST,       module: 'payouts',   description: 'List host payouts (scoped by role)', scope: 'own' },

  // Disputes
  { controller: 'EscrowController', endpoint: 'openDispute',            method: 'POST',   endpoint_url: '/api/escrow/disputes',                         user_roles: AUTHENTICATED, module: 'disputes', description: 'Open a dispute on a booking or service booking' },
  { controller: 'EscrowController', endpoint: 'listDisputes',           method: 'GET',    endpoint_url: '/api/escrow/disputes',                         user_roles: AUTHENTICATED, module: 'disputes', description: 'List disputes (scoped by role)', scope: 'own' },
  { controller: 'EscrowController', endpoint: 'getDisputeRefundStatus', method: 'GET',    endpoint_url: '/api/escrow/disputes/:id/refund-status',       user_roles: AUTHENTICATED, module: 'disputes', description: 'Get refund / payout state attached to a dispute (guest view)' },
  { controller: 'EscrowController', endpoint: 'resolveDispute',         method: 'PUT',    endpoint_url: '/api/escrow/disputes/:id/resolve',             user_roles: HYPER,      module: 'disputes',  description: 'Resolve a dispute (hyper_admin / hyper_manager)' },

  // Reactivation
  { controller: 'EscrowController', endpoint: 'getMyQuote',             method: 'GET',    endpoint_url: '/api/escrow/reactivation/quote',               user_roles: HOST,       module: 'reactivation', description: 'Get reactivation quote for current host' },
  { controller: 'EscrowController', endpoint: 'getQuoteForHost',        method: 'GET',    endpoint_url: '/api/escrow/reactivation/quote/:hostId',       user_roles: HYPER,      module: 'reactivation', description: 'Get reactivation quote for any host (hyper only)' },
  { controller: 'EscrowController', endpoint: 'confirmReactivation',    method: 'POST',   endpoint_url: '/api/escrow/reactivation/confirm',             user_roles: HYPER,      module: 'reactivation', description: 'Hyper-admin confirms a reactivation payment' },
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

    for (const p of ESCROW_BACKEND_PERMISSIONS) {
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
    console.log(`✅ Escrow backend permissions seed complete`);
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
