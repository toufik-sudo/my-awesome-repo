import React from 'react';
import { useIntl } from 'react-intl';
import { Badge } from '@/components/ui/badge';
import { DeclarationStatus } from '../types';
import { getDeclarationStatusSettings } from '../services/declarationService';
import { cn } from '@/lib/utils';

interface DeclarationStatusBadgeProps {
  status: DeclarationStatus;
  className?: string;
}

/**
 * Badge component for displaying declaration status
 */
export const DeclarationStatusBadge: React.FC<DeclarationStatusBadgeProps> = ({
  status,
  className,
}) => {
  const intl = useIntl();
  const { className: statusClassName, messageId } = getDeclarationStatusSettings(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border-0',
        statusClassName,
        className
      )}
    >
      {intl.formatMessage({ id: messageId })}
    </Badge>
  );
};

export default DeclarationStatusBadge;
