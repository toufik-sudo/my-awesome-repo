// -----------------------------------------------------------------------------
// CompanyColors Component
// Color customization for program design
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface CompanyColorsProps {
  colors: ColorConfig;
  onChange: (colors: ColorConfig) => void;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Corporate Blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  { name: 'Fresh Green', primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' },
  { name: 'Vibrant Purple', primary: '#9333ea', secondary: '#7c3aed', accent: '#a855f7' },
  { name: 'Warm Orange', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
  { name: 'Modern Teal', primary: '#0d9488', secondary: '#0f766e', accent: '#14b8a6' },
  { name: 'Bold Red', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
];

export const CompanyColors: React.FC<CompanyColorsProps> = ({
  colors,
  onChange
}) => {
  const { formatMessage } = useIntl();

  const applyPreset = (preset: ColorPreset) => {
    onChange({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent
    });
  };

  const updateColor = (key: keyof ColorConfig, value: string) => {
    onChange({ ...colors, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.design.colors" defaultMessage="Brand Colors" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.design.colorsDesc" 
            defaultMessage="Choose colors that match your brand identity" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Presets */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <FormattedMessage id="launch.design.colorPresets" defaultMessage="Quick Presets" />
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <div
                key={preset.name}
                className="p-3 border rounded-lg cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex gap-1 mb-2">
                  <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: preset.primary }} />
                  <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: preset.secondary }} />
                  <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: preset.accent }} />
                </div>
                <span className="text-sm font-medium">{preset.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="space-y-4">
          <Label>
            <FormattedMessage id="launch.design.customColors" defaultMessage="Custom Colors" />
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Primary</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#2563eb"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Secondary</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#1e40af"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Accent</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => updateColor('accent', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={colors.accent}
                  onChange={(e) => updateColor('accent', e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div 
          className="p-6 rounded-lg border"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: colors.primary }}>
            <FormattedMessage id="launch.design.preview" defaultMessage="Preview" />
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            <FormattedMessage id="launch.design.previewDesc" defaultMessage="This is how your color scheme will look" />
          </p>
          <div className="flex gap-2">
            <Button size="sm" style={{ backgroundColor: colors.primary, color: 'white' }}>
              Primary
            </Button>
            <Button size="sm" variant="outline" style={{ borderColor: colors.secondary, color: colors.secondary }}>
              Secondary
            </Button>
            <Button size="sm" variant="ghost" style={{ color: colors.accent }}>
              Accent
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyColors;
