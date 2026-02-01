// -----------------------------------------------------------------------------
// TextInput Atom Component
// Migrated from old_app/src/components/atoms/ui/TextInput.tsx
// -----------------------------------------------------------------------------

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { FormattedMessage } from 'react-intl';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  errorId?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  hasLabel?: boolean;
  labelId?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      error = null,
      placeholder = '',
      errorId = '',
      wrapperClassName = '',
      inputClassName = '',
      hasLabel = false,
      labelId = '',
      onBlur,
      onFocus,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', wrapperClassName, hasLabel && value ? 'has-value' : '')}>
        {hasLabel && labelId && (
          <label className="block text-sm font-medium text-foreground mb-1">
            <FormattedMessage id={labelId} />
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            inputClassName,
            className
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">
            <FormattedMessage id={errorId || error} defaultMessage={error} />
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export { TextInput };
export default TextInput;
