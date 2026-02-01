// -----------------------------------------------------------------------------
// Results Page
// Migrated from old_app/src/components/pages/ResultsPage.tsx
// -----------------------------------------------------------------------------

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowRight, FileText, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store';

interface ResultChannel {
  declarationForm?: boolean;
  fileImport?: boolean;
}

const ResultsPage: React.FC = () => {
  const { formatMessage, messages } = useIntl();
  
  const launchState = useSelector((state: RootState & { 
    launchReducer?: { resultChannel?: ResultChannel } 
  }) => state.launchReducer);
  
  const resultChannel = launchState?.resultChannel;

  const canProceed = useMemo(() => {
    return resultChannel?.declarationForm || resultChannel?.fileImport;
  }, [resultChannel]);

  const handleNext = () => {
    // TODO: Implement navigation to next step
    console.log('Navigate to result validation step');
  };

  const resultOptions = [
    {
      id: 'declarationForm',
      icon: FileText,
      titleId: 'launchProgram.results.declarationForm.title',
      defaultTitle: 'Declaration Form',
      descriptionId: 'launchProgram.results.declarationForm.description',
      defaultDescription: 'Allow users to submit declarations through a form',
      enabled: resultChannel?.declarationForm || false,
    },
    {
      id: 'fileImport',
      icon: Upload,
      titleId: 'launchProgram.results.fileImport.title',
      defaultTitle: 'File Import',
      descriptionId: 'launchProgram.results.fileImport.description',
      defaultDescription: 'Import results from external files (CSV, Excel)',
      enabled: resultChannel?.fileImport || false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {formatMessage({ id: 'launchProgram.title', defaultMessage: 'Launch Program' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'launchProgram.subtitle.rewards', defaultMessage: 'Configure rewards and results' })}
        </p>
      </div>

      {/* Results Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatMessage({ id: 'launchProgram.info.rewards', defaultMessage: 'Results Configuration' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'launchProgram.results.description', defaultMessage: 'Choose how results will be collected and processed' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resultOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  option.enabled ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    option.enabled ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {formatMessage({ id: option.titleId, defaultMessage: option.defaultTitle })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatMessage({ id: option.descriptionId, defaultMessage: option.defaultDescription })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {option.enabled && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                  <Switch
                    checked={option.enabled}
                    onCheckedChange={() => {
                      // TODO: Dispatch action to update result channel
                      console.log(`Toggle ${option.id}`);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {formatMessage({ id: 'form.submit.next', defaultMessage: 'Next' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {!canProceed && (
        <p className="text-center text-sm text-muted-foreground">
          {formatMessage({ id: 'launchProgram.results.selectOne', defaultMessage: 'Please select at least one result collection method to continue' })}
        </p>
      )}
    </div>
  );
};

export default ResultsPage;
