// -----------------------------------------------------------------------------
// DesignPreview Component
// Live preview of design configuration
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trophy, Gift, Star } from 'lucide-react';

interface DesignPreviewProps {
  companyName: string;
  logo: string | null;
  coverImage: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontFamily: string;
}

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

export const DesignPreview: React.FC<DesignPreviewProps> = ({
  companyName,
  logo,
  coverImage,
  colors,
  fontFamily
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.design.livePreview" defaultMessage="Live Preview" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mock Program Card */}
        <div 
          className="border rounded-lg overflow-hidden shadow-sm"
          style={{ fontFamily: getFontFamily(fontFamily) }}
        >
          {/* Cover */}
          <div 
            className="h-24 relative"
            style={{ 
              background: coverImage 
                ? `url(${coverImage}) center/cover no-repeat`
                : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
            }}
          >
            {/* Logo overlay */}
            {logo && (
              <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                <div className="h-16 w-16 rounded-lg bg-background border-4 border-background shadow-md overflow-hidden">
                  <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                </div>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className={logo ? 'pt-10 px-4 pb-4' : 'p-4'}>
            <h3 
              className="text-xl font-bold mb-1"
              style={{ color: colors.primary }}
            >
              {companyName || 'Your Company'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              <FormattedMessage id="launch.design.previewSubtitle" defaultMessage="Incentive Program 2024" />
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <Trophy className="h-5 w-5 mx-auto mb-1" style={{ color: colors.accent }} />
                <p className="text-lg font-bold">1,250</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <Gift className="h-5 w-5 mx-auto mb-1" style={{ color: colors.accent }} />
                <p className="text-lg font-bold">12</p>
                <p className="text-xs text-muted-foreground">Rewards</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <Star className="h-5 w-5 mx-auto mb-1" style={{ color: colors.accent }} />
                <p className="text-lg font-bold">#5</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                style={{ backgroundColor: colors.primary }}
              >
                <FormattedMessage id="launch.design.viewRewards" defaultMessage="View Rewards" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1"
                style={{ borderColor: colors.secondary, color: colors.secondary }}
              >
                <FormattedMessage id="launch.design.leaderboard" defaultMessage="Leaderboard" />
              </Button>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          <FormattedMessage 
            id="launch.design.previewNote" 
            defaultMessage="This is a preview of how your program will appear to participants" 
          />
        </p>
      </CardContent>
    </Card>
  );
};

export default DesignPreview;
