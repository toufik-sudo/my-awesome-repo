// -----------------------------------------------------------------------------
// ResultsPreviewStep Component
// Preview how results will be collected and displayed
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Hash, DollarSign, Building, Tag, MessageSquare } from 'lucide-react';

interface ResultsPreviewStepProps {
  selectedFields: string[];
  declarationFormEnabled: boolean;
  fileImportEnabled: boolean;
}

const FIELD_ICONS: Record<string, React.ElementType> = {
  dateOfEvent: Calendar,
  quantity: Hash,
  amount: DollarSign,
  companyName: Building,
  customerReference: Tag,
  productReference: Tag,
  additionalComments: MessageSquare,
};

const FIELD_LABELS: Record<string, string> = {
  dateOfEvent: 'Date of Event',
  quantity: 'Quantity',
  amount: 'Amount',
  companyName: 'Company Name',
  customerReference: 'Customer Reference',
  productReference: 'Product Reference',
  additionalComments: 'Comments',
};

export const ResultsPreviewStep: React.FC<ResultsPreviewStepProps> = ({
  selectedFields,
  declarationFormEnabled,
  fileImportEnabled
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage id="launch.results.preview.title" defaultMessage="Results Preview" />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.results.preview.description" 
            defaultMessage="Preview how participants will submit their results" 
          />
        </p>
      </div>

      {/* Active Methods */}
      <div className="flex gap-2 justify-center">
        {declarationFormEnabled && (
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-3 w-3" />
            Declaration Form
          </Badge>
        )}
        {fileImportEnabled && (
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-3 w-3" />
            File Upload
          </Badge>
        )}
      </div>

      {/* Form Preview */}
      {declarationFormEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              <FormattedMessage id="launch.results.formPreview" defaultMessage="Declaration Form Preview" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage 
                id="launch.results.formPreviewDesc" 
                defaultMessage="This is how the form will appear to participants" 
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted/30 rounded-lg border-2 border-dashed space-y-4">
              <h3 className="font-semibold text-lg text-center mb-6">
                <FormattedMessage id="launch.results.submitResults" defaultMessage="Submit Your Results" />
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedFields.map((fieldId) => {
                  const Icon = FIELD_ICONS[fieldId] || FileText;
                  const label = FIELD_LABELS[fieldId] || fieldId;
                  
                  return (
                    <div key={fieldId} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {label}
                      </Label>
                      <Input 
                        placeholder={`Enter ${label.toLowerCase()}`}
                        disabled
                        className="bg-background"
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-4 text-center">
                <Button disabled>
                  <FormattedMessage id="launch.results.submit" defaultMessage="Submit Results" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Import Info */}
      {fileImportEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <FormattedMessage id="launch.results.fileImportPreview" defaultMessage="File Import" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted/30 rounded-lg border-2 border-dashed text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                <FormattedMessage 
                  id="launch.results.fileImportInfo" 
                  defaultMessage="Participants can upload CSV or Excel files with their results" 
                />
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedFields.map((fieldId) => (
                  <Badge key={fieldId} variant="outline">
                    {FIELD_LABELS[fieldId] || fieldId}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                <FormattedMessage 
                  id="launch.results.fileColumnsHint" 
                  defaultMessage="File must contain columns matching the fields above" 
                />
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsPreviewStep;
