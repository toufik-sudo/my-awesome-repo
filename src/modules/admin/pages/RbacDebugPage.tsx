import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, RefreshCw, Trash2, Search, Bug } from 'lucide-react';
import { toast } from 'sonner';
import { RefreshControl } from '@/components/shared/RefreshControl';
import {
  rbacDebugApi,
  type ScopeFallbackEvent,
  type PermissionTraceResult,
  type PermissionBranchKind,
} from '../rbac-debug.api';

const ROLES = ['any', 'hyper_admin', 'hyper_manager', 'admin', 'manager', 'guest', 'user'];
const RESOURCES = ['property', 'service'] as const;

const BRANCH_TONE: Record<PermissionBranchKind, string> = {
  'explicit-properties': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'explicit-services': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'explicit-property-groups': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'explicit-service-groups': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'explicit-admins': 'bg-blue-500/10 text-blue-600 border-blue-200',
  'fallback-inherit-inviter': 'bg-amber-500/10 text-amber-700 border-amber-200',
  'all-platform-wide': 'bg-violet-500/10 text-violet-600 border-violet-200',
  'no-match': 'bg-destructive/10 text-destructive border-destructive/30',
};

export const RbacDebugPage: React.FC = () => {
  // ─── Fallback events tab ──────────────────────────────────────────────
  const [events, setEvents] = useState<ScopeFallbackEvent[]>([]);
  const [evtTotal, setEvtTotal] = useState(0);
  const [evtLoading, setEvtLoading] = useState(false);
  const [filterUserId, setFilterUserId] = useState('');
  const [filterRole, setFilterRole] = useState('any');
  const [filterPerm, setFilterPerm] = useState('');
  const [filterKind, setFilterKind] = useState<'any' | 'property' | 'service'>('any');

  const loadEvents = async () => {
    setEvtLoading(true);
    try {
      const r = await rbacDebugApi.listFallbacks({
        userId: filterUserId ? Number(filterUserId) : undefined,
        role: filterRole && filterRole !== 'any' ? filterRole : undefined,
        permissionKey: filterPerm || undefined,
        resourceKind: filterKind && filterKind !== 'any' ? filterKind : undefined,
        limit: 500,
      });
      setEvents(r.events);
      setEvtTotal(r.total);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load fallback events');
    } finally {
      setEvtLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []); // initial

  const onClearEvents = async () => {
    try {
      const r = await rbacDebugApi.clearFallbacks();
      toast.success(`Cleared ${r.cleared} event(s)`);
      loadEvents();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to clear');
    }
  };

  // ─── Trace tester tab ─────────────────────────────────────────────────
  const [tUserId, setTUserId] = useState('');
  const [tPerm, setTPerm] = useState('');
  const [tKind, setTKind] = useState<'property' | 'service'>('property');
  const [tResId, setTResId] = useState('');
  const [traceResult, setTraceResult] = useState<PermissionTraceResult | null>(null);
  const [tLoading, setTLoading] = useState(false);

  const runTrace = async () => {
    if (!tPerm) { toast.error('permissionKey is required'); return; }
    setTLoading(true);
    try {
      const r = await rbacDebugApi.trace({
        userId: tUserId ? Number(tUserId) : undefined,
        permissionKey: tPerm,
        resourceKind: tKind,
        resourceId: tResId || undefined,
      });
      setTraceResult(r);
    } catch (e: any) {
      toast.error(e?.message || 'Trace failed');
    } finally {
      setTLoading(false);
    }
  };

  const branchSummary = useMemo(() => {
    if (!traceResult) return null;
    const counts: Record<string, number> = {};
    traceResult.branches.forEach(b => { counts[b.branch] = (counts[b.branch] || 0) + 1; });
    return counts;
  }, [traceResult]);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Bug className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">RBAC Debug Console</h1>
            <p className="text-sm text-muted-foreground">
              Trace scope resolution and inspect inviter-fallback events.
            </p>
          </div>
        </div>
        <RefreshControl onRefresh={loadEvents} storageKey="rbac-debug-events" />
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Scope-fallback events</TabsTrigger>
          <TabsTrigger value="trace">Permission trace</TabsTrigger>
        </TabsList>

        {/* ─── Events ───────────────────────────────────────────────── */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                Recent fallbacks · buffer size {evtTotal}
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={loadEvents} disabled={evtLoading}>
                  {evtLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="destructive" onClick={onClearEvents}>
                  <Trash2 className="h-4 w-4 mr-1" /> Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <Label>User ID</Label>
                  <Input value={filterUserId} onChange={e => setFilterUserId(e.target.value)} placeholder="e.g. 42" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger><SelectValue placeholder="any" /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Permission key</Label>
                  <Input value={filterPerm} onChange={e => setFilterPerm(e.target.value)} placeholder="backend.X.Y.GET" />
                </div>
                <div>
                  <Label>Resource</Label>
                  <Select value={filterKind} onValueChange={(v: any) => setFilterKind(v)}>
                    <SelectTrigger><SelectValue placeholder="any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">any</SelectItem>
                      <SelectItem value="property">property</SelectItem>
                      <SelectItem value="service">service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={loadEvents} disabled={evtLoading} className="w-full">
                    <Search className="h-4 w-4 mr-1" /> Apply
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[500px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permission key</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Inviter(s)</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No fallback events. {evtTotal === 0 ? 'Buffer is empty.' : 'No matches for the current filters.'}
                      </TableCell></TableRow>
                    )}
                    {events.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {new Date(e.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{e.userId ?? '—'}</TableCell>
                        <TableCell><Badge variant="outline">{e.role || '—'}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{e.permissionKey || '—'}</TableCell>
                        <TableCell>{e.resourceKind}</TableCell>
                        <TableCell className="font-mono text-xs">[{e.inviterIds.join(', ')}]</TableCell>
                        <TableCell>{e.resolvedCount}</TableCell>
                        <TableCell className="max-w-md text-xs text-muted-foreground">{e.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Trace ────────────────────────────────────────────────── */}
        <TabsContent value="trace" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Run a permission trace</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <Label>User ID (optional)</Label>
                  <Input value={tUserId} onChange={e => setTUserId(e.target.value)} placeholder="me by default" />
                </div>
                <div className="md:col-span-2">
                  <Label>Permission key</Label>
                  <Input value={tPerm} onChange={e => setTPerm(e.target.value)} placeholder="backend.PropertiesController.findAll.GET" />
                </div>
                <div>
                  <Label>Resource</Label>
                  <Select value={tKind} onValueChange={(v: any) => setTKind(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RESOURCES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Resource ID (optional)</Label>
                  <Input value={tResId} onChange={e => setTResId(e.target.value)} placeholder="check allowed?" />
                </div>
              </div>
              <Button onClick={runTrace} disabled={tLoading}>
                {tLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Trace
              </Button>

              {traceResult && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={traceResult.allowed ? 'default' : 'destructive'}>
                      {traceResult.allowed ? 'ALLOWED' : 'DENIED'}
                    </Badge>
                    <Badge variant="outline">role: {traceResult.role}</Badge>
                    {traceResult.fellBackToInviter && (
                      <Badge className={BRANCH_TONE['fallback-inherit-inviter']}>inviter fallback</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{traceResult.summary}</span>
                  </div>

                  <div className="text-sm">
                    Effective IDs: {traceResult.effectiveIds === null
                      ? <Badge variant="outline">unrestricted (null)</Badge>
                      : <span className="font-mono">{traceResult.effectiveIds.length === 0 ? '∅' : `${traceResult.effectiveIds.length} id(s)`}</span>}
                  </div>

                  {branchSummary && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(branchSummary).map(([b, n]) => (
                        <Badge key={b} className={BRANCH_TONE[b as PermissionBranchKind]}>{b} × {n}</Badge>
                      ))}
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Resolution steps</h4>
                    <ol className="space-y-1 text-sm">
                      {traceResult.steps.map(s => (
                        <li key={s.step} className="flex gap-2">
                          <span className="font-mono text-xs text-muted-foreground">#{s.step}</span>
                          <span className="font-medium">{s.label}:</span>
                          <span className="text-muted-foreground">{s.detail}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Branch evaluations</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Branch</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Inviter</TableHead>
                          <TableHead>Contributes</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {traceResult.branches.map((b, i) => (
                          <TableRow key={i}>
                            <TableCell><Badge className={BRANCH_TONE[b.branch]}>{b.branch}</Badge></TableCell>
                            <TableCell className="font-mono text-xs">{b.scope}</TableCell>
                            <TableCell className="font-mono text-xs">{b.assignedById ?? '—'}</TableCell>
                            <TableCell className="font-mono text-xs">{b.contributesIds.length}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{b.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RbacDebugPage;
