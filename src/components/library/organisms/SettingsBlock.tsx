// -----------------------------------------------------------------------------
// SettingsBlock Component
// Consolidated settings interface with tabbed navigation
// -----------------------------------------------------------------------------

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Lock, 
  Shield, 
  CreditCard, 
  FileText, 
  ArrowLeft,
  Settings,
  ChevronRight
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type SettingsTabId = 'account' | 'password' | 'administrators' | 'payment' | 'gdpr';

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  visible?: boolean;
}

export interface SettingsBlockProps {
  tabs: SettingsTab[];
  defaultTab?: SettingsTabId;
  backPath?: string;
  backLabel?: string;
  title?: string;
  description?: string;
  className?: string;
  showSubscriptionCancel?: boolean;
  onCancelSubscription?: () => Promise<void>;
  subscriptionName?: string;
  isLoadingCancel?: boolean;
}

// -----------------------------------------------------------------------------
// Default Tab Icons
// -----------------------------------------------------------------------------

export const SETTINGS_TAB_ICONS: Record<SettingsTabId, React.ReactNode> = {
  account: <User className="h-4 w-4" />,
  password: <Lock className="h-4 w-4" />,
  administrators: <Shield className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  gdpr: <FileText className="h-4 w-4" />
};

// -----------------------------------------------------------------------------
// Settings Section Component
// -----------------------------------------------------------------------------

export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
  className,
  action
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="border border-border rounded-lg p-4">
        {children}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Settings Row Component
// -----------------------------------------------------------------------------

export interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  children,
  className
}) => {
  return (
    <div className={cn('flex items-center justify-between py-3', className)}>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Settings Link Component
// -----------------------------------------------------------------------------

export interface SettingsLinkProps {
  label: string;
  description?: string;
  to: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SettingsLink: React.FC<SettingsLinkProps> = ({
  label,
  description,
  to,
  icon,
  className
}) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border border-border',
        'hover:bg-muted/50 transition-colors group',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div>
          <p className="font-medium">{label}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </Link>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const SettingsBlock: React.FC<SettingsBlockProps> = ({
  tabs,
  defaultTab,
  backPath = '/',
  backLabel = 'Back',
  title = 'Settings',
  description = 'Manage your account settings and preferences',
  className,
  showSubscriptionCancel = false,
  onCancelSubscription,
  subscriptionName,
  isLoadingCancel = false
}) => {
  const visibleTabs = useMemo(() => 
    tabs.filter(tab => tab.visible !== false),
    [tabs]
  );

  const [activeTab, setActiveTab] = useState<SettingsTabId>(
    defaultTab || visibleTabs[0]?.id || 'account'
  );
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelSubscription = async () => {
    await onCancelSubscription?.();
    setShowCancelModal(false);
  };

  if (visibleTabs.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No settings available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={backPath}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Link>
          </Button>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingsTabId)}>
          {/* Tab Navigation */}
          <TabsList className="flex flex-wrap justify-start gap-1 h-auto bg-transparent border-b border-border rounded-none pb-2 mb-6">
            {visibleTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md',
                  'data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-secondary'
                )}
              >
                {tab.icon || SETTINGS_TAB_ICONS[tab.id]}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}

            {/* Cancel Subscription Button */}
            {showSubscriptionCancel && onCancelSubscription && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelModal(true)}
                className="ml-auto"
                disabled={isLoadingCancel}
              >
                Cancel Subscription
              </Button>
            )}
          </TabsList>

          {/* Tab Content */}
          {visibleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {/* Cancel Subscription Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        description={`Are you sure you want to cancel your subscription${subscriptionName ? ` to "${subscriptionName}"` : ''}? You will lose access to premium features at the end of your billing period.`}
        variant="danger"
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Subscription"
        isLoading={isLoadingCancel}
      />
    </Card>
  );
};

export default SettingsBlock;
