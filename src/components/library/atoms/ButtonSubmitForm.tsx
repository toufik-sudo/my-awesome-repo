// -----------------------------------------------------------------------------
// ButtonSubmitForm Atom Component
// Migrated from old_app/src/components/atoms/ui/ButtonSubmitForm.tsx
// -----------------------------------------------------------------------------

import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from './Button';
import { cn } from '@/lib/utils';

export interface ButtonSubmitFormProps extends Omit<ButtonProps, 'type'> {
  isSubmitting?: boolean;
  buttonText: string;
  loading?: boolean;
  nextStepDisabled?: boolean;
}

const ButtonSubmitForm: React.FC<ButtonSubmitFormProps> = ({
  isSubmitting = false,
  buttonText,
  loading = false,
  className,
  nextStepDisabled = false,
  variant = 'primary',
  onClick,
  ...props
}) => {
  const intl = useIntl();

  return (
    <Button
      type="submit"
      variant={variant}
      className={cn(className)}
      disabled={isSubmitting || loading || nextStepDisabled}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        intl.formatMessage({ id: buttonText })
      )}
    </Button>
  );
};

export { ButtonSubmitForm };
export default memo(ButtonSubmitForm);
