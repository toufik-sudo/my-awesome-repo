import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775139209757 implements MigrationInterface {
    name = 'Migrations1775139209757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
    }

}
