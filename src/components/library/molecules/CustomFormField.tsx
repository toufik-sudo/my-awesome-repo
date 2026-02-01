// -----------------------------------------------------------------------------
// CustomFormField Molecule Component
// Migrated from old_app/src/components/molecules/forms/fields/CustomFormField.tsx
// Simplified version using shadcn form components
// -----------------------------------------------------------------------------

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FormattedMessage } from 'react-intl';
import { INPUT_TYPE } from '@/constants/forms';
import type { IFormField } from '@/types/forms/IForm';
import type { FormikProps } from 'formik';

export interface CustomFormFieldProps {
  form: FormikProps<Record<string, unknown>>;
  field: IFormField;
  name?: string;
  measurementName?: string | null;
  setMeasurementName?: ((name: string) => void) | null;
}

const CustomFormField: React.FC<CustomFormFieldProps> = ({
  form,
  field,
  name = '',
  measurementName = null,
}) => {
  const { label, type, options = [], constraints } = field;
  const fieldName = name || label;
  const fieldValue = form.values[fieldName];
  const fieldError = form.errors[fieldName] as string | undefined;
  const isTouched = form.touched[fieldName];

  // Handle hidden fields based on measurement
  const isHidden = measurementName === 'action' && label === 'amount';
  if (isHidden) return null;

  // Check if required (handle different constraint types)
  const isRequired = constraints && 'required' in constraints ? constraints.required : false;

  const renderError = () => {
    if (!isTouched || !fieldError) return null;
    return (
      <p className="text-sm text-destructive mt-1">
        <FormattedMessage id={fieldError} defaultMessage={fieldError} />
      </p>
    );
  };

  const renderLabel = () => (
    <Label htmlFor={fieldName} className="text-sm font-medium">
      <FormattedMessage id={`form.field.${label}`} defaultMessage={label} />
      {isRequired && <span className="text-destructive ml-1">*</span>}
    </Label>
  );

  switch (type) {
    case INPUT_TYPE.CHECKBOX:
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={fieldName}
            checked={!!fieldValue}
            onCheckedChange={(checked) => form.setFieldValue(fieldName, checked)}
          />
          {renderLabel()}
          {renderError()}
        </div>
      );

    case INPUT_TYPE.DROPDOWN:
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Select
            value={String(fieldValue || '')}
            onValueChange={(value) => form.setFieldValue(fieldName, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, idx) => (
                <SelectItem key={`${option.value}-${idx}`} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError()}
        </div>
      );

    case INPUT_TYPE.RADIO:
      return (
        <div className="space-y-2">
          {renderLabel()}
          <RadioGroup
            value={String(fieldValue || '')}
            onValueChange={(value) => form.setFieldValue(fieldName, value)}
          >
            {options.map((option, idx) => (
              <div key={`${option.value}-${idx}`} className="flex items-center space-x-2">
                <RadioGroupItem value={String(option.value)} id={`${fieldName}-${option.value}`} />
                <Label htmlFor={`${fieldName}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {renderError()}
        </div>
      );

    case INPUT_TYPE.DATETIME:
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !fieldValue && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fieldValue ? format(new Date(fieldValue as string), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fieldValue ? new Date(fieldValue as string) : undefined}
                onSelect={(date) => form.setFieldValue(fieldName, date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {renderError()}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Input
            id={fieldName}
            type={type || 'text'}
            value={String(fieldValue || '')}
            onChange={(e) => form.setFieldValue(fieldName, e.target.value)}
            onBlur={() => form.setFieldTouched(fieldName, true)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={cn(fieldError && isTouched && 'border-destructive')}
          />
          {renderError()}
        </div>
      );
  }
};

export { CustomFormField };
export default CustomFormField;
