/**
 * ImageUploadModal Component
 * Migrated from old_app/src/components/organisms/modals/ImageUploadModal.tsx
 * Modern implementation using shadcn Dialog
 */

import React from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useImageUploadModal } from '@/hooks/modals/useImageUploadModal';
import { ImageIcon, X } from 'lucide-react';

type ImageModalType = 'imageUploadModal' | 'designCoverModal' | 'contentsCoverModal' | 'designAvatarModal';

interface ImageUploadModalProps {
  modalType?: ImageModalType;
  context?: string;
}

/**
 * Modal for image upload and cropping
 */
export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  modalType = 'imageUploadModal',
  context,
}) => {
  const { formatMessage } = useIntl();
  const { isOpen, data, onClose } = useImageUploadModal({ modalType });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <ImageIcon className="h-5 w-5" />
              {formatMessage({ id: 'personalInformation.info.form.crop' })}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image preview/editor area */}
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
            {data?.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="Preview"
                className="max-h-[300px] max-w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatMessage({ id: 'image.upload.placeholder' })}
                </p>
              </div>
            )}
          </div>

          {/* Placeholder for AvatarEditor component */}
          {/* Note: Full avatar editor integration would be implemented here */}
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="default">
            {formatMessage({ id: 'label.button.save' })}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {formatMessage({ id: 'label.close.modal' })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
