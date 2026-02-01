// -----------------------------------------------------------------------------
// UserFileUploadStep Component
// Step 2: Invite users by Email, File Upload, or All Users
// Integrated with InviteUsersApi for backend file uploads
// -----------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  FileSpreadsheet,
  X,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Mail,
  Users,
  Plus,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHandleInvitesSubmission } from '../../../hooks/useHandleInvitesSubmission';
import { ACCEPTED_USERS_LIST_TYPE } from '@/constants/wall/launch';
import { EMAIL, FILE, ALL_USERS } from '@/constants/wall/users';

const UserFileUploadStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const [emailInput, setEmailInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Use the invitation submission hook
  const {
    activeTab,
    isSubmitting,
    isUploading,
    inviteError,
    uploadError,
    emailList,
    addEmail,
    removeEmail,
    uploadedFile,
    handleFileUpload,
    removeFile,
    setActiveTab,
    isDisabled
  } = useHandleInvitesSubmission();

  // Email input handlers
  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (addEmail(trimmedEmail)) {
      setEmailInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = (type: string) => {
    // TODO: Implement template download from API
    console.log('Download template:', type);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          <FormattedMessage
            id="launchProgram.users.invite.title"
            defaultMessage="Invite Participants"
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage
            id="launchProgram.users.invite.subtitle"
            defaultMessage="Choose how you want to invite users to your program"
          />
        </p>
      </div>

      {/* Invitation Methods Tabs */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value={EMAIL}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <FormattedMessage id="wall.users.byEmail" defaultMessage="By Email" />
                </span>
              </TabsTrigger>
              <TabsTrigger
                value={FILE}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <FormattedMessage id="wall.users.byFile" defaultMessage="By File" />
                </span>
              </TabsTrigger>
              <TabsTrigger
                value={ALL_USERS}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <FormattedMessage id="wall.users.allUsers" defaultMessage="All Users" />
                </span>
              </TabsTrigger>
            </TabsList>

            {/* EMAIL TAB */}
            <TabsContent value={EMAIL} className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={formatMessage({
                      id: 'form.email.placeholder',
                      defaultMessage: 'Enter email address...'
                    })}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddEmail}
                    disabled={!emailInput.trim() || !validateEmail(emailInput.trim())}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <FormattedMessage id="common.add" defaultMessage="Add" />
                  </Button>
                </div>

                {emailList.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <FormattedMessage
                        id="wall.users.emailCount"
                        defaultMessage="{count} email(s) added"
                        values={{ count: emailList.length }}
                      />
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-muted/30 rounded-lg">
                      {emailList.map((email) => (
                        <Badge
                          key={email}
                          variant="secondary"
                          className="gap-1 py-1.5 px-3 text-sm"
                        >
                          {email}
                          <button
                            onClick={() => removeEmail(email)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {emailList.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>
                      <FormattedMessage
                        id="wall.users.noEmails"
                        defaultMessage="No emails added yet. Add email addresses above."
                      />
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* FILE TAB */}
            <TabsContent value={FILE} className="space-y-4">
              {/* Template Download */}
              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Download className="h-4 w-4" />
                  <FormattedMessage
                    id="launchProgram.users.templates"
                    defaultMessage="Download Templates"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ACCEPTED_USERS_LIST_TYPE.map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadTemplate(type)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {type.toUpperCase().replace('.', '')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* File Upload Dropzone */}
              {isUploading ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">
                    <FormattedMessage
                      id="launchProgram.users.uploading"
                      defaultMessage="Uploading and validating file..."
                    />
                  </p>
                </div>
              ) : uploadedFile?.invitedUsersFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-primary/5 border-primary/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{uploadedFile.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {uploadedFile.validRecords !== undefined ? (
                            <FormattedMessage
                              id="launchProgram.users.validRecords"
                              defaultMessage="{count} valid records found"
                              values={{ count: uploadedFile.validRecords }}
                            />
                          ) : (
                            <FormattedMessage
                              id="launchProgram.users.fileUploaded"
                              defaultMessage="File uploaded successfully"
                            />
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {uploadedFile.invalidRecords && uploadedFile.invalidRecords.length > 0 && (
                    <div className="p-4 border-2 rounded-lg bg-destructive/5 border-destructive/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <p className="font-medium text-destructive">
                          <FormattedMessage
                            id="launchProgram.users.invalidRecords"
                            defaultMessage="{count} invalid records"
                            values={{ count: uploadedFile.invalidRecords.length }}
                          />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
                    dragActive
                      ? 'border-primary bg-primary/5 scale-[1.02]'
                      : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
                  )}
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2 font-medium">
                    <FormattedMessage
                      id="launchProgram.users.dropzone.title"
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
                        accept={ACCEPTED_USERS_LIST_TYPE.join(',')}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <FormattedMessage id="common.browse" defaultMessage="Browse files" />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    <FormattedMessage
                      id="launchProgram.users.acceptedTypes"
                      defaultMessage="Accepted formats: {formats}"
                      values={{ formats: ACCEPTED_USERS_LIST_TYPE.join(', ') }}
                    />
                  </p>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{uploadError}</span>
                </div>
              )}
            </TabsContent>

            {/* ALL USERS TAB */}
            <TabsContent value={ALL_USERS} className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/20">
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  <FormattedMessage
                    id="wall.users.inviteAll.title"
                    defaultMessage="Invite All Platform Users"
                  />
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  <FormattedMessage
                    id="wall.users.inviteAll.description"
                    defaultMessage="All users registered on the platform will automatically receive an invitation to join this program."
                  />
                </p>
              </div>

              <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  <FormattedMessage
                    id="wall.users.inviteAll.note"
                    defaultMessage="Invitations will be sent when you complete the program setup."
                  />
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {inviteError && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{inviteError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status indicator */}
      <div className="text-center text-sm text-muted-foreground">
        {activeTab === EMAIL && emailList.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <FormattedMessage
              id="launch.users.emailsReady"
              defaultMessage="{count} email(s) ready to invite"
              values={{ count: emailList.length }}
            />
          </div>
        )}
        {activeTab === FILE && uploadedFile?.invitedUsersFile && (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <FormattedMessage
              id="launch.users.fileReady"
              defaultMessage="File ready for processing"
            />
          </div>
        )}
        {activeTab === ALL_USERS && (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <FormattedMessage
              id="launch.users.allUsersReady"
              defaultMessage="All platform users will be invited"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { UserFileUploadStep };
export default UserFileUploadStep;
