// -----------------------------------------------------------------------------
// ImageUploadModal Organism Component
// Migrated from old_app/src/components/organisms/modals/ImageUploadModal.tsx
// Consolidated image/avatar upload with cropping functionality
// -----------------------------------------------------------------------------

import React, { useRef, useState, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import AvatarEditor from 'react-avatar-editor';
import { X, ZoomIn, ZoomOut, RotateCcw, RotateCw, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { AVATAR_EDITOR_CONFIG } from '@/constants/personalInformation';

export interface ImageCropConfig {
  width: number;
  height: number;
  border: number;
  borderRadius: number;
  color?: [number, number, number, number];
}

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob | null, dataUrl: string) => void;
  image: string | File | null;
  config?: Partial<ImageCropConfig>;
  title?: string;
  titleId?: string;
  isLoading?: boolean;
  aspectRatio?: 'square' | 'cover' | 'rectangle' | 'custom';
}

const aspectRatioConfigs: Record<string, Partial<ImageCropConfig>> = {
  square: {
    width: AVATAR_EDITOR_CONFIG.SQUARE_WIDTH,
    height: AVATAR_EDITOR_CONFIG.HEIGHT,
    borderRadius: AVATAR_EDITOR_CONFIG.FULL_BORDER_RADIUS,
  },
  cover: {
    width: AVATAR_EDITOR_CONFIG.COVER_CROP_WIDTH_LARGE,
    height: AVATAR_EDITOR_CONFIG.COVER_CROP_HEIGHT_LARGE,
    borderRadius: AVATAR_EDITOR_CONFIG.FULL_BORDER_RADIUS,
  },
  rectangle: {
    width: AVATAR_EDITOR_CONFIG.RECTANGLE_WIDTH,
    height: AVATAR_EDITOR_CONFIG.RECTANGLE_HEIGHT,
    borderRadius: AVATAR_EDITOR_CONFIG.FULL_BORDER_RADIUS,
  },
  custom: {},
};

const defaultConfig: ImageCropConfig = {
  width: AVATAR_EDITOR_CONFIG.SQUARE_WIDTH,
  height: AVATAR_EDITOR_CONFIG.HEIGHT,
  border: AVATAR_EDITOR_CONFIG.BORDER,
  borderRadius: AVATAR_EDITOR_CONFIG.ROUNDED_BORDER_RADIUS,
  color: [255, 255, 255, 0.6],
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  image,
  config: customConfig,
  title,
  titleId = 'personalInformation.info.form.crop',
  isLoading = false,
  aspectRatio = 'square',
}) => {
  const editorRef = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const config: ImageCropConfig = {
    ...defaultConfig,
    ...aspectRatioConfigs[aspectRatio],
    ...customConfig,
  };

  const handleSave = useCallback(() => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      
      canvas.toBlob((blob) => {
        onSave(blob, dataUrl);
      }, 'image/png');
    }
  }, [onSave]);

  const handleRotateLeft = () => setRotation((prev) => prev - 90);
  const handleRotateRight = () => setRotation((prev) => prev + 90);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  const handleClose = () => {
    setScale(1);
    setRotation(0);
    onClose();
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {title || <FormattedMessage id={titleId} defaultMessage="Crop Image" />}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={config.width}
              height={config.height}
              border={config.border}
              borderRadius={config.borderRadius}
              color={config.color}
              scale={scale}
              rotate={rotation}
              crossOrigin="anonymous"
            />
          </div>

          {/* Controls */}
          <div className="w-full space-y-4">
            {/* Zoom */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Rotation */}
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="icon" onClick={handleRotateLeft}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRotateRight}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            <FormattedMessage id="form.delete.cancel" defaultMessage="Cancel" />
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <FormattedMessage id="label.loading" defaultMessage="Loading..." />
              </span>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                <FormattedMessage id="label.button.validate" defaultMessage="Save" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ImageUploadModal };
export default ImageUploadModal;
