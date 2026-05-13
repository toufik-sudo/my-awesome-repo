import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { escrowApi, BookingDispute, HostPayout } from '@/modules/payments/escrow.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, RefreshCcw, XCircle, Wallet, ExternalLink } from 'lucide-react';
import { ADMIN_ROUTES, PROPERTY_ROUTES, SERVICE_ROUTES } from '@/routes/routes.constants';

function getServiceTitle(service?: { title?: any }): string {
  if (!service) return '';
  if (typeof service.title === 'string' && service.title.trim()) return service.title;
  if (service.title?.fr) return service.title.fr;
  if (service.title?.en) return service.title.en;
  return '';
}

function getPropertyTitle(property?: { title?: string }): string {
  return property?.title?.trim() || '';
}

type RefundStage = 'pending' | 'validated' | 'refunded' | 'partial' | 'rejected';

const STAGES: { key: RefundStage; icon: any }[] = [
  { key: 'pending', icon: Clock },
  { key: 'validated', icon: CheckCircle2 },
  { key: 'partial', icon: Wallet },
  { key: 'refunded', icon: RefreshCcw },
];

export default function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [data, setData] = useState<{
    dispute?: BookingDispute;
    payout?: HostPayout;
    refundStage?: RefundStage;
    refundAmount?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!id) return;
    try {
      const res = await escrowApi.getDisputeRefundStatus(id);
      if (!res.found) {
        toast.error(t('disputes.notFound', 'Réclamation introuvable'));
        return;
      }
      setData(res);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [id]);

  if (loading) return <div className="container mx-auto p-6"><Skeleton className="h-64 w-full" /></div>;
  if (!data?.dispute) return <div className="container mx-auto p-6">—</div>;

  const { dispute, payout, refundStage, refundAmount } = data;
  const isRejected = refundStage === 'rejected';
  const activeIndex = isRejected ? -1 : STAGES.findIndex((s) => s.key === refundStage);

  return (
    <div className="container mx-auto p-6 space-y-4 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <Link to={ADMIN_ROUTES.MY_DISPUTES} className="text-sm text-muted-foreground hover:underline">
          ← {t('disputes.back', 'Mes réclamations')}
        </Link>
        <Button variant="outline" size="sm" onClick={reload}>
          <RefreshCcw className="h-3.5 w-3.5 mr-1" />
          {t('common.refresh', 'Rafraîchir')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{dispute.subject}</CardTitle>
            <Badge variant="outline">{t(`disputes.status.${dispute.status}`, dispute.status)}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
            <Badge
              variant="outline"
              className={dispute.serviceBookingId
                ? 'bg-sky-500/10 text-sky-700 border-sky-500/30'
                : 'bg-violet-500/10 text-violet-700 border-violet-500/30'}
            >
              {dispute.serviceBookingId
                ? t('disputes.type.service', 'Service')
                : t('disputes.type.property', 'Propriété')}
            </Badge>
            {(() => {
              const title = dispute.serviceBookingId
                ? getServiceTitle(dispute.serviceBooking?.service)
                : getPropertyTitle(dispute.booking?.property);
              return (
                <span className="font-medium text-foreground">
                  {title || (dispute.serviceBookingId
                    ? t('disputes.fallback.service', 'Service sans nom')
                    : t('disputes.fallback.property', 'Propriété sans nom'))}
                </span>
              );
            })()}
            <span className="font-mono">
              #{(dispute.bookingId || dispute.serviceBookingId || '').slice(0, 8)}
            </span>
            <span>·</span>
            <span>
              {t('disputes.opened', 'Ouverte le')} {new Date(dispute.createdAt).toLocaleString()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-wrap">{dispute.description}</p>

          {/* Refund tracker */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="text-sm font-semibold mb-3">
              {t('disputes.refundTracker', 'État du remboursement')}
            </div>

            {isRejected ? (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {t('disputes.stage.rejected', 'Réclamation rejetée — pas de remboursement')}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                {STAGES.map((s, idx) => {
                  const Icon = s.icon;
                  const done = idx <= activeIndex;
                  const active = idx === activeIndex;
                  return (
                    <div key={s.key} className="flex-1 flex flex-col items-center text-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                        done ? 'bg-emerald-500 border-emerald-500 text-white'
                          : active ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs mt-1 ${done || active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {t(`disputes.stage.${s.key}`, s.key)}
                      </span>
                      {idx < STAGES.length - 1 && (
                        <div className={`hidden sm:block h-0.5 w-full mt-[-22px] -z-10 ${
                          idx < activeIndex ? 'bg-emerald-500' : 'bg-muted-foreground/20'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {refundAmount && refundAmount > 0 && (
              <div className="mt-4 text-sm">
                <span className="text-muted-foreground">{t('disputes.refundAmount', 'Montant remboursé')}: </span>
                <span className="font-semibold">{refundAmount} {payout?.currency || 'DZD'}</span>
              </div>
            )}
          </div>

          {dispute.resolution && (
            <div className="text-sm">
              <span className="text-muted-foreground">{t('disputes.resolution', 'Résolution')}: </span>
              <span className="font-medium">{t(`disputes.resolutionType.${dispute.resolution}`, dispute.resolution)}</span>
              {dispute.resolutionNote && (
                <p className="text-xs text-muted-foreground mt-1">{dispute.resolutionNote}</p>
              )}
            </div>
          )}

          {payout && (
            <div className="border-t pt-3 text-xs text-muted-foreground space-y-1">
              <div>{t('disputes.payoutStatus', 'Statut paiement hôte')}: <span className="font-mono">{payout.status}</span></div>
              <div>{t('disputes.payoutGross', 'Montant brut')}: {payout.grossAmount} {payout.currency}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
