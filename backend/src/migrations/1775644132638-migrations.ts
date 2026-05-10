import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775644132638 implements MigrationInterface {
    name = 'Migrations1775644132638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_userId\` ON \`badge_users\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`unlockedAt\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`, \`badgeId\`, \`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_userId\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` ADD CONSTRAINT \`FK_a1d89c9aad02c9fa049bf5f9a6d\` FOREIGN KEY (\`backendPermissionId\`) REFERENCES \`rbac_backend_permissions\`(\`permission_key\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD CONSTRAINT \`FK_7b5dcfef06b1d7e8a2dcd984737\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD CONSTRAINT \`FK_fe1ea9422b1498bc96e2a720cca\` FOREIGN KEY (\`badgeId\`) REFERENCES \`badges\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP FOREIGN KEY \`FK_fe1ea9422b1498bc96e2a720cca\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP FOREIGN KEY \`FK_7b5dcfef06b1d7e8a2dcd984737\``);
        await queryRunner.query(`ALTER TABLE \`rbac_permission_bindings\` DROP FOREIGN KEY \`FK_a1d89c9aad02c9fa049bf5f9a6d\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_userId\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`unlockedAt\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`id\`, \`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_userId\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\` (\`userId\`)`);
    }

}
