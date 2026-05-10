import { useEffect, useState } from 'react';
import { escrowApi, ReactivationQuote, PlatformAccount } from '@/modules/payments/escrow.api';
import { toast } from 'sonner';

export default function HostReactivationPage() {
  const [quote, setQuote] = useState<ReactivationQuote | null>(null);
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [q, a] = await Promise.all([
          escrowApi.getMyReactivationQuote(),
          escrowApi.listPlatformAccountsForReactivation(),
        ]);
        setQuote(q); setAccounts(a);
      } catch (e: any) { toast.error(e?.message || 'Failed to load quote'); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!quote) return <p className="p-6">Unable to load reactivation quote.</p>;

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Réactivation du compte</h1>
      <div className="border rounded p-4 space-y-2">
        <div className="flex justify-between"><span>Frais plateforme dus</span><span>{quote.debtTotal} {quote.currency}</span></div>
        <div className="flex justify-between"><span>Pénalité de réactivation</span><span>{quote.penalty} {quote.currency}</span></div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total à régler</span><span>{quote.total} {quote.currency}</span>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Choisissez votre mode de paiement</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Vous pouvez régler par virement (envoyez votre reçu via la page Paiement habituelle, type <em>réactivation</em>),
          ou par carte (Stripe). L'hyper-admin confirmera la réception.
        </p>
        <div className="space-y-2">
          {accounts.map((a) => (
            <div key={a.id} className="border rounded p-3 text-sm">
              <div className="font-medium">{a.bankName} ({a.accountType.toUpperCase()})</div>
              <div className="text-muted-foreground">N° {a.accountNumber} · Titulaire: {a.holderName}</div>
              {a.instructions && <div className="text-xs mt-1">{a.instructions}</div>}
            </div>
          ))}
          {accounts.length === 0 && <p className="text-sm text-muted-foreground">Aucun compte de réactivation configuré.</p>}
        </div>
      </div>
    </div>
  );
}
