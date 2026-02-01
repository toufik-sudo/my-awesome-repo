// -----------------------------------------------------------------------------
// Heading Atom Component
// Migrated from old_app/src/components/atoms/ui/Heading.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  size: HeadingLevel;
  textId?: string;
  primaryTextId?: string;
  className?: string;
  children?: React.ReactNode;
}

const headingSizeClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-bold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-semibold',
  6: 'text-base md:text-lg font-medium',
};

const Heading: React.FC<HeadingProps> = ({ 
  size, 
  textId = '', 
  primaryTextId = '', 
  className = '',
  children 
}) => {
  const Tag = `h${size}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn(headingSizeClasses[size], 'text-foreground w-full', className)}>
      {textId ? <FormattedMessage id={textId} /> : children}
      {primaryTextId && (
        <span className="text-primary">
          {' '}
          <FormattedMessage id={primaryTextId} />
        </span>
      )}
    </Tag>
  );
};

export { Heading };
export default Heading;
