// -----------------------------------------------------------------------------
// AI Selection Step Component
// Migrated from old_app/src/components/pages/programs/ia/SelectAiPage.tsx
// AI assistant selection for the launch wizard
// -----------------------------------------------------------------------------

import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Bot, Volume2, VolumeX, GraduationCap, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import aiPersoApi from '@/api/AiPersoApi';
import type { IAiPersoProfile, IAiTrainingCourse, IAiCompanyProgram } from '@/features/ai/types';

// Training courses - should come from API in production
const TRAINING_COURSES: IAiTrainingCourse[] = [
  { iaTrainingName: 'Pas de formation', iaTrainingType: '' },
  { iaTrainingName: 'Les séquences de la vente', iaTrainingType: 'quizz' },
  { iaTrainingName: 'Formation 2', iaTrainingType: 'quizz' },
  { iaTrainingName: 'Formation 3', iaTrainingType: 'quizz' },
];

const NO_AI_OPTION: IAiPersoProfile = {
  id: 0,
  iaName: "Pas d'IA",
};

interface AISelectionStepProps {
  userUuid: string;
}

export const AISelectionStep: React.FC<AISelectionStepProps> = ({ userUuid }) => {
  const { formatMessage } = useIntl();
  const { updateStepData, goToNextStep, launchData } = useLaunchWizard();

  const [profiles, setProfiles] = useState<IAiPersoProfile[]>([]);
  const [selectedAi, setSelectedAi] = useState<IAiPersoProfile | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<IAiTrainingCourse | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch AI profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!userUuid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await aiPersoApi.getIaPersoCompany({ userUuid });
        setProfiles([NO_AI_OPTION, ...(response.data || [])]);
      } catch (err) {
        console.error('Failed to fetch AI profiles:', err);
        setError('Failed to load AI profiles. You can continue without AI.');
        setProfiles([NO_AI_OPTION]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [userUuid]);

  // Restore previous selection
  useEffect(() => {
    const existingAi = launchData.iaCompany as IAiCompanyProgram | undefined;
    if (existingAi?.iaName && profiles.length > 1) {
      const profile = profiles.find((p) => p.iaName === existingAi.iaName);
      if (profile) {
        setSelectedAi(profile);
        setIsVoiceEnabled(existingAi.iaAudioOn || false);
        if (existingAi.iaTrainingCompany?.[0]) {
          const course = TRAINING_COURSES.find(
            (c) => c.iaTrainingName === existingAi.iaTrainingCompany![0].iaTrainingName
          );
          setSelectedCourse(course || null);
        }
      }
    }
  }, [profiles, launchData.iaCompany]);

  const handleAiSelect = (profileId: string) => {
    const id = parseInt(profileId, 10);
    if (id === 0) {
      setSelectedAi(null);
      setSelectedCourse(null);
      setIsVoiceEnabled(false);
      return;
    }
    const profile = profiles.find((p) => p.id === id);
    setSelectedAi(profile || null);
    setSelectedCourse(null);
  };

  const handleCourseSelect = (courseName: string) => {
    const course = TRAINING_COURSES.find((c) => c.iaTrainingName === courseName);
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
          iaTrainingCompany: selectedCourse?.iaTrainingName ? [selectedCourse] : [],
          iaAudioOn: isVoiceEnabled,
        }
      : {};

    updateStepData('iaCompany', aiConfig);
    goToNextStep();
  };

  const showCourseSelection = selectedAi && (
    selectedAi.iaType === 'IA_STAR_ACADEMY' || 
    selectedAi.iaType === 'OLYMPE_ACADEMY'
  );

  const aiOptions = useMemo(() => {
    return profiles.map((profile) => ({
      id: profile.id || 0,
      name: profile.iaName || '',
      type: profile.iaType,
      description: profile.shortBiography,
    }));
  }, [profiles]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {formatMessage({ id: 'ai.loading', defaultMessage: 'Loading AI assistants...' })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center gap-3 p-5 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-inner">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            {formatMessage({ id: 'aiTunnel.ai.step', defaultMessage: 'AI Assistant Configuration' })}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mt-2">
            {formatMessage({
              id: 'ai.perso.text',
              defaultMessage: 'Enhance your program with an AI assistant that can help guide and support your participants.',
            })}
          </p>
        </div>
      </div>

      {error && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Profile Selection */}
      <Card className="border-2 border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Bot className="h-5 w-5 text-cyan-600" />
            </div>
            {formatMessage({ id: 'aiTunnel.ai.choose', defaultMessage: 'Choose AI Assistant' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({
              id: 'aiTunnel.ai.chooseDesc',
              defaultMessage: 'Select an AI profile to personalize the experience for your participants.',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Select
            value={selectedAi ? String(selectedAi.id) : '0'}
            onValueChange={handleAiSelect}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue
                placeholder={formatMessage({
                  id: 'aiTunnel.ai.placeholder',
                  defaultMessage: 'Select an AI assistant',
                })}
              />
            </SelectTrigger>
            <SelectContent>
              {aiOptions.map((option) => (
                <SelectItem key={option.id} value={String(option.id)} className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.name}</span>
                    {option.type && (
                      <Badge variant="secondary" className="text-xs">
                        {option.type}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected AI Details */}
          {selectedAi && selectedAi.id !== 0 && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-2 border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">{selectedAi.iaName}</span>
                </div>
                {selectedAi.iaType && (
                  <Badge variant="default" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                    {selectedAi.iaType}
                  </Badge>
                )}
              </div>

              {selectedAi.shortBiography && (
                <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg">
                  {selectedAi.shortBiography}
                </p>
              )}

              {/* Voice Toggle */}
              <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
                <Checkbox
                  id="voice-enabled"
                  checked={isVoiceEnabled}
                  onCheckedChange={(checked) => setIsVoiceEnabled(checked as boolean)}
                  className="w-5 h-5"
                />
                <Label
                  htmlFor="voice-enabled"
                  className="flex items-center gap-2 cursor-pointer text-base"
                >
                  {isVoiceEnabled ? (
                    <Volume2 className="h-5 w-5 text-primary" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                  )}
                  {formatMessage({
                    id: 'aiTunnel.ai.enableVoice',
                    defaultMessage: 'Enable voice for this AI assistant',
                  })}
                </Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Course Selection */}
      {showCourseSelection && (
        <Card className="border-2 border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500/5 to-orange-500/5">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <GraduationCap className="h-5 w-5 text-amber-600" />
              </div>
              {formatMessage({
                id: 'aiTunnel.courses.title',
                defaultMessage: 'Training Course',
              })}
            </CardTitle>
            <CardDescription>
              {formatMessage({
                id: 'aiTunnel.courses.description',
                defaultMessage: 'Optionally select a training course for this AI assistant.',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Select
              value={selectedCourse?.iaTrainingName || ''}
              onValueChange={handleCourseSelect}
            >
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue
                  placeholder={formatMessage({
                    id: 'aiTunnel.courses.placeholder',
                    defaultMessage: 'Select a training course',
                  })}
                />
              </SelectTrigger>
              <SelectContent>
                {TRAINING_COURSES.map((course) => (
                  <SelectItem key={course.iaTrainingName} value={course.iaTrainingName || ''} className="py-3">
                    <div className="flex items-center gap-2">
                      <span>{course.iaTrainingName}</span>
                      {course.iaTrainingType && (
                        <Badge variant="outline" className="text-xs">
                          {course.iaTrainingType}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <Button onClick={handleNext} size="lg" className="gap-2 min-w-[200px] shadow-lg shadow-primary/20">
          {formatMessage({ id: 'form.submit.next', defaultMessage: 'Continue' })}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AISelectionStep;
