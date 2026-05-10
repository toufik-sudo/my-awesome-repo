import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bug, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { rbacDebugApi, type PermissionTraceResult } from '../rbac-debug.api';

interface AccessSourcePanelProps {
  /** Backend permission key driving the listing — e.g. backend.PropertiesController.findAll.GET */
  permissionKey: string;
  resourceKind: 'property' | 'service';
  /** Optional resource id to also assert allowed?(resource) */
  resourceId?: string;
  /** Show only when the URL contains ?debug=1 (or always if true). */
  alwaysShow?: boolean;
  className?: string;
}

/**
 * Compact debug panel that calls /rbac-debug/trace for the current user and
 * surfaces whether their list access is from explicit scope or inviter
 * fallback — with the underlying logged reason. Intended for property /
 * service list pages while troubleshooting.
 */
export const AccessSourcePanel: React.FC<AccessSourcePanelProps> = ({
  permissionKey,
  resourceKind,
  resourceId,
  alwaysShow = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PermissionTraceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible = alwaysShow ||
    (typeof window !== 'undefined' && /[?&]debug=1\b/.test(window.location.search));

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    rbacDebugApi
      .trace({ permissionKey, resourceKind, resourceId })
      .then(r => { if (!cancelled) setData(r); })
      .catch(e => { if (!cancelled) setError(e?.message || 'trace failed'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [permissionKey, resourceKind, resourceId, visible]);

  if (!visible) return null;

  const tone = data?.fellBackToInviter
    ? 'bg-amber-500/10 text-amber-700 border-amber-200'
    : data?.allowed
    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
    : 'bg-destructive/10 text-destructive border-destructive/30';

  return (
    <Card className={`p-3 text-sm border-dashed ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Bug className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Access source</span>
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        {error && <Badge variant="destructive">{error}</Badge>}
        {data && (
          <>
            <Badge className={tone}>
              {data.fellBackToInviter ? 'inviter fallback' : data.allowed ? 'explicit scope' : 'denied'}
            </Badge>
            <Badge variant="outline">role: {data.role}</Badge>
            <span className="text-xs text-muted-foreground">{data.summary}</span>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 px-2"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {open && data && (
        <div className="mt-2 space-y-2">
          <ol className="space-y-1 text-xs text-muted-foreground">
            {data.steps.map(s => (
              <li key={s.step}><span className="font-mono">#{s.step}</span> {s.label}: {s.detail}</li>
            ))}
          </ol>
          {data.branches.length > 0 && (
            <ul className="space-y-1 text-xs">
              {data.branches.map((b, i) => (
                <li key={i}>
                  <Badge variant="outline" className="mr-2">{b.branch}</Badge>
                  <span className="text-muted-foreground">{b.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
};

export default AccessSourcePanel;
