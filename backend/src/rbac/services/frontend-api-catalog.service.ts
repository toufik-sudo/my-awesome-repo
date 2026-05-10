import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

export interface FrontendApiEntry {
  /** raw key from rbac('...') call, e.g. "propertiesApi.getAll.GET" */
  frontendApiKey: string;
  /** logical module name guessed from the file path, e.g. "properties" */
  module: string;
  /** file path (relative to repo) where this key was first seen */
  source: string | null;
  /** Inferred from the enclosing `api.<verb>('<url>', ...)` call site. */
  endpoint_url?: string | null;
  /** Inferred HTTP verb (uppercase) — from the api call or the key suffix. */
  method?: string | null;
}

export interface FrontendApiCatalogMeta {
  generatedAt: string | null;
  count: number;
  generator: string | null;
  /** Filled when read from disk so callers can show file age. */
  fileMtime: string | null;
}

/**
 * Loads the generated frontend API catalog. The catalog is produced by
 * `scripts/generate-frontend-api-catalog.ts` (run from the web repo) and
 * shipped to the backend as a static JSON file at
 * `backend/src/rbac/data/frontend-api-catalog.json`.
 *
 * The frontend can also POST a fresh catalog to the diff endpoint at runtime,
 * which is what RBAC Settings does so the diff reflects the currently running
 * web build.
 */
@Injectable()
export class FrontendApiCatalogService {
  private readonly logger = new Logger(FrontendApiCatalogService.name);
  private cache: FrontendApiEntry[] | null = null;
  private cachedMeta: FrontendApiCatalogMeta | null = null;

  list(): FrontendApiEntry[] {
    if (this.cache) return this.cache;
    const { entries, meta } = this.loadFromDisk();
    this.cache = entries;
    this.cachedMeta = meta;
    return this.cache;
  }

  meta(): FrontendApiCatalogMeta {
    if (!this.cachedMeta) this.list();
    return this.cachedMeta || { generatedAt: null, count: 0, generator: null, fileMtime: null };
  }

  invalidate() {
    this.cache = null;
    this.cachedMeta = null;
  }

  /** Merge a runtime-supplied catalog (from the web client) with the on-disk one. */
  mergeRuntime(runtime: FrontendApiEntry[] | undefined | null): FrontendApiEntry[] {
    if (!runtime || runtime.length === 0) return this.list();
    const seen = new Map<string, FrontendApiEntry>();
    for (const e of this.list()) seen.set(e.frontendApiKey, e);
    for (const e of runtime) {
      if (!seen.has(e.frontendApiKey)) seen.set(e.frontendApiKey, e);
    }
    return Array.from(seen.values()).sort((a, b) =>
      a.frontendApiKey.localeCompare(b.frontendApiKey),
    );
  }

  /**
   * Best-effort: execute `scripts/generate-frontend-api-catalog.ts` from the
   * monorepo root. Returns true if the script completed successfully.
   * Used by the RBAC "Refresh diff" action so admins can sync without a
   * separate CI step.
   */
  regenerate(): { ok: boolean; output: string } {
    const candidates = [
      path.resolve(process.cwd(), 'scripts/generate-frontend-api-catalog.ts'),
      path.resolve(__dirname, '../../../../../scripts/generate-frontend-api-catalog.ts'),
    ];
    const script = candidates.find(p => fs.existsSync(p));
    if (!script) {
      this.logger.warn('frontend catalog generator script not found; skipping regenerate');
      return { ok: false, output: 'generator script not found' };
    }

    // Try bun first, then npx tsx, then node + ts-node loader.
    const runners: Array<{ cmd: string; args: string[] }> = [
      { cmd: 'bun', args: ['run', script] },
      { cmd: 'npx', args: ['tsx', script] },
      { cmd: 'node', args: ['--loader', 'ts-node/esm', script] },
    ];

    for (const r of runners) {
      try {
        const res = spawnSync(r.cmd, r.args, {
          cwd: path.dirname(path.dirname(script)), // monorepo root
          encoding: 'utf8',
          timeout: 60_000,
        });
        if (res.status === 0) {
          this.invalidate();
          this.logger.log(`Regenerated frontend catalog via ${r.cmd}`);
          return { ok: true, output: res.stdout || '' };
        }
      } catch {
        /* try next runner */
      }
    }

    return { ok: false, output: 'no compatible runner (bun/tsx/ts-node) succeeded' };
  }

  private loadFromDisk(): { entries: FrontendApiEntry[]; meta: FrontendApiCatalogMeta } {
    const candidates = [
      path.resolve(__dirname, '../data/frontend-api-catalog.json'),
      path.resolve(process.cwd(), 'backend/src/rbac/data/frontend-api-catalog.json'),
    ];
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          const parsed = JSON.parse(raw);
          const stat = fs.statSync(p);
          // New shape: { meta, entries: [] }
          if (parsed && Array.isArray(parsed.entries)) {
            return {
              entries: parsed.entries as FrontendApiEntry[],
              meta: {
                generatedAt: parsed.meta?.generatedAt ?? null,
                count: parsed.meta?.count ?? parsed.entries.length,
                generator: parsed.meta?.generator ?? null,
                fileMtime: stat.mtime.toISOString(),
              },
            };
          }
          // Legacy: bare array
          if (Array.isArray(parsed)) {
            return {
              entries: parsed as FrontendApiEntry[],
              meta: {
                generatedAt: null,
                count: parsed.length,
                generator: null,
                fileMtime: stat.mtime.toISOString(),
              },
            };
          }
        }
      } catch (err: any) {
        this.logger.warn(`Failed reading frontend catalog at ${p}: ${err.message}`);
      }
    }
    this.logger.warn(
      'frontend-api-catalog.json not found — diff will rely on runtime catalog only',
    );
    return {
      entries: [],
      meta: { generatedAt: null, count: 0, generator: null, fileMtime: null },
    };
  }
}
