import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775311327966 implements MigrationInterface {
    name = 'Migrations1775311327966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '🎁'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rewards\` CHANGE \`icon\` \`icon\` varchar(10) NOT NULL DEFAULT '?'`);
    }

}
