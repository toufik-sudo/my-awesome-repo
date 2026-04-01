import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServiceDetail } from '@/modules/services/services.hooks';
import { tourismServicesApi } from '@/modules/services/services.api';
import { SERVICE_CATEGORIES, CATEGORY_ICONS } from '@/modules/services/services.constants';
import {
  ArrowLeft, ArrowRight, Check, Upload, Camera, X, Plus,
  FileText, Clock, Image as ImageIcon, Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';

// ─── Types ──────────────────────────────────────────────────────────────────
interface ServiceFormData {
  titleFr: string;
  titleEn: string;
  titleAr: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  city: string;
  wilaya: string;
  address: string;
  minParticipants: string;
  maxParticipants: string;
  duration: string;
  durationUnit: string;
  languages: string[];
  tags: string[];
  minAge: string;
  cancellationPolicy: string;
  instantBooking: boolean;
}

interface PricingData {
  price: string;
  currency: string;
  pricingType: string;
  priceChild: string;
  groupDiscount: string;
}

interface ScheduleData {
  days: string[];
  startTime: string;
  endTime: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'info', label: 'Basic Info', icon: FileText },
  { id: 'pricing', label: 'Pricing', icon: Banknote },
  { id: 'schedule', label: 'Schedule', icon: Clock },
  { id: 'media', label: 'Media', icon: ImageIcon },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Béjaïa', 'Tizi Ouzou', 'Sétif',
  'Batna', 'Blida', 'Tipaza', 'Bouira', 'Ghardaïa', 'Tlemcen', 'Jijel',
  'Skikda', 'Mostaganem', 'Chlef', 'Médéa', 'El Tarf', 'Tamanrasset',
];
const LANGUAGES = ['fr', 'en', 'ar', 'de', 'es', 'it', 'zh', 'ja'];

const STORAGE_KEY = 'service_wizard_draft';

interface WizardDraft {
  formData: ServiceFormData;
  pricingData: PricingData;
  scheduleData: ScheduleData;
  includesFr: string;
  requirementsFr: string;
  currentStep: number;
  existingImages: string[];
}

const loadDraft = (): WizardDraft | null => {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const saveDraft = (draft: WizardDraft) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch {}
};
const clearDraft = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
};

