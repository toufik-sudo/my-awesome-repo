import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775227286673 implements MigrationInterface {
    name = 'Migrations1775227286673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
        await queryRunner.query(`ALTER TABLE \`properties\` CHANGE \`latitude\` \`latitude\` decimal(10,7) NULL`);
        await queryRunner.query(`ALTER TABLE \`properties\` CHANGE \`longitude\` \`longitude\` decimal(10,7) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`properties\` CHANGE \`longitude\` \`longitude\` decimal(10,7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`properties\` CHANGE \`latitude\` \`latitude\` decimal(10,7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
    }

}
