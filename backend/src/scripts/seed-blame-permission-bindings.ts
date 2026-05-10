/**
 * Additive seed for permission bindings (frontend API → backend permission key)
 * for the new user-blames endpoints.
 *
 * ⚠️ NEVER OVERWRITES existing rows — uses INSERT IGNORE on
 *    (frontend_permission_api, backend_permission_key).
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-blame-permission-bindings.ts
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

export const BLAME_PERMISSION_BINDING_SEED: Array<{
  frontendPermissionApi: string;
  backendPermissionKey: string;
  module: string;
}> = [
  // user-blames REST surface used by BlamesAdminPage and NonSeriousBadge
  { frontendPermissionApi: 'userBlamesApi.getPublic.GET',  backendPermissionKey: 'backend.UserBlameController.getPublic.GET',  module: 'blames' },
  { frontendPermissionApi: 'userBlamesApi.getCounts.GET',  backendPermissionKey: 'backend.UserBlameController.getCounts.GET',  module: 'blames' },
  { frontendPermissionApi: 'userBlamesApi.getMine.GET',    backendPermissionKey: 'backend.UserBlameController.myBlames.GET',   module: 'blames' },
  { frontendPermissionApi: 'userBlamesApi.list.GET',       backendPermissionKey: 'backend.UserBlameController.list.GET',       module: 'blames' },
  { frontendPermissionApi: 'userBlamesApi.create.POST',    backendPermissionKey: 'backend.UserBlameController.create.POST',    module: 'blames' },
  { frontendPermissionApi: 'userBlamesApi.remove.DELETE',  backendPermissionKey: 'backend.UserBlameController.remove.DELETE',  module: 'blames' },
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

    for (const b of BLAME_PERMISSION_BINDING_SEED) {
      try {
        const result: any = await qr.query(
          `INSERT IGNORE INTO rbac_permission_bindings
            (id, frontend_permission_api, backend_permission_key, module)
           VALUES
            (UUID(), ?, ?, ?)`,
          [b.frontendPermissionApi, b.backendPermissionKey, b.module],
        );
        if (result?.affectedRows > 0) inserted++;
        else skipped++;
      } catch (err: any) {
        errors.push(`${b.frontendPermissionApi} → ${b.backendPermissionKey}: ${err.message}`);
      }
    }

    await qr.commitTransaction();
    console.log(`✅ Blame permission bindings seed complete`);
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
