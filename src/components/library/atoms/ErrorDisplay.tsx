// -----------------------------------------------------------------------------
// ErrorDisplay Atom Component
// Consolidated from ErrorLineDisplay, ErrorLineAddition, DynamicFormattedError
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

type ErrorVariant = 'error' | 'warning' | 'info';

interface ErrorDisplayProps {
  message: string;
  variant?: ErrorVariant;
  className?: string;
  showIcon?: boolean;
  inline?: boolean;
}

const variantConfig: Record<
  ErrorVariant,
  { icon: React.ElementType; className: string }
> = {
  error: {
    icon: XCircle,
    className: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-warning',
  },
  info: {
    icon: Info,
    className: 'text-muted-foreground',
  },
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  variant = 'error',
  className,
  showIcon = true,
  inline = false,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (inline) {
    return (
      <span className={cn('text-sm', config.className, className)}>
        {showIcon && <Icon className="mr-1 inline h-3.5 w-3.5" />}
        {message}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2 text-sm',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
};

// Field error for form inputs
interface FieldErrorProps {
  error?: string;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <p className={cn('mt-1 text-sm text-destructive', className)}>{error}</p>
  );
};

// Multiple errors list
interface ErrorListProps {
  errors: string[];
  variant?: ErrorVariant;
  className?: string;
}

export const ErrorList: React.FC<ErrorListProps> = ({
  errors,
  variant = 'error',
  className,
}) => {
  if (errors.length === 0) return null;

  return (
    <ul className={cn('space-y-1', className)}>
      {errors.map((error, index) => (
        <li key={index}>
          <ErrorDisplay message={error} variant={variant} />
        </li>
      ))}
    </ul>
  );
};

// Alert box for prominent errors
interface ErrorAlertProps {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  className?: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  variant = 'error',
  className,
  onDismiss,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const bgColors: Record<ErrorVariant, string> = {
    error: 'bg-destructive/10 border-destructive/20',
    warning: 'bg-warning/10 border-warning/20',
    info: 'bg-muted border-muted-foreground/20',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border p-4',
        bgColors[variant],
        className
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.className)} />
      <div className="flex-1">
        {title && (
          <h4 className={cn('mb-1 font-medium', config.className)}>{title}</h4>
        )}
        <p className={cn('text-sm', config.className)}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export { ErrorDisplay };
export default ErrorDisplay;
