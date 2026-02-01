// -----------------------------------------------------------------------------
// AI Personalization Form Component
// Migrated from old_app/src/components/pages/programs/ia/AiPersonnalisationComponent.tsx
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Plus } from 'lucide-react';
import aiPersoApi from '@/api/AiPersoApi';
import type { IAiPersoProfile } from '../types';
import { AI_TYPES } from '../types';

interface AiPersonalizationFormProps {
  userUuid: string;
  profiles: IAiPersoProfile[];
  onProfileSaved: () => void;
}

const INITIAL_FORM_DATA: IAiPersoProfile = {
  id: undefined,
  iaType: undefined,
  iaName: '',
  iaProjectId: '',
  tone: '',
  theValues: '',
  favoriteDishes: '',
  rhythm: '',
  favoriteColor: '',
  socialActivities: '',
  favoriteMusicStyle: '',
  favoriteSport: '',
  sportsTeam: '',
  petName: '',
  entertainmentPreferences: '',
  topThreeFavoriteBooks: '',
  favoriteDestination: '',
  shortBiography: '',
  introductions: '',
  universe: '',
  expressions: '',
};

const FORM_FIELDS = [
  { name: 'iaName', label: 'IA Name', type: 'text', required: true },
  { name: 'tone', label: 'Tone', type: 'text' },
  { name: 'expressions', label: 'Expressions', type: 'textarea' },
  { name: 'theValues', label: 'Values', type: 'textarea' },
  { name: 'rhythm', label: 'Rhythm', type: 'text' },
  { name: 'favoriteColor', label: 'Favorite Color', type: 'text' },
  { name: 'favoriteDishes', label: 'Favorite Dishes', type: 'textarea' },
  { name: 'socialActivities', label: 'Social Activities', type: 'textarea' },
  { name: 'favoriteMusicStyle', label: 'Favorite Music Style', type: 'text' },
  { name: 'favoriteSport', label: 'Favorite Sport', type: 'text' },
  { name: 'sportsTeam', label: 'Sports Team', type: 'text' },
  { name: 'entertainmentPreferences', label: 'Entertainment Preferences', type: 'textarea' },
  { name: 'topThreeFavoriteBooks', label: 'Top 3 Favorite Books', type: 'textarea' },
  { name: 'petName', label: 'Pet Name', type: 'text' },
  { name: 'favoriteDestination', label: 'Favorite Destination', type: 'text' },
  { name: 'shortBiography', label: 'Short Biography', type: 'textarea' },
  { name: 'introductions', label: 'Introductions', type: 'textarea' },
  { name: 'universe', label: 'Universe', type: 'text' },
];

