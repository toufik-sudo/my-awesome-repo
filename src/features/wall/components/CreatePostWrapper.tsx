// -----------------------------------------------------------------------------
// CreatePostWrapper Component
// Migrated from old_app/src/components/molecules/wall/postBlock/CreatePostWrapper.tsx
// -----------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { X, Image, Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { POST, TASK } from '@/constants/wall/posts';
import { cn } from '@/lib/utils';
import { postsApi } from '@/api/PostsApi';
import { useWallSelection } from '@/hooks/wall';

interface ICreatePostWrapperProps {
  postType: string;
  color?: string;
  className?: string;
  onClose?: () => void;
  onPostCreated?: () => void;
}

/**
 * Wrapper component for creating posts/tasks with form fields
 */
const CreatePostWrapper: React.FC<ICreatePostWrapperProps> = ({
  postType,
  color,
  className,
  onClose,
  onPostCreated
}) => {
  const { formatMessage } = useIntl();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isTask = postType === TASK;
  const titlePlaceholder = formatMessage({ 
    id: isTask ? 'wall.posts.create.task.title' : 'wall.posts.create.post.title' 
  });
  const contentPlaceholder = formatMessage({ 
    id: isTask ? 'wall.posts.create.task.content' : 'wall.posts.create.post.content' 
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error(formatMessage({ id: 'wall.posts.create.error.title' }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload file first if provided
      let fileId: number | undefined;
      if (selectedFile) {
        fileId = await postsApi.uploadFile({
          file: selectedFile,
          filename: selectedFile.name,
          type: 1 // Default file type
        });
      }

      // Create the post
      await postsApi.createPost({
        title,
        content,
        type: postType,
        fileId
      });
      
      toast.success(formatMessage({ 
        id: isTask ? 'wall.posts.create.task.success' : 'wall.posts.create.post.success' 
      }));
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedFile(null);
      
      if (onPostCreated) {
        onPostCreated();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(formatMessage({ id: 'toast.message.generic.error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedFile(null);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Title Input */}
      <Input
        placeholder={titlePlaceholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-medium"
        style={{ borderColor: color }}
      />
      
      {/* Content Textarea */}
      <Textarea
        placeholder={contentPlaceholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none"
        rows={4}
      />
      
      {/* File Preview */}
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm truncate flex-1">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setSelectedFile(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex gap-2">
          {/* Image Upload */}
          <label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="ghost" size="icon" className="cursor-pointer" asChild>
              <span>
                <Image className="h-4 w-4" />
              </span>
            </Button>
          </label>
          
          {/* File Upload */}
          <label>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="ghost" size="icon" className="cursor-pointer" asChild>
              <span>
                <Paperclip className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            {formatMessage({ id: 'common.cancel' })}
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            style={{ backgroundColor: color }}
          >
            <Send className="h-4 w-4 mr-2" />
            {formatMessage({ id: isTask ? 'wall.posts.create.task.submit' : 'wall.posts.create.post.submit' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostWrapper;
