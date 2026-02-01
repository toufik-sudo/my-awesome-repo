// -----------------------------------------------------------------------------
// CommentSection Component
// Comment list with add comment functionality
// -----------------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Paperclip,
  X,
  Loader2,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommentAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface CommentAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name?: string;
  thumbnailUrl?: string;
}

export interface CommentData {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: Date | string;
  attachment?: CommentAttachment;
}

export interface CommentSectionProps {
  comments: CommentData[];
  currentUser?: CommentAuthor;
  isLoading?: boolean;
  isSubmitting?: boolean;
  hasMore?: boolean;
  maxLength?: number;
  placeholder?: string;
  onSubmit: (content: string, attachment?: File) => Promise<void>;
  onDelete?: (commentId: string) => void;
  onLoadMore?: () => void;
  onAuthorClick?: (authorId: string) => void;
  canDeleteComment?: (comment: CommentData) => boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Comment Item Component
// -----------------------------------------------------------------------------

interface CommentItemProps {
  comment: CommentData;
  canDelete?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
  onAuthorClick?: (authorId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  canDelete,
  isDeleting,
  onDelete,
  onAuthorClick
}) => {
  const { author, content, createdAt, attachment } = comment;
  const fullName = `${author.firstName} ${author.lastName}`;
  const initials = `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
  const parsedDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  return (
    <div className={cn('flex gap-3 py-3 group', isDeleting && 'opacity-50')}>
      <Avatar
        className="h-8 w-8 flex-shrink-0 cursor-pointer"
        onClick={() => onAuthorClick?.(author.id)}
      >
        <AvatarImage src={author.avatarUrl} alt={fullName} />
        <AvatarFallback className="text-xs bg-muted">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="bg-muted/50 rounded-lg p-2 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-medium text-sm hover:underline cursor-pointer"
                onClick={() => onAuthorClick?.(author.id)}
              >
                {fullName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(parsedDate, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
            
            {/* Attachment */}
            {attachment && (
              <div className="mt-2">
                {attachment.type === 'image' ? (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={attachment.thumbnailUrl || attachment.url}
                      alt={attachment.name || 'Image'}
                      className="max-w-[200px] max-h-[150px] rounded-md object-cover"
                    />
                  </a>
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-secondary hover:underline"
                  >
                    <Paperclip className="h-3 w-3" />
                    {attachment.name || 'Attachment'}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Delete Action */}
          {canDelete && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Add Comment Component
// -----------------------------------------------------------------------------

interface AddCommentProps {
  currentUser?: CommentAuthor;
  isSubmitting: boolean;
  maxLength?: number;
  placeholder?: string;
  onSubmit: (content: string, attachment?: File) => Promise<void>;
}

const AddComment: React.FC<AddCommentProps> = ({
  currentUser,
  isSubmitting,
  maxLength = 1000,
  placeholder = 'Write a comment...',
  onSubmit
}) => {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isValid = content.trim().length > 0 && content.length <= maxLength;
  const isOverLimit = content.length > maxLength;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    await onSubmit(content.trim(), attachment || undefined);
    setContent('');
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachmentPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const initials = currentUser 
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : '?';

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={currentUser?.avatarUrl} alt="You" />
        <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        {/* Attachment Preview */}
        {attachment && (
          <div className="relative inline-block">
            {attachmentPreview ? (
              <img
                src={attachmentPreview}
                alt="Preview"
                className="max-w-[150px] max-h-[100px] rounded-md object-cover"
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5"
              onClick={removeAttachment}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSubmitting}
            className={cn(
              'min-h-[60px] pr-20 resize-none',
              isOverLimit && 'border-destructive focus-visible:ring-destructive'
            )}
          />

          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="h-8 w-8"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Character Count */}
        {content.length > maxLength * 0.8 && (
          <p className={cn(
            'text-xs text-right',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {content.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUser,
  isLoading = false,
  isSubmitting = false,
  hasMore = false,
  maxLength = 1000,
  placeholder = 'Write a comment...',
  onSubmit,
  onDelete,
  onLoadMore,
  onAuthorClick,
  canDeleteComment,
  className
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    onDelete?.(commentId);
    setDeletingId(null);
  };

  // Reverse comments to show oldest first, newest at bottom
  const reversedComments = [...comments].reverse();

  return (
    <div className={cn('space-y-4', className)}>
      {/* Load More */}
      {hasMore && onLoadMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full text-secondary"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Show more comments
        </Button>
      )}

      {/* Comments List */}
      {isLoading && comments.length === 0 ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reversedComments.length > 0 ? (
        <div className="divide-y divide-border">
          {reversedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canDelete={canDeleteComment?.(comment) ?? currentUser?.id === comment.author.id}
              isDeleting={deletingId === comment.id}
              onDelete={() => handleDelete(comment.id)}
              onAuthorClick={onAuthorClick}
            />
          ))}
        </div>
      ) : null}

      <Separator />

      {/* Add Comment */}
      <AddComment
        currentUser={currentUser}
        isSubmitting={isSubmitting}
        maxLength={maxLength}
        placeholder={placeholder}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CommentSection;
