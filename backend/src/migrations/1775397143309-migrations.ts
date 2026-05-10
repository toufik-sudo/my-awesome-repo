import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775397143309 implements MigrationInterface {
    name = 'Migrations1775397143309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rbac_frontend_permissions\` (\`id\` varchar(36) NOT NULL, \`role\` varchar(20) NOT NULL, \`ui_key\` varchar(100) NOT NULL, \`permission_key\` varchar(80) NOT NULL, \`allowed\` tinyint NOT NULL DEFAULT 1, \`conditions\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_5a5992fca36e2f96a8dcfc30ac\` (\`permission_key\`), INDEX \`IDX_621c81f0e84eaee7ba041536c0\` (\`role\`), UNIQUE INDEX \`IDX_c8a4873159c0d348f0ae5b6750\` (\`role\`, \`ui_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_backend_permissions\` (\`id\` varchar(36) NOT NULL, \`role\` varchar(20) NOT NULL, \`resource\` varchar(50) NOT NULL, \`action\` varchar(30) NOT NULL, \`permission_key\` varchar(80) NOT NULL, \`scope\` varchar(20) NOT NULL DEFAULT 'global', \`allowed\` tinyint NOT NULL DEFAULT 1, \`conditions\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_be592dee1a85e397f8255a9e66\` (\`resource\`, \`action\`), INDEX \`IDX_b4c71ba5b1c0cd81c3aa4006b8\` (\`role\`), UNIQUE INDEX \`IDX_c8de7526a599aea40d63789e37\` (\`role\`, \`permission_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
        await queryRunner.query(`DROP INDEX \`IDX_c8de7526a599aea40d63789e37\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_b4c71ba5b1c0cd81c3aa4006b8\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_be592dee1a85e397f8255a9e66\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP TABLE \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_c8a4873159c0d348f0ae5b6750\` ON \`rbac_frontend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_621c81f0e84eaee7ba041536c0\` ON \`rbac_frontend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a5992fca36e2f96a8dcfc30ac\` ON \`rbac_frontend_permissions\``);
        await queryRunner.query(`DROP TABLE \`rbac_frontend_permissions\``);
    }

}
