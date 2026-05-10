import { useEffect, useState } from 'react';
import { escrowApi, HostPayout, BookingDispute } from '@/modules/payments/escrow.api';
import { toast } from 'sonner';
import { RefreshControl } from '@/components/shared/RefreshControl';

export default function EscrowAdminPage() {
  const [tab, setTab] = useState<'payouts' | 'disputes'>('payouts');
  const [payouts, setPayouts] = useState<HostPayout[]>([]);
  const [disputes, setDisputes] = useState<BookingDispute[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      if (tab === 'payouts') setPayouts(await escrowApi.listPayouts());
      else setDisputes(await escrowApi.listDisputes());
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load');
    } finally { setLoading(false); }
  };
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [tab]);

  const resolve = async (d: BookingDispute, resolution: BookingDispute['resolution']) => {
    const refundStr = resolution?.startsWith('refund') ? prompt('Refund amount?', '0') : '0';
    const note = prompt('Resolution note (optional)', '') || undefined;
    try {
      await escrowApi.resolveDispute(d.id, {
        resolution, refundAmount: Number(refundStr) || 0, note,
      });
      toast.success(`Dispute ${d.id.slice(0,8)} resolved (${resolution})`);
      reload();
    } catch (e: any) { toast.error(e?.message || 'Failed'); }
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Escrow & Disputes</h1>
        <RefreshControl onRefresh={reload} storageKey="escrow-admin" />
      </div>
      <div className="flex gap-2">
        {(['payouts', 'disputes'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {tab === 'payouts' && (
        <table className="w-full border-collapse">
          <thead><tr className="border-b">
            <th className="text-left p-2">ID</th><th>Host</th><th>Gross</th><th>Fee</th><th>Net</th>
            <th>Status</th><th>Release at</th>
          </tr></thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2 font-mono text-xs">{p.id.slice(0,8)}</td>
                <td>{p.host?.email}</td>
                <td>{p.grossAmount} {p.currency}</td>
                <td>{p.platformFee}</td>
                <td className="font-semibold">{p.netAmount}</td>
                <td><span className="px-2 py-1 rounded text-xs bg-muted">{p.status}</span></td>
                <td className="text-xs">{new Date(p.releaseAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'disputes' && (
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="border rounded p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{d.subject}</div>
                  <div className="text-sm text-muted-foreground">
                    {d.guest?.email} · severity={d.severity} · status={d.status}
                  </div>
                </div>
                <div className="text-xs">{new Date(d.createdAt).toLocaleDateString()}</div>
              </div>
              <p className="text-sm">{d.description}</p>
              {d.status === 'open' && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => resolve(d, 'release_to_host')} className="px-3 py-1 rounded bg-muted text-sm">Release to host</button>
                  <button onClick={() => resolve(d, 'refund_partial')} className="px-3 py-1 rounded bg-secondary text-sm">Partial refund</button>
                  <button onClick={() => resolve(d, 'refund_full')} className="px-3 py-1 rounded bg-destructive text-destructive-foreground text-sm">Full refund</button>
                  <button onClick={() => resolve(d, 'host_suspended')} className="px-3 py-1 rounded bg-destructive text-destructive-foreground text-sm">Suspend host</button>
                  <button onClick={() => resolve(d, 'host_archived')} className="px-3 py-1 rounded bg-destructive text-destructive-foreground text-sm">Archive host</button>
                </div>
              )}
              {d.resolution && (
                <div className="text-xs text-muted-foreground">
                  Resolved: {d.resolution} · refund={d.refundAmount}
                  {d.resolutionNote && <> · {d.resolutionNote}</>}
                </div>
              )}
            </div>
          ))}
          {disputes.length === 0 && !loading && <p className="text-muted-foreground">No disputes.</p>}
        </div>
      )}
    </div>
  );
}
