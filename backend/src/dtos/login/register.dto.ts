import { IsEmail, IsMobilePhone, IsString } from 'class-validator';

export class RegisterDto {
  @IsMobilePhone(
    'fr-FR',
    { strictMode: false },
    { message: 'phone number is invalid' },
  )
  phoneNbr: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
