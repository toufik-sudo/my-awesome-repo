/**
 * permissions:sync — Lifecycle sync script
 *
 * Reads the permission-registry and upserts all entries into:
 *   - rbac_backend_permissions
 *   - rbac_frontend_permissions
 *   - rbac_permission_bindings
 *
 * Then invalidates Redis cache keys and emits RBAC_UPDATED.
 *
 * Usage: npx ts-node backend/src/scripts/permissions-sync.ts
 *        or: npm run permissions:sync
 */
import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import {
  BACKEND_PERMISSIONS,
  FRONTEND_PERMISSIONS,
  PERMISSION_BINDINGS,
} from '../rbac/permission-registry';
import Redis from 'ioredis';

dotenvConfig({ path: '.env' });

const ROLES = ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];

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

async function main() {
  await AppDataSource.initialize();
  const qr = AppDataSource.createQueryRunner();
  await qr.connect();

  console.log('═══ RBAC Permission Sync ═══\n');

  let backendCreated = 0;
  let backendSkipped = 0;
  let frontendCreated = 0;
  let frontendSkipped = 0;
  let bindingsCreated = 0;
  let bindingsSkipped = 0;
  const conflicts: string[] = [];

  // ─── Backend permissions ──────────────────────────────────────────────────
  console.log('▶ Syncing backend permissions…');
  for (const perm of BACKEND_PERMISSIONS) {
    for (const role of ROLES) {
      try {
        const exists = await qr.query(
          `SELECT id FROM rbac_backend_permissions WHERE role = ? AND permission_key = ?`,
          [role, perm.key],
        );
        if (exists.length > 0) {
          backendSkipped++;
          continue;
        }
        await qr.query(
          `INSERT INTO rbac_backend_permissions (id, role, resource, action, permission_key, scope, allowed, conditions, created_at, updated_at)
           VALUES (UUID(), ?, ?, ?, ?, 'global', true, NULL, NOW(), NOW())`,
          [role, perm.resource, perm.action, perm.key],
        );
        backendCreated++;
      } catch (e: any) {
        conflicts.push(`Backend [${role}:${perm.key}]: ${e.message}`);
      }
    }
  }
  console.log(`  ✓ Created: ${backendCreated} | Skipped: ${backendSkipped}`);

  // ─── Frontend permissions ─────────────────────────────────────────────────
  console.log('▶ Syncing frontend permissions…');
  for (const perm of FRONTEND_PERMISSIONS) {
    for (const role of ROLES) {
      try {
        const exists = await qr.query(
          `SELECT id FROM rbac_frontend_permissions WHERE role = ? AND ui_key = ?`,
          [role, perm.key],
        );
        if (exists.length > 0) {
          frontendSkipped++;
          continue;
        }
        await qr.query(
          `INSERT INTO rbac_frontend_permissions (id, role, ui_key, permission_key, allowed, conditions, created_at, updated_at)
           VALUES (UUID(), ?, ?, ?, true, NULL, NOW(), NOW())`,
          [role, perm.key, perm.key],
        );
        frontendCreated++;
      } catch (e: any) {
        conflicts.push(`Frontend [${role}:${perm.key}]: ${e.message}`);
      }
    }
  }
  console.log(`  ✓ Created: ${frontendCreated} | Skipped: ${frontendSkipped}`);

  // ─── Bindings ─────────────────────────────────────────────────────────────
  console.log('▶ Syncing bindings…');
  for (const binding of PERMISSION_BINDINGS) {
    try {
      const exists = await qr.query(
        `SELECT id FROM rbac_permission_bindings WHERE api_permission_key = ? AND ui_permission_key = ?`,
        [binding.apiPermissionKey, binding.uiPermissionKey],
      );
      if (exists.length > 0) {
        bindingsSkipped++;
        continue;
      }
      await qr.query(
        `INSERT INTO rbac_permission_bindings (id, api_permission_key, ui_permission_key, module, created_at)
         VALUES (UUID(), ?, ?, ?, NOW())`,
        [binding.apiPermissionKey, binding.uiPermissionKey, binding.module],
      );
      bindingsCreated++;
    } catch (e: any) {
      conflicts.push(`Binding [${binding.apiPermissionKey}↔${binding.uiPermissionKey}]: ${e.message}`);
    }
  }
  console.log(`  ✓ Created: ${bindingsCreated} | Skipped: ${bindingsSkipped}`);

  // ─── Redis invalidation ───────────────────────────────────────────────────
  console.log('\n▶ Invalidating Redis cache…');
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    });
    await redis.del('rbac:backend:permissions');
    await redis.del('rbac:frontend:permissions');
    await redis.del('rbac:bindings');
    await redis.publish('rbac:updated', JSON.stringify({ ts: Date.now(), source: 'permissions:sync' }));
    console.log('  ✓ Cache cleared + RBAC_UPDATED published');
    await redis.quit();
  } catch (e: any) {
    console.warn(`  ⚠ Redis unavailable (${e.message}) — cache not cleared`);
  }

  // ─── Report ───────────────────────────────────────────────────────────────
  console.log('\n═══ Summary ═══');
  console.log(`Backend:  ${backendCreated} created, ${backendSkipped} existing`);
  console.log(`Frontend: ${frontendCreated} created, ${frontendSkipped} existing`);
  console.log(`Bindings: ${bindingsCreated} created, ${bindingsSkipped} existing`);

  if (conflicts.length > 0) {
    console.log(`\n⚠ ${conflicts.length} conflicts:`);
    conflicts.forEach(c => console.log(`  - ${c}`));
  } else {
    console.log('\n✅ No conflicts.');
  }

  await qr.release();
  await AppDataSource.destroy();
  process.exit(conflicts.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
