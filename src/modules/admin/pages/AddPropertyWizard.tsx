import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Camera,
  X,
  FileText,
  ShieldCheck,
  Home,
  Image as ImageIcon,
  Star,
  AlertCircle,
  Plus,
  Banknote,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import {
  calculateTrustStars,
  DOCUMENT_LABELS,
  IDENTITY_DOCUMENTS,
  PROPERTY_DOCUMENTS,
  DocumentType,
  VerificationDocument,
} from '@/types/verification.types';
import { PricingPaymentStep, PricingData, INITIAL_PRICING_DATA } from '@/modules/admin/components/PricingPaymentStep';
import { propertiesApi, type PropertyCreatePayload } from '@/modules/properties/properties.api';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
  { value: 'chalet', label: 'Chalet' },
  { value: 'riad', label: 'Riad' },
  { value: 'hotel', label: 'Hotel' },
];

const AMENITIES_LIST = [
  'wifi', 'parking', 'ac', 'pool', 'kitchen', 'washer', 'tv', 'security', 'garden', 'breakfast',
];

const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Béjaïa', 'Tizi Ouzou', 'Sétif',
  'Batna', 'Blida', 'Tipaza', 'Bouira', 'Ghardaïa', 'Tlemcen', 'Jijel',
  'Skikda', 'Mostaganem', 'Chlef', 'Médéa', 'El Tarf', 'Tamanrasset',
];

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  wilaya: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  instantBooking: boolean;
  minNights: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

const STEPS = [
  { id: 'details', label: 'Property Details', icon: Home },
  { id: 'pricing', label: 'Pricing & Payment', icon: Banknote },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'documents', label: 'Verification', icon: ShieldCheck },
];

