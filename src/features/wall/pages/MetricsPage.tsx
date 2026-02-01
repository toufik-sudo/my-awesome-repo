// -----------------------------------------------------------------------------
// Metrics Page Component
// Analytics and metrics dashboard
// Migrated from old_app/src/components/pages/wall/MetricsPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BarChart3, TrendingUp, Users, Target, ArrowUp, ArrowDown } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallSelection } from '@/hooks/wall';

interface MetricCardProps {
  titleId: string;
  titleDefault: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  titleId,
  titleDefault,
  value,
  change,
  changeLabel,
  icon,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <FormattedMessage id={titleId} defaultMessage={titleDefault} />
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {isPositive && <ArrowUp className="h-3 w-3" />}
            {isNegative && <ArrowDown className="h-3 w-3" />}
            {Math.abs(change)}% {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const MetricsPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { selectedProgramName } = useWallSelection();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <FormattedMessage id="metrics.title" defaultMessage="Analytics & Metrics" />
        </h1>
        <p className="text-muted-foreground">
          {selectedProgramName || (
            <FormattedMessage id="metrics.subtitle" defaultMessage="View your performance metrics and analytics" />
          )}
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          titleId="metrics.totalParticipants"
          titleDefault="Total Participants"
          value="0"
          change={0}
          changeLabel="from last month"
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          titleId="metrics.activePrograms"
          titleDefault="Active Programs"
          value="0"
          icon={<Target className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          titleId="metrics.completionRate"
          titleDefault="Completion Rate"
          value="0%"
          change={0}
          changeLabel="from last month"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          titleId="metrics.totalPoints"
          titleDefault="Points Distributed"
          value="0"
          change={0}
          changeLabel="from last month"
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <FormattedMessage id="metrics.tabs.overview" defaultMessage="Overview" />
          </TabsTrigger>
          <TabsTrigger value="programs">
            <FormattedMessage id="metrics.tabs.programs" defaultMessage="Programs" />
          </TabsTrigger>
          <TabsTrigger value="users">
            <FormattedMessage id="metrics.tabs.users" defaultMessage="Users" />
          </TabsTrigger>
          <TabsTrigger value="declarations">
            <FormattedMessage id="metrics.tabs.declarations" defaultMessage="Declarations" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="metrics.overview.title" defaultMessage="Performance Overview" />
              </CardTitle>
              <CardDescription>
                <FormattedMessage 
                  id="metrics.overview.description" 
                  defaultMessage="Your program performance over the last 30 days" 
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <FormattedMessage id="metrics.noData" defaultMessage="No data available yet" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="metrics.programs.title" defaultMessage="Program Analytics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <FormattedMessage id="metrics.programs.noData" defaultMessage="No program data available" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="metrics.users.title" defaultMessage="User Analytics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <FormattedMessage id="metrics.users.noData" defaultMessage="No user data available" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declarations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="metrics.declarations.title" defaultMessage="Declaration Analytics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <FormattedMessage id="metrics.declarations.noData" defaultMessage="No declaration data available" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetricsPage;
