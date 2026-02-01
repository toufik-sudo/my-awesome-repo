// -----------------------------------------------------------------------------
// ResultsValidationConfig Component
// Configuration for results validation settings
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Bell, Clock, UserCheck, Shield } from 'lucide-react';

interface ResultsValidationConfigProps {
  manualValidation: boolean;
  emailNotify: boolean;
  autoApproveDelay: string;
  requireProof: boolean;
  onManualValidationChange: (enabled: boolean) => void;
  onEmailNotifyChange: (enabled: boolean) => void;
  onAutoApproveDelayChange: (delay: string) => void;
  onRequireProofChange: (enabled: boolean) => void;
}

const DELAY_OPTIONS = [
  { value: 'none', label: 'No Auto-Approve' },
  { value: '24h', label: '24 Hours' },
  { value: '48h', label: '48 Hours' },
  { value: '72h', label: '72 Hours' },
  { value: '1w', label: '1 Week' },
];

export const ResultsValidationConfig: React.FC<ResultsValidationConfigProps> = ({
  manualValidation,
  emailNotify,
  autoApproveDelay,
  requireProof,
  onManualValidationChange,
  onEmailNotifyChange,
  onAutoApproveDelayChange,
  onRequireProofChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.results.validation" defaultMessage="Validation Settings" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.results.validationDesc" 
            defaultMessage="Configure how submitted results are validated" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Validation */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">
                <FormattedMessage id="launch.results.manualValidation" defaultMessage="Manual Validation" />
              </Label>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.manualValidationDesc" 
                  defaultMessage="Review and approve each result manually" 
                />
              </p>
            </div>
          </div>
          <Switch
            checked={manualValidation}
            onCheckedChange={onManualValidationChange}
          />
        </div>

        {/* Auto-Approve Delay */}
        {manualValidation && (
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <Label className="font-medium">
                <FormattedMessage id="launch.results.autoApprove" defaultMessage="Auto-Approve After" />
              </Label>
            </div>
            <Select value={autoApproveDelay} onValueChange={onAutoApproveDelayChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELAY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              <FormattedMessage 
                id="launch.results.autoApproveHint" 
                defaultMessage="Results will be automatically approved if not reviewed within this period" 
              />
            </p>
          </div>
        )}

        {/* Require Proof */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">
                <FormattedMessage id="launch.results.requireProof" defaultMessage="Require Proof" />
              </Label>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.requireProofDesc" 
                  defaultMessage="Participants must attach documents or images as proof" 
                />
              </p>
            </div>
          </div>
          <Switch
            checked={requireProof}
            onCheckedChange={onRequireProofChange}
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <Label className="font-medium">
                <FormattedMessage id="launch.results.emailNotify" defaultMessage="Email Notifications" />
              </Label>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage 
                  id="launch.results.emailNotifyDesc" 
                  defaultMessage="Receive email when new results are submitted" 
                />
              </p>
            </div>
          </div>
          <Switch
            checked={emailNotify}
            onCheckedChange={onEmailNotifyChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsValidationConfig;
