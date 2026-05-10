/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * generate-frontend-api-catalog
 *
 * Scans the web app source for `rbac('<key>')` and `rbacMerge('<key>', ...)`
 * calls and writes a catalog file consumed by:
 *   1. The web app at runtime — it POSTs the catalog to the backend so the
 *      "RBAC Settings → Diff" panels reflect the build that's actually running.
 *   2. The backend `FrontendApiCatalogService` — same JSON is copied to
 *      `backend/src/rbac/data/frontend-api-catalog.json` for static fallback.
 *
 * Each entry now also captures the **endpoint_url** and **HTTP method** by
 * looking back at the enclosing `api.<verb>('<url>', ...)` call site. This
 * lets the RBAC Settings diff easily relate frontend keys to backend routes.
 *
 * Output guarantees (validated below — script will exit non-zero if violated):
 *   • No duplicate `frontendApiKey` values
 *   • Deterministic ordering (lexicographic by key)
 *   • Embedded metadata: generatedAt (ISO) + count
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const WEB_OUT = path.join(SRC, 'lib', 'frontend-api-catalog.generated.json');
const BACKEND_OUT = path.join(
  ROOT,
  'backend',
  'src',
  'rbac',
  'data',
  'frontend-api-catalog.json',
);

const KEY_REGEX = /\brbac(?:Merge)?\s*\(\s*['"`]([^'"`]+)['"`]/g;

// Matches an axios call site:  api.get('/path', ...   |   api.post(`/path/${x}`, ...
// Captures the verb and the (possibly templated) URL literal contents.
const API_CALL_REGEX = /\bapi\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi;

interface Entry {
  frontendApiKey: string;
  module: string;
  source: string | null;
  endpoint_url: string | null;
  method: string | null;
}

interface CatalogMeta {
  generatedAt: string;
  count: number;
  generator: string;
}

function walk(dir: string, out: string[]) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      walk(full, out);
      continue;
    }
    if (/\.(ts|tsx|js|jsx)$/.test(name)) out.push(full);
  }
}

function inferModule(file: string): string {
  const rel = path.relative(SRC, file).replace(/\\/g, '/');
  const m = rel.match(/^modules\/([^/]+)\//);
  if (m) return m[1];
  if (rel.startsWith('services/')) return 'services';
  if (rel.startsWith('lib/')) return 'lib';
  return 'general';
}

/** Extract method from key suffix, e.g. "fooApi.bar.GET" -> "GET". */
function methodFromKey(key: string): string | null {
  const m = key.match(/\.([A-Z]+)$/);
  if (!m) return null;
  const verb = m[1].toUpperCase();
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(verb) ? verb : null;
}

/**
 * Normalize a captured URL: collapse `${expr}` into `:param`, trim, and
 * ensure a single `/api` prefix so frontend endpoint_url matches the FULL
 * backend route (global prefix + controller + endpoint).
 */
const API_GLOBAL_PREFIX = '/api';
function normalizeUrl(url: string): string {
  const stripped = url.replace(/\$\{[^}]+\}/g, ':param').trim();
  if (!stripped) return stripped;
  if (/^https?:\/\//i.test(stripped)) return stripped;
  const clean = ('/' + stripped.replace(/^\/+/, '')).replace(/\/+$/, '') || '/';
  if (clean === API_GLOBAL_PREFIX || clean.startsWith(`${API_GLOBAL_PREFIX}/`)) return clean;
  return `${API_GLOBAL_PREFIX}${clean}`;
}

/**
 * For a given file content, build a list of `api.<verb>('<url>', ...)` call
 * sites with their start positions so we can match each rbac() call to the
 * nearest preceding one.
 */
function indexApiCalls(content: string): Array<{ pos: number; method: string; url: string }> {
  const out: Array<{ pos: number; method: string; url: string }> = [];
  API_CALL_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = API_CALL_REGEX.exec(content)) !== null) {
    out.push({
      pos: m.index,
      method: m[1].toUpperCase(),
      url: normalizeUrl(m[2]),
    });
  }
  return out;
}

function findEnclosingApiCall(
  apiCalls: Array<{ pos: number; method: string; url: string }>,
  rbacPos: number,
): { method: string; url: string } | null {
  let best: { pos: number; method: string; url: string } | null = null;
  for (const c of apiCalls) {
    if (c.pos < rbacPos && (!best || c.pos > best.pos)) best = c;
    if (c.pos > rbacPos) break;
  }
  // Heuristic: only pair when the api call is "near" (within ~600 chars) so
  // unrelated rbac() calls in the same file don't borrow the wrong URL.
  if (best && rbacPos - best.pos <= 600) {
    return { method: best.method, url: best.url };
  }
  return null;
}

function validate(list: Entry[]) {
  // 1. No duplicates
  const seen = new Set<string>();
  for (const e of list) {
    if (seen.has(e.frontendApiKey)) {
      throw new Error(`Duplicate frontendApiKey detected: '${e.frontendApiKey}'`);
    }
    seen.add(e.frontendApiKey);
  }

  // 2. Deterministic ordering
  for (let i = 1; i < list.length; i++) {
    if (list[i - 1].frontendApiKey.localeCompare(list[i].frontendApiKey) > 0) {
      throw new Error(
        `Catalog is not sorted at index ${i}: '${list[i - 1].frontendApiKey}' > '${list[i].frontendApiKey}'`,
      );
    }
  }

  // 3. Non-empty keys
  for (const e of list) {
    if (!e.frontendApiKey || typeof e.frontendApiKey !== 'string') {
      throw new Error(`Invalid entry (empty key): ${JSON.stringify(e)}`);
    }
  }
}

function main() {
  const files: string[] = [];
  walk(SRC, files);

  const found = new Map<string, Entry>();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const apiCalls = indexApiCalls(content);
    KEY_REGEX.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = KEY_REGEX.exec(content)) !== null) {
      const key = m[1];
      if (found.has(key)) continue;
      const enclosing = findEnclosingApiCall(apiCalls, m.index);
      const method = enclosing?.method ?? methodFromKey(key);
      const endpoint_url = enclosing?.url ?? null;
      found.set(key, {
        frontendApiKey: key,
        module: inferModule(file),
        source: path.relative(ROOT, file).replace(/\\/g, '/'),
        endpoint_url,
        method,
      });
    }
  }

  const list = Array.from(found.values()).sort((a, b) =>
    a.frontendApiKey.localeCompare(b.frontendApiKey),
  );

  validate(list);

  const meta: CatalogMeta = {
    generatedAt: new Date().toISOString(),
    count: list.length,
    generator: 'scripts/generate-frontend-api-catalog.ts',
  };

  // JSON shape: include both meta and entries so the backend can read them too.
  const jsonPayload = { meta, entries: list };

  fs.mkdirSync(path.dirname(WEB_OUT), { recursive: true });
  fs.writeFileSync(WEB_OUT, JSON.stringify(jsonPayload, null, 2) + '\n');

  // Typed .ts wrapper for the web app (no resolveJsonModule required).
  const TS_OUT = WEB_OUT.replace(/\.json$/, '.ts');
  const tsBody = [
    '// AUTO-GENERATED by scripts/generate-frontend-api-catalog.ts — do not edit.',
    'export interface FrontendApiCatalogEntry {',
    '  frontendApiKey: string;',
    '  module: string;',
    '  source: string | null;',
    '  endpoint_url: string | null;',
    '  method: string | null;',
    '}',
    'export interface FrontendApiCatalogMeta {',
    '  generatedAt: string;',
    '  count: number;',
    '  generator: string;',
    '}',
    `export const CATALOG_META: FrontendApiCatalogMeta = ${JSON.stringify(meta, null, 2)};`,
    `const catalog: FrontendApiCatalogEntry[] = ${JSON.stringify(list, null, 2)};`,
    'export default catalog;',
    '',
  ].join('\n');
  fs.writeFileSync(TS_OUT, tsBody);

  // Backend copy (same JSON payload, with meta).
  if (fs.existsSync(path.dirname(BACKEND_OUT))) {
    fs.writeFileSync(BACKEND_OUT, JSON.stringify(jsonPayload, null, 2) + '\n');
  } else {
    try {
      fs.mkdirSync(path.dirname(BACKEND_OUT), { recursive: true });
      fs.writeFileSync(BACKEND_OUT, JSON.stringify(jsonPayload, null, 2) + '\n');
    } catch {
      /* backend not co-located — skip */
    }
  }

  const withUrl = list.filter(e => e.endpoint_url).length;
  // eslint-disable-next-line no-console
  console.log(
    `✓ generated ${list.length} frontend API keys (${withUrl} with endpoint_url) @ ${meta.generatedAt}`,
  );
  // eslint-disable-next-line no-console
  console.log(`  • ${WEB_OUT}`);
  // eslint-disable-next-line no-console
  console.log(`  • ${BACKEND_OUT}`);
}

try {
  main();
} catch (err: any) {
  // eslint-disable-next-line no-console
  console.error(`✗ catalog generation failed: ${err.message}`);
  process.exit(1);
}
