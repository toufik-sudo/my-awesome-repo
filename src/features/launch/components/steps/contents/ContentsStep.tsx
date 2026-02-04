// -----------------------------------------------------------------------------
// Contents Step Component
// Main content configuration step for the launch wizard
// Combines editor and banner upload
// -----------------------------------------------------------------------------

import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ContentsEditor } from './ContentsEditor';
import { ContentsBannerUpload } from './ContentsBannerUpload';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import { cn } from '@/lib/utils';

interface ContentSection {
  id: string;
  bannerTitle: string;
  bannerImage: string | null;
  content: string;
}

// Helper to determine if program type is freemium or wall
function isFreemiumOrWall(type: string | undefined): boolean {
  if (!type) return false;
  return type.toLowerCase() === 'freemium' || type.toLowerCase() === 'wall';
}

const TOTAL_SECTIONS = 5;
const FREEMIUM_WALL_SECTIONS = 1; // Only Main Banner and Section 1

export const ContentsStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { stepIndex = '1' } = useParams < { stepIndex: string } > ();
  const { updateStepData, launchData, programType } = useLaunchWizard();

  // Determine currentIndex and whether to restrict to only first section
  const currentIndex = parseInt(stepIndex, 10);

  // Check for freemium or wall type
  // programType from useLaunchWizard is already normalized
  const isLimitedSections = useMemo(() => !isFreemiumOrWall(programType), [programType]);
  const sectionCount = isLimitedSections ? FREEMIUM_WALL_SECTIONS : TOTAL_SECTIONS;

  const isMainBanner = currentIndex === 1;

  // Initialize content sections from store or create defaults
  const [sections, setSections] = useState < ContentSection[] > (() => {
    const storedSections = launchData.contentSections as ContentSection[] | undefined;
    if (storedSections?.length) {
      // Always keep at least sectionCount sections
      return [
        ...storedSections.slice(0, sectionCount),
        ...Array.from(
          { length: Math.max(0, sectionCount - (storedSections.length)) },
          (_, i) => ({
            id: `section-${storedSections.length + i + 1}`,
            bannerTitle: '',
            bannerImage: null,
            content: '',
          })
        ),
      ];
    }
    return Array.from({ length: sectionCount }, (_, i) => ({
      id: `section-${i + 1}`,
      bannerTitle: '',
      bannerImage: null,
      content: '',
    }));
  });

  // Sync to store on change
  useEffect(() => {
    updateStepData('contentSections', sections);
  }, [sections]);

  const updateSection = (index: number, updates: Partial<ContentSection>) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, ...updates } : section
      )
    );
  };

  // Get actual current section from local state
  const activeSection = sections[currentIndex - 1];

  // Calculate progress
  const filledSections = sections.filter(
    (s) => s.bannerTitle || s.bannerImage || s.content
  ).length;
  const progress = (filledSections / sectionCount) * 100;

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
            {filledSections}/{sectionCount}
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
      {activeSection && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <ContentsBannerUpload
            value={activeSection.bannerImage}
            onChange={(img) => updateSection(currentIndex - 1, { bannerImage: img })}
            title={
              isMainBanner
                ? formatMessage({ id: 'contents.banner.main', defaultMessage: 'Main Program Banner' })
                : formatMessage(
                  { id: 'contents.banner.section', defaultMessage: 'Section {number} Banner' },
                  { number: currentIndex - 1 }
                )
            }
            bannerTitle={activeSection.bannerTitle}
            onBannerTitleChange={(title) =>
              updateSection(currentIndex - 1, { bannerTitle: title })
            }
            optimalSize={isMainBanner ? '1920 x 1080px' : '1024 x 243px'}
            aspectRatio={isMainBanner ? 'wide' : 'wide'}
            index={currentIndex}
          />

          <ContentsEditor
            value={activeSection.content}
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
    </div>
  );
};

export default ContentsStep;
