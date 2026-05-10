import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775487988879 implements MigrationInterface {
    name = 'Migrations1775487988879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rbac_frontend_permissions\` (\`id\` varchar(36) NOT NULL, \`created_by\` varchar(255) NULL, \`permission_key\` varchar(200) NOT NULL, \`user_roles\` text NOT NULL, \`component\` varchar(100) NOT NULL, \`sub_view\` varchar(100) NULL, \`element_type\` varchar(50) NULL, \`action_name\` varchar(50) NULL, \`module\` varchar(50) NOT NULL DEFAULT 'general', \`description\` varchar(255) NULL, \`allowed\` tinyint NOT NULL DEFAULT 1, \`conditions\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_RBAC_CONFIG_FRONTEND_MODULE\` (\`module\`), UNIQUE INDEX \`IDX_5a5992fca36e2f96a8dcfc30ac\` (\`permission_key\`), UNIQUE INDEX \`IDX_RBAC_CONFIG_FRONTEND_PERMISSION_KEY\` (\`permission_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_backend_permissions\` (\`id\` varchar(36) NOT NULL, \`created_by\` varchar(255) NULL, \`permission_key\` varchar(200) NOT NULL, \`user_roles\` text NOT NULL, \`controller\` varchar(100) NOT NULL, \`endpoint\` varchar(100) NOT NULL, \`method\` varchar(10) NOT NULL, \`module\` varchar(50) NOT NULL DEFAULT 'general', \`description\` varchar(255) NULL, \`scope\` varchar(20) NOT NULL DEFAULT 'global', \`allowed\` tinyint NOT NULL DEFAULT 1, \`conditions\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_RBAC_CONFIG_BACKEND_MODULE\` (\`module\`), INDEX \`IDX_RBAC_CONFIG_BACKEND_CONTROLLER\` (\`controller\`), UNIQUE INDEX \`IDX_d7e463fdbd30d445a6aec068e9\` (\`permission_key\`), UNIQUE INDEX \`IDX_RBAC_CONFIG_BACKEND_PERMISSION_KEY\` (\`permission_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
        await queryRunner.query(`DROP INDEX \`IDX_RBAC_CONFIG_BACKEND_PERMISSION_KEY\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_d7e463fdbd30d445a6aec068e9\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_RBAC_CONFIG_BACKEND_CONTROLLER\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_RBAC_CONFIG_BACKEND_MODULE\` ON \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP TABLE \`rbac_backend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_RBAC_CONFIG_FRONTEND_PERMISSION_KEY\` ON \`rbac_frontend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a5992fca36e2f96a8dcfc30ac\` ON \`rbac_frontend_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_RBAC_CONFIG_FRONTEND_MODULE\` ON \`rbac_frontend_permissions\``);
        await queryRunner.query(`DROP TABLE \`rbac_frontend_permissions\``);
    }

}
