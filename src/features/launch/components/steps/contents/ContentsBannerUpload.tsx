// -----------------------------------------------------------------------------
// Contents Banner Upload Component
// Banner/cover image upload for content pages
// -----------------------------------------------------------------------------

import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Image as ImageIcon,
  X,
  Maximize2,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentsBannerUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  title: string;
  bannerTitle?: string;
  onBannerTitleChange?: (title: string) => void;
  optimalSize?: string;
  aspectRatio?: 'wide' | 'square' | 'tall';
  index?: number;
}

const ASPECT_RATIOS = {
  wide: 'aspect-[16/4]',
  square: 'aspect-square',
  tall: 'aspect-[3/4]',
};

export const ContentsBannerUpload: React.FC<ContentsBannerUploadProps> = ({
  value,
  onChange,
  title,
  bannerTitle = '',
  onBannerTitleChange,
  optimalSize = '1024 x 243px',
  aspectRatio = 'wide',
  index = 1,
}) => {
  const { formatMessage } = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(formatMessage({ id: 'upload.error.fileType', defaultMessage: 'Please select an image file' }));
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(formatMessage({ id: 'upload.error.fileSize', defaultMessage: 'File size must be less than 5MB' }));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Card className="border-2 border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Info className="h-3 w-3" />
          {formatMessage(
            { id: 'contents.banner.optimalSize', defaultMessage: 'Optimal size: {size}' },
            { size: optimalSize }
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Banner Title Input */}
        {onBannerTitleChange && (
          <div className="space-y-2">
            <Label>
              {formatMessage({ id: 'contents.bannerTitle', defaultMessage: 'Banner Title' })}
            </Label>
            <Input
              value={bannerTitle}
              onChange={(e) => onBannerTitleChange(e.target.value)}
              placeholder={formatMessage({ 
                id: 'contents.bannerTitle.placeholder', 
                defaultMessage: 'Enter a title for this section' 
              })}
            />
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg transition-all cursor-pointer overflow-hidden',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            ASPECT_RATIOS[aspectRatio]
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Banner preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="h-4 w-4" />
                  {formatMessage({ id: 'common.change', defaultMessage: 'Change' })}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <div className="p-4 rounded-full bg-muted/50 mb-3">
                <Upload className="h-8 w-8" />
              </div>
              <p className="font-medium">
                {formatMessage({ id: 'upload.dropOrClick', defaultMessage: 'Drop image or click to upload' })}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentsBannerUpload;
