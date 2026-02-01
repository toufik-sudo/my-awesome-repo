// -----------------------------------------------------------------------------
// UserValidationStep Component
// Step 3: User validation settings (for closed programs)
// Aligned with old_app UserValidationSection.tsx
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ShieldCheck, 
  Mail, 
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../../hooks/useLaunchWizard';
import { CLOSED } from '@/constants/general';
import { 
  MANUAL_VALIDATION, 
  EMAIL_NOTIFY 
} from '@/constants/wall/launch';

const UserValidationStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchData, updateStepData, updateMultipleData, goToNextStep } = useLaunchWizard();
  
  const isClosedProgram = launchData.confidentiality === CLOSED;
  
  // Validation settings
  const [manualValidation, setManualValidation] = useState(
    (launchData.manualValidation as boolean) ?? true
  );
  const [emailNotify, setEmailNotify] = useState(
    (launchData.emailNotify as boolean) ?? true
  );
  
  // Get uploaded file data
  const uploadedFile = launchData.invitedUserData as { 
    fileName?: string; 
    validRecords?: number;
  } | undefined;
  
  // Sync settings with store
  useEffect(() => {
    updateMultipleData({
      [MANUAL_VALIDATION]: manualValidation,
      [EMAIL_NOTIFY]: emailNotify,
    });
  }, [manualValidation, emailNotify]);
  
  const handleContinue = () => {
    updateMultipleData({
      [MANUAL_VALIDATION]: manualValidation,
      [EMAIL_NOTIFY]: emailNotify,
    });
    goToNextStep();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launchProgram.validation.title" 
            defaultMessage="User Validation Settings" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launchProgram.validation.subtitle" 
            defaultMessage="Configure how participants will be validated and notified" 
          />
        </p>
      </div>
      
      {/* Upload Summary */}
      {uploadedFile?.fileName && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-10 w-10 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage 
                    id="launchProgram.validation.recordsReady" 
                    defaultMessage="{count} participants ready to be invited" 
                    values={{ count: uploadedFile.validRecords || 0 }}
                  />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Validation Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <FormattedMessage 
              id="launchProgram.validation.method" 
              defaultMessage="Validation Method" 
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launchProgram.validation.method.desc" 
              defaultMessage="Choose how participant registrations will be validated" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onClick={() => setManualValidation(true)}
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
              manualValidation 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-muted-foreground/30'
            )}
          >
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full',
              manualValidation ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  <FormattedMessage 
                    id="launchProgram.validation.manual" 
                    defaultMessage="Manual Validation" 
                  />
                </p>
                {manualValidation && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <FormattedMessage 
                  id="launchProgram.validation.manual.desc" 
                  defaultMessage="You'll review and approve each participant before they can access the program" 
                />
              </p>
            </div>
          </div>
          
          <div
            onClick={() => setManualValidation(false)}
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
              !manualValidation 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-muted-foreground/30'
            )}
          >
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full',
              !manualValidation ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  <FormattedMessage 
                    id="launchProgram.validation.auto" 
                    defaultMessage="Automatic Validation" 
                  />
                </p>
                {!manualValidation && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <FormattedMessage 
                  id="launchProgram.validation.auto.desc" 
                  defaultMessage="Participants are automatically validated if their email is in the uploaded list" 
                />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <FormattedMessage 
              id="launchProgram.validation.notifications" 
              defaultMessage="Email Notifications" 
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launchProgram.validation.notifications.desc" 
              defaultMessage="Configure email notifications for validation events" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="email-notify" className="font-medium">
                <FormattedMessage 
                  id="launchProgram.validation.notifyOnValidation" 
                  defaultMessage="Notify participants on validation" 
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="launchProgram.validation.notifyOnValidation.desc" 
                  defaultMessage="Send an email when a participant is approved or rejected" 
                />
              </p>
            </div>
            <Switch
              id="email-notify"
              checked={emailNotify}
              onCheckedChange={setEmailNotify}
            />
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleContinue} className="w-full" size="lg">
        <FormattedMessage id="form.submit.next" defaultMessage="Continue to Next Step" />
      </Button>
    </div>
  );
};

export { UserValidationStep };
export default UserValidationStep;
