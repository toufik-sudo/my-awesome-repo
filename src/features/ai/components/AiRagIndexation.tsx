// -----------------------------------------------------------------------------
// AI RAG Indexation Component
// Migrated from old_app/src/components/pages/programs/ia/AiRagComponent.tsx
// -----------------------------------------------------------------------------

import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Link as LinkIcon, 
  Loader2, 
  RefreshCw, 
  Lock,
  Unlock,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IRagCategory, IAiAdminProgram } from '../types';
import type { UseRagIndexationReturn } from '../hooks/useRagIndexation';

interface AiRagIndexationProps extends UseRagIndexationReturn {
  adminPrograms: IAiAdminProgram[];
  isHyperAdmin?: boolean;
}

const CategoryCard: React.FC<{
  category: IRagCategory;
  onUpload: (file: File | null, isLink: boolean, url?: string) => void;
  onReset: () => void;
  onBlock: () => void;
  isLoading: boolean;
  formatMessage: ReturnType<typeof useIntl>['formatMessage'];
}> = ({ category, onUpload, onReset, onBlock, isLoading, formatMessage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl.trim()) {
      onUpload(null, true, linkUrl);
      setLinkUrl('');
    }
  };

  const statusIcon = category.disabled ? (
    <Lock className="h-4 w-4 text-destructive" />
  ) : category.isActivatedReset ? (
    <AlertTriangle className="h-4 w-4 text-warning" />
  ) : (
    <CheckCircle className="h-4 w-4 text-success" />
  );

  return (
    <Card className={cn(
      'transition-all',
      category.disabled && 'opacity-60 border-destructive/50'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {formatMessage({ id: category.id }, { defaultMessage: category.catName })}
          </CardTitle>
          {statusIcon}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!category.disabled && (
          <>
            <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as 'file' | 'link')}>
              <TabsList className="w-full">
                <TabsTrigger value="file" className="flex-1">
                  <Upload className="h-3 w-3 mr-1" />
                  {formatMessage({ id: 'ai.rag.uploadFile' }, { defaultMessage: 'File' })}
                </TabsTrigger>
                <TabsTrigger value="link" className="flex-1">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  {formatMessage({ id: 'ai.rag.uploadLink' }, { defaultMessage: 'Link' })}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.txt,.doc,.docx"
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {formatMessage({ id: 'ai.rag.selectFile' }, { defaultMessage: 'Select File' })}
                </Button>
              </TabsContent>
              <TabsContent value="link" className="mt-2 space-y-2">
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLinkSubmit}
                  disabled={isLoading || !linkUrl.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LinkIcon className="h-4 w-4 mr-2" />
                  )}
                  {formatMessage({ id: 'ai.rag.indexLink' }, { defaultMessage: 'Index Link' })}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                disabled={isLoading}
                className="flex-1 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {formatMessage({ id: 'ai.rag.reset' }, { defaultMessage: 'Reset' })}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBlock}
                disabled={isLoading}
                className="flex-1 text-xs text-destructive hover:text-destructive"
              >
                <Lock className="h-3 w-3 mr-1" />
                {formatMessage({ id: 'ai.rag.block' }, { defaultMessage: 'Block' })}
              </Button>
            </div>
          </>
        )}

        {category.disabled && (
          <div className="text-center py-2">
            <Badge variant="destructive">
              {formatMessage({ id: 'ai.rag.blocked' }, { defaultMessage: 'Blocked' })}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AiRagIndexation: React.FC<AiRagIndexationProps> = ({
  adminPrograms,
  categories,
  commonCategories,
  isLoading,
  selectedProgram,
  setSelectedProgram,
  uploadFile,
  resetCategory,
  blockCategory,
  isHyperAdmin = false,
}) => {
  const { formatMessage } = useIntl();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'reset' | 'block';
    catName: string;
    isCommon: boolean;
  }>({ open: false, type: 'reset', catName: '', isCommon: false });

  const handleProgramSelect = (programId: string) => {
    const program = adminPrograms.find(p => String(p.id) === programId);
    setSelectedProgram(program || null);
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === 'reset') {
      await resetCategory(confirmDialog.catName, confirmDialog.isCommon);
    } else {
      await blockCategory(confirmDialog.catName);
    }
    setConfirmDialog({ open: false, type: 'reset', catName: '', isCommon: false });
  };

  return (
    <div className="space-y-6">
      {/* Program Selection */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatMessage({ id: 'ai.rag.title' }, { defaultMessage: 'RAG Knowledge Base' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'ai.rag.description' }, { defaultMessage: 'Upload documents and links to train your AI assistant' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>{formatMessage({ id: 'ai.rag.selectProgram' }, { defaultMessage: 'Select Program' })}</Label>
            <Select 
              value={selectedProgram ? String(selectedProgram.id) : ''}
              onValueChange={handleProgramSelect}
            >
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder={formatMessage({ id: 'ai.rag.programPlaceholder' }, { defaultMessage: 'Choose a program with AI' })} />
              </SelectTrigger>
              <SelectContent>
                {adminPrograms.map(program => (
                  <SelectItem key={program.id} value={String(program.id)}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {selectedProgram && (
        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">
              {formatMessage({ id: 'ai.rag.categories' }, { defaultMessage: 'Categories' })}
            </TabsTrigger>
            <TabsTrigger value="common">
              {formatMessage({ id: 'ai.rag.common' }, { defaultMessage: 'Common' })}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onUpload={(file, isLink, url) => uploadFile(file, category.catName, false, isLink, url)}
                  onReset={() => setConfirmDialog({ open: true, type: 'reset', catName: category.catName, isCommon: false })}
                  onBlock={() => setConfirmDialog({ open: true, type: 'block', catName: category.catName, isCommon: false })}
                  isLoading={isLoading}
                  formatMessage={formatMessage}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="common" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {commonCategories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onUpload={(file, isLink, url) => uploadFile(file, category.catName, true, isLink, url)}
                  onReset={() => setConfirmDialog({ open: true, type: 'reset', catName: category.catName, isCommon: true })}
                  onBlock={() => {}}
                  isLoading={isLoading}
                  formatMessage={formatMessage}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'reset' 
                ? formatMessage({ id: 'ai.rag.confirmReset' }, { defaultMessage: 'Confirm Reset' })
                : formatMessage({ id: 'ai.rag.confirmBlock' }, { defaultMessage: 'Confirm Block' })
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'reset'
                ? formatMessage(
                    { id: 'ai.rag.resetDescription' },
                    { defaultMessage: `This will reset all indexed data for the "${confirmDialog.catName}" category. This action cannot be undone.` }
                  )
                : formatMessage(
                    { id: 'ai.rag.blockDescription' },
                    { defaultMessage: `This will block indexation for the "${confirmDialog.catName}" category.` }
                  )
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {formatMessage({ id: 'common.cancel' }, { defaultMessage: 'Cancel' })}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {formatMessage({ id: 'common.confirm' }, { defaultMessage: 'Confirm' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AiRagIndexation;
