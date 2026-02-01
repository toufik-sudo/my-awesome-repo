// -----------------------------------------------------------------------------
// DesignStep Component
// Design configuration step: Brand identity, logo, colors, fonts
// Integrated with Redux store
// -----------------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Type, 
  Image as ImageIcon,
  Upload,
  Check,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import {
  COMPANY_NAME,
  COMPANY_LOGO,
  BACKGROUND_COVER
} from '@/constants/wall/launch';

interface DesignConfig {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundStyle: string;
}

const COLOR_PRESETS = [
  { name: 'Corporate Blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  { name: 'Fresh Green', primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' },
  { name: 'Vibrant Purple', primary: '#9333ea', secondary: '#7c3aed', accent: '#a855f7' },
  { name: 'Warm Orange', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
  { name: 'Modern Teal', primary: '#0d9488', secondary: '#0f766e', accent: '#14b8a6' },
  { name: 'Bold Red', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
];

const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', style: 'Modern & Clean' },
  { id: 'poppins', name: 'Poppins', style: 'Friendly & Rounded' },
  { id: 'roboto', name: 'Roboto', style: 'Professional' },
  { id: 'playfair', name: 'Playfair Display', style: 'Elegant & Classic' },
  { id: 'montserrat', name: 'Montserrat', style: 'Bold & Strong' },
  { id: 'opensans', name: 'Open Sans', style: 'Neutral & Readable' },
];

const BACKGROUND_STYLES = [
  { id: 'solid', name: 'Solid', preview: 'bg-background' },
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-primary/10 to-secondary/10' },
  { id: 'pattern', name: 'Pattern', preview: 'bg-[url("/patterns/dots.svg")]' },
  { id: 'minimal', name: 'Minimal', preview: 'bg-muted/30' },
];

const DesignStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { updateStepData, launchData } = useLaunchWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [config, setConfig] = useState<DesignConfig>({
    companyName: (launchData[COMPANY_NAME] as string) || (launchData.companyName as string) || '',
    logo: (launchData[COMPANY_LOGO] as string) || (launchData.logo as string) || null,
    primaryColor: (launchData.primaryColor as string) || '#2563eb',
    secondaryColor: (launchData.secondaryColor as string) || '#1e40af',
    accentColor: (launchData.accentColor as string) || '#3b82f6',
    fontFamily: (launchData.fontFamily as string) || 'inter',
    backgroundStyle: (launchData[BACKGROUND_COVER] as string) || (launchData.backgroundStyle as string) || 'solid',
  });
  
  const [activeTab, setActiveTab] = useState('branding');
  
  // Sync config to store on change
  useEffect(() => {
    updateStepData(COMPANY_NAME, config.companyName);
    updateStepData(COMPANY_LOGO, config.logo);
    updateStepData('primaryColor', config.primaryColor);
    updateStepData('secondaryColor', config.secondaryColor);
    updateStepData('accentColor', config.accentColor);
    updateStepData('fontFamily', config.fontFamily);
    updateStepData(BACKGROUND_COVER, config.backgroundStyle);
  }, [config]);
  
  const updateConfig = (key: keyof DesignConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateConfig('logo', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.design.title" 
            defaultMessage="Design & Branding" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.design.description" 
            defaultMessage="Customize the look and feel of your program" 
          />
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.design.branding" defaultMessage="Branding" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.design.colors" defaultMessage="Colors" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.design.typography" defaultMessage="Typography" />
            </span>
          </TabsTrigger>
        </TabsList>
        
        {/* Branding */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <FormattedMessage id="launch.design.companyIdentity" defaultMessage="Company Identity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.design.companyName" defaultMessage="Company Name" />
                </Label>
                <Input
                  value={config.companyName}
                  onChange={(e) => updateConfig('companyName', e.target.value)}
                  placeholder={formatMessage({ id: 'launch.design.companyNamePlaceholder', defaultMessage: 'Enter company name' })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.design.logo" defaultMessage="Company Logo" />
                </Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {config.logo ? (
                    <div className="space-y-3">
                      <img 
                        src={config.logo} 
                        alt="Company logo" 
                        className="max-h-24 mx-auto object-contain"
                      />
                      <p className="text-sm text-muted-foreground">
                        <FormattedMessage id="launch.design.clickToChange" defaultMessage="Click to change" />
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        <FormattedMessage id="launch.design.uploadLogo" defaultMessage="Click to upload your logo" />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, SVG up to 2MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Background Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <FormattedMessage id="launch.design.backgroundStyle" defaultMessage="Background Style" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BACKGROUND_STYLES.map(style => (
                  <div
                    key={style.id}
                    className={cn(
                      'p-4 border-2 rounded-lg cursor-pointer transition-all text-center',
                      config.backgroundStyle === style.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    )}
                    onClick={() => updateConfig('backgroundStyle', style.id)}
                  >
                    <div className={cn('h-16 rounded mb-2 border', style.preview)} />
                    <span className="text-sm font-medium">{style.name}</span>
                    {config.backgroundStyle === style.id && (
                      <Check className="h-4 w-4 text-primary mx-auto mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Colors */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                <FormattedMessage id="launch.design.colorPresets" defaultMessage="Color Presets" />
              </CardTitle>
              <CardDescription>
                <FormattedMessage id="launch.design.colorPresetsDesc" defaultMessage="Quick-apply a color scheme" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COLOR_PRESETS.map(preset => (
                  <div
                    key={preset.name}
                    className="p-3 border rounded-lg cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => applyColorPreset(preset)}
                  >
                    <div className="flex gap-1 mb-2">
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-sm font-medium">{preset.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <FormattedMessage id="launch.design.customColors" defaultMessage="Custom Colors" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => updateConfig('accentColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={config.accentColor}
                      onChange={(e) => updateConfig('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className="mt-6 p-6 rounded-lg border" style={{ 
                background: `linear-gradient(135deg, ${config.primaryColor}20 0%, ${config.secondaryColor}20 100%)`
              }}>
                <h4 className="font-semibold mb-2" style={{ color: config.primaryColor }}>
                  Preview
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This is how your color scheme will look
                </p>
                <div className="flex gap-2">
                  <Button size="sm" style={{ backgroundColor: config.primaryColor, color: 'white' }}>
                    Primary Button
                  </Button>
                  <Button size="sm" variant="outline" style={{ borderColor: config.secondaryColor, color: config.secondaryColor }}>
                    Secondary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Typography */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <FormattedMessage id="launch.design.fontFamily" defaultMessage="Font Family" />
              </CardTitle>
              <CardDescription>
                <FormattedMessage id="launch.design.fontFamilyDesc" defaultMessage="Choose a font that matches your brand" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FONT_OPTIONS.map(font => (
                  <div
                    key={font.id}
                    className={cn(
                      'p-4 border-2 rounded-lg cursor-pointer transition-all',
                      config.fontFamily === font.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    )}
                    onClick={() => updateConfig('fontFamily', font.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{font.name}</h4>
                        <p className="text-sm text-muted-foreground">{font.style}</p>
                      </div>
                      {config.fontFamily === font.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="mt-2 text-lg" style={{ fontFamily: font.name }}>
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { DesignStep };
export default DesignStep;
