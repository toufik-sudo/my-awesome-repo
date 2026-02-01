// -----------------------------------------------------------------------------
// useDesignConfig Hook
// Manages design/branding configuration state
// Migrated from old_app hooks
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useLaunchWizard } from './useLaunchWizard';
import {
  COMPANY_NAME,
  COMPANY_LOGO,
  BACKGROUND_COVER
} from '@/constants/wall/launch';

interface DesignConfig {
  companyName: string;
  logo: string | null;
  coverImage: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontFamily: string;
  backgroundStyle: string;
}

const DEFAULT_COLORS = {
  primary: '#2563eb',
  secondary: '#1e40af',
  accent: '#3b82f6'
};

export const useDesignConfig = () => {
  const { updateStepData, launchData } = useLaunchWizard();

  const [config, setConfig] = useState<DesignConfig>(() => ({
    companyName: (launchData[COMPANY_NAME] as string) || '',
    logo: (launchData[COMPANY_LOGO] as string) || null,
    coverImage: (launchData[BACKGROUND_COVER] as string) || null,
    colors: {
      primary: (launchData.primaryColor as string) || DEFAULT_COLORS.primary,
      secondary: (launchData.secondaryColor as string) || DEFAULT_COLORS.secondary,
      accent: (launchData.accentColor as string) || DEFAULT_COLORS.accent,
    },
    fontFamily: (launchData.fontFamily as string) || 'inter',
    backgroundStyle: (launchData.backgroundStyle as string) || 'solid',
  }));

  // Sync to store
  useEffect(() => {
    updateStepData(COMPANY_NAME, config.companyName);
    updateStepData(COMPANY_LOGO, config.logo);
    updateStepData(BACKGROUND_COVER, config.coverImage);
    updateStepData('primaryColor', config.colors.primary);
    updateStepData('secondaryColor', config.colors.secondary);
    updateStepData('accentColor', config.colors.accent);
    updateStepData('fontFamily', config.fontFamily);
    updateStepData('backgroundStyle', config.backgroundStyle);
  }, [config]);

  const updateCompanyName = useCallback((name: string) => {
    setConfig(prev => ({ ...prev, companyName: name }));
  }, []);

  const updateLogo = useCallback((logo: string | null) => {
    setConfig(prev => ({ ...prev, logo }));
  }, []);

  const updateCoverImage = useCallback((coverImage: string | null) => {
    setConfig(prev => ({ ...prev, coverImage }));
  }, []);

  const updateColors = useCallback((colors: Partial<DesignConfig['colors']>) => {
    setConfig(prev => ({ 
      ...prev, 
      colors: { ...prev.colors, ...colors } 
    }));
  }, []);

  const updateFontFamily = useCallback((fontFamily: string) => {
    setConfig(prev => ({ ...prev, fontFamily }));
  }, []);

  const updateBackgroundStyle = useCallback((backgroundStyle: string) => {
    setConfig(prev => ({ ...prev, backgroundStyle }));
  }, []);

  const applyColorPreset = useCallback((preset: { primary: string; secondary: string; accent: string }) => {
    setConfig(prev => ({
      ...prev,
      colors: preset
    }));
  }, []);

  // Validation
  const isValid = config.companyName.trim().length > 0;

  return {
    config,
    updateCompanyName,
    updateLogo,
    updateCoverImage,
    updateColors,
    updateFontFamily,
    updateBackgroundStyle,
    applyColorPreset,
    isValid
  };
};

export default useDesignConfig;
