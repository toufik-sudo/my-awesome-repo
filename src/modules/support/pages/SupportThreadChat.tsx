import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Send, Loader2, CheckCircle2, XCircle, Clock,
  AlertTriangle, Bot,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// MainLayout removed — provided by Routes
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import {
  useSupportThread, useSupportMessages, useSendSupportMessage, useUpdateThreadStatus,
} from '../support.hooks';
import type { SupportMessage } from '../support.api';
import { cn } from '@/lib/utils';

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  open: { label: 'Open', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'secondary' },
  resolved: { label: 'Resolved', variant: 'outline' },
  closed: { label: 'Closed', variant: 'destructive' },
};

export const SupportThreadChat: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState('');

  const isAdmin = user?.roles?.some(r => ['hyper_admin', 'hyper_manager', 'admin'].includes(r));

  const { data: thread, isLoading: threadLoading } = useSupportThread(threadId || '');
  const { data: messagesData, isLoading: msgsLoading } = useSupportMessages(threadId || '');
  const sendMutation = useSendSupportMessage();
  const statusMutation = useUpdateThreadStatus();

  const messages = messagesData?.items || [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSend = async () => {
    if (!messageInput.trim() || !threadId) return;
    await sendMutation.mutateAsync({ threadId, content: messageInput.trim() });
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnMessage = (msg: SupportMessage) => String(msg.senderId) === user?.id;

  if (threadLoading || msgsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statusBadge = STATUS_BADGES[thread?.status || 'open'];
  const isClosed = thread?.status === 'closed';

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={() => navigate('/support')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate text-sm">
              {thread?.subject || 'Support Thread'}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={statusBadge.variant} className="text-[10px] h-5">
                {statusBadge.label}
              </Badge>
              {thread?.category && (
                <span className="text-[11px] text-muted-foreground capitalize">
                  {thread.category.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
          {/* Admin actions */}
          {isAdmin && !isClosed && (
            <div className="flex gap-1.5">
              {thread?.status !== 'resolved' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={() => threadId && statusMutation.mutate({ threadId, status: 'resolved' })}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t('support.resolve') || 'Resolve'}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8"
                onClick={() => threadId && statusMutation.mutate({ threadId, status: 'closed' })}
              >
                <XCircle className="h-3 w-3 mr-1" />
                {t('support.close') || 'Close'}
              </Button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const own = isOwnMessage(msg);
            const isSystem = msg.isSystemMessage;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
                    <Bot className="h-3 w-3" />
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={cn('flex', own ? 'justify-end' : 'justify-start')}>
                <div className={cn('flex gap-2 max-w-[75%]', own && 'flex-row-reverse')}>
                  <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                    <AvatarFallback className={cn(
                      'text-xs font-semibold',
                      msg.senderRole === 'admin' || msg.senderRole === 'hyper_admin' || msg.senderRole === 'hyper_manager'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    )}>
                      {msg.senderRole === 'admin' || msg.senderRole === 'hyper_admin' || msg.senderRole === 'hyper_manager'
                        ? 'A' : msg.senderRole === 'host' ? 'H' : 'G'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={cn(
                      'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      own
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    )}>
                      {msg.content}
                    </div>
                    <div className={cn('flex items-center gap-1.5 mt-1', own ? 'justify-end' : 'justify-start')}>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {msg.senderRole.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">•</span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(parseISO(msg.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {isClosed ? (
          <div className="p-4 border-t border-border/50 bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">{t('support.threadClosed') || 'This thread has been closed.'}</p>
          </div>
        ) : (
          <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Textarea
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('support.placeholder') || 'Type your message...'}
                className="min-h-[44px] max-h-[120px] resize-none rounded-xl bg-muted/30 border-border/50"
                rows={1}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!messageInput.trim() || sendMutation.isPending}
                className="h-11 w-11 rounded-xl flex-shrink-0 shadow-md shadow-primary/20"
              >
                {sendMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default SupportThreadChat;
