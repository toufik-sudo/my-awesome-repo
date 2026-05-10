import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Sparkles,
  Search,
  ExternalLink,
  HelpCircle,
  Pencil,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  rbacConfigApi,
  type BackendCatalogDiff,
  type FrontendCatalogDiff,
  type FrontendApiCatalogEntry,
  type BindingsDiff,
} from '../rbac-config.api';
import { CATALOG_META } from '@/lib/frontend-api-catalog.generated';
import {
  getMergedFrontendCatalog,
  getFrontendCatalogScanStats,
  type FrontendCatalogScanStats,
} from '@/lib/frontend-api-runtime-scanner';

const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24h
const METHOD_FILTERS = ['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'UNKNOWN'] as const;
type MethodFilter = (typeof METHOD_FILTERS)[number];

interface Props {
  canEditRbac: boolean;
  onQuickCreateBackend?: (entry: BackendCatalogDiff['missing'][number]) => void;
  onQuickCreateFrontend?: (entry: FrontendApiCatalogEntry) => void;
}

/**
 * Build a clickable source link for a frontend API key.
 * - In dev (localhost), tries `vscode://file/<absolute>` (works if user has the
 *   handler enabled). Otherwise falls back to copying the path to clipboard.
 */
function openSource(source: string | null | undefined) {
  if (!source) return;
  const path = source.startsWith('/') ? source : `/${source}`;
  // Try VS Code deep-link first when running locally.
  if (typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    try {
      window.open(`vscode://file${path}`, '_blank');
      toast.success(`Opening ${path} in VS Code`);
      return;
    } catch {
      /* fall through */
    }
  }
  // Fallback: copy to clipboard.
  navigator.clipboard
    ?.writeText(path)
    .then(() => toast.success(`Copied source path: ${path}`))
    .catch(() => toast.info(path));
}

export const RbacCatalogDiffPanel: React.FC<Props> = ({
  canEditRbac,
  onQuickCreateBackend,
  onQuickCreateFrontend,
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backendDiff, setBackendDiff] = useState<BackendCatalogDiff | null>(null);
  const [frontendDiff, setFrontendDiff] = useState<FrontendCatalogDiff | null>(null);
  const [bindingsDiff, setBindingsDiff] = useState<BindingsDiff | null>(null);
  const [scanStats, setScanStats] = useState<FrontendCatalogScanStats | null>(null);

  // Filters for missing frontend keys
  const [searchUrl, setSearchUrl] = useState('');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('ALL');
  // Bulk selection of filtered missing frontend keys
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const runtime = getMergedFrontendCatalog() as FrontendApiCatalogEntry[];
      const stats = getFrontendCatalogScanStats();
      setScanStats(stats);
      const runtimeKeys = runtime.map(r => r.frontendApiKey);
      const [b, f, bd] = await Promise.all([
        rbacConfigApi.getBackendCatalogDiff(),
        rbacConfigApi.getFrontendCatalogDiff(runtime),
        rbacConfigApi.getBindingsDiff(runtimeKeys),
      ]);
      setBackendDiff(b);
      setFrontendDiff(f);
      setBindingsDiff(bd);
    } catch {
      toast.error('Failed to load RBAC diff');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleHardRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await rbacConfigApi.refreshCatalogs();
      if (result.frontendRegenerated) {
        toast.success(
          `Re-scanned ${result.routesRescanned} routes & regenerated frontend catalog`,
        );
      } else {
        toast.warning(
          `Re-scanned ${result.routesRescanned} routes — frontend regen skipped (${result.frontendOutput || 'no runner'})`,
        );
      }
      await load();
    } catch {
      toast.error('Failed to refresh catalogs');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const generatedAt = CATALOG_META?.generatedAt ? new Date(CATALOG_META.generatedAt) : null;
  const isStale = generatedAt ? Date.now() - generatedAt.getTime() > STALE_AFTER_MS : true;
  const isEmpty = (CATALOG_META?.count ?? 0) === 0;
  const showCatalogWarning = (isEmpty || isStale) && (scanStats?.liveCount ?? 0) === 0;

  // Split missing frontend entries into "with metadata" and "missing metadata"
  const missingFrontend = frontendDiff?.missing ?? [];
  const missingMetaEntries = useMemo(
    () => missingFrontend.filter(m => !m.endpoint_url || !m.method),
    [missingFrontend],
  );

  const filteredMissingFrontend = useMemo(() => {
    const q = searchUrl.trim().toLowerCase();
    return missingFrontend.filter(m => {
      // Method filter
      if (methodFilter !== 'ALL') {
        if (methodFilter === 'UNKNOWN') {
          if (m.method) return false;
        } else if ((m.method || '').toUpperCase() !== methodFilter) {
          return false;
        }
      }
      // URL/key search
      if (q) {
        const hay = `${m.endpoint_url ?? ''} ${m.frontendApiKey} ${m.module} ${m.source ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [missingFrontend, methodFilter, searchUrl]);

  // Keep selection in sync with current filtered list (drop hidden entries)
  useEffect(() => {
    setSelectedKeys(prev => {
      if (prev.size === 0) return prev;
      const visible = new Set(filteredMissingFrontend.map(m => m.frontendApiKey));
      const next = new Set<string>();
      prev.forEach(k => { if (visible.has(k)) next.add(k); });
      return next.size === prev.size ? prev : next;
    });
  }, [filteredMissingFrontend]);

  const toggleKey = (key: string, checked: boolean) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (checked) next.add(key); else next.delete(key);
      return next;
    });
  };

  const allFilteredSelected =
    filteredMissingFrontend.length > 0 &&
    filteredMissingFrontend.every(m => selectedKeys.has(m.frontendApiKey));
  const someFilteredSelected =
    !allFilteredSelected && filteredMissingFrontend.some(m => selectedKeys.has(m.frontendApiKey));

  const toggleAllFiltered = (checked: boolean) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      filteredMissingFrontend.forEach(m => {
        if (checked) next.add(m.frontendApiKey);
        else next.delete(m.frontendApiKey);
      });
      return next;
    });
  };

  const clearSelection = () => setSelectedKeys(new Set());

  const selectedEntries = useMemo(
    () => filteredMissingFrontend.filter(m => selectedKeys.has(m.frontendApiKey)),
    [filteredMissingFrontend, selectedKeys],
  );

  /** Open the create modal pre-filled, prompting for manual endpoint_url + method. */
  const handleManualEntry = (entry: FrontendApiCatalogEntry) => {
    if (!onQuickCreateFrontend) return;
    onQuickCreateFrontend({
      ...entry,
      // Hint downstream modal that values are manual: leave nulls but flag via key
    });
    toast.info('Fill the endpoint URL and method manually in the modal');
  };

  /** Sequentially open the modal for each selected entry. */
  const runBulk = async (mode: 'quick' | 'manual') => {
    if (!onQuickCreateFrontend || selectedEntries.length === 0) return;
    const label = mode === 'manual' ? 'Add manually' : 'Quick-create';
    toast.info(`${label}: processing ${selectedEntries.length} entr${selectedEntries.length === 1 ? 'y' : 'ies'}…`);
    for (const entry of selectedEntries) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 150));
      onQuickCreateFrontend({ ...entry });
    }
    clearSelection();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live API ↔ DB Diff</h3>
          <p className="text-xs text-muted-foreground">
            Compares the running backend routes and frontend API keys against the rbac_*_permissions tables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading || refreshing}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Reload diff
          </Button>
          {canEditRbac && (
            <Button size="sm" onClick={handleHardRefresh} disabled={refreshing || loading}>
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              Refresh diff (rescan + regen)
            </Button>
          )}
        </div>
      </div>

      {showCatalogWarning && (
        <div className="flex items-start gap-2 p-3 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <div className="font-medium">
              {isEmpty
                ? 'Frontend API catalog is empty.'
                : 'Frontend API catalog may be stale.'}
            </div>
            <div className="text-amber-800/80 dark:text-amber-300/80">
              {generatedAt
                ? `Last generated ${generatedAt.toLocaleString()} (${CATALOG_META?.count ?? 0} keys).`
                : 'No generation timestamp found.'}{' '}
              Click <strong>Refresh diff</strong> above to re-run the generator.
            </div>
          </div>
        </div>
      )}

      {/* Missing metadata warning */}
      {missingMetaEntries.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-md border border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 text-orange-900 dark:text-orange-200 text-xs">
          <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="font-medium">
              {missingMetaEntries.length} missing frontend API key{missingMetaEntries.length === 1 ? '' : 's'} could not infer endpoint_url and/or HTTP method.
            </div>
            <div className="text-orange-800/80 dark:text-orange-300/80">
              These keys are not adjacent to a recognizable <code className="font-mono">api.&lt;verb&gt;(&lt;url&gt;)</code> call. Use <strong>Add manually</strong> to fill them in.
            </div>
            <ScrollArea className="max-h-24 mt-1">
              <div className="space-y-1 pr-2">
                {missingMetaEntries.slice(0, 50).map(e => (
                  <div
                    key={e.frontendApiKey}
                    className="flex items-center justify-between gap-2 text-[11px] bg-orange-100/50 dark:bg-orange-900/20 rounded px-2 py-1"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-mono truncate">{e.frontendApiKey}</div>
                      <div className="text-[10px] opacity-75 truncate">
                        {!e.method && <span>no method</span>}
                        {!e.method && !e.endpoint_url && <span> · </span>}
                        {!e.endpoint_url && <span>no url</span>}
                        {e.source && <span> · {e.source}</span>}
                      </div>
                    </div>
                    {canEditRbac && onQuickCreateFrontend && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 shrink-0 gap-1 text-[10px]"
                        onClick={() => handleManualEntry(e)}
                      >
                        <Pencil className="h-3 w-3" /> Add manually
                      </Button>
                    )}
                  </div>
                ))}
                {missingMetaEntries.length > 50 && (
                  <div className="text-[10px] italic opacity-75">
                    …and {missingMetaEntries.length - 50} more.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Backend Diff */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Backend Routes</span>
              {backendDiff && (
                <span className="text-xs text-muted-foreground font-normal">
                  Live {backendDiff.liveCount} · DB {backendDiff.dbCount} · Matched {backendDiff.matchedCount}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DiffSection
              title="Missing in DB"
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              tone="destructive"
              count={backendDiff?.missing.length ?? 0}
              empty="All live routes are seeded."
            >
              <ScrollArea className="h-48 pr-2">
                <div className="space-y-1">
                  {backendDiff?.missing.map((m) => (
                    <div
                      key={m.permission_key}
                      className="flex items-center justify-between gap-2 text-xs border border-border rounded-md px-2 py-1.5"
                    >
                      <div className="min-w-0">
                        <div className="font-mono truncate">{m.permission_key}</div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {m.method} · {m.endpoint_url}
                        </div>
                      </div>
                      {canEditRbac && onQuickCreateBackend && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 shrink-0 gap-1"
                          onClick={() => onQuickCreateBackend(m)}
                          title="Create permission"
                        >
                          <Plus className="h-3 w-3" /> Create
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DiffSection>

            <DiffSection
              title="Orphan in DB"
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
              tone="warning"
              count={backendDiff?.orphan.length ?? 0}
              empty="No stale permissions."
            >
              <ScrollArea className="h-32 pr-2">
                <div className="space-y-1">
                  {backendDiff?.orphan.map((o) => (
                    <div
                      key={o.permission_key}
                      className="text-xs border border-border rounded-md px-2 py-1.5"
                    >
                      <div className="font-mono truncate">{o.permission_key}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{o.module}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DiffSection>
          </CardContent>
        </Card>

        {/* Frontend Diff */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between gap-2 flex-wrap">
              <span>Frontend API Keys</span>
              {frontendDiff && (
                <span className="text-xs text-muted-foreground font-normal">
                  Live {frontendDiff.liveCount} · DB {frontendDiff.dbCount} · Matched {frontendDiff.matchedCount}
                </span>
              )}
            </CardTitle>
            {scanStats && (
              <div className="text-[10px] text-muted-foreground font-mono mt-1">
                runtime scan: {scanStats.liveCount} keys ({scanStats.withEndpointUrl} w/ url) from {scanStats.scannedFiles} files
                {scanStats.liveCount !== scanStats.generatedCount && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {' '}· snapshot: {scanStats.generatedCount} (Δ {Math.abs(scanStats.liveCount - scanStats.generatedCount)})
                  </span>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Filter row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchUrl}
                  onChange={e => setSearchUrl(e.target.value)}
                  placeholder="Filter by endpoint URL, key, module, source…"
                  className="h-8 pl-7 text-xs"
                />
              </div>
              <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as MethodFilter)}>
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHOD_FILTERS.map(m => (
                    <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchUrl || methodFilter !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => { setSearchUrl(''); setMethodFilter('ALL'); }}
                >
                  Clear
                </Button>
              )}
            </div>

            <DiffSection
              title="Missing in DB"
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              tone="destructive"
              count={filteredMissingFrontend.length}
              countSuffix={
                filteredMissingFrontend.length !== missingFrontend.length
                  ? ` of ${missingFrontend.length}`
                  : undefined
              }
              empty={missingFrontend.length === 0 ? 'All API keys are bound.' : 'No matches for current filter.'}
            >
              {/* Bulk selection toolbar */}
              {filteredMissingFrontend.length > 0 && canEditRbac && onQuickCreateFrontend && (
                <div className="flex items-center justify-between gap-2 px-2 py-1.5 border border-border rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false}
                      onCheckedChange={(c) => toggleAllFiltered(Boolean(c))}
                      aria-label="Select all filtered"
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {selectedKeys.size > 0
                        ? `${selectedKeys.size} selected`
                        : `Select all (${filteredMissingFrontend.length})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-[11px]"
                      disabled={selectedKeys.size === 0}
                      onClick={() => runBulk('quick')}
                      title="Quick-create permissions for all selected"
                    >
                      <Plus className="h-3 w-3" /> Quick-create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-[11px]"
                      disabled={selectedKeys.size === 0}
                      onClick={() => runBulk('manual')}
                      title="Open each selected entry for manual entry"
                    >
                      <Pencil className="h-3 w-3" /> Add manually
                    </Button>
                    {selectedKeys.size > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[11px]"
                        onClick={clearSelection}
                        title="Clear selection"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <ScrollArea className="h-48 pr-2">
                <div className="space-y-1">
                  {filteredMissingFrontend.map((m) => {
                    const checked = selectedKeys.has(m.frontendApiKey);
                    return (
                    <div
                      key={m.frontendApiKey}
                      className={`flex items-center justify-between gap-2 text-xs border rounded-md px-2 py-1.5 ${checked ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                      {canEditRbac && onQuickCreateFrontend && (
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => toggleKey(m.frontendApiKey, Boolean(c))}
                          aria-label={`Select ${m.frontendApiKey}`}
                          className="shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-mono truncate">{m.frontendApiKey}</div>
                        <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1 flex-wrap">
                          {m.method ? (
                            <Badge variant="secondary" className="px-1 py-0 h-4 text-[9px] font-mono">
                              {m.method}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="px-1 py-0 h-4 text-[9px] font-mono text-orange-600 border-orange-300">
                              ?
                            </Badge>
                          )}
                          {m.endpoint_url ? (
                            <span className="font-mono truncate">{m.endpoint_url}</span>
                          ) : (
                            <span className="italic">{m.module}</span>
                          )}
                          {m.source && (
                            <button
                              type="button"
                              onClick={() => openSource(m.source)}
                              title={`Open ${m.source}`}
                              className="inline-flex items-center gap-0.5 text-primary hover:underline shrink-0"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                              <span className="font-mono truncate max-w-[160px]">{m.source}</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {canEditRbac && onQuickCreateFrontend && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 shrink-0 gap-1"
                          onClick={() => onQuickCreateFrontend(m)}
                          title="Create binding"
                        >
                          <Plus className="h-3 w-3" /> Create
                        </Button>
                      )}
                    </div>
                  );})}
                </div>
              </ScrollArea>
            </DiffSection>

            <DiffSection
              title="Orphan in DB"
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
              tone="warning"
              count={frontendDiff?.orphan.length ?? 0}
              empty="No stale frontend keys."
            >
              <ScrollArea className="h-32 pr-2">
                <div className="space-y-1">
                  {frontendDiff?.orphan.map((o) => (
                    <div
                      key={o.frontendApiKey}
                      className="text-xs border border-border rounded-md px-2 py-1.5 font-mono truncate"
                    >
                      {o.frontendApiKey}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DiffSection>
          </CardContent>
        </Card>
      </div>

      {/* Bindings link-gap diff: backend perms ↔ rbac_permission_bindings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between gap-2 flex-wrap">
            <span>Backend ↔ Bindings link gaps</span>
            {bindingsDiff && (
              <span className="text-xs text-muted-foreground font-normal">
                Live routes {bindingsDiff.counts.liveRoutes} · Backend perms {bindingsDiff.counts.backendTotal} · Bindings {bindingsDiff.counts.bindingsTotal}
                {bindingsDiff.counts.frontendRuntime > 0 && ` · Runtime FE ${bindingsDiff.counts.frontendRuntime}`}
              </span>
            )}
          </CardTitle>
          <p className="text-[11px] text-muted-foreground mt-1">
            Lists rows that exist on one side but are not linked to the other — backend permissions with no binding,
            bindings whose backend permission was deleted, and (when runtime catalog is available) bindings/frontend keys
            with no counterpart.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DiffSection
            title="Live backend keys missing in DB"
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            tone="destructive"
            count={bindingsDiff?.liveBackendMissingInDb.length ?? 0}
            empty="Every live route has a backend permission row."
          >
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-1">
                {bindingsDiff?.liveBackendMissingInDb.map(p => (
                  <div key={p.permission_key} className="text-xs border border-border rounded-md px-2 py-1.5">
                    <div className="font-mono truncate">{p.permission_key}</div>
                    <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                      <Badge variant="secondary" className="px-1 py-0 h-4 text-[9px] font-mono">{p.method}</Badge>
                      <span className="font-mono truncate">{p.endpoint_url || `${p.controller}/${p.endpoint}`}</span>
                      <span className="italic">· {p.module}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DiffSection>

          <DiffSection
            title="Live backend keys missing in bindings"
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            tone="destructive"
            count={bindingsDiff?.liveBackendMissingInBindings.length ?? 0}
            empty="Every live route is referenced by at least one binding."
          >
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-1">
                {bindingsDiff?.liveBackendMissingInBindings.map(p => (
                  <div key={p.permission_key} className="text-xs border border-border rounded-md px-2 py-1.5">
                    <div className="font-mono truncate">{p.permission_key}</div>
                    <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                      <Badge variant="secondary" className="px-1 py-0 h-4 text-[9px] font-mono">{p.method}</Badge>
                      <span className="font-mono truncate">{p.endpoint_url || `${p.controller}/${p.endpoint}`}</span>
                      <span className="italic">· {p.module}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DiffSection>

          <DiffSection
            title="Backend perms without binding"
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            tone="destructive"
            count={bindingsDiff?.backendWithoutBinding.length ?? 0}
            empty="Every backend permission has at least one binding."
          >
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-1">
                {bindingsDiff?.backendWithoutBinding.map(p => (
                  <div
                    key={p.permission_key}
                    className="text-xs border border-border rounded-md px-2 py-1.5"
                  >
                    <div className="font-mono truncate">{p.permission_key}</div>
                    <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                      <Badge variant="secondary" className="px-1 py-0 h-4 text-[9px] font-mono">{p.method}</Badge>
                      <span className="font-mono truncate">{p.endpoint_url || `${p.controller}/${p.endpoint}`}</span>
                      <span className="italic">· {p.module}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DiffSection>

          <DiffSection
            title="Bindings without backend perm"
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            tone="destructive"
            count={bindingsDiff?.bindingWithoutBackend.length ?? 0}
            empty="All bindings reference an existing backend permission."
          >
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-1">
                {bindingsDiff?.bindingWithoutBackend.map(b => (
                  <div
                    key={b.id}
                    className="text-xs border border-border rounded-md px-2 py-1.5"
                  >
                    <div className="font-mono truncate">{b.frontendPermissionApi}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      → <span className="font-mono">{b.backendPermissionId}</span> (missing) · {b.module}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DiffSection>

          <DiffSection
            title="Bindings without runtime frontend key"
            icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
            tone="warning"
            count={bindingsDiff?.bindingWithoutFrontend.length ?? 0}
            empty={
              (bindingsDiff?.counts.frontendRuntime ?? 0) === 0
                ? 'Runtime catalog not loaded — skipped.'
                : 'All bindings match a runtime frontend key.'
            }
          >
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-1">
                {bindingsDiff?.bindingWithoutFrontend.map(b => (
                  <div
                    key={b.id}
                    className="text-xs border border-border rounded-md px-2 py-1.5"
                  >
                    <div className="font-mono truncate">{b.frontendPermissionApi}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      bound to <span className="font-mono">{b.backendPermissionId}</span> · {b.module}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DiffSection>

          <DiffSection
            title="Runtime frontend keys without binding"
            icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
            tone="warning"
            count={bindingsDiff?.frontendWithoutBinding.length ?? 0}
            empty={
              (bindingsDiff?.counts.frontendRuntime ?? 0) === 0
                ? 'Runtime catalog not loaded — skipped.'
                : 'Every runtime frontend key is bound.'
            }
          >
            <ScrollArea className="h-44 pr-2">
              <div className="space-y-1">
                {bindingsDiff?.frontendWithoutBinding.map(k => (
                  <div
                    key={k}
                    className="text-xs border border-border rounded-md px-2 py-1.5 font-mono truncate"
                  >
                    {k}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DiffSection>
        </CardContent>
      </Card>
    </div>
  );
};

const DiffSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  tone: 'destructive' | 'warning';
  count: number;
  countSuffix?: string;
  empty: string;
  children: React.ReactNode;
}> = ({ title, icon, count, countSuffix, empty, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-foreground">{title}</span>
      <Badge variant="outline" className="text-[10px]">
        {count}{countSuffix}
      </Badge>
    </div>
    {count === 0 ? (
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-3 border border-dashed border-border rounded-md">
        <CheckCircle2 className="h-3 w-3 text-green-500" /> {empty}
      </div>
    ) : (
      children
    )}
  </div>
);
