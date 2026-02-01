// -----------------------------------------------------------------------------
// Point Conversion Services
// Migrated from old_app/src/services/PointConversionServices.ts
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const POINT_CONVERSION_STATUS = {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  DECLINED: 'DECLINED',
} as const;

export type PointConversionStatus = typeof POINT_CONVERSION_STATUS[keyof typeof POINT_CONVERSION_STATUS];

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PointConversionStatusSettings {
  statusStyle: string;
  statusDescriptionId: string;
  variant: 'default' | 'pending' | 'success' | 'destructive';
}

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

/**
 * Resolves display settings for point conversion status
 * 
 * @param status - Current conversion status
 * @returns Status styling configuration
 */
export const getPointConversionStatusSettings = (
  status: PointConversionStatus
): PointConversionStatusSettings => {
  const statusDescriptionId = `pointConversions.status.${status}`;

  switch (status) {
    case POINT_CONVERSION_STATUS.PENDING:
      return {
        statusStyle: 'conversion-status-pending',
        statusDescriptionId,
        variant: 'pending',
      };

    case POINT_CONVERSION_STATUS.DECLINED:
      return {
        statusStyle: 'conversion-status-declined',
        statusDescriptionId,
        variant: 'destructive',
      };

    case POINT_CONVERSION_STATUS.VALIDATED:
    default:
      return {
        statusStyle: 'conversion-status-validated',
        statusDescriptionId,
        variant: 'success',
      };
  }
};

/**
 * Checks if a conversion is pending
 */
export const isConversionPending = (status: PointConversionStatus): boolean => {
  return status === POINT_CONVERSION_STATUS.PENDING;
};

/**
 * Checks if a conversion is validated
 */
export const isConversionValidated = (status: PointConversionStatus): boolean => {
  return status === POINT_CONVERSION_STATUS.VALIDATED;
};

/**
 * Checks if a conversion is declined
 */
export const isConversionDeclined = (status: PointConversionStatus): boolean => {
  return status === POINT_CONVERSION_STATUS.DECLINED;
};
