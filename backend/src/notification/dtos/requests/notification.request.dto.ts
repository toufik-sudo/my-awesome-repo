import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class NotificationRequestDto {
  @ValidateIf(o => !o.email)
  @IsMobilePhone('fr-FR', { strictMode: false }, { message: 'phone number is invalid' })
  phoneNbr: string;

  @ValidateIf(o => !o.phoneNbr)
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
