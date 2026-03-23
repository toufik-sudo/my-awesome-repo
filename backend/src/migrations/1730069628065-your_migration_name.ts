import { MigrationInterface, QueryRunner } from 'typeorm';

export class YourMigrationName1730069628065 implements MigrationInterface {
  name = 'YourMigrationName1730069628065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NULL, \`phoneNbr\` varchar(255) NOT NULL, \`cardId\` varchar(255) NOT NULL, \`passportId\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`otp\` varchar(255) NULL, \`title\` varchar(255) NULL, \`city\` varchar(255) NULL, \`zipcode\` varchar(255) NULL, \`address\` varchar(255) NULL, \`country\` varchar(255) NULL, \`secondPhoneNbr\` varchar(255) NULL, \`resetToken\` varchar(255) NULL, \`passwordCreatedAt\` datetime NULL, \`passwordUpdatedAt\` datetime NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_75b3a5d8f99f184a376a414542\` (\`phoneNbr\`), UNIQUE INDEX \`IDX_501578f69c24fba9ec42553591\` (\`cardId\`), UNIQUE INDEX \`IDX_53a51a9023bb1e952b1f840312\` (\`passportId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`city\` varchar(255) NULL, \`zipcode\` varchar(255) NULL, \`address\` varchar(255) NULL, \`country\` varchar(255) NULL, \`otherPhoneNbr\` varchar(255) NULL, \`otherEmail\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users_address\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_53a51a9023bb1e952b1f840312\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_501578f69c24fba9ec42553591\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_75b3a5d8f99f184a376a414542\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
