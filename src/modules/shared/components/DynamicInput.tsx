import React from 'react';
import { InputProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';
import { Input } from '@/components/ui/input';
import { MicrophoneInput } from '@/modules/shared/components/MicrophoneInput';

interface DynamicInputExtendedProps extends InputProps {
  enableSpeech?: boolean;
  speechLanguage?: string;
}

export const DynamicInput: React.FC<DynamicInputExtendedProps> = ({
  type = 'text',
  placeholder,
  value,
  name,
  required,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  onChange,
  enableSpeech = true,
  speechLanguage,
  ...baseProps
}) => {
  const { style, className } = buildComponentStyles(
    baseProps,
    'transition-base'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !baseProps.disabled) {
      onChange(e.target.value);
    }
  };

  const handleTranscript = (transcript: string) => {
    if (onChange && !baseProps.disabled) {
      const newValue = value ? `${value} ${transcript}` : transcript;
      onChange(newValue);
    }
  };

  if (baseProps.hidden) return null;

  const isTextType = type === 'text' || type === 'email' || type === 'url' || type === 'tel';
  const showMic = enableSpeech && isTextType && !baseProps.disabled;

  return (
    <div className="relative flex items-center">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        autoComplete={autoComplete}
        onChange={handleChange}
        disabled={baseProps.disabled}
        className={showMic ? `${className || ''} pr-9` : className}
        style={style}
      />
      {showMic && (
        <div className="absolute right-1">
          <MicrophoneInput
            onTranscript={handleTranscript}
            language={speechLanguage}
            disabled={baseProps.disabled}
          />
        </div>
      )}
    </div>
  );
};
