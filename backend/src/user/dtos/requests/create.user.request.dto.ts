import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsMobilePhone,
  IsPostalCode,
  IsEmpty,
  IsIn,
  IsOptional,
  ValidateIf,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isMobilePhone, isPostalCode } from 'class-validator';

/**
 * Maps ISO-3166 alpha-2 country codes onto the locale string class-validator
 * (and the underlying `validator` package) expects for `isMobilePhone`.
 *
 * If the country isn't listed we fall back to `'any'` which lets `validator`
 * try every known locale — looser, but better than rejecting valid numbers.
 */
const PHONE_LOCALE_BY_COUNTRY: Record<string, string> = {
  DZ: 'ar-DZ',
  FR: 'fr-FR',
  BE: 'fr-BE',
  CH: 'fr-CH',
  LU: 'fr-LU',
  MA: 'ar-MA',
  TN: 'ar-TN',
  EG: 'ar-EG',
  SA: 'ar-SA',
  AE: 'ar-AE',
  TR: 'tr-TR',
  ES: 'es-ES',
  PT: 'pt-PT',
  IT: 'it-IT',
  DE: 'de-DE',
  NL: 'nl-NL',
  GB: 'en-GB',
  IE: 'en-IE',
  US: 'en-US',
  CA: 'en-CA',
  BR: 'pt-BR',
  AR: 'es-AR',
  MX: 'es-MX',
  AU: 'en-AU',
  NZ: 'en-NZ',
  ZA: 'en-ZA',
  NG: 'en-NG',
  KE: 'en-KE',
  IN: 'en-IN',
  PK: 'en-PK',
  CN: 'zh-CN',
  JP: 'ja-JP',
  KR: 'ko-KR',
  RU: 'ru-RU',
  SE: 'sv-SE',
  NO: 'nb-NO',
  DK: 'da-DK',
  FI: 'fi-FI',
  PL: 'pl-PL',
  GR: 'el-GR',
};

/**
 * Validates `phoneNbr` using the locale derived from the sibling `countryCode`.
 * Falls back to `'any'` so we don't reject obscure-but-valid international
 * numbers when the country isn't in the map above.
 */
@ValidatorConstraint({ name: 'IsPhoneForCountry', async: false })
export class IsPhoneForCountryConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string' || !value.trim()) return false;
    const obj = args.object as Record<string, unknown>;
    const cc = String(obj?.countryCode || '').toUpperCase();
    const locale = (PHONE_LOCALE_BY_COUNTRY[cc] || 'any') as any;
    try {
      return isMobilePhone(value, locale, { strictMode: false });
    } catch {
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    const cc = String((args.object as any)?.countryCode || 'unknown');
    return `phone number is invalid for country ${cc}`;
  }
}

/**
 * Validates `zipcode` using the sibling `countryCode`. Falls back to `'any'`
 * for countries that `validator` doesn't list.
 */
@ValidatorConstraint({ name: 'IsPostalForCountry', async: false })
export class IsPostalForCountryConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === undefined || value === null || value === '') return false;
    const str = String(value);
    const obj = args.object as Record<string, unknown>;
    const cc = String(obj?.countryCode || '').toUpperCase();
    try {
      return isPostalCode(str, (cc || 'any') as any);
    } catch {
      // unsupported locale → accept (we already do client-side regex)
      return true;
    }
  }
  defaultMessage(args: ValidationArguments) {
    const cc = String((args.object as any)?.countryCode || 'unknown');
    return `zip code is invalid for country ${cc}`;
  }
}

export class CreateUserRequestDto {
  /**
   * ISO-3166 alpha-2 country code used to drive phone & postal validation.
   * Optional for backward compatibility — when absent we keep the previous
   * `fr-FR` / `DZ` defaults.
   */
  @IsOptional()
  @IsString()
  @IsIn([
    'DZ', 'FR', 'BE', 'CH', 'LU', 'MA', 'TN', 'EG', 'SA', 'AE', 'TR',
    'ES', 'PT', 'IT', 'DE', 'NL', 'GB', 'IE', 'US', 'CA', 'BR', 'AR',
    'MX', 'AU', 'NZ', 'ZA', 'NG', 'KE', 'IN', 'PK', 'CN', 'JP', 'KR',
    'RU', 'SE', 'NO', 'DK', 'FI', 'PL', 'GR',
  ])
  countryCode?: string;

  @IsNotEmpty()
  @ValidateIf((o) => !!o.countryCode)
  @Validate(IsPhoneForCountryConstraint)
  @ValidateIf((o) => !o.countryCode)
  @IsMobilePhone(
    'fr-FR',
    { strictMode: false },
    { message: 'phone number is invalid' },
  )
  phoneNbr: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'])
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'password too weak' },
  )
  password;

  @IsString()
  @IsNotEmpty()
  cardId;

  @IsString()
  passportId;

  @IsString()
  @IsNotEmpty()
  lastName;

  @IsString()
  @IsNotEmpty()
  firstName;

  @IsString()
  @IsNotEmpty()
  title;

  @IsString()
  @IsNotEmpty()
  city;

  @IsNotEmpty()
  @ValidateIf((o) => !!o.countryCode)
  @Validate(IsPostalForCountryConstraint)
  @ValidateIf((o) => !o.countryCode)
  @IsPostalCode('DZ')
  zipcode;

  @IsString()
  @IsNotEmpty()
  address;

  @IsString()
  @IsNotEmpty()
  country;

  @IsEmpty()
  secondPhoneNbr;

  /** Optional preset or uploaded avatar URL chosen during onboarding. */
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  /** Optional referral code entered at signup (e.g. REF-XXXXXXXX). */
  @IsOptional()
  @IsString()
  referralCode?: string;
}
