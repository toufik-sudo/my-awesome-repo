// -----------------------------------------------------------------------------
// FlexibleModalContainer Organism Component
// Flexible modal wrapper using shadcn Dialog
// -----------------------------------------------------------------------------

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface FlexibleModalContainerProps {
  isModalOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  fullOnMobile?: boolean;
  animationClass?: string;
}

const FlexibleModalContainer: React.FC<FlexibleModalContainerProps> = ({
  isModalOpen,
  closeModal,
  children,
  title,
  description,
  className = '',
  fullOnMobile = true,
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className={cn(
          fullOnMobile && 'max-md:h-full max-md:max-h-none max-md:rounded-none',
          className
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export { FlexibleModalContainer };
export default FlexibleModalContainer;
