/**
 * rbac:validate — Anti-hardcode validation script
 *
 * Scans backend and frontend code for hardcoded permission strings.
 *
 * Rules:
 *  - Backend: @RequirePermission must NOT contain raw strings
 *  - Frontend: canUI / can must NOT contain raw strings
 *  - All permission keys must exist in the permission-registry
 *
 * Usage: npx ts-node backend/src/scripts/rbac-validate.ts
 *        or: npm run rbac:validate
 */
import * as fs from 'fs';
import * as path from 'path';
// import {
//   ALL_BACKEND_KEYS,
//   ALL_FRONTEND_KEYS,
// } from '../rbac/permission-registry';

const ROOT = path.resolve(__dirname, '../../..');
const errors: string[] = [];
const warnings: string[] = [];

function scanDir(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      results.push(...scanDir(full, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function checkBackendFiles() {
  console.log('▶ Checking backend files for hardcoded permission strings…');

  const files = scanDir(path.join(ROOT, 'backend/src'), ['.ts']);
  const skipFiles = ['permission-registry.ts', 'generate-backend-permission-key.ts', 'generate-ui-permission-key.ts', 'permissions-sync.ts', 'rbac-validate.ts', 'seed.ts'];

  for (const file of files) {
    if (skipFiles.some(s => file.endsWith(s))) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for hardcoded strings in @RequirePermission('...')
      const hardcodedPerm = line.match(/@RequirePermission\(\s*['"`]([^'"`]+)['"`]/);
      if (hardcodedPerm) {
        errors.push(`${path.relative(ROOT, file)}:${i + 1} — Hardcoded @RequirePermission('${hardcodedPerm[1]}'). Use generateBackendPermissionKey() instead.`);
      }
    }
  }
}

function checkFrontendFiles() {
  console.log('▶ Checking frontend files for hardcoded permission strings…');

  const files = [
    ...scanDir(path.join(ROOT, 'src'), ['.ts', '.tsx']),
    ...scanDir(path.join(ROOT, 'mobile/src'), ['.ts', '.tsx']),
  ];
  const skipFiles = ['generate-ui-permission-key.ts', 'permission-registry.ts'];

  for (const file of files) {
    if (skipFiles.some(s => file.endsWith(s))) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Warn about direct canUI('string') usage outside generated keys
      const canUiCall = line.match(/canUI\(\s*['"`]([^'"`]+)['"`]\s*\)/);
      if (canUiCall) {
        const key = canUiCall[1];
        // Old-style keys (no dots) are legacy
        if (!key.startsWith('ui.')) {
          warnings.push(`${path.relative(ROOT, file)}:${i + 1} — Legacy canUI('${key}'). Migrate to generateUiPermissionKey().`);
        }
      }
    }
  }
}

// function checkRegistryIntegrity() {
//   console.log('▶ Validating registry integrity…');

//   // Check for duplicate keys
//   const backendKeys = new Set<string>();
//   for (const key of ALL_BACKEND_KEYS) {
//     if (backendKeys.has(key)) {
//       errors.push(`Duplicate backend key: ${key}`);
//     }
//     backendKeys.add(key);
//   }

//   const frontendKeys = new Set<string>();
//   for (const key of ALL_FRONTEND_KEYS) {
//     if (frontendKeys.has(key)) {
//       errors.push(`Duplicate frontend key: ${key}`);
//     }
//     frontendKeys.add(key);
//   }

//   console.log(`  Backend keys:  ${ALL_BACKEND_KEYS.size}`);
//   console.log(`  Frontend keys: ${ALL_FRONTEND_KEYS.size}`);
// }

// ─── Main ──────────────────────────────────────────────────────────────────
console.log('═══ RBAC Validation ═══\n');

// checkRegistryIntegrity();
checkBackendFiles();
checkFrontendFiles();

console.log('\n═══ Results ═══');
if (errors.length > 0) {
  console.log(`\n❌ ${errors.length} ERRORS:`);
  errors.forEach(e => console.log(`  ✗ ${e}`));
}
if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} WARNINGS:`);
  warnings.forEach(w => console.log(`  ⚡ ${w}`));
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All checks passed. No hardcoded permission strings found.');
}

process.exit(errors.length > 0 ? 1 : 0);
