// -----------------------------------------------------------------------------
// Design Page
// Migrated from old_app/src/components/pages/DesignPage.tsx
// -----------------------------------------------------------------------------

import React, { createContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Image, Type, ArrowRight, Upload } from 'lucide-react';

// Context for avatar/logo uploads
export const DesignAvatarContext = createContext<any>(null);
export const DesignCoverContext = createContext<any>(null);

// Available fonts for customization
const CUSTOMIZE_FONTS = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
];

const DesignPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [selectedFont, setSelectedFont] = useState('Roboto');

  const handleNext = () => {
    // TODO: Navigate to next step
    console.log('Navigate to next step');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          {formatMessage({ id: 'launchProgram.title', defaultMessage: 'Launch Program' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'launchProgram.design.subtitle', defaultMessage: 'Customize the look and feel of your program' })}
        </p>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {formatMessage({ id: 'design.colors', defaultMessage: 'Colors' })}
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            {formatMessage({ id: 'design.typography', defaultMessage: 'Typography' })}
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            {formatMessage({ id: 'design.branding', defaultMessage: 'Branding' })}
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>
                {formatMessage({ id: 'design.colorScheme', defaultMessage: 'Color Scheme' })}
              </CardTitle>
              <CardDescription>
                {formatMessage({ id: 'design.colorScheme.description', defaultMessage: 'Choose colors that match your brand' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">
                    {formatMessage({ id: 'design.primaryColor', defaultMessage: 'Primary Color' })}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">
                    {formatMessage({ id: 'design.secondaryColor', defaultMessage: 'Secondary Color' })}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-6 rounded-lg border" style={{ backgroundColor: primaryColor + '10' }}>
                <h3 className="font-bold mb-2" style={{ color: primaryColor }}>
                  {formatMessage({ id: 'design.preview', defaultMessage: 'Preview' })}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {formatMessage({ id: 'design.preview.text', defaultMessage: 'This is how your program will look' })}
                </p>
                <div className="flex gap-2">
                  <Button style={{ backgroundColor: primaryColor }}>
                    {formatMessage({ id: 'design.primaryButton', defaultMessage: 'Primary' })}
                  </Button>
                  <Button variant="outline" style={{ borderColor: secondaryColor, color: secondaryColor }}>
                    {formatMessage({ id: 'design.secondaryButton', defaultMessage: 'Secondary' })}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>
                {formatMessage({ id: 'design.fonts', defaultMessage: 'Fonts' })}
              </CardTitle>
              <CardDescription>
                {formatMessage({ id: 'design.fonts.description', defaultMessage: 'Select fonts for your program' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CUSTOMIZE_FONTS.map((font) => (
                  <div
                    key={font}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFont === font ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFont(font)}
                  >
                    <p className="text-lg font-medium" style={{ fontFamily: font }}>
                      {font}
                    </p>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: font }}>
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>
                {formatMessage({ id: 'design.branding', defaultMessage: 'Branding' })}
              </CardTitle>
              <CardDescription>
                {formatMessage({ id: 'design.branding.description', defaultMessage: 'Upload your logo and cover image' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>
                    {formatMessage({ id: 'design.logo', defaultMessage: 'Logo' })}
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formatMessage({ id: 'design.uploadLogo', defaultMessage: 'Click to upload logo' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>

                {/* Cover Upload */}
                <div className="space-y-2">
                  <Label>
                    {formatMessage({ id: 'design.cover', defaultMessage: 'Cover Image' })}
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formatMessage({ id: 'design.uploadCover', defaultMessage: 'Click to upload cover' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleNext}>
          {formatMessage({ id: 'form.submit.next', defaultMessage: 'Next' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DesignPage;
