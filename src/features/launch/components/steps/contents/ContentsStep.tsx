// -----------------------------------------------------------------------------
// Contents Step Component
// Main content configuration step for the launch wizard
// Combines editor, banner upload, and social networks
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ContentsEditor } from './ContentsEditor';
import { ContentsBannerUpload } from './ContentsBannerUpload';
import { SocialNetworksConfig, SocialNetwork } from './SocialNetworksConfig';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import { cn } from '@/lib/utils';

interface ContentSection {
  id: string;
  bannerTitle: string;
  bannerImage: string | null;
  content: string;
}

const CONTENT_SECTIONS_COUNT = 5;

export const ContentsStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { stepIndex = '1' } = useParams<{ stepIndex: string }>();
  const { updateStepData, goToNextStep, launchData } = useLaunchWizard();

  const currentIndex = parseInt(stepIndex, 10);
  const isSocialNetworksStep = currentIndex === 6;

  // Initialize content sections from store or create defaults
  const [sections, setSections] = useState<ContentSection[]>(() => {
    const storedSections = launchData.contentSections as ContentSection[] | undefined;
    if (storedSections?.length) {
      return storedSections;
    }
    return Array.from({ length: CONTENT_SECTIONS_COUNT }, (_, i) => ({
      id: `section-${i + 1}`,
      bannerTitle: '',
      bannerImage: null,
      content: '',
    }));
  });

  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>(
    (launchData.socialMediaAccounts as SocialNetwork[]) || []
  );

  // Sync to store on change
  useEffect(() => {
    updateStepData('contentSections', sections);
  }, [sections]);

  useEffect(() => {
    updateStepData('socialMediaAccounts', socialNetworks);
  }, [socialNetworks]);

  const updateSection = (index: number, updates: Partial<ContentSection>) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, ...updates } : section
      )
    );
  };

  const currentSection = sections[currentIndex - 1];
  const isMainBanner = currentIndex === 1;

  // Calculate progress
  const filledSections = sections.filter(
    (s) => s.bannerTitle || s.bannerImage || s.content
  ).length;
  const progress = (filledSections / CONTENT_SECTIONS_COUNT) * 100;

  const handleNext = () => {
    goToNextStep();
  };

  if (isSocialNetworksStep) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              {formatMessage({ id: 'contents.socialNetworks.title', defaultMessage: 'Social Networks' })}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {formatMessage({
              id: 'contents.socialNetworks.subtitle',
              defaultMessage: 'Connect your social media accounts to engage with participants.',
            })}
          </p>
        </div>

        <SocialNetworksConfig
          networks={socialNetworks}
          onChange={setSocialNetworks}
        />

        <div className="flex justify-center pt-4">
          <Button onClick={handleNext} size="lg" className="gap-2">
            {formatMessage({ id: 'form.submit.next', defaultMessage: 'Continue' })}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">
            {isMainBanner
              ? formatMessage({ id: 'contents.mainBanner.title', defaultMessage: 'Main Content Banner' })
              : formatMessage(
                  { id: 'contents.section.title', defaultMessage: 'Content Section {number}' },
                  { number: currentIndex - 1 }
                )}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {isMainBanner
            ? formatMessage({
                id: 'contents.mainBanner.subtitle',
                defaultMessage: 'Set up the main banner that appears at the top of your program.',
              })
            : formatMessage({
                id: 'contents.section.subtitle',
                defaultMessage: 'Add content to engage and inform your participants.',
              })}
        </p>
      </div>

      {/* Progress */}
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatMessage({ id: 'contents.progress', defaultMessage: 'Content Progress' })}
          </span>
          <Badge variant="secondary">
            {filledSections}/{CONTENT_SECTIONS_COUNT}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Tabs */}
      <div className="flex justify-center gap-2 flex-wrap">
        {sections.map((section, i) => {
          const sectionNum = i + 1;
          const isActive = sectionNum === currentIndex;
          const isFilled = section.bannerTitle || section.bannerImage || section.content;
          return (
            <button
              key={section.id}
              className={cn(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium text-sm transition-all',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isFilled
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-muted bg-muted text-muted-foreground hover:border-primary/30'
              )}
              disabled
            >
              {sectionNum}
            </button>
          );
        })}
      </div>

      {/* Current Section Editor */}
      {currentSection && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <ContentsBannerUpload
            value={currentSection.bannerImage}
            onChange={(img) => updateSection(currentIndex - 1, { bannerImage: img })}
            title={
              isMainBanner
                ? formatMessage({ id: 'contents.banner.main', defaultMessage: 'Main Program Banner' })
                : formatMessage(
                    { id: 'contents.banner.section', defaultMessage: 'Section {number} Banner' },
                    { number: currentIndex - 1 }
                  )
            }
            bannerTitle={currentSection.bannerTitle}
            onBannerTitleChange={(title) =>
              updateSection(currentIndex - 1, { bannerTitle: title })
            }
            optimalSize={isMainBanner ? '1920 x 1080px' : '1024 x 243px'}
            aspectRatio={isMainBanner ? 'wide' : 'wide'}
            index={currentIndex}
          />

          <ContentsEditor
            value={currentSection.content}
            onChange={(content) => updateSection(currentIndex - 1, { content })}
            title={formatMessage({ id: 'contents.editor.title', defaultMessage: 'Content' })}
            placeholder={formatMessage({
              id: 'contents.editor.placeholder',
              defaultMessage: 'Write your content here. Use the toolbar to format text.',
            })}
            minHeight={isMainBanner ? '250px' : '180px'}
          />
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleNext} size="lg" className="gap-2">
          {formatMessage({ id: 'form.submit.next', defaultMessage: 'Continue' })}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentsStep;
