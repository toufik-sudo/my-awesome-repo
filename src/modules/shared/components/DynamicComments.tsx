import React, { memo, useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DynamicReactions, ReactionType, ReactionSummary } from './DynamicReactions';
import {
  Send, Image, Film, Smile, MoreHorizontal, Edit2, Trash2,
  Reply, ChevronDown, ChevronUp, Paperclip, X, AtSign,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CommentUser {
  id: string;
  name: string;
  avatar?: string;
  badge?: string;
}

export interface CommentMedia {
  id: string;
  type: 'image' | 'gif' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface CommentMention {
  userId: string;
  name: string;
  startIndex: number;
  endIndex: number;
}

export interface CommentData {
  id: string;
  user: CommentUser;
  content: string;
  media?: CommentMedia[];
  mentions?: CommentMention[];
  reactions?: ReactionSummary;
  replies?: CommentData[];
  replyCount?: number;
  parentId?: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
}

export interface CommentInputConfig {
  allowImages?: boolean;
  allowGifs?: boolean;
  allowVideos?: boolean;
  allowMentions?: boolean;
  maxMediaCount?: number;
  maxLength?: number;
  placeholder?: string;
}

export interface MentionSuggestion {
  id: string;
  name: string;
  avatar?: string;
}

export interface DynamicCommentsProps {
  comments: CommentData[];
  currentUserId: string;
  inputConfig?: CommentInputConfig;
  onAddComment: (content: string, media?: File[], mentions?: CommentMention[], parentId?: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string, media?: File[]) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onReaction?: (commentId: string, type: ReactionType) => Promise<void>;
  onLoadReplies?: (commentId: string) => Promise<CommentData[]>;
  onMentionSearch?: (query: string) => Promise<MentionSuggestion[]>;
  onMediaUpload?: (files: File[]) => Promise<CommentMedia[]>;
  maxDepth?: number;
  showReactions?: boolean;
  sortBy?: 'newest' | 'oldest' | 'popular';
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

// ─── Comment Input ───────────────────────────────────────────────────────────

interface CommentInputProps {
  config: CommentInputConfig;
  onSubmit: (content: string, media?: File[], mentions?: CommentMention[]) => Promise<void>;
  onMentionSearch?: (query: string) => Promise<MentionSuggestion[]>;
  placeholder?: string;
  autoFocus?: boolean;
  initialContent?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = memo(({
  config,
  onSubmit,
  onMentionSearch,
  placeholder,
  autoFocus = false,
  initialContent = '',
  submitLabel,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialContent);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentions, setMentions] = useState<CommentMention[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxMedia = config.maxMediaCount ?? 4;

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxMedia - mediaFiles.length;
    const newFiles = files.slice(0, remaining);

    setMediaFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [maxMedia, mediaFiles.length]);

  const removeMedia = useCallback((index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleContentChange = useCallback(async (value: string) => {
    setContent(value);
    if (!config.allowMentions || !onMentionSearch) return;

    const lastAtSign = value.lastIndexOf('@');
    if (lastAtSign !== -1) {
      const query = value.slice(lastAtSign + 1).split(/\s/)[0];
      if (query.length > 0) {
        setMentionQuery(query);
        const suggestions = await onMentionSearch(query);
        setMentionSuggestions(suggestions);
        setShowMentions(suggestions.length > 0);
        return;
      }
    }
    setShowMentions(false);
  }, [config.allowMentions, onMentionSearch]);

  const insertMention = useCallback((suggestion: MentionSuggestion) => {
    const lastAtSign = content.lastIndexOf('@');
    const before = content.slice(0, lastAtSign);
    const after = content.slice(lastAtSign).replace(/@\S*/, '');
    const mentionText = `@${suggestion.name}`;
    const newContent = before + mentionText + after + ' ';
    setContent(newContent);
    setMentions(prev => [...prev, {
      userId: suggestion.id,
      name: suggestion.name,
      startIndex: lastAtSign,
      endIndex: lastAtSign + mentionText.length,
    }]);
    setShowMentions(false);
    textareaRef.current?.focus();
  }, [content]);

  const handleSubmit = useCallback(async () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content, mediaFiles.length > 0 ? mediaFiles : undefined, mentions.length > 0 ? mentions : undefined);
      setContent('');
      setMediaFiles([]);
      setMediaPreviews([]);
      setMentions([]);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, mediaFiles, mentions, onSubmit]);

  const acceptTypes = useMemo(() => {
    const types: string[] = [];
    if (config.allowImages) types.push('image/*');
    if (config.allowGifs) types.push('image/gif');
    if (config.allowVideos) types.push('video/*');
    return types.join(',');
  }, [config]);

  const canAttach = config.allowImages || config.allowGifs || config.allowVideos;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={e => handleContentChange(e.target.value)}
          placeholder={placeholder || t('comments.placeholder')}
          className="min-h-[80px] pr-12 resize-none"
          autoFocus={autoFocus}
          maxLength={config.maxLength}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        {/* Mention suggestions dropdown */}
        {showMentions && (
          <div className="absolute bottom-full left-0 w-64 bg-popover border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
            {mentionSuggestions.map(s => (
              <button
                key={s.id}
                onClick={() => insertMention(s)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent text-sm text-left"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback className="text-xs">{s.name[0]}</AvatarFallback>
                </Avatar>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media previews */}
      {mediaPreviews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {mediaPreviews.map((preview, i) => (
            <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
              {mediaFiles[i]?.type.startsWith('video') ? (
                <video src={preview} className="w-full h-full object-cover" />
              ) : (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => removeMedia(i)}
                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {canAttach && mediaFiles.length < maxMedia && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptTypes}
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </>
          )}
          {config.allowMentions && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              setContent(prev => prev + '@');
              textareaRef.current?.focus();
            }}>
              <AtSign className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
            className="gap-1"
          >
            <Send className="h-3.5 w-3.5" />
            {submitLabel || t('comments.send')}
          </Button>
        </div>
      </div>
      {config.maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {content.length}/{config.maxLength}
        </p>
      )}
    </div>
  );
});
CommentInput.displayName = 'CommentInput';

// ─── Single Comment ──────────────────────────────────────────────────────────

interface SingleCommentProps {
  comment: CommentData;
  currentUserId: string;
  depth: number;
  maxDepth: number;
  showReactions: boolean;
  inputConfig: CommentInputConfig;
  onReply: (content: string, media?: File[], mentions?: CommentMention[], parentId?: string) => Promise<void>;
  onEdit?: (commentId: string, content: string, media?: File[]) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onReaction?: (commentId: string, type: ReactionType) => Promise<void>;
  onLoadReplies?: (commentId: string) => Promise<CommentData[]>;
  onMentionSearch?: (query: string) => Promise<MentionSuggestion[]>;
}

const SingleComment: React.FC<SingleCommentProps> = memo(({
  comment,
  currentUserId,
  depth,
  maxDepth,
  showReactions,
  inputConfig,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onLoadReplies,
  onMentionSearch,
}) => {
  const { t } = useTranslation();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [loadedReplies, setLoadedReplies] = useState<CommentData[] | null>(null);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const isOwner = comment.user.id === currentUserId;
  const canNest = depth < maxDepth;
  const replies = loadedReplies || comment.replies || [];
  const replyCount = comment.replyCount || replies.length;

  const handleToggleReplies = useCallback(async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    if (!loadedReplies && onLoadReplies) {
      setIsLoadingReplies(true);
      try {
        const data = await onLoadReplies(comment.id);
        setLoadedReplies(data);
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(true);
  }, [showReplies, loadedReplies, onLoadReplies, comment.id]);

  const handleReply = useCallback(async (content: string, media?: File[], mentions?: CommentMention[]) => {
    await onReply(content, media, mentions, comment.id);
    setShowReplyInput(false);
  }, [onReply, comment.id]);

  const handleEdit = useCallback(async (content: string, media?: File[]) => {
    if (onEdit) {
      await onEdit(comment.id, content, media);
      setIsEditing(false);
    }
  }, [onEdit, comment.id]);

  const timeAgo = useMemo(() => {
    const diff = Date.now() - new Date(comment.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('comments.justNow');
    if (mins < 60) return t('comments.minutesAgo', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('comments.hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('comments.daysAgo', { count: days });
  }, [comment.createdAt, t]);

  const renderContent = (text: string, commentMentions?: CommentMention[]) => {
    if (!commentMentions?.length) return <p className="text-sm whitespace-pre-wrap">{text}</p>;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const sorted = [...commentMentions].sort((a, b) => a.startIndex - b.startIndex);

    sorted.forEach((m, i) => {
      if (m.startIndex > lastIndex) parts.push(text.slice(lastIndex, m.startIndex));
      parts.push(
        <span key={i} className="text-primary font-medium cursor-pointer hover:underline">
          @{m.name}
        </span>
      );
      lastIndex = m.endIndex;
    });
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));

    return <p className="text-sm whitespace-pre-wrap">{parts}</p>;
  };

  return (
    <div className={cn('group', depth > 0 && 'ml-8 mt-3 pl-4 border-l-2 border-border')}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {comment.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{comment.user.name}</span>
            {comment.user.badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {comment.user.badge}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground italic">({t('comments.edited')})</span>
            )}
          </div>

          {/* Content or edit mode */}
          {isEditing ? (
            <div className="mt-2">
              <CommentInput
                config={inputConfig}
                onSubmit={handleEdit}
                onMentionSearch={onMentionSearch}
                initialContent={comment.content}
                submitLabel={t('common.save')}
                onCancel={() => setIsEditing(false)}
                autoFocus
              />
            </div>
          ) : (
            <>
              <div className="mt-1">{renderContent(comment.content, comment.mentions)}</div>

              {/* Media */}
              {comment.media && comment.media.length > 0 && (
                <div className={cn(
                  'mt-2 grid gap-2',
                  comment.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
                  comment.media.length > 2 && 'grid-cols-3'
                )}>
                  {comment.media.map(m => (
                    <div key={m.id} className="rounded-lg overflow-hidden border border-border">
                      {m.type === 'video' ? (
                        <video src={m.url} controls className="w-full max-h-60 object-cover" />
                      ) : (
                        <img src={m.url} alt={m.alt || ''} className="w-full max-h-60 object-cover" loading="lazy" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 mt-2">
                {showReactions && onReaction && (
                  <DynamicReactions
                    summary={comment.reactions || { counts: {}, total: 0 }}
                    onReact={type => onReaction(comment.id, type)}
                    size="sm"
                  />
                )}

                {canNest && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowReplyInput(!showReplyInput)}
                  >
                    <Reply className="h-3.5 w-3.5" />
                    {t('comments.reply')}
                  </Button>
                )}

                {isOwner && (onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          <Edit2 className="h-3.5 w-3.5 mr-2" /> {t('comments.edit')}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(comment.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> {t('comments.delete')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                config={inputConfig}
                onSubmit={handleReply}
                onMentionSearch={onMentionSearch}
                placeholder={t('comments.replyPlaceholder', { name: comment.user.name })}
                autoFocus
                onCancel={() => setShowReplyInput(false)}
              />
            </div>
          )}

          {/* Show/hide replies toggle */}
          {replyCount > 0 && canNest && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-primary mt-1"
              onClick={handleToggleReplies}
              disabled={isLoadingReplies}
            >
              {showReplies ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isLoadingReplies
                ? t('common.loading')
                : showReplies
                  ? t('comments.hideReplies')
                  : t('comments.showReplies', { count: replyCount })}
            </Button>
          )}

          {/* Replies */}
          {showReplies && replies.map(reply => (
            <SingleComment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              depth={depth + 1}
              maxDepth={maxDepth}
              showReactions={showReactions}
              inputConfig={inputConfig}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReaction={onReaction}
              onLoadReplies={onLoadReplies}
              onMentionSearch={onMentionSearch}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
SingleComment.displayName = 'SingleComment';

// ─── Main Component ──────────────────────────────────────────────────────────

export const DynamicComments: React.FC<DynamicCommentsProps> = memo(({
  comments,
  currentUserId,
  inputConfig = {
    allowImages: true,
    allowGifs: true,
    allowVideos: true,
    allowMentions: true,
    maxMediaCount: 4,
    maxLength: 2000,
  },
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReaction,
  onLoadReplies,
  onMentionSearch,
  maxDepth = 3,
  showReactions = true,
  sortBy = 'newest',
  className,
  emptyMessage,
  loading = false,
}) => {
  const { t } = useTranslation();

  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => (b.reactions?.total || 0) - (a.reactions?.total || 0));
      default:
        return sorted;
    }
  }, [comments, sortBy]);

  const handleAddComment = useCallback(async (content: string, media?: File[], mentions?: CommentMention[]) => {
    await onAddComment(content, media, mentions);
  }, [onAddComment]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* New comment input */}
      <CommentInput
        config={inputConfig}
        onSubmit={handleAddComment}
        onMentionSearch={onMentionSearch}
      />

      {/* Comments count */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {t('comments.count', { count: comments.length })}
        </h3>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-8 text-center text-muted-foreground text-sm">
          {t('common.loading')}
        </div>
      )}

      {/* Empty */}
      {!loading && sortedComments.length === 0 && (
        <div className="py-8 text-center text-muted-foreground text-sm">
          {emptyMessage || t('comments.empty')}
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {sortedComments.map(comment => (
          <SingleComment
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            depth={0}
            maxDepth={maxDepth}
            showReactions={showReactions}
            inputConfig={inputConfig}
            onReply={async (content, media, mentions, parentId) => {
              await onAddComment(content, media, mentions, parentId);
            }}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onReaction={onReaction}
            onLoadReplies={onLoadReplies}
            onMentionSearch={onMentionSearch}
          />
        ))}
      </div>
    </div>
  );
});

DynamicComments.displayName = 'DynamicComments';
