// -----------------------------------------------------------------------------
// Create Beneficiary Declaration Page
// Migrated from old_app/src/components/pages/wall/CreateBeneficiaryDeclarationPage.tsx
// Page for beneficiaries to submit new declarations
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, FileText, Upload, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWallSelection } from '@/hooks/wall';
import { declarationsApi } from '@/api/DeclarationsApi';
import { toast } from 'sonner';

const CreateBeneficiaryDeclarationPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const wallState = useWallSelection();
  const selectedProgramId = wallState.selectedProgramId;
  const selectedProgram = wallState.programs?.find(p => p.id === selectedProgramId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    value: '',
    unit: ''
  });
  const [proofFile, setProofFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  // If no program selected, show error
  if (!selectedProgramId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {formatMessage({ id: 'wall.userDeclarations.program.notSelected.title', defaultMessage: 'No Program Selected' })}
          </AlertTitle>
          <AlertDescription>
            {formatMessage({ id: 'wall.userDeclarations.program.notSelected', defaultMessage: 'Please select a program before creating a declaration.' })}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate('/wall')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {formatMessage({ id: 'common.backToWall', defaultMessage: 'Back to Wall' })}
          </Button>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error(formatMessage({ id: 'declaration.error.title', defaultMessage: 'Please enter a title' }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      await declarationsApi.createDeclaration({
        programId: selectedProgramId,
        data: {
          type: formData.type,
          title: formData.title,
          description: formData.description,
          value: formData.value ? parseFloat(formData.value) : undefined,
          unit: formData.unit
        },
        proofOfSale: proofFile || undefined
      });
      
      toast.success(formatMessage({ id: 'declaration.success', defaultMessage: 'Declaration submitted successfully' }));
      navigate('/wall');
    } catch (error) {
      console.error('Error submitting declaration:', error);
      toast.error(formatMessage({ id: 'toast.message.generic.error', defaultMessage: 'An error occurred' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {formatMessage({ id: 'declaration.create.title', defaultMessage: 'New Declaration' })}
          </h1>
          <p className="text-muted-foreground">
            {formatMessage({ id: 'declaration.create.subtitle', defaultMessage: 'Submit a new declaration for review' })}
          </p>
        </div>
      </div>

      {/* Program Info */}
      {selectedProgram && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>
            {formatMessage({ id: 'declaration.program', defaultMessage: 'Program' })}
          </AlertTitle>
          <AlertDescription>
            {selectedProgram.name || `Program #${selectedProgramId}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Declaration Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatMessage({ id: 'declaration.form.title', defaultMessage: 'Declaration Details' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'declaration.form.description', defaultMessage: 'Fill in the details of your declaration' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Declaration Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                {formatMessage({ id: 'declaration.type', defaultMessage: 'Declaration Type' })}
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder={formatMessage({ id: 'declaration.type.placeholder', defaultMessage: 'Select type' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">
                    {formatMessage({ id: 'declaration.type.sales', defaultMessage: 'Sales Declaration' })}
                  </SelectItem>
                  <SelectItem value="performance">
                    {formatMessage({ id: 'declaration.type.performance', defaultMessage: 'Performance Declaration' })}
                  </SelectItem>
                  <SelectItem value="activity">
                    {formatMessage({ id: 'declaration.type.activity', defaultMessage: 'Activity Declaration' })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                {formatMessage({ id: 'declaration.title', defaultMessage: 'Title' })}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={formatMessage({ id: 'declaration.title.placeholder', defaultMessage: 'Enter a title for your declaration' })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {formatMessage({ id: 'declaration.description', defaultMessage: 'Description' })}
              </Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={formatMessage({ id: 'declaration.description.placeholder', defaultMessage: 'Describe your achievement or activity...' })}
              />
            </div>

            {/* Value */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="value">
                  {formatMessage({ id: 'declaration.value', defaultMessage: 'Value' })}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">
                  {formatMessage({ id: 'declaration.unit', defaultMessage: 'Unit' })}
                </Label>
                <Select>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder={formatMessage({ id: 'declaration.unit.placeholder', defaultMessage: 'Select unit' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">€ (EUR)</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="percent">%</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>
                {formatMessage({ id: 'declaration.attachments', defaultMessage: 'Attachments' })}
              </Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {formatMessage({ id: 'declaration.upload.text', defaultMessage: 'Drag and drop files here, or click to browse' })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                {formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                {formatMessage({ id: 'declaration.submit', defaultMessage: 'Submit Declaration' })}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBeneficiaryDeclarationPage;
