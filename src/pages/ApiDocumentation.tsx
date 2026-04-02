import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search, ChevronRight, ChevronDown, Lock, Globe, Shield,
  Copy, Check, FileJson, BookOpen, Zap, ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SwaggerSpec {
  info: { title: string; version: string; description?: string };
  tags?: Array<{ name: string; description?: string }>;
  paths: Record<string, Record<string, SwaggerOperation>>;
  components?: { schemas?: Record<string, any>; securitySchemes?: Record<string, any> };
}

interface SwaggerOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  security?: Array<Record<string, string[]>>;
  parameters?: any[];
  requestBody?: any;
  responses?: Record<string, any>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
  get: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  post: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  put: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  patch: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
  delete: 'bg-red-500/15 text-red-600 border-red-500/30',
};

const METHOD_BG: Record<string, string> = {
  get: 'border-l-emerald-500',
  post: 'border-l-blue-500',
  put: 'border-l-amber-500',
  patch: 'border-l-orange-500',
  delete: 'border-l-red-500',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8095/api';
const SWAGGER_JSON_URL = `${API_URL}/docs-json`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveRef = (ref: string, spec: SwaggerSpec): any => {
  const path = ref.replace('#/', '').split('/');
  let obj: any = spec;
  for (const key of path) obj = obj?.[key];
  return obj;
};

const getSchemaDisplay = (schema: any, spec: SwaggerSpec, depth = 0): string => {
  if (!schema) return 'any';
  if (schema.$ref) {
    const name = schema.$ref.split('/').pop();
    if (depth > 2) return name || 'object';
    const resolved = resolveRef(schema.$ref, spec);
    return resolved ? getSchemaDisplay(resolved, spec, depth + 1) : name || 'object';
  }
  if (schema.type === 'array') {
    return `${getSchemaDisplay(schema.items, spec, depth)}[]`;
  }
  if (schema.type === 'object' && schema.properties) {
    if (depth > 1) return 'object';
    const props = Object.entries(schema.properties)
      .slice(0, 6)
      .map(([k, v]: [string, any]) => `${k}: ${getSchemaDisplay(v, spec, depth + 1)}`)
      .join(', ');
    const more = Object.keys(schema.properties).length > 6 ? ', ...' : '';
    return `{ ${props}${more} }`;
  }
  if (schema.enum) return schema.enum.map((e: string) => `'${e}'`).join(' | ');
  return schema.type || 'any';
};

// ─── Fallback embedded spec ───────────────────────────────────────────────────

const FALLBACK_SPEC: SwaggerSpec = {
  info: {
    title: 'Rent & Tourism Platform API',
    version: '1.0.0',
    description: `Complete REST API documentation for the rental & tourism platform.

### Role Hierarchy
| Role | Level |
|------|-------|
| \`hyper_admin\` | 5 — Platform super-admin |
| \`hyper_manager\` | 4 — Platform manager |
| \`admin\` | 3 — Host / Property owner |
| \`manager\` | 2 — Delegated manager |
| \`user\` | 1 — Regular user / Guest |

### Payment Methods (Algeria)
\`ccp\`, \`baridi_mob\`, \`edahabia\`, \`cib\`, \`cash\`, \`bank_transfer\``,
  },
  tags: [
    { name: 'Auth', description: 'Authentication & session management' },
    { name: 'SSO', description: 'Single Sign-On (Google, etc.)' },
    { name: 'Users', description: 'User management & avatar' },
    { name: 'Roles', description: 'Role & permission management' },
    { name: 'Invitations', description: 'User invitations' },
    { name: 'Referrals', description: 'Referral & sharing system' },
    { name: 'Properties', description: 'Property CRUD & search' },
    { name: 'Property Groups', description: 'Group properties for management' },
    { name: 'Bookings', description: 'Property booking lifecycle' },
    { name: 'Services', description: 'Tourism services CRUD & search' },
    { name: 'Service Groups', description: 'Group services for management' },
    { name: 'Service Bookings', description: 'Service booking lifecycle' },
    { name: 'Reviews', description: 'Property reviews' },
    { name: 'Favorites', description: 'User favorites / wishlist' },
    { name: 'Comments', description: 'Social comments on properties/services' },
    { name: 'Reactions', description: 'Likes & reactions' },
    { name: 'Rankings', description: 'User leaderboard & ranking' },
    { name: 'Points', description: 'Points system & transactions' },
    { name: 'Profiles', description: 'User profiles' },
    { name: 'Settings', description: 'User preferences & notifications' },
    { name: 'Payments', description: 'Transfer accounts & receipt validation' },
    { name: 'Documents', description: 'Property document validation' },
    { name: 'Hyper Management', description: 'Platform-level pause/archive/delete' },
    { name: 'Dashboard', description: 'Admin dashboard stats' },
    { name: 'Notifications', description: 'Push & email notifications' },
    { name: 'Support', description: 'Support chat & ticketing' },
    { name: 'Cancellation Rules', description: 'Host cancellation policies' },
    { name: 'Fee Absorption', description: 'Host fee absorption settings' },
    { name: 'Service Fees', description: 'Platform service fee rules' },
    { name: 'Points Rules', description: 'Points earning/conversion rules' },
    { name: 'Saved Search Alerts', description: 'Property search alerts' },
  ],
  paths: {
    '/auth/register': {
      post: { tags: ['Auth'], summary: 'Register a new user', description: 'Creates a new user account with OTP verification' },
    },
    '/auth/login': {
      post: { tags: ['Auth'], summary: 'Login with credentials', description: 'Returns JWT access_token and refreshToken' },
    },
    '/auth/activate': {
      post: { tags: ['Auth'], summary: 'Activate account with OTP' },
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Refresh JWT token', description: 'Exchange a refresh token for a new access token' },
    },
    '/auth/forgot-password': {
      post: { tags: ['Auth'], summary: 'Request password reset' },
    },
    '/sso/google': {
      get: { tags: ['SSO'], summary: 'Initiate Google OAuth flow' },
    },
    '/users': {
      get: { tags: ['Users'], summary: 'List all users (admin)', security: [{ 'JWT-auth': [] }] },
    },
    '/users/{id}': {
      get: { tags: ['Users'], summary: 'Get user by ID', security: [{ 'JWT-auth': [] }] },
      put: { tags: ['Users'], summary: 'Update user', security: [{ 'JWT-auth': [] }] },
      delete: { tags: ['Users'], summary: 'Delete user (hyper_admin)', security: [{ 'JWT-auth': [] }] },
    },
    '/roles': {
      get: { tags: ['Roles'], summary: 'List user roles', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Roles'], summary: 'Assign role to user', security: [{ 'JWT-auth': [] }] },
    },
    '/roles/{id}': {
      delete: { tags: ['Roles'], summary: 'Remove role from user', security: [{ 'JWT-auth': [] }] },
    },
    '/invitations': {
      get: { tags: ['Invitations'], summary: 'List invitations', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Invitations'], summary: 'Send invitation', security: [{ 'JWT-auth': [] }] },
    },
    '/referrals': {
      get: { tags: ['Referrals'], summary: 'Get referral stats', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Referrals'], summary: 'Create referral link', security: [{ 'JWT-auth': [] }] },
    },
    '/properties': {
      get: { tags: ['Properties'], summary: 'List properties with filters' },
      post: { tags: ['Properties'], summary: 'Create a new property', security: [{ 'JWT-auth': [] }] },
    },
    '/properties/{id}': {
      get: { tags: ['Properties'], summary: 'Get property details' },
      put: { tags: ['Properties'], summary: 'Update property', security: [{ 'JWT-auth': [] }] },
      delete: { tags: ['Properties'], summary: 'Delete property', security: [{ 'JWT-auth': [] }] },
    },
    '/properties/{id}/availability': {
      get: { tags: ['Properties'], summary: 'Get property availability' },
      put: { tags: ['Properties'], summary: 'Update availability', security: [{ 'JWT-auth': [] }] },
    },
    '/properties/{id}/prices': {
      put: { tags: ['Properties'], summary: 'Update property pricing', security: [{ 'JWT-auth': [] }] },
    },
    '/property-groups': {
      get: { tags: ['Property Groups'], summary: 'List property groups', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Property Groups'], summary: 'Create property group', security: [{ 'JWT-auth': [] }] },
    },
    '/bookings': {
      get: { tags: ['Bookings'], summary: 'List my bookings', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Bookings'], summary: 'Create a booking', security: [{ 'JWT-auth': [] }] },
    },
    '/bookings/{id}': {
      get: { tags: ['Bookings'], summary: 'Get booking details', security: [{ 'JWT-auth': [] }] },
    },
    '/bookings/{id}/confirm': {
      put: { tags: ['Bookings'], summary: 'Confirm booking (host)', security: [{ 'JWT-auth': [] }] },
    },
    '/bookings/{id}/cancel': {
      put: { tags: ['Bookings'], summary: 'Cancel booking', security: [{ 'JWT-auth': [] }] },
    },
    '/services': {
      get: { tags: ['Services'], summary: 'List tourism services with filters' },
      post: { tags: ['Services'], summary: 'Create a tourism service', security: [{ 'JWT-auth': [] }] },
    },
    '/services/{id}': {
      get: { tags: ['Services'], summary: 'Get service details' },
      put: { tags: ['Services'], summary: 'Update service', security: [{ 'JWT-auth': [] }] },
      delete: { tags: ['Services'], summary: 'Delete service', security: [{ 'JWT-auth': [] }] },
    },
    '/service-groups': {
      get: { tags: ['Service Groups'], summary: 'List service groups', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Service Groups'], summary: 'Create service group', security: [{ 'JWT-auth': [] }] },
    },
    '/service-bookings': {
      get: { tags: ['Service Bookings'], summary: 'List service bookings', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Service Bookings'], summary: 'Book a service', security: [{ 'JWT-auth': [] }] },
    },
    '/reviews': {
      get: { tags: ['Reviews'], summary: 'List reviews for a property' },
      post: { tags: ['Reviews'], summary: 'Submit a review', security: [{ 'JWT-auth': [] }] },
    },
    '/favorites': {
      get: { tags: ['Favorites'], summary: 'List my favorites', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Favorites'], summary: 'Add to favorites', security: [{ 'JWT-auth': [] }] },
    },
    '/comments': {
      get: { tags: ['Comments'], summary: 'List comments for a target' },
      post: { tags: ['Comments'], summary: 'Post a comment', security: [{ 'JWT-auth': [] }] },
    },
    '/reactions': {
      post: { tags: ['Reactions'], summary: 'Add/toggle reaction', security: [{ 'JWT-auth': [] }] },
    },
    '/rankings/leaderboard': {
      get: { tags: ['Rankings'], summary: 'Get leaderboard' },
    },
    '/points/me': {
      get: { tags: ['Points'], summary: 'Get my points summary', security: [{ 'JWT-auth': [] }] },
    },
    '/points/admin/award': {
      post: { tags: ['Points'], summary: 'Award points to user (admin)', security: [{ 'JWT-auth': [] }] },
    },
    '/profiles/me': {
      get: { tags: ['Profiles'], summary: 'Get my profile', security: [{ 'JWT-auth': [] }] },
      put: { tags: ['Profiles'], summary: 'Update my profile', security: [{ 'JWT-auth': [] }] },
    },
    '/settings/preferences': {
      get: { tags: ['Settings'], summary: 'Get preferences', security: [{ 'JWT-auth': [] }] },
      put: { tags: ['Settings'], summary: 'Update preferences', security: [{ 'JWT-auth': [] }] },
    },
    '/payments/transfer-accounts': {
      get: { tags: ['Payments'], summary: 'Get active transfer accounts' },
      post: { tags: ['Payments'], summary: 'Create/update transfer account (admin)', security: [{ 'JWT-auth': [] }] },
    },
    '/payments/receipts': {
      post: { tags: ['Payments'], summary: 'Upload payment receipt', security: [{ 'JWT-auth': [] }] },
    },
    '/payments/receipts/pending': {
      get: { tags: ['Payments'], summary: 'Get pending receipts (hyper admin)', security: [{ 'JWT-auth': [] }] },
    },
    '/payments/receipts/{id}/approve': {
      put: { tags: ['Payments'], summary: 'Approve receipt', security: [{ 'JWT-auth': [] }] },
    },
    '/payments/receipts/{id}/reject': {
      put: { tags: ['Payments'], summary: 'Reject receipt', security: [{ 'JWT-auth': [] }] },
    },
    '/documents/property/{propertyId}': {
      get: { tags: ['Documents'], summary: 'Get documents for a property', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Documents'], summary: 'Upload verification document', security: [{ 'JWT-auth': [] }] },
    },
    '/notifications': {
      get: { tags: ['Notifications'], summary: 'Get all notifications', security: [{ 'JWT-auth': [] }] },
    },
    '/notifications/read-all': {
      put: { tags: ['Notifications'], summary: 'Mark all as read', security: [{ 'JWT-auth': [] }] },
    },
    '/support/threads': {
      get: { tags: ['Support'], summary: 'List support threads', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Support'], summary: 'Open support thread', security: [{ 'JWT-auth': [] }] },
    },
    '/support/threads/{id}/messages': {
      get: { tags: ['Support'], summary: 'Get thread messages', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Support'], summary: 'Send message', security: [{ 'JWT-auth': [] }] },
    },
    '/cancellation-rules': {
      get: { tags: ['Cancellation Rules'], summary: 'List cancellation rules', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Cancellation Rules'], summary: 'Create cancellation rule', security: [{ 'JWT-auth': [] }] },
    },
    '/fee-absorption': {
      get: { tags: ['Fee Absorption'], summary: 'List fee absorption rules', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Fee Absorption'], summary: 'Create fee absorption rule', security: [{ 'JWT-auth': [] }] },
    },
    '/service-fees': {
      get: { tags: ['Service Fees'], summary: 'List service fee rules', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Service Fees'], summary: 'Create service fee rule (hyper)', security: [{ 'JWT-auth': [] }] },
    },
    '/points-rules': {
      get: { tags: ['Points Rules'], summary: 'List points rules', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Points Rules'], summary: 'Create points rule (hyper)', security: [{ 'JWT-auth': [] }] },
    },
    '/alerts/saved-searches': {
      get: { tags: ['Saved Search Alerts'], summary: 'List saved search alerts', security: [{ 'JWT-auth': [] }] },
      post: { tags: ['Saved Search Alerts'], summary: 'Create saved search alert', security: [{ 'JWT-auth': [] }] },
    },
  },
  components: {
    securitySchemes: {
      'JWT-auth': { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ApiDocumentation: React.FC = () => {
  const { toast } = useToast();
  const [spec, setSpec] = useState<SwaggerSpec>(FALLBACK_SPEC);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedOps, setExpandedOps] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'endpoints' | 'schemas'>('endpoints');

  // Try to fetch live swagger spec
  useEffect(() => {
    fetch(SWAGGER_JSON_URL)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: SwaggerSpec) => { setSpec(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group endpoints by tag
  const taggedEndpoints = useMemo(() => {
    const map = new Map<string, Array<{ path: string; method: string; op: SwaggerOperation }>>();

    // Initialize all declared tags
    spec.tags?.forEach(t => map.set(t.name, []));

    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, op]) => {
        const tags = op.tags?.length ? op.tags : ['Untagged'];
        tags.forEach(tag => {
          if (!map.has(tag)) map.set(tag, []);
          map.get(tag)!.push({ path, method, op });
        });
      });
    });

    return map;
  }, [spec]);

  // Filter
  const filteredTags = useMemo(() => {
    const q = search.toLowerCase();
    const result = new Map<string, Array<{ path: string; method: string; op: SwaggerOperation }>>();

    taggedEndpoints.forEach((endpoints, tag) => {
      if (selectedTag && tag !== selectedTag) return;
      const filtered = endpoints.filter(e =>
        !q ||
        e.path.toLowerCase().includes(q) ||
        e.method.toLowerCase().includes(q) ||
        e.op.summary?.toLowerCase().includes(q) ||
        tag.toLowerCase().includes(q)
      );
      if (filtered.length > 0) result.set(tag, filtered);
    });

    return result;
  }, [taggedEndpoints, search, selectedTag]);

  // Schemas
  const schemas = useMemo(() => {
    return spec.components?.schemas || {};
  }, [spec]);

  const toggleOp = useCallback((id: string) => {
    setExpandedOps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const copyPath = useCallback((path: string) => {
    navigator.clipboard.writeText(`${API_URL}${path}`);
    setCopiedId(path);
    toast({ title: 'Copié !', description: `${API_URL}${path}` });
    setTimeout(() => setCopiedId(null), 2000);
  }, [toast]);

  const tagDescriptionMap = useMemo(() => {
    const m: Record<string, string> = {};
    spec.tags?.forEach(t => { if (t.description) m[t.name] = t.description; });
    return m;
  }, [spec]);

  const totalEndpoints = useMemo(() => {
    let count = 0;
    Object.values(spec.paths).forEach(methods => { count += Object.keys(methods).length; });
    return count;
  }, [spec]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{spec.info.title}</h1>
                <Badge variant="outline" className="text-xs">v{spec.info.version}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" />{totalEndpoints} endpoints</span>
                <span className="flex items-center gap-1"><FileJson className="h-3.5 w-3.5" />{Object.keys(schemas).length} schemas</span>
                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" />JWT Bearer Auth</span>
              </div>
            </div>
            <a
              href={`${API_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Swagger UI <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          {/* Sidebar: Tags */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Modules</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-0.5 pr-3">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !selectedTag ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Tous les endpoints
                  </button>
                  {Array.from(taggedEndpoints.keys()).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        selectedTag === tag ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="truncate">{tag}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
                        {taggedEndpoints.get(tag)?.length}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Search & mode toggle */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un endpoint, tag, méthode..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={viewMode} onValueChange={v => setViewMode(v as any)}>
                <TabsList className="h-9">
                  <TabsTrigger value="endpoints" className="text-xs px-3">Endpoints</TabsTrigger>
                  <TabsTrigger value="schemas" className="text-xs px-3">Schemas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile tag selector */}
            <div className="lg:hidden mb-4 flex flex-wrap gap-1.5">
              <Badge
                variant={!selectedTag ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTag(null)}
              >
                Tous
              </Badge>
              {Array.from(taggedEndpoints.keys()).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {viewMode === 'endpoints' ? (
              <div className="space-y-8">
                {Array.from(filteredTags.entries()).map(([tag, endpoints]) => (
                  <section key={tag}>
                    <div className="mb-3">
                      <h2 className="text-lg font-semibold text-foreground">{tag}</h2>
                      {tagDescriptionMap[tag] && (
                        <p className="text-sm text-muted-foreground mt-0.5">{tagDescriptionMap[tag]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {endpoints.map(({ path, method, op }) => {
                        const opId = `${method}-${path}`;
                        const isExpanded = expandedOps.has(opId);
                        const isSecured = !!op.security?.length;

                        return (
                          <Collapsible key={opId} open={isExpanded} onOpenChange={() => toggleOp(opId)}>
                            <CollapsibleTrigger asChild>
                              <div
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border border-l-4 cursor-pointer transition-colors hover:bg-muted/50 ${METHOD_BG[method] || 'border-l-muted'} ${
                                  isExpanded ? 'bg-muted/30' : 'bg-card'
                                }`}
                              >
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 ${METHOD_COLORS[method] || ''}`}
                                >
                                  {method}
                                </Badge>
                                <code className="text-sm font-mono text-foreground flex-1 truncate">{path}</code>
                                <span className="text-xs text-muted-foreground hidden sm:block max-w-[200px] truncate">
                                  {op.summary}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isSecured ? (
                                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                                  ) : (
                                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                                  )}
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-4 mt-1 p-4 rounded-lg border bg-muted/20 space-y-3">
                                {op.summary && (
                                  <p className="text-sm font-medium text-foreground">{op.summary}</p>
                                )}
                                {op.description && (
                                  <p className="text-xs text-muted-foreground">{op.description}</p>
                                )}

                                {/* Auth badge */}
                                <div className="flex items-center gap-2">
                                  {isSecured ? (
                                    <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                                      <Lock className="h-3 w-3 mr-1" /> JWT Required
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                                      <Globe className="h-3 w-3 mr-1" /> Public
                                    </Badge>
                                  )}
                                </div>

                                {/* Parameters */}
                                {op.parameters && op.parameters.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Parameters</h4>
                                    <div className="space-y-1">
                                      {op.parameters.map((p: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                          <Badge variant="secondary" className="text-[10px] px-1.5">{p.in}</Badge>
                                          <code className="font-mono text-foreground">{p.name}</code>
                                          {p.required && <span className="text-red-500">*</span>}
                                          <span className="text-muted-foreground">{p.schema?.type || 'string'}</span>
                                          {p.description && <span className="text-muted-foreground">— {p.description}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Request Body */}
                                {op.requestBody && (
                                  <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Request Body</h4>
                                    {Object.entries(op.requestBody.content || {}).map(([contentType, media]: [string, any]) => (
                                      <div key={contentType}>
                                        <Badge variant="secondary" className="text-[10px] mb-1">{contentType}</Badge>
                                        {media.schema && (
                                          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                                            <code>{getSchemaDisplay(media.schema, spec)}</code>
                                          </pre>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Responses */}
                                {op.responses && (
                                  <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Responses</h4>
                                    <div className="space-y-1">
                                      {Object.entries(op.responses).map(([status, resp]: [string, any]) => (
                                        <div key={status} className="flex items-start gap-2 text-xs">
                                          <Badge
                                            variant="outline"
                                            className={`text-[10px] px-1.5 ${
                                              status.startsWith('2') ? 'bg-emerald-500/10 text-emerald-600'
                                                : status.startsWith('4') ? 'bg-red-500/10 text-red-600'
                                                  : 'bg-muted'
                                            }`}
                                          >
                                            {status}
                                          </Badge>
                                          <span className="text-muted-foreground">{resp.description || ''}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Copy URL */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7"
                                  onClick={() => copyPath(path)}
                                >
                                  {copiedId === path ? (
                                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  Copier l'URL
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </section>
                ))}

                {filteredTags.size === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Aucun endpoint trouvé pour « {search} »</p>
                  </div>
                )}
              </div>
            ) : (
              /* Schemas view */
              <div className="space-y-4">
                {Object.entries(schemas)
                  .filter(([name]) => !search || name.toLowerCase().includes(search.toLowerCase()))
                  .map(([name, schema]) => (
                    <div key={name} className="border rounded-lg bg-card p-4">
                      <h3 className="text-sm font-semibold text-foreground font-mono mb-2">{name}</h3>
                      {schema.properties && (
                        <div className="space-y-1">
                          {Object.entries(schema.properties).map(([prop, propSchema]: [string, any]) => (
                            <div key={prop} className="flex items-center gap-2 text-xs">
                              <code className="font-mono text-foreground min-w-[120px]">{prop}</code>
                              {schema.required?.includes(prop) && <span className="text-red-500">*</span>}
                              <span className="text-muted-foreground">{getSchemaDisplay(propSchema, spec)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {!schema.properties && schema.type && (
                        <p className="text-xs text-muted-foreground">{getSchemaDisplay(schema, spec)}</p>
                      )}
                    </div>
                  ))}
                {Object.keys(schemas).length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <FileJson className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Aucun schema disponible. Connectez le backend pour charger le Swagger JSON.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
