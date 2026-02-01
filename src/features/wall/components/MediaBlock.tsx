// -----------------------------------------------------------------------------
// MediaBlock Component
// Displays media content (images, videos, files) in posts
// Migrated from old_app/src/components/molecules/wall/postBlock/media/MediaBlock.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Download, Play, ExternalLink, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';

export interface MediaFile {
  url: string;
  type?: string;
  name?: string;
  extension?: string;
  size?: number;
}

interface MediaBlockProps {
  media: MediaFile;
  className?: string;
  showModal?: boolean;
  onModalChange?: (open: boolean) => void;
}

const FILE_TYPE = 'file';
const VIDEO_TYPE = 'video';
const IMAGE_TYPE = 'image';

const getMediaType = (media: MediaFile): string => {
  if (media.type?.startsWith('video')) return VIDEO_TYPE;
  if (media.type?.startsWith('image')) return IMAGE_TYPE;
  
  const ext = media.extension?.toLowerCase() || media.url?.split('.').pop()?.toLowerCase();
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')) return VIDEO_TYPE;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return IMAGE_TYPE;
  
  return FILE_TYPE;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaBlock: React.FC<MediaBlockProps> = ({
  media,
  className,
  showModal: externalShowModal,
  onModalChange,
}) => {
  const [internalShowModal, setInternalShowModal] = useState(false);
  const showModal = externalShowModal ?? internalShowModal;
  const setShowModal = onModalChange ?? setInternalShowModal;

  const mediaType = getMediaType(media);

  // Render Image
  if (mediaType === IMAGE_TYPE) {
    return (
      <>
        <div 
          className={cn(
            'relative group cursor-pointer rounded-lg overflow-hidden',
            'border border-border/50 hover:border-border',
            'transition-all duration-200',
            className
          )}
          onClick={() => setShowModal(true)}
        >
          <img
            src={media.url}
            alt={media.name || 'Post image'}
            className="w-full max-h-96 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Image Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            <DialogClose className="absolute right-4 top-4 z-50">
              <Button size="icon" variant="secondary" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
            <img
              src={media.url}
              alt={media.name || 'Post image'}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Render Video
  if (mediaType === VIDEO_TYPE) {
    return (
      <>
        <div 
          className={cn(
            'relative group rounded-lg overflow-hidden',
            'border border-border/50',
            className
          )}
        >
          <video
            src={media.url}
            poster={undefined}
            controls
            className="w-full max-h-96"
            onClick={(e) => e.stopPropagation()}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Expand button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowModal(true)}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Video Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <DialogClose className="absolute right-4 top-4 z-50">
              <Button size="icon" variant="secondary" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
            <video
              src={media.url}
              controls
              autoPlay
              className="w-full max-h-[90vh] rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Render File
  return (
    <div 
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        'bg-muted/50 border border-border/50',
        'hover:bg-muted transition-colors',
        className
      )}
    >
      <div className="p-2 rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {media.name || 'Download file'}
        </p>
        {media.size && (
          <p className="text-xs text-muted-foreground">
            {formatFileSize(media.size)}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        asChild
        className="shrink-0"
      >
        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <Download className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

export { MediaBlock };
export default MediaBlock;
