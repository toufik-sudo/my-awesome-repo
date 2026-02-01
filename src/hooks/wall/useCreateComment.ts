// -----------------------------------------------------------------------------
// useCreateComment Hook
// Manages comment creation with validation and file upload
// Migrated from old_app/src/hooks/wall/comments/useCreateComments.ts
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommentFile {
  file: File;
  preview?: string;
  error?: string;
  maxSize?: number;
}

export interface UseCreateCommentConfig {
  /** Post ID to comment on */
  postId: string;
  
  /** Maximum content length */
  maxLength?: number;
  
  /** Maximum file size in MB */
  maxFileSizeMB?: number;
  
  /** Allowed file types */
  allowedFileTypes?: string[];
  
  /** API function to create comment */
  onSubmit: (data: { postId: string; content: string; file?: File }) => Promise<void>;
  
  /** Callback after successful comment creation */
  onSuccess?: () => void;
}

export interface UseCreateCommentResult {
  /** Current comment content */
  content: string;
  
  /** Set comment content */
  setContent: (content: string) => void;
  
  /** Current attached file */
  file: CommentFile | null;
  
  /** Attach a file */
  setFile: (file: File | null) => void;
  
  /** Remove attached file */
  removeFile: () => void;
  
  /** Whether content has validation errors */
  hasError: boolean;
  
  /** Whether content exceeds max length */
  isOverLimit: boolean;
  
  /** Whether submission is in progress */
  isSubmitting: boolean;
  
  /** Submit the comment */
  submit: () => Promise<void>;
  
  /** Reset form to initial state */
  reset: () => void;
  
  /** Whether form is valid for submission */
  isValid: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_MAX_LENGTH = 1000;
const DEFAULT_MAX_FILE_SIZE_MB = 10;
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function validateFile(
  file: File,
  maxSizeMB: number,
  allowedTypes: string[]
): { valid: boolean; error?: string; maxSize?: number } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'form.validation.file.too.large', maxSize: maxSizeMB };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: 'form.validation.file.type.invalid' };
  }
  
  return { valid: true };
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useCreateComment({
  postId,
  maxLength = DEFAULT_MAX_LENGTH,
  maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  allowedFileTypes = DEFAULT_ALLOWED_TYPES,
  onSubmit,
  onSuccess
}: UseCreateCommentConfig): UseCreateCommentResult {
  const [content, setContent] = useState('');
  const [file, setFileState] = useState<CommentFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const trimmedContent = content.trim();
  const hasError = trimmedContent.length === 0;
  const isOverLimit = content.length > maxLength;
  const hasFileError = file?.error !== undefined;
  const isValid = !hasError && !isOverLimit && !hasFileError;

  // Set file with validation
  const setFile = useCallback((newFile: File | null) => {
    if (!newFile) {
      setFileState(null);
      return;
    }

    const validation = validateFile(newFile, maxFileSizeMB, allowedFileTypes);
    
    // Create preview for images
    let preview: string | undefined;
    if (newFile.type.startsWith('image/')) {
      preview = URL.createObjectURL(newFile);
    }

    setFileState({
      file: newFile,
      preview,
      error: validation.error,
      maxSize: validation.maxSize
    });
  }, [maxFileSizeMB, allowedFileTypes]);

  // Remove file
  const removeFile = useCallback(() => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFileState(null);
  }, [file]);

  // Submit comment
  const submit = useCallback(async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        postId,
        content: trimmedContent,
        file: file?.file
      });

      // Reset form on success
      setContent('');
      removeFile();
      
      toast.success('Comment added successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, isSubmitting, postId, trimmedContent, file, onSubmit, onSuccess, removeFile]);

  // Reset form
  const reset = useCallback(() => {
    setContent('');
    removeFile();
  }, [removeFile]);

  // Cleanup file previews on unmount
  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, []);

  return {
    content,
    setContent,
    file,
    setFile,
    removeFile,
    hasError,
    isOverLimit,
    isSubmitting,
    submit,
    reset,
    isValid
  };
}

export default useCreateComment;
