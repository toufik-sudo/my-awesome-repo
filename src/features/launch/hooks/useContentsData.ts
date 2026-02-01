// -----------------------------------------------------------------------------
// useContentsData Hook
// Manages content sections data for the launch wizard
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import type { RootState } from '@/store';

export interface ContentSection {
  id: string;
  bannerTitle: string;
  bannerImage: string | null;
  content: string;
}

export interface ContentSocialNetwork {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  placeholder: string;
}

export interface UseContentsDataReturn {
  sections: ContentSection[];
  socialNetworks: ContentSocialNetwork[];
  updateSection: (index: number, updates: Partial<ContentSection>) => void;
  updateSocialNetworks: (networks: ContentSocialNetwork[]) => void;
  getProgress: () => { filled: number; total: number; percentage: number };
  isValid: (stepIndex: number) => boolean;
}

const CONTENT_SECTIONS_COUNT = 5;

const DEFAULT_SOCIAL_NETWORKS: Omit<ContentSocialNetwork, 'url' | 'enabled'>[] = [
  { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
  { id: 'twitter', name: 'X (Twitter)', placeholder: 'https://x.com/yourhandle' },
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { id: 'website', name: 'Website', placeholder: 'https://yourwebsite.com' },
];

export function useContentsData(): UseContentsDataReturn {
  const dispatch = useDispatch();
  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  // Initialize sections from store or create defaults
  const [sections, setSections] = useState<ContentSection[]>(() => {
    const stored = launchData.contentSections as ContentSection[] | undefined;
    if (stored?.length) return stored;
    return Array.from({ length: CONTENT_SECTIONS_COUNT }, (_, i) => ({
      id: `section-${i + 1}`,
      bannerTitle: '',
      bannerImage: null,
      content: '',
    }));
  });

  const [socialNetworks, setSocialNetworks] = useState<ContentSocialNetwork[]>(() => {
    const stored = launchData.socialMediaAccounts as ContentSocialNetwork[] | undefined;
    if (stored?.length) return stored;
    return DEFAULT_SOCIAL_NETWORKS.map((n) => ({ ...n, url: '', enabled: false }));
  });

  // Sync to store
  useEffect(() => {
    dispatch(setLaunchDataStep({ key: 'contentSections', value: sections }));
  }, [sections, dispatch]);

  useEffect(() => {
    dispatch(setLaunchDataStep({ key: 'socialMediaAccounts', value: socialNetworks }));
  }, [socialNetworks, dispatch]);

  const updateSection = useCallback((index: number, updates: Partial<ContentSection>) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, ...updates } : section))
    );
  }, []);

  const updateSocialNetworks = useCallback((networks: ContentSocialNetwork[]) => {
    setSocialNetworks(networks);
  }, []);

  const getProgress = useCallback(() => {
    const filled = sections.filter(
      (s) => s.bannerTitle || s.bannerImage || s.content
    ).length;
    return {
      filled,
      total: CONTENT_SECTIONS_COUNT,
      percentage: (filled / CONTENT_SECTIONS_COUNT) * 100,
    };
  }, [sections]);

  const isValid = useCallback(
    (stepIndex: number) => {
      // Social networks step
      if (stepIndex === 6) {
        return true; // Optional
      }
      // Content sections are optional
      return true;
    },
    [sections]
  );

  return {
    sections,
    socialNetworks,
    updateSection,
    updateSocialNetworks,
    getProgress,
    isValid,
  };
}

export default useContentsData;
