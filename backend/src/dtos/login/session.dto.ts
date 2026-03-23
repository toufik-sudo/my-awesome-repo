import { IsEmail, IsMobilePhone, IsNumber, IsNumberString, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class SessionDto {
  @ValidateIf(o => !o.email)
  @IsMobilePhone('fr-FR', { strictMode: false }, { message: 'phone number is invalid' })
  phoneNbr: string;

  @ValidateIf(o => !o.phoneNbr)
  @IsEmail()
  email?: string;

  @ValidateIf(o => typeof o.value === 'string')
  @IsString()
  @ValidateIf(o => typeof o.value === 'number')
  @IsNumber()
  sub: string | number;

  @ValidateIf(o => typeof o.value === 'string')
  @IsString()
  @ValidateIf(o => typeof o.value === 'number')
  @IsNumber()
  id: string | number;

  @IsString()
  username: string;

  roles: any;

  authToken: string;
}
