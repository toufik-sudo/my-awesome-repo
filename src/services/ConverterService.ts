// -----------------------------------------------------------------------------
// Converter Service
// Migrated from old_app/src/services/ConverterService.ts
// -----------------------------------------------------------------------------

/**
 * Convert bytes to human readable format (KB, MB, GB, etc.)
 */
export const byteConverter = (bytes: number | string): string => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  let n = parseInt(String(bytes), 10) || 0;

  while (n >= 1024 && ++index) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && index > 0 ? 1 : 0) + ' ' + units[index];
};

/**
 * Convert file size to MB
 */
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

/**
 * Convert MB to bytes
 */
export const mbToBytes = (mb: number): number => {
  return mb * 1024 * 1024;
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'EUR', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Convert percentage to decimal
 */
export const percentToDecimal = (percent: number): number => {
  return percent / 100;
};

/**
 * Convert decimal to percentage
 */
export const decimalToPercent = (decimal: number): number => {
  return decimal * 100;
};
