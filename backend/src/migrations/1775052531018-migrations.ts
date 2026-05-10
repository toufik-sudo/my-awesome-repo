import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775052531018 implements MigrationInterface {
    name = 'Migrations1775052531018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cancellation_rules\` (\`id\` varchar(36) NOT NULL, \`hostUserId\` int NOT NULL, \`policyType\` varchar(20) NOT NULL, \`scope\` varchar(30) NOT NULL, \`targetPropertyGroupId\` varchar(255) NULL, \`targetServiceGroupId\` varchar(255) NULL, \`targetPropertyId\` varchar(255) NULL, \`targetServiceId\` varchar(255) NULL, \`fullRefundHours\` int NOT NULL DEFAULT '24', \`partialRefundHours\` int NOT NULL DEFAULT '12', \`partialRefundPercent\` decimal(5,2) NOT NULL DEFAULT '50.00', \`lateCancelPenalty\` decimal(5,2) NOT NULL DEFAULT '0.00', \`noShowPenalty\` tinyint NOT NULL DEFAULT 0, \`noShowPenaltyPercent\` decimal(5,2) NOT NULL DEFAULT '0.00', \`isActive\` tinyint NOT NULL DEFAULT 1, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`cancellation_rules\``);
    }

}
