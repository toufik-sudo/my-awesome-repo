// -----------------------------------------------------------------------------
// CompanyFonts Component
// Font selection for program design
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Type, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FontOption {
  id: string;
  name: string;
  style: string;
  sample: string;
}

interface CompanyFontsProps {
  selectedFont: string;
  onChange: (fontId: string) => void;
}

const FONT_OPTIONS: FontOption[] = [
  { id: 'inter', name: 'Inter', style: 'Modern & Clean', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'poppins', name: 'Poppins', style: 'Friendly & Rounded', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'roboto', name: 'Roboto', style: 'Professional', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'playfair', name: 'Playfair Display', style: 'Elegant & Classic', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'montserrat', name: 'Montserrat', style: 'Bold & Strong', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'opensans', name: 'Open Sans', style: 'Neutral & Readable', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'lato', name: 'Lato', style: 'Warm & Stable', sample: 'The quick brown fox jumps over the lazy dog' },
  { id: 'sourcesans', name: 'Source Sans Pro', style: 'Technical & Clear', sample: 'The quick brown fox jumps over the lazy dog' },
];

const getFontFamily = (fontId: string): string => {
  const fontMap: Record<string, string> = {
    inter: '"Inter", sans-serif',
    poppins: '"Poppins", sans-serif',
    roboto: '"Roboto", sans-serif',
    playfair: '"Playfair Display", serif',
    montserrat: '"Montserrat", sans-serif',
    opensans: '"Open Sans", sans-serif',
    lato: '"Lato", sans-serif',
    sourcesans: '"Source Sans Pro", sans-serif',
  };
  return fontMap[fontId] || fontMap.inter;
};

export const CompanyFonts: React.FC<CompanyFontsProps> = ({
  selectedFont,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.design.fonts" defaultMessage="Typography" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage 
            id="launch.design.fontsDesc" 
            defaultMessage="Choose a font that represents your brand personality" 
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FONT_OPTIONS.map((font) => (
            <div
              key={font.id}
              className={cn(
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                selectedFont === font.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              )}
              onClick={() => onChange(font.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{font.name}</h4>
                  <p className="text-sm text-muted-foreground">{font.style}</p>
                </div>
                {selectedFont === font.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p 
                className="text-lg mt-3 pb-1"
                style={{ fontFamily: getFontFamily(font.id) }}
              >
                {font.sample}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyFonts;
