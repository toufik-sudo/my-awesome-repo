/**
 * Country reference dataset for onboarding.
 * - dialCode: international phone prefix
 * - phoneRegex: national-significant-number validator (after the +XX prefix)
 * - postalRegex: zipcode pattern (kept lenient when official format is unclear)
 *
 * Source curated for the markets we care about; extend as needed.
 */

export interface Country {
  code: string;        // ISO-3166 alpha-2
  name: string;
  flag: string;        // emoji
  dialCode: string;    // e.g. '+33'
  phoneRegex: RegExp;  // matches national number (digits only after dial code)
  postalRegex: RegExp;
}

export const COUNTRIES: Country[] = [
  { code: 'DZ', name: 'Algeria',        flag: '🇩🇿', dialCode: '+213', phoneRegex: /^[5-7]\d{8}$/,        postalRegex: /^\d{5}$/ },
  { code: 'FR', name: 'France',         flag: '🇫🇷', dialCode: '+33',  phoneRegex: /^[1-9]\d{8}$/,        postalRegex: /^\d{5}$/ },
  { code: 'BE', name: 'Belgium',        flag: '🇧🇪', dialCode: '+32',  phoneRegex: /^[1-9]\d{7,8}$/,      postalRegex: /^\d{4}$/ },
  { code: 'CH', name: 'Switzerland',    flag: '🇨🇭', dialCode: '+41',  phoneRegex: /^[1-9]\d{8}$/,        postalRegex: /^\d{4}$/ },
  { code: 'LU', name: 'Luxembourg',     flag: '🇱🇺', dialCode: '+352', phoneRegex: /^\d{6,9}$/,           postalRegex: /^\d{4}$/ },
  { code: 'MA', name: 'Morocco',        flag: '🇲🇦', dialCode: '+212', phoneRegex: /^[5-7]\d{8}$/,        postalRegex: /^\d{5}$/ },
  { code: 'TN', name: 'Tunisia',        flag: '🇹🇳', dialCode: '+216', phoneRegex: /^[2-9]\d{7}$/,        postalRegex: /^\d{4}$/ },
  { code: 'EG', name: 'Egypt',          flag: '🇪🇬', dialCode: '+20',  phoneRegex: /^1\d{9}$/,            postalRegex: /^\d{5}$/ },
  { code: 'SA', name: 'Saudi Arabia',   flag: '🇸🇦', dialCode: '+966', phoneRegex: /^5\d{8}$/,            postalRegex: /^\d{5}$/ },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', phoneRegex: /^5\d{8}$/,    postalRegex: /^\d{5}$/ },
  { code: 'TR', name: 'Turkey',         flag: '🇹🇷', dialCode: '+90',  phoneRegex: /^5\d{9}$/,            postalRegex: /^\d{5}$/ },
  { code: 'ES', name: 'Spain',          flag: '🇪🇸', dialCode: '+34',  phoneRegex: /^[6-9]\d{8}$/,        postalRegex: /^\d{5}$/ },
  { code: 'PT', name: 'Portugal',       flag: '🇵🇹', dialCode: '+351', phoneRegex: /^9\d{8}$/,            postalRegex: /^\d{4}-\d{3}$/ },
  { code: 'IT', name: 'Italy',          flag: '🇮🇹', dialCode: '+39',  phoneRegex: /^3\d{9}$/,            postalRegex: /^\d{5}$/ },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪', dialCode: '+49',  phoneRegex: /^1[5-7]\d{8,9}$/,     postalRegex: /^\d{5}$/ },
  { code: 'NL', name: 'Netherlands',    flag: '🇳🇱', dialCode: '+31',  phoneRegex: /^6\d{8}$/,            postalRegex: /^\d{4}\s?[A-Z]{2}$/i },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44',  phoneRegex: /^7\d{9}$/,            postalRegex: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i },
  { code: 'IE', name: 'Ireland',        flag: '🇮🇪', dialCode: '+353', phoneRegex: /^8\d{8}$/,            postalRegex: /^[A-Z0-9]{3}\s?[A-Z0-9]{4}$/i },
  { code: 'US', name: 'United States',  flag: '🇺🇸', dialCode: '+1',   phoneRegex: /^\d{10}$/,            postalRegex: /^\d{5}(-\d{4})?$/ },
  { code: 'CA', name: 'Canada',         flag: '🇨🇦', dialCode: '+1',   phoneRegex: /^\d{10}$/,            postalRegex: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i },
  { code: 'BR', name: 'Brazil',         flag: '🇧🇷', dialCode: '+55',  phoneRegex: /^\d{10,11}$/,         postalRegex: /^\d{5}-?\d{3}$/ },
  { code: 'AR', name: 'Argentina',      flag: '🇦🇷', dialCode: '+54',  phoneRegex: /^\d{10}$/,            postalRegex: /^[A-Z]?\d{4}[A-Z]{0,3}$/i },
  { code: 'MX', name: 'Mexico',         flag: '🇲🇽', dialCode: '+52',  phoneRegex: /^\d{10}$/,            postalRegex: /^\d{5}$/ },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺', dialCode: '+61',  phoneRegex: /^4\d{8}$/,            postalRegex: /^\d{4}$/ },
  { code: 'NZ', name: 'New Zealand',    flag: '🇳🇿', dialCode: '+64',  phoneRegex: /^2\d{7,9}$/,          postalRegex: /^\d{4}$/ },
  { code: 'ZA', name: 'South Africa',   flag: '🇿🇦', dialCode: '+27',  phoneRegex: /^\d{9}$/,             postalRegex: /^\d{4}$/ },
  { code: 'NG', name: 'Nigeria',        flag: '🇳🇬', dialCode: '+234', phoneRegex: /^[7-9]\d{9}$/,        postalRegex: /^\d{6}$/ },
  { code: 'KE', name: 'Kenya',          flag: '🇰🇪', dialCode: '+254', phoneRegex: /^[17]\d{8}$/,         postalRegex: /^\d{5}$/ },
  { code: 'IN', name: 'India',          flag: '🇮🇳', dialCode: '+91',  phoneRegex: /^[6-9]\d{9}$/,        postalRegex: /^\d{6}$/ },
  { code: 'PK', name: 'Pakistan',       flag: '🇵🇰', dialCode: '+92',  phoneRegex: /^3\d{9}$/,            postalRegex: /^\d{5}$/ },
  { code: 'CN', name: 'China',          flag: '🇨🇳', dialCode: '+86',  phoneRegex: /^1\d{10}$/,           postalRegex: /^\d{6}$/ },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵', dialCode: '+81',  phoneRegex: /^[789]0\d{8}$/,       postalRegex: /^\d{3}-?\d{4}$/ },
  { code: 'KR', name: 'South Korea',    flag: '🇰🇷', dialCode: '+82',  phoneRegex: /^1\d{8,9}$/,          postalRegex: /^\d{5}$/ },
  { code: 'RU', name: 'Russia',         flag: '🇷🇺', dialCode: '+7',   phoneRegex: /^9\d{9}$/,            postalRegex: /^\d{6}$/ },
  { code: 'SE', name: 'Sweden',         flag: '🇸🇪', dialCode: '+46',  phoneRegex: /^7\d{8}$/,            postalRegex: /^\d{3}\s?\d{2}$/ },
  { code: 'NO', name: 'Norway',         flag: '🇳🇴', dialCode: '+47',  phoneRegex: /^[49]\d{7}$/,         postalRegex: /^\d{4}$/ },
  { code: 'DK', name: 'Denmark',        flag: '🇩🇰', dialCode: '+45',  phoneRegex: /^\d{8}$/,             postalRegex: /^\d{4}$/ },
  { code: 'FI', name: 'Finland',        flag: '🇫🇮', dialCode: '+358', phoneRegex: /^[45]\d{7,9}$/,       postalRegex: /^\d{5}$/ },
  { code: 'PL', name: 'Poland',         flag: '🇵🇱', dialCode: '+48',  phoneRegex: /^\d{9}$/,             postalRegex: /^\d{2}-\d{3}$/ },
  { code: 'GR', name: 'Greece',         flag: '🇬🇷', dialCode: '+30',  phoneRegex: /^6\d{9}$/,            postalRegex: /^\d{3}\s?\d{2}$/ },
];

export const COUNTRY_BY_CODE: Record<string, Country> =
  Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

export const COUNTRY_BY_NAME: Record<string, Country> =
  Object.fromEntries(COUNTRIES.map((c) => [c.name.toLowerCase(), c]));

/** Strip every non-digit so phone validation runs against pure digits. */
export const digitsOnly = (s: string) => (s || '').replace(/\D+/g, '');
