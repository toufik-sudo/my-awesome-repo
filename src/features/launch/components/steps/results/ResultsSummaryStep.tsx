// -----------------------------------------------------------------------------
// ResultsSummaryStep Component
// Summary of results configuration before proceeding
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ClipboardList, Upload, Bell, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsSummaryStepProps {
  config: {
    declarationForm: boolean;
    fileImport: boolean;
    manualValidation: boolean;
    emailNotify: boolean;
    selectedFields: string[];
  };
}

const FIELD_LABELS: Record<string, string> = {
  dateOfEvent: 'Date of Event',
  quantity: 'Quantity',
  amount: 'Amount',
  companyName: 'Company Name',
  customerReference: 'Customer Reference',
  productReference: 'Product Reference',
  additionalComments: 'Comments',
};

interface ConfigItem {
  icon: React.ElementType;
  label: string;
  enabled: boolean;
}

export const ResultsSummaryStep: React.FC<ResultsSummaryStepProps> = ({ config }) => {
  const configItems: ConfigItem[] = [
    {
      icon: ClipboardList,
      label: 'Declaration Form',
      enabled: config.declarationForm
    },
    {
      icon: Upload,
      label: 'File Upload',
      enabled: config.fileImport
    },
    {
      icon: UserCheck,
      label: 'Manual Validation',
      enabled: config.manualValidation
    },
    {
      icon: Bell,
      label: 'Email Notifications',
      enabled: config.emailNotify
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">
          <FormattedMessage id="launch.results.summary.title" defaultMessage="Results Configuration Summary" />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.results.summary.description" 
            defaultMessage="Review your results collection settings" 
          />
        </p>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <FormattedMessage id="launch.results.settings" defaultMessage="Settings" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {configItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border text-center',
                    item.enabled ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'
                  )}
                >
                  <Icon className={cn('h-6 w-6', item.enabled ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge variant={item.enabled ? 'default' : 'secondary'}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Fields */}
      {config.selectedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <FormattedMessage id="launch.results.formFields" defaultMessage="Form Fields" />
              <Badge variant="outline" className="ml-2">
                {config.selectedFields.length} fields
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.selectedFields.map((fieldId) => (
                <Badge key={fieldId} variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {FIELD_LABELS[fieldId] || fieldId}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready Message */}
      <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="font-medium">
          <FormattedMessage id="launch.results.ready" defaultMessage="Your results configuration is ready!" />
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          <FormattedMessage 
            id="launch.results.readyDesc" 
            defaultMessage="Continue to the next step to finish setting up your program" 
          />
        </p>
      </div>
    </div>
  );
};

export default ResultsSummaryStep;
