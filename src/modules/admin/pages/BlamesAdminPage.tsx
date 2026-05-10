import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface Blame {
  id: string;
  userId: number;
  type: string;
  reason: string;
  bookingRef?: string;
  createdAt: string;
  removedAt?: string | null;
  user?: { id: number; firstName?: string; lastName?: string; email?: string };
}

/** Hyper admin/manager page to review and clear user blames. */
export default function BlamesAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Blame[]>([]);
  const [active, setActive] = useState<'true' | 'false' | ''>('true');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/user-blames', { params: active ? { active } : {} });
      setItems((r.data as Blame[]) || []);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [active]);

  const remove = async (id: string) => {
    const note = window.prompt(t('blame.removeNotePrompt') || 'Removal note (optional):') || '';
    await api.delete(`/user-blames/${id}`, { data: { note } });
    load();
  };

  return (
    <div className="container py-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{t('blame.adminTitle') || 'User trust badges'}</h1>
        <div className="flex gap-2">
          <Button variant={active === 'true' ? 'default' : 'outline'} size="sm" onClick={() => setActive('true')}>
            {t('blame.activeOnly') || 'Active'}
          </Button>
          <Button variant={active === 'false' ? 'default' : 'outline'} size="sm" onClick={() => setActive('false')}>
            {t('blame.removed') || 'Removed'}
          </Button>
          <Button variant={active === '' ? 'default' : 'outline'} size="sm" onClick={() => setActive('')}>
            {t('common.all') || 'All'}
          </Button>
        </div>
      </div>

      {loading && <p className="text-muted-foreground text-sm">{t('common.loading') || 'Loading…'}</p>}

      <div className="grid gap-3">
        {items.map((b) => (
          <Card key={b.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {b.user?.firstName} {b.user?.lastName}
                <span className="text-muted-foreground text-xs">({b.user?.email})</span>
                <Badge variant={b.removedAt ? 'secondary' : 'destructive'}>{b.type}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{b.reason}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(b.createdAt).toLocaleString()}
                {b.bookingRef ? ` • ${b.bookingRef.slice(0, 8)}` : ''}
              </p>
              {!b.removedAt && (
                <Button size="sm" variant="outline" onClick={() => remove(b.id)}>
                  {t('blame.remove') || 'Remove badge'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">{t('blame.empty') || 'No badges to display.'}</p>
        )}
      </div>
    </div>
  );
}
