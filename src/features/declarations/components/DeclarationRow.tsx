import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IDeclaration, DeclarationSource, DeclarationStatus } from '../types';
import { DeclarationStatusBadge } from './DeclarationStatusBadge';
import { DeclarationValidationActions } from './DeclarationValidationActions';
import {
  formatDeclarationDate,
  getDeclarantName,
  getProductName,
  formatQuantity,
  formatAmount,
  canValidateDeclaration,
} from '../services/declarationService';
import { cn } from '@/lib/utils';

interface DeclarationRowProps {
  declaration: IDeclaration;
  isAdmin?: boolean;
  className?: string;
  onValidationSuccess?: () => void;
}

/**
 * Row component for displaying a single declaration
 * Includes validation actions for admin users when declaration is pending
 */
export const DeclarationRow: React.FC<DeclarationRowProps> = ({
  declaration,
  isAdmin = false,
  className,
  onValidationSuccess,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/declarations/${declaration.id}`);
  };

  const sourceIcon =
    declaration.source === DeclarationSource.FORM ? (
      <FileText className="h-4 w-4 text-muted-foreground" />
    ) : (
      <Upload className="h-4 w-4 text-muted-foreground" />
    );

  const showValidationActions = isAdmin && canValidateDeclaration(declaration.status);

  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 p-3 border-b hover:bg-muted/30 transition-colors items-center text-sm',
        className
      )}
    >
      {/* Source */}
      <div className="flex items-center">{sourceIcon}</div>

      {/* ID */}
      <div className="font-mono text-xs">#{declaration.id}</div>

      {/* Program Name */}
      <div className="truncate" title={declaration.programName}>
        {declaration.programName || '-'}
      </div>

      {/* Program Type */}
      <div className="text-muted-foreground">
        {declaration.programType === 1
          ? 'Challenge'
          : declaration.programType === 2
          ? 'Loyalty'
          : declaration.programType === 3
          ? 'Sponsorship'
          : '-'}
      </div>

      {/* Date */}
      <div>{formatDeclarationDate(declaration.dateOfEvent)}</div>

      {/* Declarant */}
      <div className="truncate" title={getDeclarantName(declaration)}>
        {getDeclarantName(declaration)}
      </div>

      {/* Company */}
      <div className="truncate" title={declaration.companyName}>
        {declaration.companyName || '-'}
      </div>

      {/* Target (for admin view) */}
      {isAdmin && (
        <div className="truncate">
          {declaration.firstName} {declaration.lastName}
        </div>
      )}

      {/* Product */}
      <div className="truncate" title={getProductName(declaration)}>
        {getProductName(declaration)}
      </div>

      {/* Quantity */}
      <div>{formatQuantity(declaration.quantity)}</div>

      {/* Amount */}
      <div>{formatAmount(declaration.amount)}</div>

      {/* Status */}
      <div>
        <DeclarationStatusBadge status={declaration.status} />
      </div>

      {/* Validated By */}
      <div className="truncate" title={declaration.validatedBy}>
        {declaration.validatedBy || '-'}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {showValidationActions && (
          <DeclarationValidationActions
            declaration={declaration}
            onSuccess={onValidationSuccess}
          />
        )}
        <Button variant="ghost" size="sm" onClick={handleViewDetails}>
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DeclarationRow;
