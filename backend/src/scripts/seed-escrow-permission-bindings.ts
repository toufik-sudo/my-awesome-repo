/**
 * Additive seed for escrow / disputes / payouts FRONTEND-API → BACKEND-PERMISSION bindings.
 *
 * ⚠️ NEVER OVERWRITES — uses INSERT IGNORE on the unique
 *    (backendPermissionId, frontendPermissionApi) index, so existing bindings
 *    are left as-is. Only missing pairs are inserted.
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-escrow-permission-bindings.ts
 */

import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

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

// Mirrors the keys used by src/modules/payments/escrow.api.ts (rbac('escrowApi.<fn>.<METHOD>'))
export const ESCROW_PERMISSION_BINDINGS: Array<{
  frontendPermissionApi: string;
  backendPermissionKey: string;
  module: string;
}> = [
  // Platform accounts
  { frontendPermissionApi: 'escrowApi.listPlatformAccountsForGuests.GET',       backendPermissionKey: 'backend.EscrowController.listForGuests.GET',          module: 'escrow' },
  { frontendPermissionApi: 'escrowApi.listPlatformAccountsForReactivation.GET', backendPermissionKey: 'backend.EscrowController.listForReactivation.GET',    module: 'escrow' },
  { frontendPermissionApi: 'escrowApi.listAllPlatformAccounts.GET',             backendPermissionKey: 'backend.EscrowController.listAll.GET',                module: 'escrow' },
  { frontendPermissionApi: 'escrowApi.upsertPlatformAccount.POST',              backendPermissionKey: 'backend.EscrowController.upsertPlatformAccount.POST', module: 'escrow' },
  { frontendPermissionApi: 'escrowApi.deletePlatformAccount.DELETE',            backendPermissionKey: 'backend.EscrowController.removePlatformAccount.DELETE', module: 'escrow' },

  // Payouts
  { frontendPermissionApi: 'escrowApi.listPayouts.GET',                         backendPermissionKey: 'backend.EscrowController.listPayouts.GET',            module: 'payouts' },

  // Disputes
  { frontendPermissionApi: 'escrowApi.openDispute.POST',                        backendPermissionKey: 'backend.EscrowController.openDispute.POST',           module: 'disputes' },
  { frontendPermissionApi: 'escrowApi.listDisputes.GET',                        backendPermissionKey: 'backend.EscrowController.listDisputes.GET',           module: 'disputes' },
  { frontendPermissionApi: 'escrowApi.getDisputeRefundStatus.GET',              backendPermissionKey: 'backend.EscrowController.getDisputeRefundStatus.GET', module: 'disputes' },
  { frontendPermissionApi: 'escrowApi.resolveDispute.PUT',                      backendPermissionKey: 'backend.EscrowController.resolveDispute.PUT',         module: 'disputes' },

  // Reactivation
  { frontendPermissionApi: 'escrowApi.getMyReactivationQuote.GET',              backendPermissionKey: 'backend.EscrowController.getMyQuote.GET',             module: 'reactivation' },
  { frontendPermissionApi: 'escrowApi.getReactivationQuoteForHost.GET',         backendPermissionKey: 'backend.EscrowController.getQuoteForHost.GET',        module: 'reactivation' },
  { frontendPermissionApi: 'escrowApi.confirmReactivation.POST',                backendPermissionKey: 'backend.EscrowController.confirmReactivation.POST',   module: 'reactivation' },
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

    for (const b of ESCROW_PERMISSION_BINDINGS) {
      try {
        const result: any = await qr.query(
          `INSERT IGNORE INTO rbac_permission_bindings
            (id, frontendPermissionApi, backendPermissionId, endpoint_url, module, created_at, updated_at)
           VALUES
            (UUID(), ?, ?, (SELECT endpoint_url FROM rbac_backend_permissions WHERE permission_key = ? LIMIT 1), ?, NOW(), NOW())`,
          [b.frontendPermissionApi, b.backendPermissionKey, b.backendPermissionKey, b.module],
        );
        if (result?.affectedRows > 0) inserted++;
        else skipped++;
      } catch (err: any) {
        errors.push(`${b.frontendPermissionApi} → ${b.backendPermissionKey}: ${err.message}`);
      }
    }

    await qr.commitTransaction();
    console.log(`✅ Escrow permission bindings seed complete`);
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
