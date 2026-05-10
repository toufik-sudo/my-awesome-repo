import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Materialized views (summary tables) for dashboards & heavy metrics endpoints.
 *
 * MySQL has no native MATERIALIZED VIEW, so we emulate them with:
 *   - Plain summary tables (mv_*) holding pre-aggregated rows.
 *   - A `mv_refresh_queue` table marking which (mv, key) is dirty.
 *   - INSERT/UPDATE/DELETE triggers on source tables that enqueue dirty keys.
 *   - Stored procedures that refresh one host / one user / one row at a time.
 *   - Scheduled EVENTS that drain the queue every minute and do a safety
 *     full-refresh every 15 minutes.
 *
 * Read paths (DashboardService, MetricsController#getSummary, ...) hit the
 * mv_* tables with a single indexed lookup instead of large JOIN+GROUP BY scans.
 */
export class MaterializedViews1779000000000 implements MigrationInterface {
  name = 'MaterializedViews1779000000000';

  public async up(q: QueryRunner): Promise<void> {
    // ─────────────────────────────────────────────────────────────
    // 1. Refresh queue
    // ─────────────────────────────────────────────────────────────
    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_refresh_queue\` (
        \`mv_name\` VARCHAR(64) NOT NULL,
        \`mv_key\`  VARCHAR(64) NOT NULL DEFAULT '',
        \`dirty_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`mv_name\`, \`mv_key\`)
      ) ENGINE=InnoDB
    `);

    // ─────────────────────────────────────────────────────────────
    // 2. Summary tables
    // ─────────────────────────────────────────────────────────────
    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_host_property_stats\` (
        \`hostId\` INT NOT NULL PRIMARY KEY,
        \`totalProperties\` INT NOT NULL DEFAULT 0,
        \`publishedProperties\` INT NOT NULL DEFAULT 0,
        \`avgTrustStars\` DECIMAL(3,1) NOT NULL DEFAULT 0,
        \`propertyTypeDistribution\` JSON NULL,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_host_booking_aggregates\` (
        \`hostId\` INT NOT NULL PRIMARY KEY,
        \`totalRevenue\` DECIMAL(14,2) NOT NULL DEFAULT 0,
        \`pendingRequests\` INT NOT NULL DEFAULT 0,
        \`confirmedBookings\` INT NOT NULL DEFAULT 0,
        \`completedBookings\` INT NOT NULL DEFAULT 0,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_host_revenue_monthly\` (
        \`hostId\` INT NOT NULL,
        \`year\` SMALLINT NOT NULL,
        \`month\` TINYINT NOT NULL,
        \`revenue\` DECIMAL(14,2) NOT NULL DEFAULT 0,
        \`bookings\` INT NOT NULL DEFAULT 0,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`hostId\`, \`year\`, \`month\`),
        INDEX \`IDX_mv_revenue_host\` (\`hostId\`)
      ) ENGINE=InnoDB
    `);

    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_user_booking_stats\` (
        \`guestId\` INT NOT NULL PRIMARY KEY,
        \`totalBookings\` INT NOT NULL DEFAULT 0,
        \`pendingBookings\` INT NOT NULL DEFAULT 0,
        \`confirmedBookings\` INT NOT NULL DEFAULT 0,
        \`completedBookings\` INT NOT NULL DEFAULT 0,
        \`totalSpent\` DECIMAL(14,2) NOT NULL DEFAULT 0,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_property_verification_stats\` (
        \`hostId\` INT NOT NULL PRIMARY KEY,
        \`total\` INT NOT NULL DEFAULT 0,
        \`approved\` INT NOT NULL DEFAULT 0,
        \`pending\` INT NOT NULL DEFAULT 0,
        \`rejected\` INT NOT NULL DEFAULT 0,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await q.query(`
      CREATE TABLE IF NOT EXISTS \`mv_platform_summary\` (
        \`id\` TINYINT NOT NULL PRIMARY KEY DEFAULT 1,
        \`totalUsers\` INT NOT NULL DEFAULT 0,
        \`activeUsers\` INT NOT NULL DEFAULT 0,
        \`totalProperties\` INT NOT NULL DEFAULT 0,
        \`publishedProperties\` INT NOT NULL DEFAULT 0,
        \`totalServices\` INT NOT NULL DEFAULT 0,
        \`totalBookings\` INT NOT NULL DEFAULT 0,
        \`pendingBookings\` INT NOT NULL DEFAULT 0,
        \`confirmedBookings\` INT NOT NULL DEFAULT 0,
        \`completedBookings\` INT NOT NULL DEFAULT 0,
        \`cancelledBookings\` INT NOT NULL DEFAULT 0,
        \`totalRevenue\` DECIMAL(16,2) NOT NULL DEFAULT 0,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
    await q.query(`INSERT IGNORE INTO \`mv_platform_summary\` (\`id\`) VALUES (1)`);

    // ─────────────────────────────────────────────────────────────
    // 3. Stored procedures (refresh logic)
    // ─────────────────────────────────────────────────────────────
    const procs = [
      `DROP PROCEDURE IF EXISTS sp_refresh_mv_host_property_stats`,
      `CREATE PROCEDURE sp_refresh_mv_host_property_stats(IN p_host INT)
       BEGIN
         INSERT INTO mv_host_property_stats
           (hostId, totalProperties, publishedProperties, avgTrustStars, propertyTypeDistribution)
         SELECT
           p_host,
           COUNT(*),
           SUM(CASE WHEN status='published' THEN 1 ELSE 0 END),
           COALESCE(ROUND(AVG(trustStars),1), 0),
           COALESCE((
             SELECT JSON_OBJECTAGG(propertyType, c)
             FROM (
               SELECT propertyType, COUNT(*) c
               FROM properties
               WHERE hostId = p_host
               GROUP BY propertyType
             ) t
           ), JSON_OBJECT())
         FROM properties WHERE hostId = p_host
         ON DUPLICATE KEY UPDATE
           totalProperties=VALUES(totalProperties),
           publishedProperties=VALUES(publishedProperties),
           avgTrustStars=VALUES(avgTrustStars),
           propertyTypeDistribution=VALUES(propertyTypeDistribution);
       END`,

      `DROP PROCEDURE IF EXISTS sp_refresh_mv_host_booking_aggregates`,
      `CREATE PROCEDURE sp_refresh_mv_host_booking_aggregates(IN p_host INT)
       BEGIN
         INSERT INTO mv_host_booking_aggregates
           (hostId, totalRevenue, pendingRequests, confirmedBookings, completedBookings)
         SELECT
           p_host,
           COALESCE(SUM(CASE WHEN b.status IN ('confirmed','completed') THEN b.totalPrice ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN b.status='pending' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN b.status='confirmed' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN b.status='completed' THEN 1 ELSE 0 END), 0)
         FROM bookings b
         JOIN properties p ON p.id = b.propertyId
         WHERE p.hostId = p_host
         ON DUPLICATE KEY UPDATE
           totalRevenue=VALUES(totalRevenue),
           pendingRequests=VALUES(pendingRequests),
           confirmedBookings=VALUES(confirmedBookings),
           completedBookings=VALUES(completedBookings);
       END`,

      `DROP PROCEDURE IF EXISTS sp_refresh_mv_host_revenue_monthly`,
      `CREATE PROCEDURE sp_refresh_mv_host_revenue_monthly(IN p_host INT)
       BEGIN
         DELETE FROM mv_host_revenue_monthly WHERE hostId = p_host;
         INSERT INTO mv_host_revenue_monthly (hostId, year, month, revenue, bookings)
         SELECT
           p_host,
           YEAR(b.createdAt),
           MONTH(b.createdAt),
           COALESCE(SUM(CASE WHEN b.status IN ('confirmed','completed') THEN b.totalPrice ELSE 0 END), 0),
           SUM(CASE WHEN b.status IN ('confirmed','completed') THEN 1 ELSE 0 END)
         FROM bookings b
         JOIN properties p ON p.id = b.propertyId
         WHERE p.hostId = p_host
           AND b.createdAt >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
         GROUP BY YEAR(b.createdAt), MONTH(b.createdAt)
         ON DUPLICATE KEY UPDATE
           revenue=VALUES(revenue),
           bookings=VALUES(bookings);
       END`,

      `DROP PROCEDURE IF EXISTS sp_refresh_mv_user_booking_stats`,
      `CREATE PROCEDURE sp_refresh_mv_user_booking_stats(IN p_user INT)
       BEGIN
         INSERT INTO mv_user_booking_stats
           (guestId, totalBookings, pendingBookings, confirmedBookings, completedBookings, totalSpent)
         SELECT
           p_user,
           COUNT(*),
           COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN status='confirmed' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','rejected') THEN totalPrice ELSE 0 END), 0)
         FROM bookings WHERE guestId = p_user
         ON DUPLICATE KEY UPDATE
           totalBookings=VALUES(totalBookings),
           pendingBookings=VALUES(pendingBookings),
           confirmedBookings=VALUES(confirmedBookings),
           completedBookings=VALUES(completedBookings),
           totalSpent=VALUES(totalSpent);
       END`,

      `DROP PROCEDURE IF EXISTS sp_refresh_mv_property_verification_stats`,
      `CREATE PROCEDURE sp_refresh_mv_property_verification_stats(IN p_host INT)
       BEGIN
         INSERT INTO mv_property_verification_stats (hostId, total, approved, pending, rejected)
         SELECT
           p_host,
           COUNT(*),
           COALESCE(SUM(CASE WHEN d.status='approved' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN d.status='pending' THEN 1 ELSE 0 END), 0),
           COALESCE(SUM(CASE WHEN d.status='rejected' THEN 1 ELSE 0 END), 0)
         FROM verification_documents d
         JOIN properties p ON p.id = d.propertyId
         WHERE p.hostId = p_host
         ON DUPLICATE KEY UPDATE
           total=VALUES(total),
           approved=VALUES(approved),
           pending=VALUES(pending),
           rejected=VALUES(rejected);
       END`,

      `DROP PROCEDURE IF EXISTS sp_refresh_mv_platform_summary`,
      `CREATE PROCEDURE sp_refresh_mv_platform_summary()
       BEGIN
         UPDATE mv_platform_summary SET
           totalUsers          = (SELECT COUNT(*) FROM users),
           activeUsers         = (SELECT COUNT(*) FROM users WHERE isActive = 1),
           totalProperties     = (SELECT COUNT(*) FROM properties),
           publishedProperties = (SELECT COUNT(*) FROM properties WHERE status = 'published'),
           totalServices       = (SELECT COUNT(*) FROM tourism_services),
           totalBookings       = (SELECT COUNT(*) FROM bookings),
           pendingBookings     = (SELECT COUNT(*) FROM bookings WHERE status='pending'),
           confirmedBookings   = (SELECT COUNT(*) FROM bookings WHERE status='confirmed'),
           completedBookings   = (SELECT COUNT(*) FROM bookings WHERE status='completed'),
           cancelledBookings   = (SELECT COUNT(*) FROM bookings WHERE status='cancelled'),
           totalRevenue        = (SELECT COALESCE(SUM(totalPrice),0) FROM bookings WHERE status IN ('confirmed','completed'))
         WHERE id = 1;
       END`,

      // Drain the queue: refresh whatever was marked dirty.
      `DROP PROCEDURE IF EXISTS sp_drain_mv_refresh_queue`,
      `CREATE PROCEDURE sp_drain_mv_refresh_queue()
       BEGIN
         DECLARE done INT DEFAULT 0;
         DECLARE v_mv VARCHAR(64);
         DECLARE v_key VARCHAR(64);
         DECLARE cur CURSOR FOR SELECT mv_name, mv_key FROM mv_refresh_queue LIMIT 500;
         DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
         OPEN cur;
         read_loop: LOOP
           FETCH cur INTO v_mv, v_key;
           IF done THEN LEAVE read_loop; END IF;

           IF v_mv = 'host_property_stats' THEN
             CALL sp_refresh_mv_host_property_stats(CAST(v_key AS UNSIGNED));
           ELSEIF v_mv = 'host_booking_aggregates' THEN
             CALL sp_refresh_mv_host_booking_aggregates(CAST(v_key AS UNSIGNED));
           ELSEIF v_mv = 'host_revenue_monthly' THEN
             CALL sp_refresh_mv_host_revenue_monthly(CAST(v_key AS UNSIGNED));
           ELSEIF v_mv = 'user_booking_stats' THEN
             CALL sp_refresh_mv_user_booking_stats(CAST(v_key AS UNSIGNED));
           ELSEIF v_mv = 'property_verification_stats' THEN
             CALL sp_refresh_mv_property_verification_stats(CAST(v_key AS UNSIGNED));
           ELSEIF v_mv = 'platform_summary' THEN
             CALL sp_refresh_mv_platform_summary();
           END IF;

           DELETE FROM mv_refresh_queue WHERE mv_name = v_mv AND mv_key = v_key;
         END LOOP;
         CLOSE cur;
       END`,

      // Full safety refresh.
      `DROP PROCEDURE IF EXISTS sp_full_refresh_all_mv`,
      `CREATE PROCEDURE sp_full_refresh_all_mv()
       BEGIN
         DECLARE done INT DEFAULT 0;
         DECLARE v_id INT;
         DECLARE cur CURSOR FOR SELECT DISTINCT hostId FROM properties;
         DECLARE cur2 CURSOR FOR SELECT DISTINCT guestId FROM bookings;
         DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

         OPEN cur;
         h_loop: LOOP
           FETCH cur INTO v_id;
           IF done THEN LEAVE h_loop; END IF;
           CALL sp_refresh_mv_host_property_stats(v_id);
           CALL sp_refresh_mv_host_booking_aggregates(v_id);
           CALL sp_refresh_mv_host_revenue_monthly(v_id);
           CALL sp_refresh_mv_property_verification_stats(v_id);
         END LOOP;
         CLOSE cur;

         SET done = 0;
         OPEN cur2;
         u_loop: LOOP
           FETCH cur2 INTO v_id;
           IF done THEN LEAVE u_loop; END IF;
           CALL sp_refresh_mv_user_booking_stats(v_id);
         END LOOP;
         CLOSE cur2;

         CALL sp_refresh_mv_platform_summary();
       END`,
    ];
    for (const sql of procs) await q.query(sql);

    // ─────────────────────────────────────────────────────────────
    // 4. Triggers — enqueue dirty keys
    // ─────────────────────────────────────────────────────────────
    const triggers = [
      `DROP TRIGGER IF EXISTS trg_bookings_ai_mv`,
      `CREATE TRIGGER trg_bookings_ai_mv AFTER INSERT ON bookings FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
           ('user_booking_stats', CAST(NEW.guestId AS CHAR)),
           ('platform_summary', '1');
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'host_booking_aggregates', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = NEW.propertyId;
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'host_revenue_monthly', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = NEW.propertyId;
       END`,
      `DROP TRIGGER IF EXISTS trg_bookings_au_mv`,
      `CREATE TRIGGER trg_bookings_au_mv AFTER UPDATE ON bookings FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
           ('user_booking_stats', CAST(NEW.guestId AS CHAR)),
           ('platform_summary', '1');
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'host_booking_aggregates', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = NEW.propertyId;
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'host_revenue_monthly', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = NEW.propertyId;
       END`,
      `DROP TRIGGER IF EXISTS trg_bookings_ad_mv`,
      `CREATE TRIGGER trg_bookings_ad_mv AFTER DELETE ON bookings FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
           ('user_booking_stats', CAST(OLD.guestId AS CHAR)),
           ('platform_summary', '1');
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'host_booking_aggregates', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = OLD.propertyId;
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'host_revenue_monthly', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = OLD.propertyId;
       END`,

      `DROP TRIGGER IF EXISTS trg_properties_ai_mv`,
      `CREATE TRIGGER trg_properties_ai_mv AFTER INSERT ON properties FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
           ('host_property_stats', CAST(NEW.hostId AS CHAR)),
           ('platform_summary', '1');
       END`,
      `DROP TRIGGER IF EXISTS trg_properties_au_mv`,
      `CREATE TRIGGER trg_properties_au_mv AFTER UPDATE ON properties FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
           ('host_property_stats', CAST(NEW.hostId AS CHAR)),
           ('platform_summary', '1');
         IF OLD.hostId <> NEW.hostId THEN
           INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
             ('host_property_stats', CAST(OLD.hostId AS CHAR));
         END IF;
       END`,
      `DROP TRIGGER IF EXISTS trg_properties_ad_mv`,
      `CREATE TRIGGER trg_properties_ad_mv AFTER DELETE ON properties FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key) VALUES
           ('host_property_stats', CAST(OLD.hostId AS CHAR)),
           ('platform_summary', '1');
       END`,

      `DROP TRIGGER IF EXISTS trg_verdocs_ai_mv`,
      `CREATE TRIGGER trg_verdocs_ai_mv AFTER INSERT ON verification_documents FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'property_verification_stats', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = NEW.propertyId;
       END`,
      `DROP TRIGGER IF EXISTS trg_verdocs_au_mv`,
      `CREATE TRIGGER trg_verdocs_au_mv AFTER UPDATE ON verification_documents FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'property_verification_stats', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = NEW.propertyId;
       END`,
      `DROP TRIGGER IF EXISTS trg_verdocs_ad_mv`,
      `CREATE TRIGGER trg_verdocs_ad_mv AFTER DELETE ON verification_documents FOR EACH ROW BEGIN
         INSERT IGNORE INTO mv_refresh_queue (mv_name, mv_key)
         SELECT 'property_verification_stats', CAST(p.hostId AS CHAR) FROM properties p WHERE p.id = OLD.propertyId;
       END`,
    ];
    for (const sql of triggers) await q.query(sql);

    // ─────────────────────────────────────────────────────────────
    // 5. Scheduled events
    //    - Drain dirty queue every 1 minute
    //    - Full safety refresh every 15 minutes
    // ─────────────────────────────────────────────────────────────
    try {
      await q.query(`SET GLOBAL event_scheduler = ON`);
    } catch {
      /* may be denied on managed MySQL — non-fatal */
    }

    await q.query(`DROP EVENT IF EXISTS ev_mv_drain_queue`);
    await q.query(`
      CREATE EVENT ev_mv_drain_queue
      ON SCHEDULE EVERY 1 MINUTE
      DO CALL sp_drain_mv_refresh_queue()
    `);

    await q.query(`DROP EVENT IF EXISTS ev_mv_full_refresh`);
    await q.query(`
      CREATE EVENT ev_mv_full_refresh
      ON SCHEDULE EVERY 15 MINUTE
      DO CALL sp_full_refresh_all_mv()
    `);

    // ─────────────────────────────────────────────────────────────
    // 6. Initial population
    // ─────────────────────────────────────────────────────────────
    await q.query(`CALL sp_full_refresh_all_mv()`);
  }

  public async down(q: QueryRunner): Promise<void> {
    const events = ['ev_mv_drain_queue', 'ev_mv_full_refresh'];
    for (const e of events) await q.query(`DROP EVENT IF EXISTS ${e}`);

    const triggers = [
      'trg_bookings_ai_mv', 'trg_bookings_au_mv', 'trg_bookings_ad_mv',
      'trg_properties_ai_mv', 'trg_properties_au_mv', 'trg_properties_ad_mv',
      'trg_verdocs_ai_mv', 'trg_verdocs_au_mv', 'trg_verdocs_ad_mv',
    ];
    for (const t of triggers) await q.query(`DROP TRIGGER IF EXISTS ${t}`);

    const procs = [
      'sp_refresh_mv_host_property_stats',
      'sp_refresh_mv_host_booking_aggregates',
      'sp_refresh_mv_host_revenue_monthly',
      'sp_refresh_mv_user_booking_stats',
      'sp_refresh_mv_property_verification_stats',
      'sp_refresh_mv_platform_summary',
      'sp_drain_mv_refresh_queue',
      'sp_full_refresh_all_mv',
    ];
    for (const p of procs) await q.query(`DROP PROCEDURE IF EXISTS ${p}`);

    const tables = [
      'mv_refresh_queue',
      'mv_host_property_stats',
      'mv_host_booking_aggregates',
      'mv_host_revenue_monthly',
      'mv_user_booking_stats',
      'mv_property_verification_stats',
      'mv_platform_summary',
    ];
    for (const t of tables) await q.query(`DROP TABLE IF EXISTS \`${t}\``);
  }
}
