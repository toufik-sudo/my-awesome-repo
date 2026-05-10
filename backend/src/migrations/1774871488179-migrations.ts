import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1774871488179 implements MigrationInterface {
    name = 'Migrations1774871488179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_verification_documents\` (\`id\` varchar(36) NOT NULL, \`serviceId\` varchar(255) NOT NULL, \`type\` varchar(30) NOT NULL, \`fileName\` varchar(255) NOT NULL, \`fileUrl\` varchar(500) NOT NULL, \`status\` varchar(20) NOT NULL DEFAULT 'pending', \`reviewNote\` text NULL, \`reviewedBy\` int NULL, \`reviewedAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_svc_docs_serviceId\` (\`serviceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_verification_documents\` ADD CONSTRAINT \`FK_4f16286a4ed5865e0aded658fc0\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_verification_documents\` DROP FOREIGN KEY \`FK_4f16286a4ed5865e0aded658fc0\``);
        await queryRunner.query(`DROP INDEX \`IDX_svc_docs_serviceId\` ON \`service_verification_documents\``);
        await queryRunner.query(`DROP TABLE \`service_verification_documents\``);
    }

}
