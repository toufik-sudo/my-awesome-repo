// -----------------------------------------------------------------------------
// LanguageSwitcher Atom Component
// Migrated from old_app/src/components/atoms/ui/LanguageSwitcher.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LANGUAGE_OPTIONS, type LanguageOption } from '@/constants/i18n';

interface LanguageSwitcherProps {
  selectedLanguage: LanguageOption | null;
  onLanguageChange: (language: LanguageOption) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  selectedLanguage,
  onLanguageChange,
  className,
  variant = 'default',
}) => {
  const handleValueChange = (value: string) => {
    const language = LANGUAGE_OPTIONS.find((opt) => opt.value === value);
    if (language) {
      onLanguageChange(language);
    }
  };

  return (
    <Select
      value={selectedLanguage?.value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        className={cn(
          variant === 'compact' ? 'w-20' : 'w-32',
          className
        )}
      >
        <SelectValue placeholder="Language">
          {variant === 'compact'
            ? selectedLanguage?.value?.toUpperCase()
            : selectedLanguage?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { LanguageSwitcher };
export default LanguageSwitcher;
