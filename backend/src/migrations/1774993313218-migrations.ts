import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1774993313218 implements MigrationInterface {
    name = 'Migrations1774993313218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_groups\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`adminId\` int NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service_group_memberships\` (\`id\` varchar(36) NOT NULL, \`serviceId\` varchar(255) NOT NULL, \`groupId\` varchar(255) NOT NULL, \`addedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e55bc34b8ccc162376e7852091\` (\`serviceId\`, \`groupId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service_bookings\` (\`id\` varchar(36) NOT NULL, \`serviceId\` varchar(255) NOT NULL, \`customerId\` int NOT NULL, \`bookingDate\` date NOT NULL, \`startTime\` varchar(5) NULL, \`participants\` int NOT NULL DEFAULT '1', \`childParticipants\` int NOT NULL DEFAULT '0', \`unitPrice\` decimal(12,2) NOT NULL, \`childPrice\` decimal(12,2) NOT NULL DEFAULT '0.00', \`discountPercent\` decimal(5,2) NOT NULL DEFAULT '0.00', \`totalPrice\` decimal(12,2) NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'DZD', \`status\` varchar(20) NOT NULL DEFAULT 'pending', \`paymentStatus\` varchar(20) NOT NULL DEFAULT 'pending', \`paymentMethod\` varchar(20) NULL, \`customerMessage\` text NULL, \`providerResponse\` text NULL, \`participantDetails\` json NULL, \`confirmedAt\` datetime NULL, \`cancelledAt\` datetime NULL, \`cancellationReason\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_service_bookings_serviceId\` (\`serviceId\`), INDEX \`IDX_service_bookings_customerId\` (\`customerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service_availability\` (\`id\` varchar(36) NOT NULL, \`serviceId\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`isBlocked\` tinyint NOT NULL DEFAULT 0, \`customPrice\` decimal(12,2) NULL, \`maxSlots\` int NULL, \`bookedSlots\` int NOT NULL DEFAULT '0', \`timeSlots\` json NULL, UNIQUE INDEX \`IDX_f7c764d1eb2fd15f650e32a6a1\` (\`serviceId\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_points\` (\`id\` varchar(36) NOT NULL, \`userId\` int NOT NULL, \`totalPoints\` int NOT NULL DEFAULT '0', \`availablePoints\` int NOT NULL DEFAULT '0', \`spentPoints\` int NOT NULL DEFAULT '0', \`tier\` varchar(20) NOT NULL DEFAULT 'bronze', \`lifetimePoints\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`point_transactions\` (\`id\` varchar(36) NOT NULL, \`userId\` int NOT NULL, \`action\` varchar(50) NOT NULL, \`points\` int NOT NULL, \`type\` varchar(10) NOT NULL, \`description\` text NULL, \`referenceId\` varchar(255) NULL, \`referenceType\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_groups\` ADD CONSTRAINT \`FK_baba9a49a19339d47e9823cbfd0\` FOREIGN KEY (\`adminId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_group_memberships\` ADD CONSTRAINT \`FK_54e9245a79c8bf96493f0e4728f\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_group_memberships\` ADD CONSTRAINT \`FK_f8e453c9092f987eacc6da756e9\` FOREIGN KEY (\`groupId\`) REFERENCES \`service_groups\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_bookings\` ADD CONSTRAINT \`FK_2855f8c3dde0a2b305c674bed48\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_bookings\` ADD CONSTRAINT \`FK_2456197060bfe0e5e0f21614dd4\` FOREIGN KEY (\`customerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_availability\` ADD CONSTRAINT \`FK_c2fc3fd64e80e7b76dca6b88ff5\` FOREIGN KEY (\`serviceId\`) REFERENCES \`tourism_services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_points\` ADD CONSTRAINT \`FK_36ced61a62c66d2844032bdbf40\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`point_transactions\` ADD CONSTRAINT \`FK_557e0c8c5a7a1a449723de76822\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`point_transactions\` DROP FOREIGN KEY \`FK_557e0c8c5a7a1a449723de76822\``);
        await queryRunner.query(`ALTER TABLE \`user_points\` DROP FOREIGN KEY \`FK_36ced61a62c66d2844032bdbf40\``);
        await queryRunner.query(`ALTER TABLE \`service_availability\` DROP FOREIGN KEY \`FK_c2fc3fd64e80e7b76dca6b88ff5\``);
        await queryRunner.query(`ALTER TABLE \`service_bookings\` DROP FOREIGN KEY \`FK_2456197060bfe0e5e0f21614dd4\``);
        await queryRunner.query(`ALTER TABLE \`service_bookings\` DROP FOREIGN KEY \`FK_2855f8c3dde0a2b305c674bed48\``);
        await queryRunner.query(`ALTER TABLE \`service_group_memberships\` DROP FOREIGN KEY \`FK_f8e453c9092f987eacc6da756e9\``);
        await queryRunner.query(`ALTER TABLE \`service_group_memberships\` DROP FOREIGN KEY \`FK_54e9245a79c8bf96493f0e4728f\``);
        await queryRunner.query(`ALTER TABLE \`service_groups\` DROP FOREIGN KEY \`FK_baba9a49a19339d47e9823cbfd0\``);
        await queryRunner.query(`DROP TABLE \`point_transactions\``);
        await queryRunner.query(`DROP TABLE \`user_points\``);
        await queryRunner.query(`DROP INDEX \`IDX_f7c764d1eb2fd15f650e32a6a1\` ON \`service_availability\``);
        await queryRunner.query(`DROP TABLE \`service_availability\``);
        await queryRunner.query(`DROP INDEX \`IDX_service_bookings_customerId\` ON \`service_bookings\``);
        await queryRunner.query(`DROP INDEX \`IDX_service_bookings_serviceId\` ON \`service_bookings\``);
        await queryRunner.query(`DROP TABLE \`service_bookings\``);
        await queryRunner.query(`DROP INDEX \`IDX_e55bc34b8ccc162376e7852091\` ON \`service_group_memberships\``);
        await queryRunner.query(`DROP TABLE \`service_group_memberships\``);
        await queryRunner.query(`DROP TABLE \`service_groups\``);
    }

}
