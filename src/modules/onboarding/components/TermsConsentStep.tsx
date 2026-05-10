/**
 * Role-aware Terms & Conditions consent step.
 *
 * Shows the role's tagline plus collapsible clauses, and requires the user
 * to tick three independent acknowledgements before the form can proceed:
 *  1. General Terms of Service
 *  2. Role-specific clauses
 *  3. Privacy Policy
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRoleTerms } from '../data/terms';
import type { OnboardingRole } from '../onboarding.api';

export interface TermsConsentValue {
  general: boolean;
  role: boolean;
  privacy: boolean;
}

export const emptyConsent: TermsConsentValue = { general: false, role: false, privacy: false };

export const isFullyConsented = (v: TermsConsentValue) => v.general && v.role && v.privacy;

export interface TermsConsentStepProps {
  role: OnboardingRole;
  value: TermsConsentValue;
  onChange: (v: TermsConsentValue) => void;
}

export const TermsConsentStep: React.FC<TermsConsentStepProps> = ({ role, value, onChange }) => {
  const { t } = useTranslation();
  const terms = getRoleTerms(role);
  const [openItem, setOpenItem] = useState<string>('clause-0');

  const toggle = (key: keyof TermsConsentValue) => (checked: boolean | 'indeterminate') => {
    onChange({ ...value, [key]: checked === true });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">
              {t('onboarding.terms.heading', { defaultValue: 'Review & accept the Terms' })}
            </h3>
            <Badge variant="secondary">{terms.roleLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{terms.intro}</p>
        </div>
      </div>

      <ScrollArea className="h-[280px] sm:h-[320px] rounded-lg border border-border/60 bg-muted/20 p-3">
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={(v) => setOpenItem(v)}
          className="space-y-1"
        >
          {terms.clauses.map((c, idx) => (
            <AccordionItem
              key={`${c.title}-${idx}`}
              value={`clause-${idx}`}
              className="border border-border/40 rounded-md bg-card/60 px-3"
            >
              <AccordionTrigger className="text-left text-sm font-medium py-2.5 hover:no-underline">
                <span className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">{idx + 1}.</span>
                  {c.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3">
                {c.body}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      <Alert className="bg-primary/5 border-primary/20">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertTitle className="text-sm">
          {t('onboarding.terms.consentTitle', { defaultValue: 'Your consent' })}
        </AlertTitle>
        <AlertDescription className="text-xs">
          {t('onboarding.terms.consentDescription', {
            defaultValue: 'Tick each box to confirm you have read and accept the documents below. Without all three, the account cannot be created.',
          })}
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <ConsentRow
          id="consent-general"
          checked={value.general}
          onCheckedChange={toggle('general')}
          label={t('onboarding.terms.acceptGeneral', { defaultValue: 'I have read and accept the Terms of Service.' })}
        />
        <ConsentRow
          id="consent-role"
          checked={value.role}
          onCheckedChange={toggle('role')}
          label={t('onboarding.terms.acceptRole', {
            defaultValue: 'I accept the additional clauses applicable to my role ({{role}}).',
            role: terms.roleLabel,
          })}
        />
        <ConsentRow
          id="consent-privacy"
          checked={value.privacy}
          onCheckedChange={toggle('privacy')}
          label={t('onboarding.terms.acceptPrivacy', { defaultValue: 'I acknowledge the Privacy Policy and the processing of my personal data.' })}
        />
      </div>
    </div>
  );
};

TermsConsentStep.displayName = 'TermsConsentStep';

const ConsentRow: React.FC<{
  id: string;
  checked: boolean;
  onCheckedChange: (c: boolean | 'indeterminate') => void;
  label: string;
}> = ({ id, checked, onCheckedChange, label }) => (
  <label
    htmlFor={id}
    className={cn(
      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
      checked ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-card/40 hover:bg-muted/40',
    )}
  >
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5" />
    <span className="text-sm leading-snug">{label}</span>
  </label>
);
