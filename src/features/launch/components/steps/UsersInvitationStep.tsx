// -----------------------------------------------------------------------------
// UsersInvitationStep Component
// Configure user invitation and registration fields
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, UserPlus, FileSpreadsheet, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';

const DEFAULT_FIELDS = [
  { id: 'firstName', labelId: 'form.field.firstName', required: true },
  { id: 'lastName', labelId: 'form.field.lastName', required: true },
  { id: 'email', labelId: 'form.field.email', required: true },
  { id: 'phone', labelId: 'form.field.phone', required: false },
  { id: 'company', labelId: 'form.field.company', required: false },
  { id: 'department', labelId: 'form.field.department', required: false },
  { id: 'position', labelId: 'form.field.position', required: false },
];

const UsersInvitationStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchData, updateStepData, updateMultipleData } = useLaunchWizard();
  
  const selectedFields = (launchData.invitedUsersFields as string[]) || ['firstName', 'lastName', 'email'];
  const invitedUsersFile = launchData.invitedUserData as { invitedUsersFile?: string } | undefined;
  const [dragActive, setDragActive] = useState(false);
  
  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    const newFields = checked
      ? [...selectedFields, fieldId]
      : selectedFields.filter((f) => f !== fieldId);
    updateStepData('invitedUsersFields', newFields);
  };
  
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileUpload = (file: File) => {
    // In real implementation, this would upload to the API
    updateStepData('invitedUserData', {
      invitedUsersFile: file.name,
      fileName: file.name,
    });
  };
  
  const handleRemoveFile = () => {
    updateStepData('invitedUserData', null);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.users.title" 
            defaultMessage="User Registration" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.users.description" 
            defaultMessage="Configure registration fields and invite users" 
          />
        </p>
      </div>
      
      {/* Registration Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <FormattedMessage id="launch.users.fields" defaultMessage="Registration Fields" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launch.users.fields.desc" 
              defaultMessage="Select which fields users must fill during registration" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_FIELDS.map((field) => {
              const isSelected = selectedFields.includes(field.id);
              const isDisabled = field.required;
              
              return (
                <div
                  key={field.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    isSelected ? 'bg-primary/5 border-primary/30' : 'bg-muted/30',
                    isDisabled && 'opacity-70'
                  )}
                >
                  <Checkbox
                    id={`field-${field.id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`field-${field.id}`} 
                    className={cn('flex-1 cursor-pointer', isDisabled && 'cursor-not-allowed')}
                  >
                    <FormattedMessage id={field.labelId} defaultMessage={field.id} />
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* File Upload for Bulk Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            <FormattedMessage id="launch.users.import" defaultMessage="Bulk Import Users" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage 
              id="launch.users.import.desc" 
              defaultMessage="Upload a CSV or Excel file with user data" 
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitedUsersFile?.invitedUsersFile ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{invitedUsersFile.invitedUsersFile}</p>
                  <p className="text-sm text-muted-foreground">
                    <FormattedMessage id="common.fileUploaded" defaultMessage="File uploaded" />
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30',
                'hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                <FormattedMessage 
                  id="launch.users.import.drag" 
                  defaultMessage="Drag and drop your file here" 
                />
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <FormattedMessage id="common.or" defaultMessage="or" />
              </p>
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                  <FormattedMessage id="common.browse" defaultMessage="Browse files" />
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                <FormattedMessage 
                  id="launch.users.import.formats" 
                  defaultMessage="Supported formats: CSV, XLSX, XLS" 
                />
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { UsersInvitationStep };
export default UsersInvitationStep;
