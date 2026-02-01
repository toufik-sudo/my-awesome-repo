import { DeclarationStatus } from '../types';
import { STATUS_STYLES } from '../constants';
import { format } from 'date-fns';

/**
 * Get status display settings for a declaration
 */
export const getDeclarationStatusSettings = (status: DeclarationStatus) => {
  return STATUS_STYLES[status] || {
    className: 'text-muted-foreground bg-muted',
    messageId: 'declarations.status.unknown',
  };
};

/**
 * Check if declaration status is pending
 */
export const isPendingStatus = (status: DeclarationStatus): boolean => {
  return status === DeclarationStatus.PENDING;
};

/**
 * Check if declaration status is validated
 */
export const isValidatedStatus = (status: DeclarationStatus): boolean => {
  return status === DeclarationStatus.VALIDATED;
};

/**
 * Check if declaration status is declined
 */
export const isDeclinedStatus = (status: DeclarationStatus): boolean => {
  return status === DeclarationStatus.DECLINED;
};

/**
 * Check if declaration status is points allocated
 */
export const isAllocatedStatus = (status: DeclarationStatus): boolean => {
  return status === DeclarationStatus.POINTS_ALLOCATED;
};

/**
 * Check if declaration can be validated (only pending can be validated)
 */
export const canValidateDeclaration = (status: DeclarationStatus): boolean => {
  return status === DeclarationStatus.PENDING;
};

/**
 * Format declaration date
 */
export const formatDeclarationDate = (date: Date | string | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch {
    return '-';
  }
};

/**
 * Get display name for a declaration user
 */
export const getDeclarantName = (declaration: {
  firstName?: string;
  lastName?: string;
  user?: { firstName?: string; lastName?: string };
}): string => {
  const firstName = declaration.user?.firstName || declaration.firstName || '';
  const lastName = declaration.user?.lastName || declaration.lastName || '';
  
  if (!firstName && !lastName) return '-';
  return `${firstName} ${lastName}`.trim();
};

/**
 * Get product name from declaration
 */
export const getProductName = (declaration: {
  productName?: string;
  product?: { name: string };
  otherProductName?: string;
}): string => {
  return declaration.productName || declaration.product?.name || declaration.otherProductName || '-';
};

/**
 * Format quantity for display
 */
export const formatQuantity = (quantity?: number): string => {
  if (quantity === undefined || quantity === null) return '-';
  return quantity.toLocaleString();
};

/**
 * Format amount for display
 */
export const formatAmount = (amount?: number, currency = '€'): string => {
  if (amount === undefined || amount === null) return '-';
  return `${amount.toLocaleString()} ${currency}`;
};