// ─── Component ──────────────────────────────────────────────────────────────
export const AddServiceWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateFromId = searchParams.get('duplicateFrom');
  const isDuplicateMode = !!duplicateFromId;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const draft = useMemo(() => !isDuplicateMode ? loadDraft() : null, []);

  const { data: sourceService, isLoading: isLoadingSource } = useServiceDetail(duplicateFromId || '');

  const [currentStep, setCurrentStep] = useState(draft?.currentStep || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ServiceFormData>(draft?.formData || {
    titleFr: '', titleEn: '', titleAr: '',
    descriptionFr: '', descriptionEn: '', descriptionAr: '',
    category: '', city: '', wilaya: '', address: '',
    minParticipants: '1', maxParticipants: '20',
    duration: '', durationUnit: 'hours',
    languages: ['fr'], tags: [],
    minAge: '0', cancellationPolicy: 'flexible', instantBooking: false,
  });

  const [pricingData, setPricingData] = useState<PricingData>(draft?.pricingData || {
    price: '', currency: 'DZD', pricingType: 'per_person',
    priceChild: '', groupDiscount: '',
  });

  const [scheduleData, setScheduleData] = useState<ScheduleData>(draft?.scheduleData || {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    startTime: '09:00', endTime: '17:00',
  });

  const [includesFr, setIncludesFr] = useState(draft?.includesFr || '');
  const [requirementsFr, setRequirementsFr] = useState(draft?.requirementsFr || '');
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(draft?.existingImages || []);
  const [tagInput, setTagInput] = useState('');

  // Populate from duplicate source
  useEffect(() => {
    if (sourceService && isDuplicateMode) {
      const s = sourceService as any;
      setFormData({
        titleFr: `${s.title?.fr || ''} (Copy)`, titleEn: s.title?.en || '', titleAr: s.title?.ar || '',
        descriptionFr: s.description?.fr || '', descriptionEn: s.description?.en || '', descriptionAr: s.description?.ar || '',
        category: s.category || '', city: s.city || '', wilaya: s.wilaya || '', address: s.address || '',
        minParticipants: String(s.minParticipants || 1), maxParticipants: String(s.maxParticipants || 20),
        duration: String(s.duration || ''), durationUnit: s.durationUnit || 'hours',
        languages: s.languages || ['fr'], tags: s.tags || [],
        minAge: String(s.minAge || 0), cancellationPolicy: s.cancellationPolicy || 'flexible',
        instantBooking: s.instantBooking || false,
      });
      setPricingData({
        price: String(s.price || ''), currency: s.currency || 'DZD', pricingType: s.pricingType || 'per_person',
        priceChild: String(s.priceChild || ''), groupDiscount: String(s.groupDiscount || ''),
      });
      if (s.schedule) {
        setScheduleData({ days: s.schedule.days || DAYS, startTime: s.schedule.startTime || '09:00', endTime: s.schedule.endTime || '17:00' });
      }
      if (s.images?.length) setExistingImages(s.images);
    }
  }, [sourceService, isDuplicateMode]);

  // Auto-save draft
  useEffect(() => {
    if (isDuplicateMode) return;
    const timeout = setTimeout(() => {
      saveDraft({ formData, pricingData, scheduleData, includesFr, requirementsFr, currentStep, existingImages });
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData, pricingData, scheduleData, includesFr, requirementsFr, currentStep, existingImages, isDuplicateMode]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => tourismServicesApi.create(payload),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['tourism-services'] });
      toast.success('Service created successfully!');
      navigate('/services');
    },
    onError: () => toast.error('Failed to create service'),
  });

  const updateField = useCallback(<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePhotoUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).map(file => ({
      id: crypto.randomUUID(), file, preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateField('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Validation
  const isStep1Valid = !!formData.titleFr && !!formData.category && !!formData.city && !!formData.wilaya;
  const isStep2Valid = !!pricingData.price;
  const isStep3Valid = scheduleData.days.length > 0;
  const isStep4Valid = photos.length >= 1 || existingImages.length >= 1;
  const stepValid = [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid];

  const buildPayload = useCallback(() => ({
    title: { fr: formData.titleFr, en: formData.titleEn, ar: formData.titleAr },
    description: { fr: formData.descriptionFr, en: formData.descriptionEn, ar: formData.descriptionAr },
    category: formData.category,
    city: formData.city,
    wilaya: formData.wilaya,
    address: formData.address,
    country: 'Algeria',
    minParticipants: parseInt(formData.minParticipants) || 1,
    maxParticipants: parseInt(formData.maxParticipants) || 20,
    duration: parseInt(formData.duration) || null,
    durationUnit: formData.durationUnit,
    languages: formData.languages,
    tags: formData.tags,
    minAge: parseInt(formData.minAge) || 0,
    cancellationPolicy: formData.cancellationPolicy,
    instantBooking: formData.instantBooking,
    price: parseFloat(pricingData.price) || 0,
    currency: pricingData.currency,
    pricingType: pricingData.pricingType,
    priceChild: parseFloat(pricingData.priceChild) || null,
    groupDiscount: parseFloat(pricingData.groupDiscount) || null,
    schedule: { days: scheduleData.days, startTime: scheduleData.startTime, endTime: scheduleData.endTime },
    includes: { fr: includesFr.split('\n').filter(Boolean) },
    requirements: { fr: requirementsFr.split('\n').filter(Boolean) },
    images: existingImages,
    status: 'draft',
  }), [formData, pricingData, scheduleData, includesFr, requirementsFr, existingImages]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    createMutation.mutate(buildPayload());
  };

  if (isDuplicateMode && isLoadingSource) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  }

  // ─── Render Steps ───────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Title (FR) *</Label><Input value={formData.titleFr} onChange={e => updateField('titleFr', e.target.value)} placeholder="Titre du service" /></div>
            <div><Label>Title (EN)</Label><Input value={formData.titleEn} onChange={e => updateField('titleEn', e.target.value)} placeholder="Service title" /></div>
            <div><Label>Title (AR)</Label><Input value={formData.titleAr} onChange={e => updateField('titleAr', e.target.value)} placeholder="عنوان الخدمة" dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Description (FR)</Label><Textarea value={formData.descriptionFr} onChange={e => updateField('descriptionFr', e.target.value)} rows={4} /></div>
            <div><Label>Description (EN)</Label><Textarea value={formData.descriptionEn} onChange={e => updateField('descriptionEn', e.target.value)} rows={4} /></div>
            <div><Label>Description (AR)</Label><Textarea value={formData.descriptionAr} onChange={e => updateField('descriptionAr', e.target.value)} rows={4} dir="rtl" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={v => updateField('category', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cancellation Policy</Label>
              <Select value={formData.cancellationPolicy} onValueChange={v => updateField('cancellationPolicy', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Location</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Wilaya *</Label>
              <Select value={formData.wilaya} onValueChange={v => updateField('wilaya', v)}>
                <SelectTrigger><SelectValue placeholder="Select wilaya" /></SelectTrigger>
                <SelectContent>{WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>City *</Label><Input value={formData.city} onChange={e => updateField('city', e.target.value)} /></div>
            <div><Label>Address</Label><Input value={formData.address} onChange={e => updateField('address', e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><Label>Min Participants</Label><Input type="number" value={formData.minParticipants} onChange={e => updateField('minParticipants', e.target.value)} /></div>
            <div><Label>Max Participants</Label><Input type="number" value={formData.maxParticipants} onChange={e => updateField('maxParticipants', e.target.value)} /></div>
            <div><Label>Duration</Label><Input type="number" value={formData.duration} onChange={e => updateField('duration', e.target.value)} /></div>
            <div>
              <Label>Duration Unit</Label>
              <Select value={formData.durationUnit} onValueChange={v => updateField('durationUnit', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Min Age</Label><Input type="number" value={formData.minAge} onChange={e => updateField('minAge', e.target.value)} /></div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox checked={formData.instantBooking} onCheckedChange={v => updateField('instantBooking', !!v)} id="instant" />
              <Label htmlFor="instant">Instant Booking</Label>
            </div>
          </div>
          <div>
            <Label>Languages</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {LANGUAGES.map(l => (
                <Badge
                  key={l}
                  variant={formData.languages.includes(l) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => updateField('languages', formData.languages.includes(l) ? formData.languages.filter(x => x !== l) : [...formData.languages, l])}
                >
                  {l.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." />
              <Button type="button" variant="outline" size="icon" onClick={addTag}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => updateField('tags', formData.tags.filter(t => t !== tag))} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <Card><CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>Price *</Label><Input type="number" value={pricingData.price} onChange={e => setPricingData(p => ({ ...p, price: e.target.value }))} /></div>
          <div>
            <Label>Currency</Label>
            <Select value={pricingData.currency} onValueChange={v => setPricingData(p => ({ ...p, currency: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DZD">DZD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pricing Type</Label>
            <Select value={pricingData.pricingType} onValueChange={v => setPricingData(p => ({ ...p, pricingType: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="per_person">Per Person</SelectItem>
                <SelectItem value="per_group">Per Group</SelectItem>
                <SelectItem value="per_hour">Per Hour</SelectItem>
                <SelectItem value="fixed">Fixed Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Child Price</Label><Input type="number" value={pricingData.priceChild} onChange={e => setPricingData(p => ({ ...p, priceChild: e.target.value }))} /></div>
          <div><Label>Group Discount (%)</Label><Input type="number" value={pricingData.groupDiscount} onChange={e => setPricingData(p => ({ ...p, groupDiscount: e.target.value }))} /></div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Operating Days</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DAYS.map(day => (
                <Badge
                  key={day}
                  variant={scheduleData.days.includes(day) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setScheduleData(s => ({
                    ...s,
                    days: s.days.includes(day) ? s.days.filter(d => d !== day) : [...s.days, day],
                  }))}
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Time</Label><Input type="time" value={scheduleData.startTime} onChange={e => setScheduleData(s => ({ ...s, startTime: e.target.value }))} /></div>
            <div><Label>End Time</Label><Input type="time" value={scheduleData.endTime} onChange={e => setScheduleData(s => ({ ...s, endTime: e.target.value }))} /></div>
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>What's Included</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={includesFr} onChange={e => setIncludesFr(e.target.value)} placeholder="One item per line..." rows={4} />
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={requirementsFr} onChange={e => setRequirementsFr(e.target.value)} placeholder="One requirement per line..." rows={4} />
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <Card><CardHeader><CardTitle>Photos & Media</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handlePhotoUpload(e.target.files)} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload Photos
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {existingImages.map((url, i) => (
            <div key={`existing-${i}`} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setExistingImages(prev => prev.filter(img => img !== url))}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.map(photo => (
            <div key={photo.id} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img src={photo.preview} alt="Upload" className="w-full h-full object-cover" />
              <button
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(photo.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {photos.length === 0 && existingImages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Upload at least 1 photo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">
              {isDuplicateMode ? 'Duplicate Service' : 'Add New Service'}
            </h1>
          </div>
          <Badge variant="outline" className="text-xs">
            Step {currentStep + 1} of {STEPS.length}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <React.Fragment key={step.id}>
                {i > 0 && <div className={cn('h-0.5 w-12 sm:w-20 rounded-full', isDone ? 'bg-primary' : 'bg-border')} />}
                <button
                  onClick={() => i <= currentStep && setCurrentStep(i)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive && 'bg-primary text-primary-foreground',
                    isDone && 'bg-primary/10 text-primary',
                    !isActive && !isDone && 'text-muted-foreground'
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        {stepRenderers[currentStep]()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pb-8">
          <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={() => setCurrentStep(s => s + 1)} disabled={!stepValid[currentStep]}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !stepValid.every(Boolean)}>
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddServiceWizard;
