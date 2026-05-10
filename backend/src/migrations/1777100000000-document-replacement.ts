import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Document replacement workflow:
 *  - verification_documents.replacesDocumentId: when admin/manager uploads
 *    a replacement, points to the document being replaced.
 *  - status now also accepts 'archived' (column is already varchar(20), no DDL needed).
 *  - Same for service_verification_documents.
 */
export class DocumentReplacementMigration1777100000000 implements MigrationInterface {
  name = 'DocumentReplacementMigration1777100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // verification_documents
    const cols1: any[] = await queryRunner.query(
      `SHOW COLUMNS FROM \`verification_documents\` LIKE 'replacesDocumentId'`,
    );
    if (cols1.length === 0) {
      await queryRunner.query(
        `ALTER TABLE \`verification_documents\` ADD \`replacesDocumentId\` varchar(36) NULL`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_ver_docs_replacesDocumentId\` ON \`verification_documents\` (\`replacesDocumentId\`)`,
      );
    }

    // service_verification_documents
    const cols2: any[] = await queryRunner.query(
      `SHOW COLUMNS FROM \`service_verification_documents\` LIKE 'replacesDocumentId'`,
    );
    if (cols2.length === 0) {
      await queryRunner.query(
        `ALTER TABLE \`service_verification_documents\` ADD \`replacesDocumentId\` varchar(36) NULL`,
      );
      await queryRunner.query(
        `CREATE INDEX \`IDX_svc_docs_replacesDocumentId\` ON \`service_verification_documents\` (\`replacesDocumentId\`)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_ver_docs_replacesDocumentId\` ON \`verification_documents\``).catch(() => {});
    await queryRunner.query(`ALTER TABLE \`verification_documents\` DROP COLUMN \`replacesDocumentId\``).catch(() => {});
    await queryRunner.query(`DROP INDEX \`IDX_svc_docs_replacesDocumentId\` ON \`service_verification_documents\``).catch(() => {});
    await queryRunner.query(`ALTER TABLE \`service_verification_documents\` DROP COLUMN \`replacesDocumentId\``).catch(() => {});
  }
}
