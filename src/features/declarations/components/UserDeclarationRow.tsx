// -----------------------------------------------------------------------------
// UserDeclarationRow Component
// Migrated from old_app/src/components/molecules/wall/declarations/UserDeclarationRow.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, FileText, Upload, LockOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IDeclaration, ISortState } from './UserDeclarationsList';
import { USER_DECLARATIONS_ROUTE } from '@/constants/routes';
import { format } from 'date-fns';

// Declaration status constants matching old_app
const DECLARATION_STATUS = {
  DELETED: 0,
  PENDING: 1,
  VALIDATED: 2,
  DECLINED: 3,
  POINTS_ALLOCATED: 4
} as const;

// Source types
const DECLARATION_SOURCE = {
  FORM: 1,
  FILE_UPLOAD: 2
} as const;

const STATUS_CONFIG: Record<number, { label: string; className: string }> = {
  [DECLARATION_STATUS.PENDING]: { 
    label: 'declarations.status.pending', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
  },
  [DECLARATION_STATUS.VALIDATED]: { 
    label: 'declarations.status.validated', 
    className: 'bg-green-100 text-green-800 border-green-200' 
  },
  [DECLARATION_STATUS.DECLINED]: { 
    label: 'declarations.status.declined', 
    className: 'bg-red-100 text-red-800 border-red-200' 
  },
  [DECLARATION_STATUS.POINTS_ALLOCATED]: { 
    label: 'declarations.status.allocated', 
    className: 'bg-blue-100 text-blue-800 border-blue-200' 
  },
};

interface IUserDeclarationRowProps {
  declaration: IDeclaration;
  listState: ISortState;
  isAdmin: boolean;
  onValidate?: (id: number, status: number) => void;
  onView?: (id: number) => void;
}

/**
 * Row component for user declaration list - matches old_app column layout
 */
const UserDeclarationRow: React.FC<IUserDeclarationRowProps> = ({
  declaration,
  listState,
  isAdmin,
  onValidate,
  onView
}) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  
  const statusConfig = STATUS_CONFIG[declaration.status] || STATUS_CONFIG[DECLARATION_STATUS.PENDING];
  const isPending = declaration.status === DECLARATION_STATUS.PENDING;
  const isIndividual = declaration.source === DECLARATION_SOURCE.FORM;
  
  // Format date
  const formattedDate = declaration.dateOfEvent 
    ? format(new Date(declaration.dateOfEvent), 'dd/MM/yyyy')
    : '-';
  
  // Get names
  const declarantName = declaration.user 
    ? `${declaration.user.firstName || ''} ${declaration.user.lastName || ''}`.trim()
    : '-';
  
  const targetName = `${declaration.firstName || ''} ${declaration.lastName || ''}`.trim() || '-';
  const programName = declaration.program?.name || '-';
  const productName = declaration.product?.name || declaration.otherProductName || '-';
  const validatedByName = declaration.validatedBy 
    ? `${declaration.validatedBy.firstName || ''} ${declaration.validatedBy.lastName || ''}`.trim()
    : '-';

  const handleRowClick = () => {
    if (isAdmin) {
      navigate(`${USER_DECLARATIONS_ROUTE}/${declaration.id}`, { state: listState });
    }
  };

  const handleValidate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onValidate) {
      onValidate(declaration.id, DECLARATION_STATUS.VALIDATED);
    }
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onValidate) {
      onValidate(declaration.id, DECLARATION_STATUS.DECLINED);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView(declaration.id);
    } else {
      handleRowClick();
    }
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-[40px_60px_minmax(100px,1fr)_100px_100px_minmax(100px,1fr)_minmax(100px,1fr)_minmax(80px,1fr)_minmax(80px,1fr)_60px_80px_100px_100px] gap-2 px-3 py-2.5 items-center text-sm",
        "hover:bg-muted/30 transition-colors border-b",
        isAdmin && "cursor-pointer",
        declaration.status === DECLARATION_STATUS.VALIDATED && "bg-primary/5",
        declaration.status === DECLARATION_STATUS.DECLINED && "bg-destructive/5",
        declaration.status === DECLARATION_STATUS.POINTS_ALLOCATED && "bg-accent/30"
      )}
      onClick={handleRowClick}
    >
      {/* Source Icon */}
      <div className="flex justify-center">
        {isIndividual ? (
          <FileText className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Upload className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      
      {/* ID */}
      <div className="font-mono text-xs text-muted-foreground">
        #{declaration.id}
      </div>
      
      {/* Program Name */}
      <div className="truncate" title={programName}>
        {programName}
      </div>
      
      {/* Program Type */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>
          {formatMessage({ id: `program.type.${declaration.program?.type || 1}` })}
        </span>
        {declaration.program?.open !== undefined && (
          declaration.program.open ? (
            <LockOpen className="h-3 w-3" />
          ) : (
            <Lock className="h-3 w-3" />
          )
        )}
      </div>
      
      {/* Date */}
      <div className="text-sm">
        {formattedDate}
      </div>
      
      {/* Declarant */}
      <div className="truncate" title={declarantName}>
        {declarantName}
      </div>
      
      {/* Company */}
      <div className="truncate text-muted-foreground" title={declaration.companyName}>
        {declaration.companyName || '-'}
      </div>
      
      {/* Target */}
      <div className="truncate" title={targetName}>
        {targetName}
      </div>
      
      {/* Product */}
      <div className="truncate text-muted-foreground" title={productName}>
        {productName}
      </div>
      
      {/* Quantity */}
      <div className="text-right">
        {declaration.quantity ?? '-'}
      </div>
      
      {/* Amount */}
      <div className="text-right">
        {declaration.amount ? `${declaration.amount}€` : '0€'}
      </div>
      
      {/* Status */}
      <div>
        <Badge variant="outline" className={cn("text-xs font-medium", statusConfig.className)}>
          {formatMessage({ id: statusConfig.label })}
        </Badge>
      </div>
      
      {/* Validated By */}
      <div className="truncate text-xs text-muted-foreground" title={validatedByName}>
        {validatedByName !== '-' ? validatedByName : ''}
      </div>
    </div>
  );
};

export default UserDeclarationRow;
