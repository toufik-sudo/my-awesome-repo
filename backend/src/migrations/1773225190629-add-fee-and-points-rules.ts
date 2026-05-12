import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeeAndPointsRules1773225190629 implements MigrationInterface {
  name = 'AddFeeAndPointsRules1773225190629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "service_fee_rules" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdByUserId" integer NOT NULL,
        "scope" varchar(30) NOT NULL DEFAULT 'global',
        "targetHostId" integer,
        "targetPropertyGroupId" uuid,
        "targetPropertyId" uuid,
        "calculationType" varchar(30) NOT NULL DEFAULT 'percentage',
        "percentageRate" decimal(5,2) NOT NULL DEFAULT 0,
        "fixedAmount" decimal(10,2) NOT NULL DEFAULT 0,
        "minFee" decimal(10,2),
        "maxFee" decimal(10,2),
        "isDefault" boolean NOT NULL DEFAULT false,
        "isActive" boolean NOT NULL DEFAULT true,
        "description" varchar,
        "priority" integer NOT NULL DEFAULT 100,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_fee_rules" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "points_rules" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "createdByUserId" integer NOT NULL,
        "ruleType" varchar(20) NOT NULL,
        "targetRole" varchar(20) NOT NULL,
        "action" varchar(50) NOT NULL,
        "pointsAmount" integer NOT NULL DEFAULT 0,
        "conversionRate" decimal(10,2),
        "currency" varchar(5) NOT NULL DEFAULT 'MAD',
        "minPointsForConversion" integer,
        "maxPointsPerPeriod" integer NOT NULL DEFAULT 0,
        "period" varchar(20),
        "multiplier" decimal(5,2) NOT NULL DEFAULT 1,
        "isDefault" boolean NOT NULL DEFAULT false,
        "isActive" boolean NOT NULL DEFAULT true,
        "description" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_points_rules" PRIMARY KEY ("id")
      )
    `);

    // FK constraints
    await queryRunner.query(`
      ALTER TABLE "service_fee_rules" ADD CONSTRAINT "FK_sfr_host" 
      FOREIGN KEY ("targetHostId") REFERENCES "users"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "service_fee_rules" ADD CONSTRAINT "FK_sfr_group" 
      FOREIGN KEY ("targetPropertyGroupId") REFERENCES "property_groups"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "service_fee_rules" ADD CONSTRAINT "FK_sfr_property" 
      FOREIGN KEY ("targetPropertyId") REFERENCES "properties"("id") ON DELETE SET NULL
    `);

    // Insert default global fee rule (15%)
    await queryRunner.query(`
      INSERT INTO "service_fee_rules" ("createdByUserId", "scope", "calculationType", "percentageRate", "isDefault", "description", "priority")
      VALUES (1, 'global', 'percentage', 15, true, 'Default platform service fee (15%)', 0)
    `);

    // Insert default points earning rules for guests
    await queryRunner.query(`
      INSERT INTO "points_rules" ("createdByUserId", "ruleType", "targetRole", "action", "pointsAmount", "isDefault", "description") VALUES
      (1, 'earning', 'guest', 'booking_completed', 100, true, 'Points per completed booking'),
      (1, 'earning', 'guest', 'review_submitted', 25, true, 'Points per review'),
      (1, 'earning', 'guest', 'referral_signup', 200, true, 'Points per referral'),
      (1, 'earning', 'guest', 'first_booking', 500, true, 'Bonus for first booking'),
      (1, 'earning', 'guest', 'profile_completed', 50, true, 'Complete profile bonus'),
      (1, 'earning', 'manager', 'property_verified', 150, true, 'Points for property verification'),
      (1, 'earning', 'manager', 'five_star_review', 75, true, 'Points for 5-star review on managed property'),
      (1, 'earning', 'manager', 'service_created', 50, true, 'Points for creating a service')
    `);

    // Insert default conversion rules
    await queryRunner.query(`
      INSERT INTO "points_rules" ("createdByUserId", "ruleType", "targetRole", "action", "pointsAmount", "conversionRate", "minPointsForConversion", "isDefault", "description") VALUES
      (1, 'conversion', 'guest', 'redeem', 0, 0.10, 500, true, '500 points = 50 MAD'),
      (1, 'conversion', 'manager', 'redeem', 0, 0.15, 300, true, '300 points = 45 MAD')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service_fee_rules" DROP CONSTRAINT "FK_sfr_property"`);
    await queryRunner.query(`ALTER TABLE "service_fee_rules" DROP CONSTRAINT "FK_sfr_group"`);
    await queryRunner.query(`ALTER TABLE "service_fee_rules" DROP CONSTRAINT "FK_sfr_host"`);
    await queryRunner.query(`DROP TABLE "points_rules"`);
    await queryRunner.query(`DROP TABLE "service_fee_rules"`);
  }
}
