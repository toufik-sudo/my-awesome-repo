/**
 * Frontend API runtime scanner
 * --------------------------------
 * Builds a fresh frontend API catalog by scanning ALL source files at runtime
 * via Vite's `import.meta.glob` (with `as: 'raw'`). This guarantees the diff
 * reflects the *currently running* web build — not the JSON snapshot generated
 * at build time by `scripts/generate-frontend-api-catalog.ts`.
 *
 * Each scanned key is enriched with `endpoint_url` and `method` by looking
 * back at the enclosing `api.<verb>('<url>', ...)` call site, so the RBAC
 * Settings diff can correlate frontend keys with backend routes directly.
 *
 * The result is merged with the static generated catalog and POSTed to the
 * backend's `/rbac-config/frontend/catalog/diff` endpoint.
 */
import generatedCatalog from '@/lib/frontend-api-catalog.generated';
import type { FrontendApiCatalogEntry } from '@/modules/admin/rbac-config.api';

// Vite-only: eagerly load every source file as a raw string.
// This runs at module-init time but is tree-shaken in prod if unused.
const RAW_FILES = import.meta.glob('/src/**/*.{ts,tsx,js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const KEY_REGEX = /\brbac(?:Merge)?\s*\(\s*['"`]([^'"`]+)['"`]/g;
const API_CALL_REGEX = /\bapi\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi;

function inferModule(filePath: string): string {
  const rel = filePath.replace(/^\/src\//, '');
  const m = rel.match(/^modules\/([^/]+)\//);
  if (m) return m[1];
  if (rel.startsWith('services/')) return 'services';
  if (rel.startsWith('lib/')) return 'lib';
  return 'general';
}

function methodFromKey(key: string): string | null {
  const m = key.match(/\.([A-Z]+)$/);
  if (!m) return null;
  const verb = m[1].toUpperCase();
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(verb) ? verb : null;
}

/**
 * Normalize a captured URL: turn `${expr}` into `:param` placeholders, trim,
 * and ensure a single `/api` prefix so frontend endpoint_url values match
 * the full backend route stored by the seed script and route mapper.
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

function indexApiCalls(content: string): Array<{ pos: number; method: string; url: string }> {
  const out: Array<{ pos: number; method: string; url: string }> = [];
  API_CALL_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = API_CALL_REGEX.exec(content)) !== null) {
    out.push({ pos: m.index, method: m[1].toUpperCase(), url: normalizeUrl(m[2]) });
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
  if (best && rbacPos - best.pos <= 600) return { method: best.method, url: best.url };
  return null;
}

/**
 * Scan all loaded source files and return a deduplicated, sorted list
 * of frontend API keys found in `rbac(...)` / `rbacMerge(...)` calls,
 * each enriched with the enclosing `api.<verb>('<url>')` when found.
 */
export function scanFrontendApiCatalogLive(): FrontendApiCatalogEntry[] {
  const found = new Map<string, FrontendApiCatalogEntry>();
  for (const [file, content] of Object.entries(RAW_FILES)) {
    if (!content) continue;
    const apiCalls = indexApiCalls(content);
    KEY_REGEX.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = KEY_REGEX.exec(content)) !== null) {
      const key = m[1];
      if (found.has(key)) continue;
      const enclosing = findEnclosingApiCall(apiCalls, m.index);
      found.set(key, {
        frontendApiKey: key,
        module: inferModule(file),
        source: file.replace(/^\//, ''),
        endpoint_url: enclosing?.url ?? null,
        method: enclosing?.method ?? methodFromKey(key),
      });
    }
  }
  return Array.from(found.values()).sort((a, b) =>
    a.frontendApiKey.localeCompare(b.frontendApiKey),
  );
}

/**
 * Merge the live-scanned catalog with the build-time generated one.
 * Live entries win for `source`/`module`/`endpoint_url`/`method`;
 * generated entries fill any gaps.
 */
export function getMergedFrontendCatalog(): FrontendApiCatalogEntry[] {
  const live = scanFrontendApiCatalogLive();
  const seen = new Map<string, FrontendApiCatalogEntry>();
  for (const e of live) seen.set(e.frontendApiKey, e);
  for (const e of generatedCatalog as FrontendApiCatalogEntry[]) {
    if (!seen.has(e.frontendApiKey)) {
      seen.set(e.frontendApiKey, {
        frontendApiKey: e.frontendApiKey,
        module: e.module,
        source: e.source,
        endpoint_url: (e as any).endpoint_url ?? null,
        method: (e as any).method ?? null,
      });
    }
  }
  return Array.from(seen.values()).sort((a, b) =>
    a.frontendApiKey.localeCompare(b.frontendApiKey),
  );
}

export interface FrontendCatalogScanStats {
  liveCount: number;
  generatedCount: number;
  mergedCount: number;
  scannedFiles: number;
  scannedAt: string;
  /** How many live entries successfully resolved an endpoint_url. */
  withEndpointUrl: number;
}

export function getFrontendCatalogScanStats(): FrontendCatalogScanStats {
  const live = scanFrontendApiCatalogLive();
  const merged = getMergedFrontendCatalog();
  return {
    liveCount: live.length,
    generatedCount: (generatedCatalog as FrontendApiCatalogEntry[]).length,
    mergedCount: merged.length,
    scannedFiles: Object.keys(RAW_FILES).length,
    scannedAt: new Date().toISOString(),
    withEndpointUrl: live.filter(e => e.endpoint_url).length,
  };
}
