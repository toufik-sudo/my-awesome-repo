import { POINT_CONVERSION_STATUS } from 'constants/api/pointConversions';

/**
 * Resolves the display settings (class, message id) corresponding to the given point conversions status
 *
 * @param status
 * @param style
 */
export const getPointConversionsStatusSettings = (status: POINT_CONVERSION_STATUS, style: any = {}) => {
  const { declarationRowStatusPending, declarationRowStatusValidated, declarationRowStatusDeclined } = style;

  let statusStyle = declarationRowStatusValidated;
  const statusDescriptionId = `pointConversions.status.${status}`;

  if (status == POINT_CONVERSION_STATUS.PENDING) {
    statusStyle = declarationRowStatusPending;
  }
  if (status == POINT_CONVERSION_STATUS.DECLINED) {
    statusStyle = declarationRowStatusDeclined;
  }

  return { statusStyle, statusDescriptionId };
};
