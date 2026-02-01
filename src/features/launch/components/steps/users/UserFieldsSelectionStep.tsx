// -----------------------------------------------------------------------------
// UserFieldsSelectionStep Component
// Step 1: Select registration fields for user invitation
// Aligned with old_app UserInformationMandatoryFields and UserFieldRow
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Mail, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../../hooks/useLaunchWizard';
import { CLOSED } from '@/constants/general';

// Default registration fields matching old_app structure
const DEFAULT_FIELDS = [
  { key: 'firstName', mandatory: true, labelId: 'form.label.firstName' },
  { key: 'lastName', mandatory: true, labelId: 'form.label.lastName' },
  { key: 'email', mandatory: true, labelId: 'form.label.email' },
  { key: 'phone', mandatory: false, labelId: 'form.label.phone' },
  { key: 'company', mandatory: false, labelId: 'form.label.company' },
  { key: 'department', mandatory: false, labelId: 'form.label.department' },
  { key: 'position', mandatory: false, labelId: 'form.label.position' },
  { key: 'address', mandatory: false, labelId: 'form.label.address' },
  { key: 'city', mandatory: false, labelId: 'form.label.city' },
  { key: 'zipCode', mandatory: false, labelId: 'form.label.zipCode' },
];

const UserFieldsSelectionStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchData, updateStepData, updateMultipleData, goToNextStep } = useLaunchWizard();
  
  const isClosedProgram = launchData.confidentiality === CLOSED;
  
  // Initialize selected fields from store or default mandatory fields
  const storedFields = launchData.invitedUsersFields as string[] | undefined;
  const [selectedFields, setSelectedFields] = useState<string[]>(
    storedFields || DEFAULT_FIELDS.filter(f => f.mandatory).map(f => f.key)
  );
  
  // Sync with store when selectedFields changes
  useEffect(() => {
    if (selectedFields.length > 0) {
      updateStepData('invitedUsersFields', selectedFields);
    }
  }, [selectedFields]);
  
  const handleFieldToggle = (fieldKey: string) => {
    const field = DEFAULT_FIELDS.find(f => f.key === fieldKey);
    if (field?.mandatory) return; // Can't toggle mandatory fields
    
    setSelectedFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };
  
  const handleAcceptInvitations = () => {
    updateMultipleData({
      invitedUsersFields: selectedFields,
      acceptedEmailInvitation: true,
    });
    goToNextStep();
  };
  
  const handleDeclineInvitations = () => {
    updateMultipleData({
      invitedUsersFields: selectedFields,
      acceptedEmailInvitation: false,
    });
    // Skip to results step for open programs
    goToNextStep();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launchProgram.title" 
            defaultMessage="Launch Your Program" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launchProgram.users.subtitle" 
            defaultMessage="Configure the information you'll collect from participants" 
          />
        </p>
      </div>
      
      {/* Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <FormattedMessage 
              id="launchProgram.users.extraInformation" 
              defaultMessage="Participant Information" 
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launchProgram.users.mandatoryItems" 
              defaultMessage="Select which fields participants must fill. " 
            />
            <span className="font-medium text-primary">
              <FormattedMessage 
                id="launchProgram.users.mandatory" 
                defaultMessage="Fields marked with * are mandatory." 
              />
            </span>
            <FormattedMessage 
              id="launchProgram.users.askTooMuch" 
              defaultMessage=" Keep it simple to increase participation rates." 
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DEFAULT_FIELDS.map((field) => {
              const isSelected = selectedFields.includes(field.key);
              const isMandatory = field.mandatory;
              
              return (
                <button
                  key={field.key}
                  onClick={() => handleFieldToggle(field.key)}
                  disabled={isMandatory}
                  className={cn(
                    'relative p-3 rounded-lg border-2 text-left transition-all',
                    'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/30',
                    isMandatory && 'cursor-not-allowed opacity-70'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <FormattedMessage id={field.labelId} defaultMessage={field.key} />
                      {isMandatory && <span className="text-destructive ml-1">*</span>}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Send Invitations Section */}
      {selectedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <FormattedMessage 
                id="launchProgram.users.sendEmailInvitations" 
                defaultMessage="Email Invitations" 
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage 
                id="launchProgram.users.emailInvitations" 
                defaultMessage="Would you like to send email invitations " 
              />
              <span className="font-medium">
                <FormattedMessage 
                  id="launchProgram.users.to" 
                  defaultMessage="to participants from your " 
                />
              </span>
              <span className="font-medium text-primary">
                <FormattedMessage 
                  id="launchProgram.users.existingDatabase" 
                  defaultMessage="existing database?" 
                />
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClosedProgram && (
              <p className="text-sm text-muted-foreground mb-4">
                <FormattedMessage 
                  id="launchProgram.users.uploadUserFileList" 
                  defaultMessage="For closed programs, you'll need to upload a list of authorized participants in the next step." 
                />
              </p>
            )}
            <div className="flex gap-3">
              {isClosedProgram ? (
                <Button onClick={handleAcceptInvitations} className="flex-1">
                  <FormattedMessage id="form.submit.next" defaultMessage="Next" />
                </Button>
              ) : (
                <>
                  <Button onClick={handleAcceptInvitations} className="flex-1">
                    <FormattedMessage id="form.label.radio.accept" defaultMessage="Yes, send invitations" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDeclineInvitations}
                    className="flex-1"
                  >
                    <FormattedMessage id="form.label.radio.decline" defaultMessage="No, skip this step" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { UserFieldsSelectionStep };
export default UserFieldsSelectionStep;