export const AddPropertyWizard: React.FC = () => {
  const navigate = useNavigate();
  const { id: propertyId } = useParams<{ id: string }>();
  const isEditMode = !!propertyId;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const docCameraInputRef = useRef<HTMLInputElement>(null);
  const [activeDocType, setActiveDocType] = useState<DocumentType | null>(null);

  // Fetch existing property for edit mode
  const { data: existingProperty, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertiesApi.getById(propertyId!),
    enabled: isEditMode,
    retry: false,
  });

  // Step 1: Property details
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    address: '',
    city: '',
    wilaya: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    instantBooking: false,
    minNights: '1',
  });

  // Step 2: Pricing & Payment
  const [pricingData, setPricingData] = useState<PricingData>(INITIAL_PRICING_DATA);

  // Step 2: Photos
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Step 3: Documents
  const [documents, setDocuments] = useState<Record<DocumentType, UploadedFile[]>>({
    national_id: [],
    passport: [],
    permit: [],
    notarized_deed: [],
    land_registry: [],
    utility_bill: [],
    management_declaration: [],
  });

  // Populate form when editing
  useEffect(() => {
    if (existingProperty && isEditMode) {
      const p = existingProperty as any;
      setFormData({
        title: p.title || '',
        description: p.description || '',
        propertyType: p.propertyType || '',
        address: p.location?.address || p.address || '',
        city: p.location?.city || p.city || '',
        wilaya: p.wilaya || '',
        maxGuests: String(p.guests || p.maxGuests || ''),
        bedrooms: String(p.bedrooms || ''),
        bathrooms: String(p.bathrooms || ''),
        amenities: p.amenities || [],
        checkInTime: p.checkInTime || '14:00',
        checkOutTime: p.checkOutTime || '11:00',
        instantBooking: p.instantBooking || false,
        minNights: String(p.minNights || '1'),
      });
      setPricingData(prev => ({
        ...prev,
        pricePerNight: String(p.price || p.pricePerNight || ''),
        pricePerWeek: String(p.pricePerWeek || ''),
        pricePerMonth: String(p.pricePerMonth || ''),
        weeklyDiscount: String(p.weeklyDiscount || ''),
        monthlyDiscount: String(p.monthlyDiscount || ''),
        currency: p.currency || 'DZD',
        paymentMethods: p.acceptedPaymentMethods || [],
      }));
      if (p.images?.length) {
        setExistingImages(p.images);
      }
    }
  }, [existingProperty, isEditMode]);

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: (payload: PropertyCreatePayload) => propertiesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(t('propertyWizard.createSuccess', 'Property submitted successfully!'));
      navigate('/properties');
    },
    onError: () => toast.error(t('propertyWizard.createError', 'Failed to create property')),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<PropertyCreatePayload>) => propertiesApi.update(propertyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      toast.success(t('propertyWizard.updateSuccess', 'Property updated successfully!'));
      navigate(`/property/${propertyId}`);
    },
    onError: () => toast.error(t('propertyWizard.updateError', 'Failed to update property')),
  });

  const updateField = useCallback(<K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  // Photo handling
  const handlePhotoUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
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

  const removeExistingImage = useCallback((url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  }, []);

  // Document handling
  const handleDocUpload = useCallback((docType: DocumentType, files: FileList | null) => {
    if (!files) return;
    const newDocs = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setDocuments(prev => ({
      ...prev,
      [docType]: [...prev[docType], ...newDocs],
    }));
  }, []);

  const removeDoc = useCallback((docType: DocumentType, id: string) => {
    setDocuments(prev => {
      const doc = prev[docType].find(d => d.id === id);
      if (doc) URL.revokeObjectURL(doc.preview);
      return { ...prev, [docType]: prev[docType].filter(d => d.id !== id) };
    });
  }, []);

  // Verification state
  const hasIdentity = documents.national_id.length > 0 || documents.passport.length > 0 || documents.permit.length > 0;
  const hasNotarizedDeed = documents.notarized_deed.length > 0;
  const hasLandRegistry = documents.land_registry.length > 0;
  const hasUtilityBill = documents.utility_bill.length > 0;
  const trustStars = calculateTrustStars({ hasIdentity, hasNotarizedDeed, hasLandRegistry, hasUtilityBill });

  // Validation
  const isStep1Valid = formData.title && formData.description && formData.propertyType && 
    formData.address && formData.city && formData.wilaya && 
    formData.maxGuests && formData.bedrooms && formData.bathrooms;
  const isStep2Valid = !!pricingData.pricePerNight && pricingData.paymentMethods.length > 0;
  const isStep3Valid = photos.length >= 1 || existingImages.length >= 1;
  const isStep4Valid = true; // Documents are optional but affect ranking

  const stepValid = [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const buildPayload = useCallback((): PropertyCreatePayload => ({
    title: formData.title,
    description: formData.description,
    propertyType: formData.propertyType,
    address: formData.address,
    city: formData.city,
    wilaya: formData.wilaya,
    maxGuests: parseInt(formData.maxGuests) || 1,
    bedrooms: parseInt(formData.bedrooms) || 0,
    bathrooms: parseInt(formData.bathrooms) || 0,
    amenities: formData.amenities,
    checkInTime: formData.checkInTime,
    checkOutTime: formData.checkOutTime,
    instantBooking: formData.instantBooking,
    minNights: parseInt(formData.minNights) || 1,
    pricePerNight: parseFloat(pricingData.pricePerNight) || 0,
    pricePerWeek: parseFloat(pricingData.pricePerWeek) || undefined,
    pricePerMonth: parseFloat(pricingData.pricePerMonth) || undefined,
    weeklyDiscount: parseFloat(pricingData.weeklyDiscount) || undefined,
    monthlyDiscount: parseFloat(pricingData.monthlyDiscount) || undefined,
    customDiscount: parseFloat(pricingData.customDiscount) || undefined,
    customDiscountMinNights: parseInt(pricingData.customDiscountMinNights) || undefined,
    currency: pricingData.currency,
    acceptedPaymentMethods: pricingData.paymentMethods,
    serviceFeePercent: pricingData.serviceFeePercent,
    images: existingImages, // New photo uploads would need a file upload API
    status: 'draft',
  }), [formData, pricingData, existingImages]);

  const confirmSubmit = () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    const payload = buildPayload();
    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const openDocUpload = (docType: DocumentType) => {
    setActiveDocType(docType);
    docFileInputRef.current?.click();
  };

  const openDocCamera = (docType: DocumentType) => {
    setActiveDocType(docType);
    docCameraInputRef.current?.click();
  };

  if (isEditMode && isLoadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-heading font-bold text-foreground">
              {isEditMode ? t('propertyWizard.editTitle', 'Edit Property') : t('propertyWizard.addTitle', 'Add New Property')}
            </h1>
          </div>
          <Badge variant="outline" className="text-xs">
            {t('propertyWizard.stepOf', 'Step {{current}} of {{total}}', { current: currentStep + 1, total: STEPS.length })}
          </Badge>
        </div>
      </header>

      {/* Stepper */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <React.Fragment key={step.id}>
                {i > 0 && (
                  <div className={cn('h-0.5 w-12 sm:w-20 rounded-full', isDone ? 'bg-primary' : 'bg-border')} />
                )}
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

        <div className="max-w-3xl mx-auto">
          {/* Step 1: Property Details */}
          {currentStep === 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-foreground">Property Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Beautiful Villa with Sea View"
                    maxLength={255}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-foreground">Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe your property..."
                    rows={4}
                    maxLength={2000}
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label className="text-foreground">Property Type *</Label>
                  <Select value={formData.propertyType} onValueChange={(v) => updateField('propertyType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {PROPERTY_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Location</h3>
                  <div className="space-y-2">
                    <Label className="text-foreground">Address *</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Street address"
                      maxLength={500}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">City *</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="City"
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Wilaya *</Label>
                      <Select value={formData.wilaya} onValueChange={(v) => updateField('wilaya', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wilaya" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-50">
                          {WILAYAS.map(w => (
                            <SelectItem key={w} value={w}>{w}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Capacity */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Capacity</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Guests *</Label>
                      <Input
                        type="number"
                        value={formData.maxGuests}
                        onChange={(e) => updateField('maxGuests', e.target.value)}
                        min={1} max={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Bedrooms *</Label>
                      <Input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => updateField('bedrooms', e.target.value)}
                        min={0} max={20}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Bathrooms *</Label>
                      <Input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => updateField('bathrooms', e.target.value)}
                        min={0} max={20}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AMENITIES_LIST.map(amenity => (
                      <div key={amenity} className="flex items-center gap-2">
                        <Checkbox
                          id={`add-amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={`add-amenity-${amenity}`} className="text-sm cursor-pointer capitalize">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Booking settings */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Check-in</Label>
                    <Input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => updateField('checkInTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Check-out</Label>
                    <Input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => updateField('checkOutTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Min Nights</Label>
                    <Input
                      type="number"
                      value={formData.minNights}
                      onChange={(e) => updateField('minNights', e.target.value)}
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="instant-booking"
                    checked={formData.instantBooking}
                    onCheckedChange={(checked) => updateField('instantBooking', !!checked)}
                  />
                  <Label htmlFor="instant-booking" className="text-sm cursor-pointer">
                    Enable instant booking
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Pricing & Payment */}
          {currentStep === 1 && (
            <PricingPaymentStep
              data={pricingData}
              onChange={setPricingData}
            />
          )}

          {/* Step 3: Photos */}
          {currentStep === 2 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Property Photos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload at least 1 photo. The first photo will be your cover image.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" /> Upload Photos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Camera className="h-4 w-4" /> Take Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                  />
                </div>

                {/* Existing images (edit mode) */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">{t('propertyWizard.existingPhotos', 'Existing Photos')}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {existingImages.map((url, index) => (
                        <div key={url} className="relative group rounded-lg overflow-hidden border border-border aspect-[4/3]">
                          <img src={url} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                          {index === 0 && photos.length === 0 && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">Cover</Badge>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeExistingImage(url)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New uploads */}
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-border aspect-[4/3]">
                        <img src={photo.preview} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && existingImages.length === 0 && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">Cover</Badge>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : existingImages.length === 0 ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t('propertyWizard.noPhotos', 'No photos yet. Upload or take photos of your property.')}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Documents & Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Trust Stars Preview */}
              <Card className="border-border bg-gradient-to-br from-card to-muted/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-heading font-bold text-foreground">Trust Score Preview</h3>
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          className={cn(
                            'h-7 w-7 transition-colors',
                            i <= trustStars ? 'fill-accent text-accent' : 'text-border'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trustStars === 0 && 'No identity provided — property will be marked as "Not Checked"'}
                      {trustStars === 1 && 'Identity verified — 1 trust star'}
                      {trustStars === 2 && 'Identity + utility bill — 2 trust stars'}
                      {trustStars === 3 && 'Identity + property deed — 3 trust stars'}
                      {trustStars === 5 && 'Fully verified — 5 trust stars! Maximum trust.'}
                    </p>
                    {!hasIdentity && (
                      <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Identity document is mandatory for trust stars</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Identity Documents */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Identity Verification
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload your ID card, passport, or residence permit. <span className="text-destructive font-medium">Required for trust stars.</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {IDENTITY_DOCUMENTS.map(docType => (
                    <DocumentUploadSection
                      key={docType}
                      docType={docType}
                      files={documents[docType]}
                      onUpload={(files) => handleDocUpload(docType, files)}
                      onRemove={(id) => removeDoc(docType, id)}
                      onOpenUpload={() => openDocUpload(docType)}
                      onOpenCamera={() => openDocCamera(docType)}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Property Documents */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Property Documents
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add property ownership or utility documents to increase your trust score.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {PROPERTY_DOCUMENTS.map(docType => (
                    <DocumentUploadSection
                      key={docType}
                      docType={docType}
                      files={documents[docType]}
                      onUpload={(files) => handleDocUpload(docType, files)}
                      onRemove={(id) => removeDoc(docType, id)}
                      onOpenUpload={() => openDocUpload(docType)}
                      onOpenCamera={() => openDocCamera(docType)}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Hidden file inputs for documents */}
              <input
                ref={docFileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (activeDocType) handleDocUpload(activeDocType, e.target.files);
                  if (e.target) e.target.value = '';
                }}
              />
              <input
                ref={docCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (activeDocType) handleDocUpload(activeDocType, e.target.files);
                  if (e.target) e.target.value = '';
                }}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pb-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!stepValid[currentStep]}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-4 w-4" />
                {isSubmitting
                  ? t('propertyWizard.submitting', 'Submitting...')
                  : isEditMode
                    ? t('propertyWizard.updateProperty', 'Update Property')
                    : t('propertyWizard.submitProperty', 'Submit Property')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {isEditMode ? t('propertyWizard.confirmUpdate', 'Update Property?') : t('propertyWizard.confirmSubmit', 'Submit Property?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode
                ? t('propertyWizard.confirmUpdateDesc', 'Your changes will be saved.')
                : t('propertyWizard.confirmSubmitDesc', 'Your property will be submitted for review.')}
              {trustStars > 0 ? (
                <span className="block mt-2">
                  {t('propertyWizard.trustScore', 'Trust score: {{stars}} star(s) — your property will be ranked higher.', { stars: trustStars })}
                </span>
              ) : (
                <span className="block mt-2 text-destructive">
                  {t('propertyWizard.noTrust', 'No identity document provided. Your property will be marked as "Not Checked".')}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? t('propertyWizard.submitting', 'Submitting...') : t('common.confirm', 'Confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Document upload section component
interface DocumentUploadSectionProps {
  docType: DocumentType;
  files: UploadedFile[];
  onUpload: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  onOpenUpload: () => void;
  onOpenCamera: () => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  docType,
  files,
  onRemove,
  onOpenUpload,
  onOpenCamera,
}) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{DOCUMENT_LABELS[docType]}</span>
        </div>
        {files.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {files.length} file{files.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map(file => (
            <div key={file.id} className="relative group w-16 h-16 rounded-md overflow-hidden border border-border">
              <img src={file.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(file.id)}
                className="absolute inset-0 bg-destructive/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="h-4 w-4 text-destructive-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onOpenUpload} className="gap-1.5 text-xs">
          <Upload className="h-3 w-3" /> Upload
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenCamera} className="gap-1.5 text-xs">
          <Camera className="h-3 w-3" /> Camera
        </Button>
      </div>
    </div>
  );
};

export default AddPropertyWizard;
