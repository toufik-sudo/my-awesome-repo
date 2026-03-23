import React, { memo, useState, useCallback } from 'react';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { DynamicTabs, DynamicTabItem } from '@/modules/shared/components/DynamicTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Settings, Bell, User, Mail, Star, Shield, Zap } from 'lucide-react';

const basicTabs: DynamicTabItem[] = [
  { value: 'overview', label: 'Overview', content: <p className="text-muted-foreground">This is the overview panel with general information.</p> },
  { value: 'analytics', label: 'Analytics', content: <p className="text-muted-foreground">Analytics data and metrics are displayed here.</p> },
  { value: 'reports', label: 'Reports', content: <p className="text-muted-foreground">Download and view your generated reports.</p> },
  { value: 'export', label: 'Export', disabled: true, content: <p>Disabled tab content.</p> },
];

const iconTabs: DynamicTabItem[] = [
  { value: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, content: <p className="text-muted-foreground">Welcome to your dashboard home.</p> },
  { value: 'profile', label: 'Profile', icon: <User className="h-4 w-4" />, content: <p className="text-muted-foreground">Manage your profile settings and preferences.</p> },
  { value: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, badge: 5, badgeVariant: 'destructive', content: <p className="text-muted-foreground">You have 5 unread notifications.</p> },
  { value: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, content: <p className="text-muted-foreground">Configure your application settings.</p> },
];

const tooltipTabs: DynamicTabItem[] = [
  { value: 'mail', label: 'Mail', icon: <Mail className="h-4 w-4" />, tooltip: 'View your inbox', badge: 12, content: <p className="text-muted-foreground">12 unread messages in your inbox.</p> },
  { value: 'starred', label: 'Starred', icon: <Star className="h-4 w-4" />, tooltip: 'Starred items', badge: 3, badgeVariant: 'secondary', content: <p className="text-muted-foreground">3 starred items saved.</p> },
  { value: 'security', label: 'Security', icon: <Shield className="h-4 w-4" />, tooltip: 'Security settings', content: <p className="text-muted-foreground">Manage security and privacy.</p> },
  { value: 'performance', label: 'Performance', icon: <Zap className="h-4 w-4" />, tooltip: 'Performance metrics', content: <p className="text-muted-foreground">Application performance overview.</p> },
];

export const TabsDemo = memo(() => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleTabChange = useCallback((val: string) => setActiveTab(val), []);
  const handleTabHover = useCallback((val: string) => setHoveredTab(val), []);

  return (
    <ErrorBoundary>
      <div className="space-y-8 p-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DynamicTabs Demo</h1>
          <p className="text-muted-foreground mt-1">All prop variations and configurations</p>
        </div>

        {/* Basic */}
        <Card>
          <CardHeader><CardTitle>Basic Tabs</CardTitle><CardDescription>Default variant with simple text labels</CardDescription></CardHeader>
          <CardContent><DynamicTabs tabs={basicTabs} defaultValue="overview" /></CardContent>
        </Card>

        {/* Icons + Badges */}
        <Card>
          <CardHeader><CardTitle>Icons & Badges</CardTitle><CardDescription>Tabs with icons, badges, and a disabled state</CardDescription></CardHeader>
          <CardContent><DynamicTabs tabs={iconTabs} defaultValue="home" variant="default" /></CardContent>
        </Card>

        {/* Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Outline Variant</CardTitle></CardHeader>
            <CardContent><DynamicTabs tabs={basicTabs.slice(0, 3)} variant="outline" defaultValue="overview" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pills Variant</CardTitle></CardHeader>
            <CardContent><DynamicTabs tabs={basicTabs.slice(0, 3)} variant="pills" defaultValue="overview" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Underline Variant</CardTitle></CardHeader>
            <CardContent><DynamicTabs tabs={basicTabs.slice(0, 3)} variant="underline" defaultValue="overview" /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Full Width</CardTitle></CardHeader>
            <CardContent><DynamicTabs tabs={basicTabs.slice(0, 3)} variant="default" fullWidth defaultValue="overview" /></CardContent>
          </Card>
        </div>

        {/* Sizes */}
        <Card>
          <CardHeader><CardTitle>Sizes</CardTitle><CardDescription>Small, medium, and large tab sizes</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <div key={size}>
                <Badge variant="outline" className="mb-2">{size}</Badge>
                <DynamicTabs tabs={basicTabs.slice(0, 3)} size={size} variant="pills" defaultValue="overview" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vertical */}
        <Card>
          <CardHeader><CardTitle>Vertical Orientation</CardTitle><CardDescription>Tabs stacked vertically with icons</CardDescription></CardHeader>
          <CardContent><DynamicTabs tabs={iconTabs} orientation="vertical" variant="outline" defaultValue="home" /></CardContent>
        </Card>

        {/* Tooltips */}
        <Card>
          <CardHeader><CardTitle>Tooltips & Callbacks</CardTitle><CardDescription>Hover to see tooltips. Active: {activeTab}, Hovered: {hoveredTab || 'none'}</CardDescription></CardHeader>
          <CardContent>
            <DynamicTabs
              tabs={tooltipTabs}
              value={activeTab}
              onTabChange={handleTabChange}
              onTabHover={handleTabHover}
              variant="underline"
            />
          </CardContent>
        </Card>

        {/* Tab List Suffix */}
        <Card>
          <CardHeader><CardTitle>Tab List Suffix</CardTitle><CardDescription>Extra content beside the tab list</CardDescription></CardHeader>
          <CardContent>
            <DynamicTabs
              tabs={basicTabs.slice(0, 3)}
              defaultValue="overview"
              tabListSuffix={<Badge variant="secondary">v2.1</Badge>}
            />
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
});

TabsDemo.displayName = 'TabsDemo';
