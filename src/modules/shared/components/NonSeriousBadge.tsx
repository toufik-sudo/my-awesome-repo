import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/axios';

interface Props {
  userId: number | string;
  className?: string;
}

interface PublicBlame {
  count: number;
  isNonSerious: boolean;
}

/**
 * Public-facing badge shown on user profiles & cards when the user has
 * one or more active blames (guest_no_payment, host_no_response, etc.).
 */
export function NonSeriousBadge({ userId, className }: Props) {
  const { t } = useTranslation();
  const [data, setData] = useState<PublicBlame | null>(null);

  useEffect(() => {
    let alive = true;
    api.get(`/user-blames/user/${userId}/public`)
      .then((r: any) => { if (alive) setData(r.data); })
      .catch(() => {});
    return () => { alive = false; };
  }, [userId]);

  if (!data?.isNonSerious) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={
            'inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive ' +
            (className || '')
          }
        >
          <ShieldAlert className="h-3 w-3" aria-hidden />
          {t('blame.nonSerious') || 'Non-serious'}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {t('blame.tooltip', { count: data.count }) ||
          `${data.count} active reliability flag(s). Contact support to dispute.`}
      </TooltipContent>
    </Tooltip>
  );
}

export default NonSeriousBadge;
