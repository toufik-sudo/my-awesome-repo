import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbSchemaRestructuring1773300000000 implements MigrationInterface {
  name = 'DbSchemaRestructuring1773300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ═══════════════════════════════════════════════════════════════════
    // 1. DROP TABLES: user_roles, manager_assignments, property_group_memberships,
    //    service_group_memberships, user_badges
    // ═══════════════════════════════════════════════════════════════════

    // Drop FKs before dropping tables
    await queryRunner.query(`ALTER TABLE \`manager_assignments\` DROP FOREIGN KEY IF EXISTS \`FK_89bf0c2c003b0888088b2fbeaa7\``);
    await queryRunner.query(`ALTER TABLE \`manager_assignments\` DROP FOREIGN KEY IF EXISTS \`FK_a481b85a26542b303daf1299603\``);
    await queryRunner.query(`ALTER TABLE \`manager_assignments\` DROP FOREIGN KEY IF EXISTS \`FK_e9ceb07f2116e7d89fdc718a586\``);
    await queryRunner.query(`ALTER TABLE \`manager_assignments\` DROP FOREIGN KEY IF EXISTS \`FK_5d989ea14604459b64788db8c63\``);
    await queryRunner.query(`ALTER TABLE \`property_group_memberships\` DROP FOREIGN KEY IF EXISTS \`FK_1e49e229423390107900cad0054\``);
    await queryRunner.query(`ALTER TABLE \`property_group_memberships\` DROP FOREIGN KEY IF EXISTS \`FK_abd19027800f0198931c5295407\``);
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY IF EXISTS \`FK_472b25323af01488f1f66a06b67\``);

    await queryRunner.query(`DROP TABLE IF EXISTS \`manager_assignments\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`property_group_memberships\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`service_group_memberships\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_badges\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user_roles\``);

    // ═══════════════════════════════════════════════════════════════════
    // 2. CREATE NEW TABLES
    // ═══════════════════════════════════════════════════════════════════

    // property_group_properties (M2M join table for PropertyGroup ↔ Property)
    await queryRunner.query(`
      CREATE TABLE \`property_group_properties\` (
        \`groupId\` varchar(36) NOT NULL,
        \`propertyId\` varchar(36) NOT NULL,
        PRIMARY KEY (\`groupId\`, \`propertyId\`),
        INDEX \`IDX_pgp_groupId\` (\`groupId\`),
        INDEX \`IDX_pgp_propertyId\` (\`propertyId\`),
        CONSTRAINT \`FK_pgp_group\` FOREIGN KEY (\`groupId\`) REFERENCES \`property_groups\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_pgp_property\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // service_group_services (M2M join table for ServiceGroup ↔ TourismService)
    await queryRunner.query(`
      CREATE TABLE \`service_group_services\` (
        \`groupId\` varchar(36) NOT NULL,
        \`serviceId\` varchar(36) NOT NULL,
        PRIMARY KEY (\`groupId\`, \`serviceId\`),
        INDEX \`IDX_sgs_groupId\` (\`groupId\`),
        INDEX \`IDX_sgs_serviceId\` (\`serviceId\`),
        CONSTRAINT \`FK_sgs_group\` FOREIGN KEY (\`groupId\`) REFERENCES \`service_groups\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_sgs_service\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // badge_users (replaces user_badges with direct M2M + unlockedAt)
    await queryRunner.query(`
      CREATE TABLE \`badge_users\` (
        \`id\` varchar(36) NOT NULL,
        \`userId\` int NOT NULL,
        \`badgeId\` varchar(36) NOT NULL,
        \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_badge_users_userId\` (\`userId\`),
        INDEX \`IDX_badge_users_badgeId\` (\`badgeId\`),
        CONSTRAINT \`FK_badge_users_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_badge_users_badge\` FOREIGN KEY (\`badgeId\`) REFERENCES \`badges\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // comment_services
    await queryRunner.query(`
      CREATE TABLE \`comment_services\` (
        \`id\` varchar(36) NOT NULL,
        \`content\` text NOT NULL,
        \`userId\` int NOT NULL,
        \`serviceBookingId\` varchar(36) NOT NULL,
        \`parentId\` varchar(36) NULL,
        \`media\` text NULL,
        \`isEdited\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_comment_services_userId\` (\`userId\`),
        INDEX \`IDX_comment_services_serviceBookingId\` (\`serviceBookingId\`),
        CONSTRAINT \`FK_cs_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_cs_booking\` FOREIGN KEY (\`serviceBookingId\`) REFERENCES \`service_bookings\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_cs_parent\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment_services\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // service_favorites
    await queryRunner.query(`
      CREATE TABLE \`service_favorites\` (
        \`id\` varchar(36) NOT NULL,
        \`userId\` int NOT NULL,
        \`serviceId\` varchar(36) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_sf_unique\` (\`userId\`, \`serviceId\`),
        INDEX \`IDX_service_favorites_userId\` (\`userId\`),
        INDEX \`IDX_service_favorites_serviceId\` (\`serviceId\`),
        CONSTRAINT \`FK_sf_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_sf_service\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // ═══════════════════════════════════════════════════════════════════
    // 3. ADD FK RELATIONS TO EXISTING TABLES
    // ═══════════════════════════════════════════════════════════════════

    // comments: add bookingId, parentId FK
    await queryRunner.query(`ALTER TABLE \`comments\` ADD COLUMN IF NOT EXISTS \`bookingId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN IF EXISTS \`targetType\``);
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN IF EXISTS \`targetId\``);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_comments_bookingId\` ON \`comments\` (\`bookingId\`)`);
    await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_comments_booking\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_comments_parent\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE`);

    // reactions: restructure to commentId FK
    await queryRunner.query(`ALTER TABLE \`reactions\` ADD COLUMN IF NOT EXISTS \`commentId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`reactions\` DROP INDEX IF EXISTS \`IDX_reactions_unique\``);
    await queryRunner.query(`ALTER TABLE \`reactions\` DROP COLUMN IF EXISTS \`targetType\``);
    await queryRunner.query(`ALTER TABLE \`reactions\` DROP COLUMN IF EXISTS \`targetId\``);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_reactions_commentId\` ON \`reactions\` (\`commentId\`)`);
    await queryRunner.query(`ALTER TABLE \`reactions\` ADD CONSTRAINT \`FK_reactions_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`reactions\` ADD CONSTRAINT \`FK_reactions_comment\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE`);

    // rankings: add user FK
    await queryRunner.query(`ALTER TABLE \`rankings\` ADD CONSTRAINT \`FK_rankings_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);

    // reviews: add serviceId, serviceBookingId
    await queryRunner.query(`ALTER TABLE \`reviews\` ADD COLUMN IF NOT EXISTS \`serviceId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`reviews\` ADD COLUMN IF NOT EXISTS \`serviceBookingId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`reviews\` MODIFY \`propertyId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`reviews\` MODIFY \`bookingId\` varchar(36) NULL`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_reviews_serviceId\` ON \`reviews\` (\`serviceId\`)`);
    await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_reviews_service\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_reviews_serviceBooking\` FOREIGN KEY (\`serviceBookingId\`) REFERENCES \`service_bookings\`(\`id\`) ON DELETE CASCADE`);

    // cancellation_rules: add FKs
    await queryRunner.query(`ALTER TABLE \`cancellation_rules\` ADD CONSTRAINT \`FK_cr_host\` FOREIGN KEY (\`hostUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`cancellation_rules\` ADD CONSTRAINT \`FK_cr_propGroup\` FOREIGN KEY (\`targetPropertyGroupId\`) REFERENCES \`property_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`cancellation_rules\` ADD CONSTRAINT \`FK_cr_svcGroup\` FOREIGN KEY (\`targetServiceGroupId\`) REFERENCES \`service_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`cancellation_rules\` ADD CONSTRAINT \`FK_cr_property\` FOREIGN KEY (\`targetPropertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`cancellation_rules\` ADD CONSTRAINT \`FK_cr_service\` FOREIGN KEY (\`targetServiceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE SET NULL`);

    // host_fee_absorptions: add FKs
    await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD CONSTRAINT \`FK_hfa_propGroup\` FOREIGN KEY (\`targetPropertyGroupId\`) REFERENCES \`property_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD CONSTRAINT \`FK_hfa_svcGroup\` FOREIGN KEY (\`targetServiceGroupId\`) REFERENCES \`service_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD CONSTRAINT \`FK_hfa_property\` FOREIGN KEY (\`targetPropertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`host_fee_absorptions\` ADD CONSTRAINT \`FK_hfa_service\` FOREIGN KEY (\`targetServiceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE SET NULL`);

    // points_rules: add FKs
    await queryRunner.query(`ALTER TABLE \`points_rules\` ADD CONSTRAINT \`FK_pr_creator\` FOREIGN KEY (\`createdByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`points_rules\` ADD CONSTRAINT \`FK_pr_host\` FOREIGN KEY (\`targetHostId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`points_rules\` ADD CONSTRAINT \`FK_pr_propGroup\` FOREIGN KEY (\`targetPropertyGroupId\`) REFERENCES \`property_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`points_rules\` ADD CONSTRAINT \`FK_pr_svcGroup\` FOREIGN KEY (\`targetServiceGroupId\`) REFERENCES \`service_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`points_rules\` ADD CONSTRAINT \`FK_pr_property\` FOREIGN KEY (\`targetPropertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`points_rules\` ADD CONSTRAINT \`FK_pr_service\` FOREIGN KEY (\`targetServiceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE SET NULL`);

    // service_fee_rules: add FKs
    await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD CONSTRAINT \`FK_sfr_creator\` FOREIGN KEY (\`createdByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD CONSTRAINT \`FK_sfr_host\` FOREIGN KEY (\`targetHostId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD CONSTRAINT \`FK_sfr_propGroup\` FOREIGN KEY (\`targetPropertyGroupId\`) REFERENCES \`property_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD CONSTRAINT \`FK_sfr_svcGroup\` FOREIGN KEY (\`targetServiceGroupId\`) REFERENCES \`service_groups\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD CONSTRAINT \`FK_sfr_property\` FOREIGN KEY (\`targetPropertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE \`service_fee_rules\` ADD CONSTRAINT \`FK_sfr_service\` FOREIGN KEY (\`targetServiceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE SET NULL`);

    // property_shares: add FK to properties
    await queryRunner.query(`ALTER TABLE \`property_shares\` ADD CONSTRAINT \`FK_ps_property\` FOREIGN KEY (\`propertyId\`) REFERENCES \`properties\`(\`id\`) ON DELETE CASCADE`);

    // verification_documents: add uploadedByUserId + reviewer FK
    await queryRunner.query(`ALTER TABLE \`verification_documents\` ADD COLUMN IF NOT EXISTS \`uploadedByUserId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`verification_documents\` ADD CONSTRAINT \`FK_vd_uploader\` FOREIGN KEY (\`uploadedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`verification_documents\` ADD CONSTRAINT \`FK_vd_reviewer\` FOREIGN KEY (\`reviewedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL`);

    // service_verification_documents: add uploadedByUserId + reviewer FK
    await queryRunner.query(`ALTER TABLE \`service_verification_documents\` ADD COLUMN IF NOT EXISTS \`uploadedByUserId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`service_verification_documents\` ADD CONSTRAINT \`FK_svd_uploader\` FOREIGN KEY (\`uploadedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`service_verification_documents\` ADD CONSTRAINT \`FK_svd_reviewer\` FOREIGN KEY (\`reviewedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL`);

    // users_address: add userId FK
    await queryRunner.query(`ALTER TABLE \`users_address\` ADD COLUMN IF NOT EXISTS \`userId\` int NULL`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_users_address_userId\` ON \`users_address\` (\`userId\`)`);
    await queryRunner.query(`ALTER TABLE \`users_address\` ADD CONSTRAINT \`FK_ua_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE`);

    // payment_receipts: add serviceBookingId FK
    await queryRunner.query(`ALTER TABLE \`payment_receipts\` ADD COLUMN IF NOT EXISTS \`serviceBookingId\` varchar(36) NULL`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS \`IDX_payment_receipts_serviceBookingId\` ON \`payment_receipts\` (\`serviceBookingId\`)`);
    await queryRunner.query(`ALTER TABLE \`payment_receipts\` ADD CONSTRAINT \`FK_pr_serviceBooking\` FOREIGN KEY (\`serviceBookingId\`) REFERENCES \`service_bookings\`(\`id\`) ON DELETE CASCADE`);

    // rbac_permission_bindings: restructure to use FK IDs
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` ADD COLUMN IF NOT EXISTS \`backendPermissionId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` ADD COLUMN IF NOT EXISTS \`frontendPermissionId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` DROP COLUMN IF EXISTS \`ui_permission_key\``);
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` ADD CONSTRAINT \`FK_rpb_backend\` FOREIGN KEY (\`backendPermissionId\`) REFERENCES \`rbac_backend_permissions\`(\`id\`) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` ADD CONSTRAINT \`FK_rpb_frontend\` FOREIGN KEY (\`frontendPermissionId\`) REFERENCES \`rbac_frontend_permissions\`(\`id\`) ON DELETE CASCADE`);

    // manager_permissions: add FK to rbac_backend_permissions + rbac_frontend_permissions
    await queryRunner.query(`ALTER TABLE \`manager_permissions\` ADD CONSTRAINT \`FK_mp_backend_perm\` FOREIGN KEY (\`backendPermissionKey\`) REFERENCES \`rbac_backend_permissions\`(\`permission_key\`) ON DELETE CASCADE`);

    // hyper_manager_permissions: add FK
    await queryRunner.query(`ALTER TABLE \`hyper_manager_permissions\` ADD CONSTRAINT \`FK_hmp_backend_perm\` FOREIGN KEY (\`backendPermissionKey\`) REFERENCES \`rbac_backend_permissions\`(\`permission_key\`) ON DELETE CASCADE`);

    // guest_permissions: add FK
    await queryRunner.query(`ALTER TABLE \`guest_permissions\` ADD CONSTRAINT \`FK_gp_backend_perm\` FOREIGN KEY (\`backendPermissionKey\`) REFERENCES \`rbac_backend_permissions\`(\`permission_key\`) ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order: drop new FKs, restore old tables
    // This is a complex migration — down is best-effort
    await queryRunner.query(`ALTER TABLE \`guest_permissions\` DROP FOREIGN KEY IF EXISTS \`FK_gp_backend_perm\``);
    await queryRunner.query(`ALTER TABLE \`hyper_manager_permissions\` DROP FOREIGN KEY IF EXISTS \`FK_hmp_backend_perm\``);
    await queryRunner.query(`ALTER TABLE \`manager_permissions\` DROP FOREIGN KEY IF EXISTS \`FK_mp_backend_perm\``);
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` DROP FOREIGN KEY IF EXISTS \`FK_rpb_frontend\``);
    await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` DROP FOREIGN KEY IF EXISTS \`FK_rpb_backend\``);
    await queryRunner.query(`ALTER TABLE \`payment_receipts\` DROP FOREIGN KEY IF EXISTS \`FK_pr_serviceBooking\``);
    await queryRunner.query(`ALTER TABLE \`users_address\` DROP FOREIGN KEY IF EXISTS \`FK_ua_user\``);
    await queryRunner.query(`ALTER TABLE \`service_verification_documents\` DROP FOREIGN KEY IF EXISTS \`FK_svd_reviewer\``);
    await queryRunner.query(`ALTER TABLE \`service_verification_documents\` DROP FOREIGN KEY IF EXISTS \`FK_svd_uploader\``);
    await queryRunner.query(`ALTER TABLE \`verification_documents\` DROP FOREIGN KEY IF EXISTS \`FK_vd_reviewer\``);
    await queryRunner.query(`ALTER TABLE \`verification_documents\` DROP FOREIGN KEY IF EXISTS \`FK_vd_uploader\``);
    await queryRunner.query(`ALTER TABLE \`property_shares\` DROP FOREIGN KEY IF EXISTS \`FK_ps_property\``);
    await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY IF EXISTS \`FK_reviews_serviceBooking\``);
    await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY IF EXISTS \`FK_reviews_service\``);
    await queryRunner.query(`ALTER TABLE \`rankings\` DROP FOREIGN KEY IF EXISTS \`FK_rankings_user\``);
    await queryRunner.query(`ALTER TABLE \`reactions\` DROP FOREIGN KEY IF EXISTS \`FK_reactions_comment\``);
    await queryRunner.query(`ALTER TABLE \`reactions\` DROP FOREIGN KEY IF EXISTS \`FK_reactions_user\``);
    await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY IF EXISTS \`FK_comments_parent\``);
    await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY IF EXISTS \`FK_comments_booking\``);

    await queryRunner.query(`DROP TABLE IF EXISTS \`service_favorites\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`comment_services\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`badge_users\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`service_group_services\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`property_group_properties\``);
  }
}
