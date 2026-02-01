// -----------------------------------------------------------------------------
// CompanyBranding Component
// Company name, logo, and cover image configuration
// -----------------------------------------------------------------------------

import React, { useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyBrandingProps {
  companyName: string;
  logo: string | null;
  coverImage: string | null;
  onNameChange: (name: string) => void;
  onLogoChange: (logo: string | null) => void;
  onCoverChange: (cover: string | null) => void;
}

export const CompanyBranding: React.FC<CompanyBrandingProps> = ({
  companyName,
  logo,
  coverImage,
  onNameChange,
  onLogoChange,
  onCoverChange
}) => {
  const { formatMessage } = useIntl();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (data: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        callback(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.design.companyIdentity" defaultMessage="Company Identity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company-name">
            <FormattedMessage id="launch.design.companyName" defaultMessage="Company Name" />
          </Label>
          <Input
            id="company-name"
            value={companyName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={formatMessage({ id: 'launch.design.companyNamePlaceholder', defaultMessage: 'Enter company name' })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>
              <FormattedMessage id="launch.design.logo" defaultMessage="Company Logo" />
            </Label>
            <div
              className={cn(
                'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors min-h-[150px] flex items-center justify-center',
                logo ? 'border-primary/30 bg-primary/5' : 'border-muted'
              )}
              onClick={() => logoInputRef.current?.click()}
            >
              {logo ? (
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Company logo" 
                    className="max-h-24 max-w-full object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogoChange(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <FormattedMessage id="launch.design.uploadLogo" defaultMessage="Click to upload logo" />
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 2MB</p>
                </div>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, onLogoChange)}
              className="hidden"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>
              <FormattedMessage id="launch.design.coverImage" defaultMessage="Cover Image" />
            </Label>
            <div
              className={cn(
                'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors min-h-[150px] flex items-center justify-center overflow-hidden',
                coverImage ? 'border-primary/30' : 'border-muted'
              )}
              onClick={() => coverInputRef.current?.click()}
            >
              {coverImage ? (
                <div className="relative w-full">
                  <img 
                    src={coverImage} 
                    alt="Cover" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCoverChange(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <FormattedMessage id="launch.design.uploadCover" defaultMessage="Click to upload cover" />
                  </p>
                  <p className="text-xs text-muted-foreground">Recommended: 1200x400px</p>
                </div>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, onCoverChange)}
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyBranding;
