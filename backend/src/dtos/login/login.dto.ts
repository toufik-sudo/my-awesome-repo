import { IsEmail, IsMobilePhone, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.email)
  @IsMobilePhone('fr-FR', { strictMode: false }, { message: 'phone number is invalid' })
  phoneNbr: string;

  @ValidateIf(o => !o.phoneNbr)
  @IsEmail()
  email?: string;

  @IsString()
  password: string;
}
