// -----------------------------------------------------------------------------
// Select AI Step Component
// Migrated from old_app/src/components/pages/programs/ia/SelectAiPage.tsx
// For use in the program launch wizard
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bot, Volume2, VolumeX, GraduationCap, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import aiPersoApi from '@/api/AiPersoApi';
import type { IAiPersoProfile, IAiTrainingCourse, IAiCompanyProgram } from '../types';

// Static training courses (should come from API in production)
const TRAINING_COURSES: IAiTrainingCourse[] = [
  { iaTrainingName: 'Pas de formation', iaTrainingType: '' },
  { iaTrainingName: 'Les séquences de la vente', iaTrainingType: 'quizz' },
  { iaTrainingName: 'Formation 2', iaTrainingType: 'quizz' },
  { iaTrainingName: 'Formation 3', iaTrainingType: 'quizz' },
];

const NO_AI: IAiPersoProfile = {
  iaName: "Pas d'IA",
  id: 0,
};

interface SelectAiStepProps {
  userUuid: string;
}

export const SelectAiStep: React.FC<SelectAiStepProps> = ({ userUuid }) => {
  const { formatMessage } = useIntl();
  const { updateStepData, goToNextStep, launchData } = useLaunchWizard();
  
  const [profiles, setProfiles] = useState<IAiPersoProfile[]>([]);
  const [selectedAi, setSelectedAi] = useState<IAiPersoProfile | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<IAiTrainingCourse | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await aiPersoApi.getIaPersoCompany({ userUuid });
        setProfiles([NO_AI, ...(response.data || [])]);
      } catch (error) {
        console.error('Failed to fetch AI profiles:', error);
        setProfiles([NO_AI]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userUuid) {
      fetchProfiles();
    }
  }, [userUuid]);

  // Restore previous selection
  useEffect(() => {
    const existingAi = launchData.aiSelected as IAiCompanyProgram | undefined;
    if (existingAi?.iaName) {
      const profile = profiles.find(p => p.iaName === existingAi.iaName);
      if (profile) {
        setSelectedAi(profile);
        setIsVoiceEnabled(existingAi.iaAudioOn || false);
      }
    }
  }, [profiles, launchData.aiSelected]);

  const handleAiSelect = (profileId: string) => {
    const id = parseInt(profileId, 10);
    if (id === 0) {
      setSelectedAi(null);
      setSelectedCourse(null);
      return;
    }
    const profile = profiles.find(p => p.id === id);
    setSelectedAi(profile || null);
    setSelectedCourse(null);
  };

  const handleCourseSelect = (courseName: string) => {
    const course = TRAINING_COURSES.find(c => c.iaTrainingName === courseName);
    setSelectedCourse(course || null);
  };

  const handleNext = () => {
    const aiConfig: IAiCompanyProgram = selectedAi && selectedAi.id !== 0
      ? {
          iaName: selectedAi.iaName,
          iaProjectId: selectedAi.iaProjectId,
          iaType: selectedAi.iaType || '',
          iaComment: '',
          iaExpireDate: '',
          iaDueDate: '',
          iaStatus: '',
          iaTrainingCompany: selectedCourse ? [selectedCourse] : [],
          iaAudioOn: isVoiceEnabled,
        }
      : {};

    updateStepData('aiSelected', aiConfig);
    goToNextStep();
  };

  const showCourseSelection = selectedAi && (
    selectedAi.iaType === 'IA_STAR_ACADEMY' || 
    selectedAi.iaType === 'OLYMPE_ACADEMY'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {formatMessage({ id: 'ai.select.title' }, { defaultMessage: 'AI Assistant Selection' })}
        </h2>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'ai.select.description' }, { defaultMessage: 'Choose an AI assistant to enhance your program experience' })}
        </p>
      </div>

      {/* AI Profile Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {formatMessage({ id: 'ai.select.chooseAi' }, { defaultMessage: 'Choose AI Profile' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'ai.select.chooseAiDesc' }, { defaultMessage: 'Select from your configured AI assistants' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select 
            value={selectedAi ? String(selectedAi.id) : '0'}
            onValueChange={handleAiSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder={formatMessage({ id: 'ai.select.placeholder' }, { defaultMessage: 'Select an AI assistant' })} />
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile.id || 0} value={String(profile.id || 0)}>
                  <div className="flex items-center gap-2">
                    {profile.iaName}
                    {profile.iaType && (
                      <Badge variant="secondary" className="text-xs">
                        {profile.iaType}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedAi && selectedAi.id !== 0 && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedAi.iaName}</span>
                {selectedAi.iaType && (
                  <Badge>{selectedAi.iaType}</Badge>
                )}
              </div>
              
              {selectedAi.shortBiography && (
                <p className="text-sm text-muted-foreground">
                  {selectedAi.shortBiography}
                </p>
              )}

              {/* Voice Toggle */}
              <div className="flex items-center space-x-2 pt-2 border-t">
                <Checkbox
                  id="voice-enabled"
                  checked={isVoiceEnabled}
                  onCheckedChange={(checked) => setIsVoiceEnabled(checked as boolean)}
                />
                <Label htmlFor="voice-enabled" className="flex items-center gap-2 cursor-pointer">
                  {isVoiceEnabled ? (
                    <Volume2 className="h-4 w-4 text-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  {formatMessage({ id: 'ai.select.enableVoice' }, { defaultMessage: 'Enable voice for AI' })}
                </Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Selection (for Academy types) */}
      {showCourseSelection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {formatMessage({ id: 'ai.select.chooseCourse' }, { defaultMessage: 'Training Course' })}
            </CardTitle>
            <CardDescription>
              {formatMessage({ id: 'ai.select.chooseCourseDesc' }, { defaultMessage: 'Select a training course for this AI' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedCourse?.iaTrainingName || ''}
              onValueChange={handleCourseSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder={formatMessage({ id: 'ai.select.coursePlaceholder' }, { defaultMessage: 'Select a course' })} />
              </SelectTrigger>
              <SelectContent>
                {TRAINING_COURSES.map(course => (
                  <SelectItem key={course.iaTrainingName} value={course.iaTrainingName || ''}>
                    {course.iaTrainingName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleNext} size="lg">
          {formatMessage({ id: 'common.continue' }, { defaultMessage: 'Continue' })}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectAiStep;
