// -----------------------------------------------------------------------------
// ConfidentialityStep Component
// Program access settings (Open/Closed, invitations, etc.)
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock, Globe, Mail, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { PROGRAM_CONFIDENTIALITY_OPEN, PROGRAM_CONFIDENTIALITY_CLOSED } from '@/constants/wall/launch';

const ConfidentialityStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchData, updateStepData, updateMultipleData } = useLaunchWizard();
  
  const confidentiality = (launchData.confidentiality as string) || PROGRAM_CONFIDENTIALITY_OPEN;
  const manualValidation = (launchData.manualValidation as boolean) || false;
  const emailNotify = (launchData.emailNotify as boolean) || false;
  const sendEmailInvites = (launchData.acceptedEmailInvitation as boolean) || false;
  
  const isOpen = confidentiality === PROGRAM_CONFIDENTIALITY_OPEN;
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.confidentiality.title" 
            defaultMessage="Access Settings" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.confidentiality.description" 
            defaultMessage="Configure how users can access your program" 
          />
        </p>
      </div>
      
      {/* Access Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <FormattedMessage id="launch.confidentiality.access" defaultMessage="Access Type" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launch.confidentiality.access.desc" 
              defaultMessage="Choose who can join your program" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={confidentiality}
            onValueChange={(value) => updateStepData('confidentiality', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Open Access */}
            <Label
              htmlFor="access-open"
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                isOpen ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'
              )}
            >
              <RadioGroupItem value={PROGRAM_CONFIDENTIALITY_OPEN} id="access-open" className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    <FormattedMessage id="launch.confidentiality.open" defaultMessage="Open Access" />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage 
                    id="launch.confidentiality.open.desc" 
                    defaultMessage="Anyone can join the program freely" 
                  />
                </p>
              </div>
            </Label>
            
            {/* Closed Access */}
            <Label
              htmlFor="access-closed"
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                !isOpen ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'
              )}
            >
              <RadioGroupItem value={PROGRAM_CONFIDENTIALITY_CLOSED} id="access-closed" className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    <FormattedMessage id="launch.confidentiality.closed" defaultMessage="Invitation Only" />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage 
                    id="launch.confidentiality.closed.desc" 
                    defaultMessage="Users need an invitation or approval to join" 
                  />
                </p>
              </div>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <FormattedMessage id="launch.confidentiality.options" defaultMessage="Additional Options" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Validation */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="manual-validation" className="text-base">
                <FormattedMessage 
                  id="launch.confidentiality.manualValidation" 
                  defaultMessage="Manual Registration Validation" 
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launch.confidentiality.manualValidation.desc" 
                  defaultMessage="Approve each new user registration manually" 
                />
              </p>
            </div>
            <Switch
              id="manual-validation"
              checked={manualValidation}
              onCheckedChange={(checked) => updateStepData('manualValidation', checked)}
            />
          </div>
          
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notify" className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <FormattedMessage 
                  id="launch.confidentiality.emailNotify" 
                  defaultMessage="Email Notifications" 
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launch.confidentiality.emailNotify.desc" 
                  defaultMessage="Receive email when new users register" 
                />
              </p>
            </div>
            <Switch
              id="email-notify"
              checked={emailNotify}
              onCheckedChange={(checked) => updateStepData('emailNotify', checked)}
            />
          </div>
          
          {/* Send Email Invites (for closed programs) */}
          {!isOpen && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="send-invites" className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <FormattedMessage 
                    id="launch.confidentiality.sendInvites" 
                    defaultMessage="Send Email Invitations" 
                  />
                </Label>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage 
                    id="launch.confidentiality.sendInvites.desc" 
                    defaultMessage="Automatically send invitation emails to users" 
                  />
                </p>
              </div>
              <Switch
                id="send-invites"
                checked={sendEmailInvites}
                onCheckedChange={(checked) => updateStepData('acceptedEmailInvitation', checked)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { ConfidentialityStep };
export default ConfidentialityStep;
