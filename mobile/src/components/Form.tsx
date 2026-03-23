import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Input } from './Input';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing } from '@/constants/theme.constants';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  defaultValue?: any;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  style?: ViewStyle;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  onCancel,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  style,
}) => {
  const { theme } = useTheme();
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: FormField, value: any): string | null => {
    if (!field.validation) return null;

    if (field.validation.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation.minLength && value.length < field.validation.minLength) {
      return `Minimum ${field.validation.minLength} characters required`;
    }

    if (field.validation.maxLength && value.length > field.validation.maxLength) {
      return `Maximum ${field.validation.maxLength} characters allowed`;
    }

    if (field.validation.pattern && !field.validation.pattern.test(value)) {
      return `Invalid format`;
    }

    if (field.validation.custom) {
      const result = field.validation.custom(value);
      if (typeof result === 'string') return result;
      if (!result) return 'Validation failed';
    }

    return null;
  };

  const handleChange = (fieldName: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.form, style]}>
      {fields.map((field) => {
        if (field.type === 'select' && field.options) {
          return (
            <Dropdown
              key={field.name}
              label={field.label}
              options={field.options}
              value={values[field.name]}
              onSelect={(value) => handleChange(field.name, value)}
              placeholder={field.placeholder}
              error={errors[field.name]}
            />
          );
        }

        return (
          <Input
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            secureTextEntry={field.type === 'password'}
            keyboardType={
              field.type === 'email'
                ? 'email-address'
                : field.type === 'number'
                ? 'numeric'
                : 'default'
            }
            error={errors[field.name]}
            autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
          />
        );
      })}

      <View style={styles.buttons}>
        <Button
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          {submitButtonText}
        </Button>
        {onCancel && (
          <Button
            onPress={onCancel}
            variant="outline"
            disabled={isSubmitting}
            style={styles.cancelButton}
          >
            {cancelButtonText}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  buttons: {
    marginTop: spacing.md,
  },
  submitButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {},
});
