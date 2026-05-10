import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Upload, RefreshCw, FileText, Eye, Check, X, Archive, Loader2, Replace,
  CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { documentsApi, trustApi } from '../admin.api';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import {
  DOCUMENT_LABELS, DocumentType, VerificationDocument,
} from '@/types/verification.types';
import { cn } from '@/lib/utils';

interface Props {
  propertyId: string;
  propertyTitle?: string;
}

const DOC_TYPES: DocumentType[] = [
  'national_id', 'passport', 'permit',
  'notarized_deed', 'land_registry', 'utility_bill', 'management_declaration',
];

export const PropertyDocumentsManager: React.FC<Props> = ({ propertyId, propertyTitle }) => {
  const qc = useQueryClient();
  const { can, isHyperAdmin, isHyperManager } = useRoleAccess('PropertyDocumentsManager');
  const isHyper = !!(isHyperAdmin || isHyperManager);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<VerificationDocument | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<DocumentType>('national_id');
  const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);
  const [rejectDoc, setRejectDoc] = useState<VerificationDocument | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const { data: docs = [], isLoading, refetch } = useQuery({
    queryKey: ['property-documents', propertyId],
    queryFn: () => documentsApi.getByProperty(propertyId),
  });

  const visibleDocs = useMemo(
    () => docs.filter(d => isHyper || d.status !== 'archived'),
    [docs, isHyper],
  );

  const uploadMut = useMutation({
    mutationFn: () => documentsApi.upload(propertyId, type, file!, replaceTarget?.id),
    onSuccess: () => {
      toast.success(replaceTarget
        ? 'Replacement submitted — pending hyper validation'
        : 'Document uploaded — pending hyper validation');
      setUploadOpen(false);
      setReplaceTarget(null);
      setFile(null);
      qc.invalidateQueries({ queryKey: ['property-documents', propertyId] });
    },
    onError: () => toast.error('Upload failed'),
  });

  const approveMut = useMutation({
    mutationFn: (id: string) => documentsApi.approve(id),
    onSuccess: async () => {
      toast.success('Approved');
      await trustApi.recalculate(propertyId).catch(() => null);
      qc.invalidateQueries({ queryKey: ['property-documents', propertyId] });
    },
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => documentsApi.reject(id, note),
    onSuccess: async () => {
      toast.error('Rejected');
      setRejectDoc(null);
      setRejectNote('');
      qc.invalidateQueries({ queryKey: ['property-documents', propertyId] });
    },
  });

  const startReplace = useCallback((doc: VerificationDocument) => {
    setReplaceTarget(doc);
    setType(doc.type);
    setUploadOpen(true);
  }, []);

  const startUpload = useCallback(() => {
    setReplaceTarget(null);
    setFile(null);
    setUploadOpen(true);
  }, []);

  const statusBadge = (s: string) => {
    switch (s) {
      case 'pending':  return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved': return <Badge className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'archived': return <Badge variant="secondary"><Archive className="h-3 w-3 mr-1" />Archived</Badge>;
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Documents</h3>
          {propertyTitle && <p className="text-xs text-muted-foreground">{propertyTitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          {can('Header', 'Button', 'Upload') && (
            <Button size="sm" onClick={startUpload} className="gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload
            </Button>
          )}
        </div>
      </div>

      {visibleDocs.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No documents yet</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleDocs.map(doc => (
            <Card
              key={doc.id}
              className={cn(
                'border-border',
                doc.status === 'archived' && 'opacity-60 border-dashed',
                doc.status === 'approved' && 'border-emerald-500/40',
                doc.status === 'rejected' && 'border-destructive/40',
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <CardTitle className="text-sm truncate">{DOCUMENT_LABELS[doc.type]}</CardTitle>
                  </div>
                  {statusBadge(doc.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-xs text-muted-foreground truncate">{doc.fileName}</p>
                {doc.replacesDocumentId && (
                  <p className="text-xs text-amber-600">↻ Replacement candidate</p>
                )}
                {doc.reviewNote && (
                  <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2">{doc.reviewNote}</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setPreviewDoc(doc)}>
                    <Eye className="h-3 w-3" /> Preview
                  </Button>
                  {doc.status === 'approved' && can('Card', 'Button', 'Replace') && (
                    <Button variant="secondary" size="sm" className="gap-1 text-xs" onClick={() => startReplace(doc)}>
                      <Replace className="h-3 w-3" /> Replace
                    </Button>
                  )}
                  {doc.status === 'pending' && can('Card', 'Button', 'Approve') && (
                    <Button size="sm" className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => approveMut.mutate(doc.id)} disabled={approveMut.isPending}>
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                  )}
                  {doc.status === 'pending' && can('Card', 'Button', 'Reject') && (
                    <Button size="sm" variant="destructive" className="gap-1 text-xs"
                      onClick={() => setRejectDoc(doc)} disabled={rejectMut.isPending}>
                      <X className="h-3 w-3" /> Reject
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload / Replace dialog */}
      <Dialog open={uploadOpen} onOpenChange={(o) => { if (!o) { setUploadOpen(false); setReplaceTarget(null); setFile(null); } }}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle>{replaceTarget ? 'Replace document' : 'Upload document'}</DialogTitle>
            <DialogDescription>
              {replaceTarget
                ? `Submitting a replacement for "${DOCUMENT_LABELS[replaceTarget.type]}". The original will be archived after hyper admin/manager validates the new file.`
                : 'The new document will be pending until a hyper admin/manager validates it.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Document type</Label>
              <Select value={type} onValueChange={(v) => setType(v as DocumentType)} disabled={!!replaceTarget}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{DOCUMENT_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File (jpg/png/webp/pdf, max 10MB)</Label>
              <Input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={() => uploadMut.mutate()} disabled={!file || uploadMut.isPending}>
              {uploadMut.isPending ? 'Uploading…' : (replaceTarget ? 'Submit replacement' : 'Upload')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle>{previewDoc && DOCUMENT_LABELS[previewDoc.type]}</DialogTitle>
            <DialogDescription>{previewDoc?.fileName}</DialogDescription>
          </DialogHeader>
          {previewDoc && (
            previewDoc.fileUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe src={previewDoc.fileUrl} className="w-full h-[60vh] rounded border border-border" />
            ) : (
              <img src={previewDoc.fileUrl} alt={previewDoc.fileName}
                className="w-full max-h-[60vh] object-contain rounded border border-border" />
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Reject */}
      <Dialog open={!!rejectDoc} onOpenChange={() => { setRejectDoc(null); setRejectNote(''); }}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle>Reject document</DialogTitle>
          </DialogHeader>
          <Textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Reason (optional)" rows={3} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDoc(null)}>Cancel</Button>
            <Button variant="destructive"
              onClick={() => rejectDoc && rejectMut.mutate({ id: rejectDoc.id, note: rejectNote })}
              disabled={rejectMut.isPending}>
              {rejectMut.isPending ? 'Rejecting…' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDocumentsManager;
