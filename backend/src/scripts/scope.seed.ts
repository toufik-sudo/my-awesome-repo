/**
 * Scope Seed Script
 *
 * Seeds initial scoped permissions for manager_permissions, hyper_manager_permissions, and guest_permissions.
 * All permissions default to scope='all' (global).
 *
 * Run: npx ts-node -r tsconfig-paths/register src/scripts/scope.seed.ts
 */

import { DataSource } from 'typeorm';

// ─── All backend permission keys that can be scoped ──────────────────────────

const MANAGER_PERMISSION_KEYS = [
  // Property management
  'backend.PropertiesController.create.POST',
  'backend.PropertiesController.update.PUT',
  'backend.PropertiesController.delete.DELETE',
  'backend.PropertiesController.findOne.GET',
  'backend.PropertiesController.findAll.GET',
  // Service management
  'backend.ServicesController.create.POST',
  'backend.ServicesController.update.PUT',
  'backend.ServicesController.delete.DELETE',
  'backend.ServicesController.findOne.GET',
  'backend.ServicesController.findAll.GET',
  // Booking management
  'backend.BookingsController.findAll.GET',
  'backend.BookingsController.accept.PUT',
  'backend.BookingsController.reject.PUT',
  'backend.BookingsController.cancel.PUT',
  // Communication
  'backend.ChatController.sendMessage.POST',
  'backend.ChatController.getMessages.GET',
  'backend.ReviewsController.reply.POST',
  // Analytics
  'backend.AnalyticsController.getStats.GET',
  // Photos & pricing
  'backend.PropertiesController.updatePhotos.PUT',
  'backend.PropertiesController.updatePrices.PUT',
  'backend.PropertiesController.updateAvailability.PUT',
];

const HYPER_MANAGER_PERMISSION_KEYS = [
  ...MANAGER_PERMISSION_KEYS,
  // Special hyper-manager capabilities
  'backend.PaymentsController.validate.POST',
  'backend.VerificationController.verify.POST',
  'backend.ServiceFeeController.findAll.GET',
  'backend.ServiceFeeController.delete.DELETE',
  'backend.CancellationRuleController.findAll.GET',
  'backend.CancellationRuleController.delete.DELETE',
  'backend.HostFeeAbsorptionController.findAll.GET',
  'backend.HostFeeAbsorptionController.delete.DELETE',
  // User management
  'backend.RolesController.getAllUsers.GET',
  'backend.RolesController.updateUserStatus.PUT',
  'backend.RolesController.deleteUser.DELETE',
  // Hyper management
  'backend.HyperManagementController.pauseProperty.PUT',
  'backend.HyperManagementController.resumeProperty.PUT',
  'backend.HyperManagementController.archiveProperty.DELETE',
  'backend.HyperManagementController.deleteProperty.DELETE',
  'backend.HyperManagementController.pauseService.PUT',
  'backend.HyperManagementController.resumeService.PUT',
  'backend.HyperManagementController.archiveService.DELETE',
  'backend.HyperManagementController.deleteService.DELETE',
  'backend.HyperManagementController.pauseUser.PUT',
  'backend.HyperManagementController.resumeUser.PUT',
  'backend.HyperManagementController.archiveUser.DELETE',
  'backend.HyperManagementController.reactivateUser.PUT',
];

const GUEST_PERMISSION_KEYS = [
  // Read-only access
  'backend.PropertiesController.findOne.GET',
  'backend.PropertiesController.findAll.GET',
  'backend.ServicesController.findOne.GET',
  'backend.ServicesController.findAll.GET',
  'backend.BookingsController.findAll.GET',
  'backend.BookingsController.findOne.GET',
  'backend.ReviewsController.findAll.GET',
  'backend.ChatController.getMessages.GET',
  'backend.AnalyticsController.getStats.GET',
];

// ─── Seed function ───────────────────────────────────────────────────────────

async function seedScopes(ds: DataSource) {
  const qr = ds.createQueryRunner();

  try {
    await qr.startTransaction();

    // Seed manager_permissions scope template (scope = 'all')
    let managerCount = 0;
    for (const key of MANAGER_PERMISSION_KEYS) {
      const existing = await qr.query(
        `SELECT id FROM manager_permissions WHERE "backendPermissionKey" = $1 AND "managerId" = 0`,
        [key],
      );
      if (existing.length === 0) {
        await qr.query(
          `INSERT INTO manager_permissions (id, "managerId", "assignedById", "backendPermissionKey", scope, "isGranted", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), 0, 0, $1, 'all', true, NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [key],
        );
        managerCount++;
      }
    }

    // Seed hyper_manager_permissions scope template (scope = 'all')
    let hyperCount = 0;
    for (const key of HYPER_MANAGER_PERMISSION_KEYS) {
      const existing = await qr.query(
        `SELECT id FROM hyper_manager_permissions WHERE "backendPermissionKey" = $1 AND "hyperManagerId" = 0`,
        [key],
      );
      if (existing.length === 0) {
        await qr.query(
          `INSERT INTO hyper_manager_permissions (id, "hyperManagerId", "assignedById", "backendPermissionKey", scope, "isGranted", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), 0, 0, $1, 'all', true, NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [key],
        );
        hyperCount++;
      }
    }

    // Seed guest_permissions scope template (scope = 'all')
    let guestCount = 0;
    for (const key of GUEST_PERMISSION_KEYS) {
      const existing = await qr.query(
        `SELECT id FROM guest_permissions WHERE "backendPermissionKey" = $1 AND "guestId" = 0`,
        [key],
      );
      if (existing.length === 0) {
        await qr.query(
          `INSERT INTO guest_permissions (id, "guestId", "assignedById", "backendPermissionKey", scope, "isGranted", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), 0, 0, $1, 'all', true, NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [key],
        );
        guestCount++;
      }
    }

    await qr.commitTransaction();

    console.log(`✅ Scope seed complete:`);
    console.log(`   Manager permissions:       ${managerCount} new / ${MANAGER_PERMISSION_KEYS.length} total`);
    console.log(`   Hyper Manager permissions:  ${hyperCount} new / ${HYPER_MANAGER_PERMISSION_KEYS.length} total`);
    console.log(`   Guest permissions:          ${guestCount} new / ${GUEST_PERMISSION_KEYS.length} total`);

  } catch (error) {
    await qr.rollbackTransaction();
    console.error('❌ Scope seed failed:', error);
    throw error;
  } finally {
    await qr.release();
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

async function main() {
  const { config } = await import('dotenv');
  config({ path: '.env' });

  const { DataSource } = await import('typeorm');

  const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await seedScopes(AppDataSource);
  await AppDataSource.destroy();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

export { seedScopes, MANAGER_PERMISSION_KEYS, HYPER_MANAGER_PERMISSION_KEYS, GUEST_PERMISSION_KEYS };
