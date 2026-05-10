import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775600711903 implements MigrationInterface {
    name = 'Migrations1775600711903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP FOREIGN KEY \`FK_e71b81457fc37b486d72afb112f\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP FOREIGN KEY \`FK_7b5dcfef06b1d7e8a2dcd984737\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP FOREIGN KEY \`FK_fe1ea9422b1498bc96e2a720cca\``);
        await queryRunner.query(`DROP INDEX \`IDX_f5639b6372cd261e97e7e76e4e\` ON \`rbac_permission_bindings\``);
        await queryRunner.query(`DROP INDEX \`IDX_b69e26a7c20d52359b4faebdc0\` ON \`reactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_reactions_commentId\` ON \`reactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_userId\` ON \`badge_users\``);
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`userId\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`unlockedAt\``);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD \`targetType\` varchar(50) NOT NULL DEFAULT 'comment'`);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD \`targetId\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`userId\`, \`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`targetType\` varchar(50) NOT NULL DEFAULT 'property'`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`targetId\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_087f019df0fee33889eb038fe53\``);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`bookingId\` \`bookingId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`, \`badgeId\`, \`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_reactions_targetType\` ON \`reactions\` (\`targetType\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_reactions_targetId\` ON \`reactions\` (\`targetId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_989f04b0d4b2c2513421b05aea\` ON \`reactions\` (\`userId\`, \`targetType\`, \`targetId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_userId\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_comments_targetType\` ON \`comments\` (\`targetType\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_comments_targetId\` ON \`comments\` (\`targetId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD CONSTRAINT \`FK_7b5dcfef06b1d7e8a2dcd984737\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD CONSTRAINT \`FK_fe1ea9422b1498bc96e2a720cca\` FOREIGN KEY (\`badgeId\`) REFERENCES \`badges\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_087f019df0fee33889eb038fe53\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_087f019df0fee33889eb038fe53\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP FOREIGN KEY \`FK_fe1ea9422b1498bc96e2a720cca\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP FOREIGN KEY \`FK_7b5dcfef06b1d7e8a2dcd984737\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_comments_targetId\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_comments_targetType\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_userId\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_989f04b0d4b2c2513421b05aea\` ON \`reactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_reactions_targetId\` ON \`reactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_reactions_targetType\` ON \`reactions\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`bookingId\` \`bookingId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_087f019df0fee33889eb038fe53\` FOREIGN KEY (\`bookingId\`) REFERENCES \`bookings\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`badgeId\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`badgeId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`userId\`, \`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`userId\`, \`badgeId\`, \`id\`)`);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`targetId\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`targetType\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`unlockedAt\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`userId\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP COLUMN \`targetId\``);
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP COLUMN \`targetType\``);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD PRIMARY KEY (\`userId\`, \`id\`, \`badgeId\`)`);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD \`commentId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_userId\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_badge_users_badgeId\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_fe1ea9422b1498bc96e2a720cc\` ON \`badge_users\` (\`badgeId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_7b5dcfef06b1d7e8a2dcd98473\` ON \`badge_users\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_reactions_commentId\` ON \`reactions\` (\`commentId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b69e26a7c20d52359b4faebdc0\` ON \`reactions\` (\`userId\`, \`commentId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f5639b6372cd261e97e7e76e4e\` ON \`rbac_permission_bindings\` (\`backendPermissionId\`, \`frontendPermissionApi\`)`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD CONSTRAINT \`FK_fe1ea9422b1498bc96e2a720cca\` FOREIGN KEY (\`badgeId\`) REFERENCES \`badges\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`badge_users\` ADD CONSTRAINT \`FK_7b5dcfef06b1d7e8a2dcd984737\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD CONSTRAINT \`FK_e71b81457fc37b486d72afb112f\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
