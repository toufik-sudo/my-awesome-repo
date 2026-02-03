// -----------------------------------------------------------------------------
// DesignPreviewStep Component
// Wrapper that connects DesignPreview with useLaunchWizard for substep 2
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesignPreview } from './DesignPreview';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import { COMPANY_NAME, COMPANY_LOGO, BACKGROUND_COVER } from '@/constants/wall/launch';

export const DesignPreviewStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { launchData } = useLaunchWizard();

  // Extract design data from launch store
  const companyName = (launchData[COMPANY_NAME] as string) || (launchData.companyName as string) || '';
  const logo = (launchData[COMPANY_LOGO] as string) || (launchData.logo as string) || null;
  const coverImage = (launchData[BACKGROUND_COVER] as string) || (launchData.backgroundCover as string) || null;
  const colors = {
    primary: (launchData.primaryColor as string) || '#2563eb',
    secondary: (launchData.secondaryColor as string) || '#1e40af',
    accent: (launchData.accentColor as string) || '#3b82f6',
  };
  const fontFamily = (launchData.fontFamily as string) || 'inter';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Eye className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold">
            {formatMessage({ id: 'launch.design.preview.title', defaultMessage: 'Design Preview' })}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {formatMessage({
            id: 'launch.design.preview.description',
            defaultMessage: 'Review how your design choices will appear to participants.',
          })}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <DesignPreview
          companyName={companyName}
          logo={logo}
          coverImage={coverImage}
          colors={colors}
          fontFamily={fontFamily}
        />
      </div>
    </div>
  );
};

export default DesignPreviewStep;