export const AiPersonalizationForm: React.FC<AiPersonalizationFormProps> = ({
  userUuid,
  profiles,
  onProfileSaved,
}) => {
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState<IAiPersoProfile>(INITIAL_FORM_DATA);
  const [selectedProfile, setSelectedProfile] = useState<IAiPersoProfile | null>(null);
  const [selectedAiType, setSelectedAiType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    if (profileId === 'new') {
      setFormData(INITIAL_FORM_DATA);
      setSelectedProfile(null);
      setSelectedAiType(null);
      return;
    }
    
    const profile = profiles.find(p => String(p.id) === profileId);
    if (profile) {
      setFormData({ ...INITIAL_FORM_DATA, ...profile });
      setSelectedProfile(profile);
      setSelectedAiType(profile.iaType || null);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = async () => {
    if (!formData.iaName?.trim()) {
      toast.error(formatMessage({ id: 'ai.perso.error.nameRequired' }, { defaultMessage: 'IA Name is required' }));
      return;
    }

    setIsSubmitting(true);
    try {
      const iaName = formData.iaName?.trim();
      if (!iaName) {
        toast.error(formatMessage({ id: 'ai.perso.error.nameRequired' }, { defaultMessage: 'IA Name is required' }));
        setIsSubmitting(false);
        return;
      }
      
      await aiPersoApi.setOrUpdateIaPersoCompany({
        iaName, // Required field
        iaId: formData.id,
        iaType: selectedAiType || undefined,
        iaProjectId: formData.iaProjectId,
        isIaPersoUpdate: !!selectedProfile,
        userUuid,
        tone: formData.tone,
        theValues: formData.theValues,
        favoriteDishes: formData.favoriteDishes,
        rhythm: formData.rhythm,
        favoriteColor: formData.favoriteColor,
        socialActivities: formData.socialActivities,
        favoriteMusicStyle: formData.favoriteMusicStyle,
        favoriteSport: formData.favoriteSport,
        sportsTeam: formData.sportsTeam,
        petName: formData.petName,
        entertainmentPreferences: formData.entertainmentPreferences,
        topThreeFavoriteBooks: formData.topThreeFavoriteBooks,
        favoriteDestination: formData.favoriteDestination,
        shortBiography: formData.shortBiography,
        introductions: formData.introductions,
        universe: formData.universe,
        expressions: formData.expressions,
      });

      toast.success(formatMessage(
        { id: selectedProfile ? 'ai.perso.success.update' : 'ai.perso.success.create' },
        { defaultMessage: selectedProfile ? 'AI profile updated' : 'AI profile created' }
      ));
      
      setFormData(INITIAL_FORM_DATA);
      setSelectedProfile(null);
      setSelectedAiType(null);
      onProfileSaved();
    } catch (error) {
      console.error('Failed to save AI profile:', error);
      toast.error(formatMessage({ id: 'ai.perso.error.save' }, { defaultMessage: 'Failed to save AI profile' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!selectedProfile;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {formatMessage({ id: 'ai.perso.title' }, { defaultMessage: 'AI Personalization' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{formatMessage({ id: 'ai.perso.selectProfile' }, { defaultMessage: 'Select AI Profile' })}</Label>
            <Select 
              value={selectedProfile ? String(selectedProfile.id) : 'new'}
              onValueChange={handleProfileSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder={formatMessage({ id: 'ai.perso.placeholder' }, { defaultMessage: 'Select or create new' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {formatMessage({ id: 'ai.perso.createNew' }, { defaultMessage: 'Create New Profile' })}
                  </span>
                </SelectItem>
                {profiles.map(profile => (
                  <SelectItem key={profile.id} value={String(profile.id)}>
                    {profile.iaName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{formatMessage({ id: 'ai.perso.aiType' }, { defaultMessage: 'AI Type' })}</Label>
            <Select 
              value={selectedAiType || ''} 
              onValueChange={setSelectedAiType}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder={formatMessage({ id: 'ai.perso.selectType' }, { defaultMessage: 'Select AI Type' })} />
              </SelectTrigger>
              <SelectContent>
                {AI_TYPES.map(type => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project ID */}
        <div className="space-y-2">
          <Label>{formatMessage({ id: 'ai.perso.projectId' }, { defaultMessage: 'Voiceflow Project ID' })}</Label>
          <Input
            value={formData.iaProjectId || ''}
            onChange={(e) => handleInputChange('iaProjectId', e.target.value)}
            disabled={isEditing}
            placeholder="e.g., 661d402894e1d3ea286a918e"
          />
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORM_FIELDS.map(field => (
            <div key={field.name} className="space-y-2">
              <Label>
                {formatMessage({ id: `ai.perso.${field.name}` }, { defaultMessage: field.label })}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={(formData as any)[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={field.name === 'iaName' && isEditing}
                  rows={3}
                />
              ) : (
                <Input
                  value={(formData as any)[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={field.name === 'iaName' && isEditing}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing 
              ? formatMessage({ id: 'ai.perso.update' }, { defaultMessage: 'Update Profile' })
              : formatMessage({ id: 'ai.perso.create' }, { defaultMessage: 'Create Profile' })
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiPersonalizationForm;
