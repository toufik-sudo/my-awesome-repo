// -----------------------------------------------------------------------------
// ResultsConfigStep Component
// Configure how results are collected and validated
// Integrated with Redux store and API hooks
// -----------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, Upload, ClipboardList, Bell, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { 
  DECLARATION_FORM, 
  FILE_IMPORT, 
  RESULTS_CHANNEL,
  RESULTS_MANUAL_VALIDATION,
  RESULTS_EMAIL_NOTIFY
} from '@/constants/wall/launch';

const RESULTS_FIELDS = [
  { id: 'dateOfEvent', labelId: 'form.field.dateOfEvent', defaultLabel: 'Date of Event', required: true },
  { id: 'quantity', labelId: 'form.field.quantity', defaultLabel: 'Quantity', required: true },
  { id: 'amount', labelId: 'form.field.amount', defaultLabel: 'Amount', required: false },
  { id: 'companyName', labelId: 'form.field.companyName', defaultLabel: 'Company Name', required: false },
  { id: 'customerReference', labelId: 'form.field.customerReference', defaultLabel: 'Customer Reference', required: false },
  { id: 'productReference', labelId: 'form.field.productReference', defaultLabel: 'Product Reference', required: false },
  { id: 'additionalComments', labelId: 'form.field.comments', defaultLabel: 'Comments', required: false },
];

const ResultsConfigStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchData, updateStepData, updateMultipleData } = useLaunchWizard();
  
  // Extract data from store
  const resultChannel = launchData[RESULTS_CHANNEL] as {
    [DECLARATION_FORM]?: boolean;
    [FILE_IMPORT]?: boolean;
  } | undefined;
  
  const declarationForm = resultChannel?.[DECLARATION_FORM] ?? true;
  const fileImport = resultChannel?.[FILE_IMPORT] ?? false;
  const resultsManualValidation = (launchData[RESULTS_MANUAL_VALIDATION] as boolean) ?? false;
  const resultsEmailNotify = (launchData[RESULTS_EMAIL_NOTIFY] as boolean) ?? false;
  const resultsFormFields = (launchData.resultsUsersFields as string[]) || ['dateOfEvent', 'quantity'];
  
  // Initialize default values on mount
  useEffect(() => {
    if (!resultChannel) {
      updateStepData(RESULTS_CHANNEL, {
        [DECLARATION_FORM]: true,
        [FILE_IMPORT]: false,
      });
    }
    if (!launchData.resultsUsersFields) {
      updateStepData('resultsUsersFields', ['dateOfEvent', 'quantity']);
    }
  }, []);
  
  const handleChannelChange = (channel: string, enabled: boolean) => {
    updateStepData(RESULTS_CHANNEL, {
      ...resultChannel,
      [channel]: enabled,
    });
  };
  
  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    const field = RESULTS_FIELDS.find(f => f.id === fieldId);
    // Prevent unchecking required fields
    if (!checked && field?.required) return;
    
    const newFields = checked
      ? [...resultsFormFields, fieldId]
      : resultsFormFields.filter((f) => f !== fieldId);
    updateStepData('resultsUsersFields', newFields);
  };
  
  const handleValidationToggle = (key: string, checked: boolean) => {
    updateStepData(key, checked);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.results.title" 
            defaultMessage="Results Configuration" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.results.description" 
            defaultMessage="Configure how users can submit and track their results" 
          />
        </p>
      </div>
      
      {/* Result Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <FormattedMessage id="launch.results.channels" defaultMessage="Result Submission Methods" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launch.results.channels.desc" 
              defaultMessage="How can users submit their results?" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Declaration Form */}
          <div
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg border-2 transition-colors',
              declarationForm ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            <Checkbox
              id="declaration-form"
              checked={declarationForm}
              onCheckedChange={(checked) => handleChannelChange(DECLARATION_FORM, checked as boolean)}
            />
            <Label htmlFor="declaration-form" className="flex-1 cursor-pointer space-y-1">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  <FormattedMessage 
                    id="launch.results.declarationForm" 
                    defaultMessage="Declaration Form" 
                  />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.declarationForm.desc" 
                  defaultMessage="Users can submit results through an online form" 
                />
              </p>
            </Label>
          </div>
          
          {/* File Import */}
          <div
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg border-2 transition-colors',
              fileImport ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            <Checkbox
              id="file-import"
              checked={fileImport}
              onCheckedChange={(checked) => handleChannelChange(FILE_IMPORT, checked as boolean)}
            />
            <Label htmlFor="file-import" className="flex-1 cursor-pointer space-y-1">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  <FormattedMessage 
                    id="launch.results.fileImport" 
                    defaultMessage="File Upload" 
                  />
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.fileImport.desc" 
                  defaultMessage="Users can upload files with their results" 
                />
              </p>
            </Label>
          </div>
        </CardContent>
      </Card>
      
      {/* Declaration Form Fields */}
      {declarationForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <FormattedMessage id="launch.results.fields" defaultMessage="Declaration Form Fields" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage 
                id="launch.results.fields.desc" 
                defaultMessage="Select the fields for the declaration form" 
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RESULTS_FIELDS.map((field) => {
                const isSelected = resultsFormFields.includes(field.id);
                
                return (
                  <div
                    key={field.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                      isSelected ? 'bg-primary/5 border-primary/30' : 'bg-muted/30 border-transparent',
                      field.required && 'opacity-90'
                    )}
                  >
                    <Checkbox
                      id={`result-field-${field.id}`}
                      checked={isSelected}
                      disabled={field.required}
                      onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`result-field-${field.id}`} 
                      className={cn("flex-1 cursor-pointer", field.required && "cursor-default")}
                    >
                      <FormattedMessage id={field.labelId} defaultMessage={field.defaultLabel} />
                      {field.required && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (<FormattedMessage id="common.required" defaultMessage="required" />)
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Validation Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <FormattedMessage id="launch.results.validation" defaultMessage="Validation Settings" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Validation */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="results-manual" className="text-base">
                <FormattedMessage 
                  id="launch.results.manualValidation" 
                  defaultMessage="Manual Result Validation" 
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.manualValidation.desc" 
                  defaultMessage="Approve each submitted result manually" 
                />
              </p>
            </div>
            <Switch
              id="results-manual"
              checked={resultsManualValidation}
              onCheckedChange={(checked) => handleValidationToggle(RESULTS_MANUAL_VALIDATION, checked)}
            />
          </div>
          
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="results-notify" className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <FormattedMessage 
                  id="launch.results.emailNotify" 
                  defaultMessage="Email Notifications" 
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.emailNotify.desc" 
                  defaultMessage="Receive email when new results are submitted" 
                />
              </p>
            </div>
            <Switch
              id="results-notify"
              checked={resultsEmailNotify}
              onCheckedChange={(checked) => handleValidationToggle(RESULTS_EMAIL_NOTIFY, checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ResultsConfigStep };
export default ResultsConfigStep;
