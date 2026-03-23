import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Check } from 'lucide-react';
import { useUserLanguage } from '@/hooks/useUserLanguage';
import { cn } from '@/lib/utils';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

const defaultLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface DynamicLanguageSwitcherProps {
  languages?: LanguageOption[];
  showFlag?: boolean;
  showLabel?: boolean;
  align?: 'start' | 'center' | 'end';
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'ghost' | 'outline' | 'default';
}

export const DynamicLanguageSwitcher: React.FC<DynamicLanguageSwitcherProps> = React.memo(({
  languages = defaultLanguages,
  showFlag = true,
  showLabel = true,
  align = 'end',
  className,
  size = 'sm',
  variant = 'ghost',
}) => {
  const { t } = useTranslation();
  const { changeLanguage, currentLanguage } = useUserLanguage();

  const currentLang = useMemo(() => {
    return languages.find(l => currentLanguage.startsWith(l.code)) || languages[0];
  }, [currentLanguage, languages]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn('gap-2', className)}>
          {showFlag && currentLang?.flag ? (
            <span className="text-base">{currentLang.flag}</span>
          ) : (
            <Languages className="h-4 w-4" />
          )}
          {showLabel && (
            <span className="hidden sm:inline text-sm">
              {currentLang?.nativeName || 'English'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-44">
        {languages.map((lang) => {
          const isActive = currentLanguage.startsWith(lang.code);
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                'flex items-center gap-3 cursor-pointer',
                isActive && 'bg-accent'
              )}
            >
              {showFlag && lang.flag && (
                <span className="text-base">{lang.flag}</span>
              )}
              <div className="flex-1">
                <span className="font-medium">{lang.nativeName}</span>
                {lang.name !== lang.nativeName && (
                  <span className="text-xs text-muted-foreground ml-1">({lang.name})</span>
                )}
              </div>
              {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

DynamicLanguageSwitcher.displayName = 'DynamicLanguageSwitcher';
