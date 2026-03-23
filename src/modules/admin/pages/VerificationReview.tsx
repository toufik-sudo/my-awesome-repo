import React, { useState, useCallback, useEffect } from 'react';
import {
  Check,
  X,
  Star,
  Eye,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Home,
  User,
  Calendar,
  Filter,
  Upload,
  Brain,
  Sparkles,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DocumentType,
  VerificationDocument,
  PendingVerification,
  DOCUMENT_LABELS,
  IDENTITY_DOCUMENTS,
  PROPERTY_DOCUMENTS,
  calculateTrustStars,
} from '@/types/verification.types';
import { documentsApi, trustApi } from '../admin.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type FilterStatus = 'all' | 'pending' | 'partial' | 'approved' | 'rejected';

// Group documents by property for display
function groupDocumentsByProperty(docs: VerificationDocument[]): PendingVerification[] {
  const grouped = new Map<string, VerificationDocument[]>();

  docs.forEach((doc) => {
    const propId = doc.propertyId;
    if (!grouped.has(propId)) grouped.set(propId, []);
    grouped.get(propId)!.push(doc);
  });

  return Array.from(grouped.entries()).map(([propertyId, documents]) => {
    const firstDoc = documents[0];
    const property = firstDoc.property;

    const allApproved = documents.every((d) => d.status === 'approved');
    const allRejected = documents.every((d) => d.status === 'rejected');
    const hasPending = documents.some((d) => d.status === 'pending');

    let overallStatus: PendingVerification['overallStatus'] = 'partial';
    if (allApproved) overallStatus = 'approved';
    else if (allRejected) overallStatus = 'rejected';
    else if (hasPending) overallStatus = 'pending';

    // Calculate current trust stars
    const approvedDocs = documents.filter((d) => d.status === 'approved');
    const hasIdentity = approvedDocs.some((d) => IDENTITY_DOCUMENTS.includes(d.type));
    const hasNotarizedDeed = approvedDocs.some((d) => d.type === 'notarized_deed');
    const hasLandRegistry = approvedDocs.some((d) => d.type === 'land_registry');
    const hasUtilityBill = approvedDocs.some((d) => d.type === 'utility_bill');
    const currentTrustStars = calculateTrustStars({ hasIdentity, hasNotarizedDeed, hasLandRegistry, hasUtilityBill });

    return {
      id: propertyId,
      propertyId,
      propertyTitle: property?.title || 'Unknown Property',
      propertyType: property?.propertyType || 'property',
      location: {
        city: property?.city || 'Unknown',
        wilaya: property?.wilaya || 'Unknown',
      },
      hostName: 'Property Owner',
      hostEmail: '',
      submittedAt: documents.reduce((earliest, d) =>
        new Date(d.createdAt) < new Date(earliest) ? d.createdAt : earliest, documents[0].createdAt),
      documents,
      currentTrustStars,
      overallStatus,
    };
  });
}

