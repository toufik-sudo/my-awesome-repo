// -----------------------------------------------------------------------------
// Beneficiary Declaration List Page Component
// Shows declarations for beneficiary users
// Migrated from old_app/src/components/pages/wall/BeneficiaryDeclarationListPage.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Plus, FileText, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/library/molecules/EmptyState';
import { useWallSelection } from '@/hooks/wall';

type DeclarationStatus = 'pending' | 'approved' | 'rejected' | 'all';

interface Declaration {
  id: string;
  title: string;
  programName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  points?: number;
}

// Mock data - replace with actual API calls
const mockDeclarations: Declaration[] = [];

const statusConfig = {
  pending: {
    icon: Clock,
    labelId: 'declarations.status.pending',
    labelDefault: 'Pending',
    variant: 'secondary' as const,
  },
  approved: {
    icon: CheckCircle,
    labelId: 'declarations.status.approved',
    labelDefault: 'Approved',
    variant: 'default' as const,
  },
  rejected: {
    icon: XCircle,
    labelId: 'declarations.status.rejected',
    labelDefault: 'Rejected',
    variant: 'destructive' as const,
  },
};

const DeclarationCard: React.FC<{ declaration: Declaration }> = ({ declaration }) => {
  const status = statusConfig[declaration.status];
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{declaration.title}</h3>
              <p className="text-sm text-muted-foreground">{declaration.programName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                <FormattedMessage 
                  id="declarations.submittedAt" 
                  defaultMessage="Submitted {date}"
                  values={{ date: new Date(declaration.submittedAt).toLocaleDateString() }}
                />
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant={status.variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              <FormattedMessage id={status.labelId} defaultMessage={status.labelDefault} />
            </Badge>
            {declaration.points && declaration.status === 'approved' && (
              <span className="text-sm font-medium text-primary">
                +{declaration.points} pts
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BeneficiaryDeclarationListPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { selectedProgramId } = useWallSelection();
  const [activeTab, setActiveTab] = useState<DeclarationStatus>('all');

  const filteredDeclarations = activeTab === 'all' 
    ? mockDeclarations 
    : mockDeclarations.filter(d => d.status === activeTab);

  const counts = {
    all: mockDeclarations.length,
    pending: mockDeclarations.filter(d => d.status === 'pending').length,
    approved: mockDeclarations.filter(d => d.status === 'approved').length,
    rejected: mockDeclarations.filter(d => d.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <FormattedMessage id="declarations.myDeclarations.title" defaultMessage="My Declarations" />
          </h1>
          <p className="text-muted-foreground">
            <FormattedMessage 
              id="declarations.myDeclarations.subtitle" 
              defaultMessage="Track and manage your submitted declarations" 
            />
          </p>
        </div>

        <Button asChild>
          <Link to="/declarations/create">
            <Plus className="mr-2 h-4 w-4" />
            <FormattedMessage id="declarations.create" defaultMessage="New Declaration" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id="declarations.stats.pending" defaultMessage="Pending" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id="declarations.stats.approved" defaultMessage="Approved" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{counts.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <FormattedMessage id="declarations.stats.rejected" defaultMessage="Rejected" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{counts.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Declarations List */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DeclarationStatus)}>
        <TabsList>
          <TabsTrigger value="all">
            <FormattedMessage id="declarations.filter.all" defaultMessage="All" />
            <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            <FormattedMessage id="declarations.filter.pending" defaultMessage="Pending" />
            {counts.pending > 0 && <Badge variant="secondary" className="ml-2">{counts.pending}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approved">
            <FormattedMessage id="declarations.filter.approved" defaultMessage="Approved" />
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <FormattedMessage id="declarations.filter.rejected" defaultMessage="Rejected" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredDeclarations.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={formatMessage({ id: 'declarations.empty.title', defaultMessage: 'No declarations yet' })}
              description={formatMessage({ id: 'declarations.empty.description', defaultMessage: 'Submit your first declaration to start earning points.' })}
              action={{
                label: formatMessage({ id: 'declarations.create', defaultMessage: 'New Declaration' }),
                onClick: () => window.location.href = '/declarations/create',
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredDeclarations.map((declaration) => (
                <DeclarationCard key={declaration.id} declaration={declaration} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeneficiaryDeclarationListPage;
