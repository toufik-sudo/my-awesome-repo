import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Send, Shield, AlertTriangle, MessageSquare, Loader2, Info,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
// MainLayout removed — provided by Routes
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useChatConversation, useSendMessage } from '../chat.hooks';
import { filterMessageContent, getFilterWarningMessage } from '../utils/contentFilter';
import type { ChatMessage } from '../chat.api';
import { cn } from '@/lib/utils';

export const BookingChat: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messageInput, setMessageInput] = useState('');
  const [filterWarning, setFilterWarning] = useState<string | null>(null);

  const { data: conversation, isLoading } = useChatConversation(bookingId || '');
  const sendMutation = useSendMessage();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length, scrollToBottom]);

  const handleInputChange = (value: string) => {
    setMessageInput(value);
    // Real-time filter check
    if (value.trim()) {
      const result = filterMessageContent(value);
      setFilterWarning(result.isClean ? null : getFilterWarningMessage(result.warnings, t));
    } else {
      setFilterWarning(null);
    }
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !bookingId) return;

    // Client-side filter check (backend will do the real filtering)
    const result = filterMessageContent(messageInput);
    if (!result.isClean) {
      setFilterWarning(getFilterWarningMessage(result.warnings, t));
      return;
    }

    try {
      await sendMutation.mutateAsync({
        bookingId,
        content: messageInput.trim(),
      });
      setMessageInput('');
      setFilterWarning(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnMessage = (msg: ChatMessage) => msg.senderId === user?.id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const messages = conversation?.messages || [];

  return (
    <>
      <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {t('chat.conversationTitle') || 'Booking Conversation'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t('chat.bookingId') || 'Booking'}: #{bookingId?.slice(0, 8)}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  {t('chat.protected') || 'Protected'}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  {t('chat.protectedDesc') || 'Messages are monitored to prevent sharing of personal contact information.'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Safety Notice */}
        <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <p className="text-[11px] text-primary/80">
            {t('chat.safetyNotice') || 'For your safety, sharing phone numbers, emails, or external contact methods is not permitted. All communication stays within ByootDZ.'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">{t('chat.noMessages') || 'No messages yet'}</p>
              <p className="text-xs mt-1">{t('chat.startConversation') || 'Start the conversation!'}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const own = isOwnMessage(msg);
              return (
                <div key={msg.id} className={cn('flex', own ? 'justify-end' : 'justify-start')}>
                  <div className={cn('flex gap-2 max-w-[75%]', own && 'flex-row-reverse')}>
                    <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                      <AvatarFallback className={cn(
                        'text-xs font-semibold',
                        own ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      )}>
                        {msg.senderRole === 'host' ? 'H' : 'G'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={cn(
                          'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                          own
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md',
                          msg.filtered && 'opacity-70'
                        )}
                      >
                        {msg.filtered ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="italic text-xs">
                              {t('chat.messageFiltered') || 'This message was filtered for containing personal contact information.'}
                            </span>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      <p className={cn(
                        'text-[10px] text-muted-foreground mt-1',
                        own ? 'text-right' : 'text-left'
                      )}>
                        {format(parseISO(msg.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Filter Warning */}
        {filterWarning && (
          <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
            <p className="text-xs text-destructive">{filterWarning}</p>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Textarea
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder') || 'Type a message...'}
              className="min-h-[44px] max-h-[120px] resize-none rounded-xl bg-muted/30 border-border/50"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!messageInput.trim() || sendMutation.isPending || !!filterWarning}
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
      </div>
    </>
  );
};

export default BookingChat;
