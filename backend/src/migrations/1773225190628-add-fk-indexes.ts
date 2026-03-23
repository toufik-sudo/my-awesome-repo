import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFkIndexes1773225190628 implements MigrationInterface {
  name = 'AddFkIndexes1773225190628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX \`IDX_properties_hostId\` ON \`properties\` (\`hostId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_bookings_propertyId\` ON \`bookings\` (\`propertyId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_bookings_guestId\` ON \`bookings\` (\`guestId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_reviews_propertyId\` ON \`reviews\` (\`propertyId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_reviews_guestId\` ON \`reviews\` (\`guestId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_favorites_userId\` ON \`favorites\` (\`userId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_favorites_propertyId\` ON \`favorites\` (\`propertyId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_notifications_userId\` ON \`notifications\` (\`userId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_comments_userId\` ON \`comments\` (\`userId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_rankings_userId\` ON \`rankings\` (\`userId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_reactions_userId\` ON \`reactions\` (\`userId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_property_images_propertyId\` ON \`property_images\` (\`propertyId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_verification_docs_propertyId\` ON \`verification_documents\` (\`propertyId\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_verification_docs_propertyId\` ON \`verification_documents\``);
    await queryRunner.query(`DROP INDEX \`IDX_property_images_propertyId\` ON \`property_images\``);
    await queryRunner.query(`DROP INDEX \`IDX_reactions_userId\` ON \`reactions\``);
    await queryRunner.query(`DROP INDEX \`IDX_rankings_userId\` ON \`rankings\``);
    await queryRunner.query(`DROP INDEX \`IDX_comments_userId\` ON \`comments\``);
    await queryRunner.query(`DROP INDEX \`IDX_notifications_userId\` ON \`notifications\``);
    await queryRunner.query(`DROP INDEX \`IDX_favorites_propertyId\` ON \`favorites\``);
    await queryRunner.query(`DROP INDEX \`IDX_favorites_userId\` ON \`favorites\``);
    await queryRunner.query(`DROP INDEX \`IDX_reviews_guestId\` ON \`reviews\``);
    await queryRunner.query(`DROP INDEX \`IDX_reviews_propertyId\` ON \`reviews\``);
    await queryRunner.query(`DROP INDEX \`IDX_bookings_guestId\` ON \`bookings\``);
    await queryRunner.query(`DROP INDEX \`IDX_bookings_propertyId\` ON \`bookings\``);
    await queryRunner.query(`DROP INDEX \`IDX_properties_hostId\` ON \`properties\``);
  }
}
