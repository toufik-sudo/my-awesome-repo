import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Mail, MousePointerClick, Eye, AlertTriangle, Bot, Users,
  TrendingUp, ExternalLink, Shield, Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { emailTrackingApi, type EmailAnalytics } from '../email-tracking.api';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';

const PERIOD_OPTIONS = [
  { value: '7', label: '7 jours' },
  { value: '14', label: '14 jours' },
  { value: '30', label: '30 jours' },
  { value: '90', label: '90 jours' },
];

const EVENT_COLORS: Record<string, string> = {
  sent: 'hsl(var(--primary))',
  delivered: 'hsl(var(--secondary))',
  opened: 'hsl(38, 92%, 50%)',
  clicked: 'hsl(262, 83%, 58%)',
  bounced: 'hsl(var(--destructive))',
  spam_report: 'hsl(0, 70%, 45%)',
};

const PIE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(38, 92%, 50%)',
  'hsl(262, 83%, 58%)',
  'hsl(var(--destructive))',
];

export const EmailAnalyticsPage: React.FC = () => {
  const [days, setDays] = useState('30');

  const { data, isLoading, error } = useQuery({
    queryKey: ['email-analytics', days],
    queryFn: () => emailTrackingApi.getAnalytics(parseInt(days)),
    refetchInterval: 60_000,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center text-destructive">Erreur de chargement des analytics</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tracking des ouvertures, clics et détection de bots
          </p>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <KPICards data={data} />

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="templates">Par template</TabsTrigger>
          <TabsTrigger value="links">Liens trackés</TabsTrigger>
          <TabsTrigger value="events">Événements récents</TabsTrigger>
          <TabsTrigger value="bots">Détection bots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab data={data} />
        </TabsContent>
        <TabsContent value="templates">
          <TemplatesTab data={data} />
        </TabsContent>
        <TabsContent value="links">
          <LinksTab data={data} />
        </TabsContent>
        <TabsContent value="events">
          <EventsTab data={data} />
        </TabsContent>
        <TabsContent value="bots">
          <BotDetectionTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─── KPI Cards ──────────────────────────────────────────────────── */

const KPICards: React.FC<{ data: EmailAnalytics }> = ({ data }) => {
  const cards = [
    { label: 'Emails envoyés', value: data.totalSent, icon: Mail, color: 'text-primary' },
    { label: 'Ouvertures (humains)', value: data.totalOpened, icon: Eye, color: 'text-amber-500', sub: `${data.openRate.toFixed(1)}%` },
    { label: 'Clics (humains)', value: data.totalClicked, icon: MousePointerClick, color: 'text-purple-500', sub: `CTR: ${data.ctr.toFixed(1)}%` },
    { label: 'Bounces', value: data.totalBounced, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Bot opens', value: `${data.botOpenRate.toFixed(0)}%`, icon: Bot, color: 'text-muted-foreground', sub: 'des ouvertures' },
    { label: 'Spam reports', value: data.totalSpam, icon: Shield, color: 'text-destructive' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className={`h-4 w-4 ${c.color}`} />
              <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            {c.sub && <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* ─── Overview Tab ───────────────────────────────────────────────── */

const OverviewTab: React.FC<{ data: EmailAnalytics }> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Tendances quotidiennes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data.byDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(v) => new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Area type="monotone" dataKey="sent" name="Envoyés" stroke={EVENT_COLORS.sent} fill={EVENT_COLORS.sent} fillOpacity={0.15} />
            <Area type="monotone" dataKey="opened" name="Ouverts" stroke={EVENT_COLORS.opened} fill={EVENT_COLORS.opened} fillOpacity={0.15} />
            <Area type="monotone" dataKey="clicked" name="Cliqués" stroke={EVENT_COLORS.clicked} fill={EVENT_COLORS.clicked} fillOpacity={0.15} />
            <Area type="monotone" dataKey="bounced" name="Bounces" stroke={EVENT_COLORS.bounced} fill={EVENT_COLORS.bounced} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-secondary" />
          Répartition des événements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              dataKey="value"
              data={[
                { name: 'Envoyés', value: data.totalSent },
                { name: 'Ouverts', value: data.totalOpened },
                { name: 'Cliqués', value: data.totalClicked },
                { name: 'Bounces', value: data.totalBounced },
                { name: 'Spam', value: data.totalSpam },
              ].filter(d => d.value > 0)}
              cx="50%" cy="50%" outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

/* ─── Templates Tab ──────────────────────────────────────────────── */

const TemplatesTab: React.FC<{ data: EmailAnalytics }> = ({ data }) => (
  <div className="space-y-6">
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Performance par template</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.byTemplate} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis dataKey="templateName" type="category" width={120} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="sent" name="Envoyés" fill={EVENT_COLORS.sent} radius={[0, 4, 4, 0]} />
            <Bar dataKey="opened" name="Ouverts" fill={EVENT_COLORS.opened} radius={[0, 4, 4, 0]} />
            <Bar dataKey="clicked" name="Cliqués" fill={EVENT_COLORS.clicked} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Template</TableHead>
              <TableHead className="text-right">Envoyés</TableHead>
              <TableHead className="text-right">Ouverts</TableHead>
              <TableHead className="text-right">Cliqués</TableHead>
              <TableHead className="text-right">Open Rate</TableHead>
              <TableHead className="text-right">CTR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.byTemplate.map((t) => (
              <TableRow key={t.templateName} className="border-border">
                <TableCell className="font-medium">{t.templateName}</TableCell>
                <TableCell className="text-right">{t.sent}</TableCell>
                <TableCell className="text-right">{t.opened}</TableCell>
                <TableCell className="text-right">{t.clicked}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={t.openRate > 30 ? 'default' : 'secondary'}>
                    {t.openRate.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={t.ctr > 5 ? 'default' : 'secondary'}>
                    {t.ctr.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

/* ─── Links Tab ──────────────────────────────────────────────────── */

const LinksTab: React.FC<{ data: EmailAnalytics }> = ({ data }) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <ExternalLink className="h-4 w-4 text-primary" />
        Top liens trackés
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead>URL</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead className="text-right">Total clics</TableHead>
            <TableHead className="text-right">Humains</TableHead>
            <TableHead className="text-right">Bots</TableHead>
            <TableHead className="text-right">Bot %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.topLinks.map((link, i) => (
            <TableRow key={i} className="border-border">
              <TableCell className="font-mono text-xs max-w-[300px] truncate" title={link.originalUrl}>
                {link.originalUrl}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{link.linkTag}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">{link.totalClicks}</TableCell>
              <TableCell className="text-right text-secondary">{link.humanClicks}</TableCell>
              <TableCell className="text-right text-destructive">{link.botClicks}</TableCell>
              <TableCell className="text-right">
                {link.totalClicks > 0
                  ? <Badge variant={link.botClicks / link.totalClicks > 0.5 ? 'destructive' : 'secondary'}>
                      {((link.botClicks / link.totalClicks) * 100).toFixed(0)}%
                    </Badge>
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
          {data.topLinks.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Aucun lien tracké pour cette période
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

/* ─── Events Tab ─────────────────────────────────────────────────── */

const EventsTab: React.FC<{ data: EmailAnalytics }> = ({ data }) => {
  const eventBadge = (type: string) => {
    const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      sent: 'outline', delivered: 'secondary', opened: 'default',
      clicked: 'default', bounced: 'destructive', spam_report: 'destructive',
    };
    return map[type] || 'outline';
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Événements récents (style webhook)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-[140px]">Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Sujet / URL</TableHead>
                <TableHead>Bot ?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentEvents.map((e) => (
                <TableRow key={e.id} className="border-border">
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(e.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={eventBadge(e.eventType)} className="text-xs">
                      {e.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{e.recipientEmail}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">
                    {e.clickedUrl || e.subject || e.templateName || '—'}
                  </TableCell>
                  <TableCell>
                    {e.isBot ? (
                      <Badge variant="destructive" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        {e.botReason}
                      </Badge>
                    ) : e.jsVerified ? (
                      <Badge variant="default" className="text-xs bg-secondary">
                        <Users className="h-3 w-3 mr-1" />
                        JS vérifié
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Humain</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── Bot Detection Tab ──────────────────────────────────────────── */

const BotDetectionTab: React.FC<{ data: EmailAnalytics }> = ({ data }) => {
  const botEvents = data.recentEvents.filter(e => e.isBot);
  const botReasons = botEvents.reduce<Record<string, number>>((acc, e) => {
    const reason = e.botReason || 'unknown';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(botReasons)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4 text-destructive" />
            Détection avancée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Ouvertures bot</p>
              <p className="text-2xl font-bold text-foreground">{data.botOpenRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Clics bot</p>
              <p className="text-2xl font-bold text-foreground">{data.botClickRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Méthodes de détection :</h4>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> User-Agent bot connu</li>
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> IP scanner (Google, Microsoft)</li>
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> Réponse trop rapide (&lt; 300ms)</li>
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> Vélocité clics excessive</li>
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> Pixel honeypot invisible</li>
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-primary" /> Challenge JavaScript</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Raisons de détection</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={pieData}
                  cx="50%" cy="50%" outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground">
              Aucun bot détecté sur cette période
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
