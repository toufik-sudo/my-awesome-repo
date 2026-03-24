import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageSquarePlus, Inbox, Clock, CheckCircle2, AlertTriangle, Search,
  Filter, ChevronRight, Loader2, HelpCircle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
// MainLayout removed — provided by Routes
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import {
  useSupportMyThreads, useSupportAdminThreads, useCreateSupportThread,
} from '../support.hooks';
import type { SupportThread } from '../support.api';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  open: { icon: Inbox, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { icon: Clock, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  resolved: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  closed: { icon: CheckCircle2, color: 'bg-muted text-muted-foreground' },
};

const CATEGORY_LABELS: Record<string, string> = {
  technical: '🔧 Technical',
  booking_issue: '📅 Booking',
  payment: '💳 Payment',
  property_issue: '🏠 Property',
  general: '💬 General',
  negative_review: '⚠️ Review',
};

export const SupportInbox: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newContent, setNewContent] = useState('');

  const isAdmin = user?.roles?.some(r => ['hyper_admin', 'hyper_manager', 'admin'].includes(r));

  const adminQuery = useSupportAdminThreads(
    1,
    statusFilter !== 'all' ? statusFilter : undefined,
    categoryFilter !== 'all' ? categoryFilter : undefined,
  );
  const userQuery = useSupportMyThreads();
  const createMutation = useCreateSupportThread();

  const { data, isLoading } = isAdmin ? adminQuery : userQuery;
  const threads = data?.items || [];

  const handleCreateThread = async () => {
    if (!newSubject.trim() || !newContent.trim()) return;
    await createMutation.mutateAsync({
      subject: newSubject.trim(),
      category: newCategory,
      content: newContent.trim(),
    });
    setShowNewThread(false);
    setNewSubject('');
    setNewContent('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {isAdmin ? (t('support.adminInbox') || 'Support Inbox') : (t('support.mySupport') || 'My Support')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin
                ? (t('support.adminInboxDesc') || 'Manage support threads from hosts and guests')
                : (t('support.mySupportDesc') || 'Get help from the ByootDZ team')}
            </p>
          </div>
          <Dialog open={showNewThread} onOpenChange={setShowNewThread}>
            <DialogTrigger asChild>
              <Button className="shadow-md shadow-primary/20">
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                {t('support.newThread') || 'New Thread'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('support.createThread') || 'Create Support Thread'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Input
                  placeholder={t('support.subjectPlaceholder') || 'What do you need help with?'}
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                />
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">💬 General</SelectItem>
                    <SelectItem value="technical">🔧 Technical</SelectItem>
                    <SelectItem value="booking_issue">📅 Booking Issue</SelectItem>
                    <SelectItem value="payment">💳 Payment</SelectItem>
                    <SelectItem value="property_issue">🏠 Property Issue</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder={t('support.messagePlaceholder') || 'Describe your issue in detail...'}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleCreateThread}
                  disabled={!newSubject.trim() || !newContent.trim() || createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('support.submit') || 'Submit'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters (admin only) */}
        {isAdmin && (
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="booking_issue">Booking</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="property_issue">Property</SelectItem>
                <SelectItem value="negative_review">Negative Review</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Thread List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-medium">{t('support.noThreads') || 'No support threads yet'}</p>
            <p className="text-sm mt-1">{t('support.noThreadsDesc') || 'Create one to get help from the team'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map((thread: SupportThread) => {
              const statusCfg = STATUS_CONFIG[thread.status] || STATUS_CONFIG.open;
              const StatusIcon = statusCfg.icon;
              const unread = isAdmin ? thread.unreadCountAdmin : thread.unreadCountUser;

              return (
                <button
                  key={thread.id}
                  onClick={() => navigate(`/support/${thread.id}`)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                    'hover:bg-accent/50 hover:shadow-sm',
                    unread > 0 ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/50'
                  )}
                >
                  <div className={cn('p-2 rounded-lg', statusCfg.color)}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn('font-medium text-sm truncate', unread > 0 && 'font-semibold')}>
                        {thread.subject}
                      </p>
                      {unread > 0 && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                          {unread}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[thread.category] || thread.category}
                      </span>
                      <span className="text-xs text-muted-foreground/50">•</span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(thread.updatedAt), 'MMM d, HH:mm')}
                      </span>
                      {isAdmin && thread.initiator && (
                        <>
                          <span className="text-xs text-muted-foreground/50">•</span>
                          <span className="text-xs text-muted-foreground">
                            {thread.initiator.name || thread.initiator.email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default SupportInbox;