export const VerificationReview: React.FC = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ doc: VerificationDocument; verificationId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch pending documents
  const { data: pendingDocs = [], isLoading, refetch } = useQuery({
    queryKey: ['pending-documents'],
    queryFn: documentsApi.getPending,
  });

  const verifications = groupDocumentsByProperty(pendingDocs);

  const filteredVerifications = verifications.filter((v) => {
    if (filterStatus === 'all') return true;
    return v.overallStatus === filterStatus;
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ docId, note }: { docId: string; note?: string }) =>
      documentsApi.approve(docId, note),
    onSuccess: async (_, variables) => {
      toast.success('Document approved');
      // Find the property ID for this document to recalculate trust
      const doc = pendingDocs.find((d) => d.id === variables.docId);
      if (doc) {
        await trustApi.recalculate(doc.propertyId);
      }
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
    },
    onError: () => toast.error('Failed to approve document'),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ docId, note }: { docId: string; note?: string }) =>
      documentsApi.reject(docId, note),
    onSuccess: async (_, variables) => {
      toast.error('Document rejected');
      const doc = pendingDocs.find((d) => d.id === variables.docId);
      if (doc) {
        await trustApi.recalculate(doc.propertyId);
      }
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
      setRejectDialog(null);
      setRejectReason('');
    },
    onError: () => toast.error('Failed to reject document'),
  });

  // Validate with AI mutation
  const validateMutation = useMutation({
    mutationFn: (docId: string) => documentsApi.submitForValidation(docId),
    onSuccess: (result) => {
      if (result.autoApproved) {
        toast.success(`AI auto-processed document (${(result.aiResult?.confidence ?? 0) * 100}% confidence)`);
      } else {
        toast.info('AI analysis complete - requires manual review');
      }
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
    },
    onError: () => toast.error('AI validation failed'),
  });

  const handleApproveDoc = useCallback((docId: string) => {
    approveMutation.mutate({ docId });
  }, [approveMutation]);

  const handleRejectDoc = useCallback(() => {
    if (!rejectDialog) return;
    rejectMutation.mutate({ docId: rejectDialog.doc.id, note: rejectReason });
  }, [rejectDialog, rejectReason, rejectMutation]);

  const handleApproveAll = useCallback((propertyId: string) => {
    const docs = pendingDocs.filter((d) => d.propertyId === propertyId && d.status === 'pending');
    docs.forEach((doc) => approveMutation.mutate({ docId: doc.id }));
  }, [pendingDocs, approveMutation]);

  const handleValidateWithAI = useCallback((docId: string) => {
    validateMutation.mutate(docId);
  }, [validateMutation]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'partial':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Partial</Badge>;
      default:
        return null;
    }
  };

  const getAIConfidenceBadge = (doc: VerificationDocument) => {
    if (!doc.aiAnalyzed) return null;
    const confidence = doc.aiConfidence ?? 0;
    const isValid = doc.aiValidationResult;
    const confidencePercent = Math.round(confidence * 100);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={cn(
                'gap-1',
                isValid ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
              )}
            >
              <Brain className="h-3 w-3" />
              AI: {confidencePercent}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">AI Analysis Result</p>
              <p className="text-sm">
                {isValid ? '✅ Likely valid' : '❌ Likely invalid'}
              </p>
              <p className="text-sm text-muted-foreground">{doc.aiReason}</p>
              {doc.aiDetectedIssues && doc.aiDetectedIssues.length > 0 && (
                <div className="text-sm">
                  <p className="font-medium">Issues detected:</p>
                  <ul className="list-disc list-inside">
                    {doc.aiDetectedIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const pendingCount = verifications.filter((v) => v.overallStatus === 'pending').length;
  const partialCount = verifications.filter((v) => v.overallStatus === 'partial').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{partialCount}</p>
                <p className="text-xs text-muted-foreground">Partial Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {verifications.filter((v) => v.overallStatus === 'approved').length}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {verifications.filter((v) => v.overallStatus === 'rejected').length}
                </p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredVerifications.length} submission{filteredVerifications.length !== 1 ? 's' : ''}
        </span>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-auto gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Verification List */}
      <div className="space-y-4">
        {filteredVerifications.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No verifications to review</p>
            </CardContent>
          </Card>
        ) : (
          filteredVerifications.map((verification) => {
            const isExpanded = expandedId === verification.id;
            const pendingDocs = verification.documents.filter((d) => d.status === 'pending').length;

            return (
              <Card key={verification.id} className={cn('border-border transition-all', isExpanded && 'ring-1 ring-primary')}>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : verification.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base text-foreground">{verification.propertyTitle}</CardTitle>
                        {getStatusBadge(verification.overallStatus)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Home className="h-3.5 w-3.5" />
                          {verification.propertyType}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {verification.location.city}, {verification.location.wilaya}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {verification.hostName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Trust Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-4 w-4',
                              i <= verification.currentTrustStars
                                ? 'fill-accent text-accent'
                                : 'text-border'
                            )}
                          />
                        ))}
                      </div>
                      {pendingDocs > 0 && (
                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                          {pendingDocs} pending
                        </Badge>
                      )}
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <Separator />

                    {/* Submission Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                      </span>
                      {verification.hostEmail && (
                        <>
                          <span>•</span>
                          <span>{verification.hostEmail}</span>
                        </>
                      )}
                    </div>

                    {/* Documents Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">Submitted Documents</h4>
                        {verification.documents.some((d) => d.status === 'pending') && (
                          <Button
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleApproveAll(verification.id); }}
                            className="gap-1.5"
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-3.5 w-3.5" /> Approve All
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {verification.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className={cn(
                              'border rounded-lg p-3 space-y-2',
                              doc.status === 'approved' && 'border-green-500/50 bg-green-500/5',
                              doc.status === 'rejected' && 'border-destructive/50 bg-destructive/5',
                              doc.status === 'pending' && 'border-border'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                  {DOCUMENT_LABELS[doc.type]}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {getAIConfidenceBadge(doc)}
                                {getStatusBadge(doc.status)}
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground truncate">{doc.fileName}</p>

                            {/* AI Analysis Section */}
                            {doc.aiAnalyzed && (
                              <div className={cn(
                                'rounded p-2 space-y-1',
                                doc.aiValidationResult ? 'bg-green-500/10' : 'bg-amber-500/10'
                              )}>
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                  <Sparkles className="h-3 w-3" />
                                  AI Analysis
                                </div>
                                <p className="text-xs text-muted-foreground">{doc.aiReason}</p>
                                {doc.aiConfidence !== undefined && (
                                  <div className="flex items-center gap-2">
                                    <Progress value={doc.aiConfidence * 100} className="h-1.5 flex-1" />
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(doc.aiConfidence * 100)}%
                                    </span>
                                  </div>
                                )}
                                {doc.aiDetectedIssues && doc.aiDetectedIssues.length > 0 && (
                                  <div className="text-xs text-destructive">
                                    Issues: {doc.aiDetectedIssues.join(', ')}
                                  </div>
                                )}
                              </div>
                            )}

                            {doc.reviewNote && (
                              <p className="text-xs text-destructive bg-destructive/10 rounded p-2">
                                Rejection reason: {doc.reviewNote}
                              </p>
                            )}

                            <div className="flex gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5 text-xs"
                                onClick={() => setPreviewDoc(doc)}
                              >
                                <Eye className="h-3 w-3" /> Preview
                              </Button>
                              {doc.status === 'pending' && (
                                <>
                                  {!doc.aiAnalyzed && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="gap-1.5 text-xs"
                                      onClick={() => handleValidateWithAI(doc.id)}
                                      disabled={validateMutation.isPending}
                                    >
                                      <Brain className="h-3 w-3" />
                                      {validateMutation.isPending ? 'Analyzing...' : 'AI Check'}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    className="gap-1.5 text-xs bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApproveDoc(doc.id)}
                                    disabled={approveMutation.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1.5 text-xs"
                                    onClick={() => setRejectDialog({ doc, verificationId: verification.id })}
                                    disabled={rejectMutation.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trust Score Summary */}
                    <div className="bg-muted/30 rounded-lg p-4 mt-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Trust Score Calculation</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            verification.documents.some((d) => IDENTITY_DOCUMENTS.includes(d.type) && d.status === 'approved')
                              ? 'bg-green-500'
                              : 'bg-border'
                          )} />
                          <span className="text-muted-foreground">Identity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            verification.documents.some((d) => d.type === 'notarized_deed' && d.status === 'approved')
                              ? 'bg-green-500'
                              : 'bg-border'
                          )} />
                          <span className="text-muted-foreground">Notarized Deed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            verification.documents.some((d) => d.type === 'land_registry' && d.status === 'approved')
                              ? 'bg-green-500'
                              : 'bg-border'
                          )} />
                          <span className="text-muted-foreground">Land Registry</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            verification.documents.some((d) => d.type === 'utility_bill' && d.status === 'approved')
                              ? 'bg-green-500'
                              : 'bg-border'
                          )} />
                          <span className="text-muted-foreground">Utility Bill</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Current trust level: <strong className="text-foreground">{verification.currentTrustStars} star{verification.currentTrustStars !== 1 ? 's' : ''}</strong>
                        {verification.currentTrustStars === 0 && ' — Property will be marked as "Not Checked"'}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {previewDoc && DOCUMENT_LABELS[previewDoc.type]}
            </DialogTitle>
            <DialogDescription>
              {previewDoc?.fileName} • Uploaded {previewDoc && new Date(previewDoc.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {previewDoc && (
              <img
                src={previewDoc.fileUrl}
                alt={previewDoc.fileName}
                className="w-full max-h-[60vh] object-contain rounded-lg border border-border"
              />
            )}
          </div>
          {previewDoc?.aiAnalyzed && (
            <div className={cn(
              'rounded-lg p-3 space-y-2',
              previewDoc.aiValidationResult ? 'bg-green-500/10' : 'bg-amber-500/10'
            )}>
              <div className="flex items-center gap-2 font-medium">
                <Brain className="h-4 w-4" />
                AI Analysis Result
                <Badge variant="outline" className={cn(
                  previewDoc.aiValidationResult ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                )}>
                  {Math.round((previewDoc.aiConfidence ?? 0) * 100)}% confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{previewDoc.aiReason}</p>
              {previewDoc.aiDetectedIssues && previewDoc.aiDetectedIssues.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium text-destructive">Issues: </span>
                  {previewDoc.aiDetectedIssues.join(', ')}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDoc(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={!!rejectDialog} onOpenChange={() => { setRejectDialog(null); setRejectReason(''); }}>
        <AlertDialogContent className="bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Reject Document?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject: <strong>{rejectDialog && DOCUMENT_LABELS[rejectDialog.doc.type]}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-foreground">Reason for rejection (optional)</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document is blurry, expired, or doesn't match property info..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectDoc}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject Document'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VerificationReview;
