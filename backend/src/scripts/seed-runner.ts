/**
 * Seed Runner
 * 
 * Runs both media generation and database seeding in sequence.
 * 
 * Usage: npm run seed:all
 */
console.log('═══════════════════════════════════════════');
console.log('  ByootDZ - Full Seed Runner');
console.log('═══════════════════════════════════════════\n');

async function run() {
  // Step 1: Generate media placeholders
  console.log('📸 Step 1: Generating media files...\n');
  // await import('./generate-media');

  console.log('\n───────────────────────────────────────────\n');

  // Step 2: Seed database
  console.log('🗄️  Step 2: Seeding database...\n');
  // await import('./seed');

  // Step 3: Seed RBAC roles and permissions
  console.log('🗄️  Step 2: Seeding RBAC...\n');
  await import('./rbac.seed');
}

run().catch((err) => {
  console.error('❌ Seed runner failed:', err);
  process.exit(1);
});
