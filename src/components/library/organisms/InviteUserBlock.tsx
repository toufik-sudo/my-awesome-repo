// -----------------------------------------------------------------------------
// InviteUserBlock Component
// Consolidated user invitation interface with multiple invite methods
// -----------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Upload, 
  Users, 
  AlertCircle, 
  X, 
  Plus,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type InviteMethod = 'email' | 'file' | 'all';

export interface InviteEmail {
  email: string;
  isValid: boolean;
}

export interface InviteUserBlockProps {
  onSubmit: (method: InviteMethod, data: InviteEmail[] | File | 'all') => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  backPath?: string;
  backLabel?: string;
  title?: string;
  description?: string;
  showAllUsersOption?: boolean;
  maxEmails?: number;
  acceptedFileTypes?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Email Input Component
// -----------------------------------------------------------------------------

interface EmailInputProps {
  emails: InviteEmail[];
  onEmailsChange: (emails: InviteEmail[]) => void;
  maxEmails?: number;
  disabled?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ 
  emails, 
  onEmailsChange, 
  maxEmails = 50,
  disabled 
}) => {
  const [inputValue, setInputValue] = useState('');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const addEmail = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    if (emails.length >= maxEmails) return;
    
    const isValid = validateEmail(trimmed);
    const exists = emails.some(e => e.email.toLowerCase() === trimmed.toLowerCase());
    
    if (!exists) {
      onEmailsChange([...emails, { email: trimmed, isValid }]);
    }
    
    setInputValue('');
  };

  const removeEmail = (index: number) => {
    onEmailsChange(emails.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedEmails = pastedText.split(/[,;\s\n]+/).filter(Boolean);
    
    const newEmails = pastedEmails
      .slice(0, maxEmails - emails.length)
      .map(email => ({
        email: email.trim(),
        isValid: validateEmail(email.trim())
      }))
      .filter(({ email }) => !emails.some(e => e.email.toLowerCase() === email.toLowerCase()));
    
    onEmailsChange([...emails, ...newEmails]);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter email address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled || emails.length >= maxEmails}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addEmail}
          disabled={disabled || !inputValue.trim() || emails.length >= maxEmails}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Email Tags */}
      {emails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {emails.map((email, index) => (
            <Badge
              key={index}
              variant={email.isValid ? 'secondary' : 'destructive'}
              className="flex items-center gap-1 pr-1"
            >
              {email.email}
              <button
                type="button"
                onClick={() => removeEmail(index)}
                disabled={disabled}
                className="ml-1 p-0.5 hover:bg-background/20 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {emails.length}/{maxEmails} emails added. Press Enter or comma to add.
      </p>
    </div>
  );
};

// -----------------------------------------------------------------------------
// File Upload Component
// -----------------------------------------------------------------------------

interface FileUploadInputProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  acceptedTypes?: string;
  disabled?: boolean;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  file,
  onFileChange,
  acceptedTypes = '.csv,.xlsx,.xls',
  disabled
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    onFileChange(selectedFile || null);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          'hover:border-primary/50 hover:bg-muted/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(null)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">
              CSV, XLSX, or XLS files supported
            </p>
            <input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const InviteUserBlock: React.FC<InviteUserBlockProps> = ({
  onSubmit,
  isLoading = false,
  error,
  backPath = '/users',
  backLabel = 'Back to Users',
  title = 'Invite Users',
  description = 'Invite new users to join your program',
  showAllUsersOption = true,
  maxEmails = 50,
  acceptedFileTypes = '.csv,.xlsx,.xls',
  className
}) => {
  const [activeTab, setActiveTab] = useState<InviteMethod>('email');
  const [emails, setEmails] = useState<InviteEmail[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const isValid = useCallback(() => {
    switch (activeTab) {
      case 'email':
        return emails.length > 0 && emails.every(e => e.isValid);
      case 'file':
        return file !== null;
      case 'all':
        return true;
      default:
        return false;
    }
  }, [activeTab, emails, file]);

  const handleSubmit = async () => {
    if (!isValid()) return;

    switch (activeTab) {
      case 'email':
        await onSubmit('email', emails);
        setEmails([]);
        break;
      case 'file':
        if (file) {
          await onSubmit('file', file);
          setFile(null);
        }
        break;
      case 'all':
        await onSubmit('all', 'all');
        break;
    }
  };

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Invite Method Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InviteMethod)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">By Email</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload File</span>
            </TabsTrigger>
            {showAllUsersOption && (
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">All Users</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <div className="space-y-4">
              <Label>Email Addresses</Label>
              <EmailInput
                emails={emails}
                onEmailsChange={setEmails}
                maxEmails={maxEmails}
                disabled={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="file" className="mt-4">
            <div className="space-y-4">
              <Label>Upload User List</Label>
              <FileUploadInput
                file={file}
                onFileChange={setFile}
                acceptedTypes={acceptedFileTypes}
                disabled={isLoading}
              />
            </div>
          </TabsContent>

          {showAllUsersOption && (
            <TabsContent value="all" className="mt-4">
              <div className="rounded-lg border border-border p-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium mb-2">Invite All Eligible Users</h4>
                <p className="text-sm text-muted-foreground">
                  This will send invitations to all users who haven't been invited yet.
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" asChild>
            <Link to={backPath}>{backLabel}</Link>
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Send Invitations
              </>
            )}
          </Button>
        </div>

        {/* Warning */}
        <p className="text-xs text-muted-foreground text-center">
          Invitations will be sent immediately. Users will receive an email with instructions to join.
        </p>
      </CardContent>
    </Card>
  );
};

export default InviteUserBlock;
