import {
  IsString,
  IsNotEmpty,
  IsMobilePhone,
  IsNumberString,
  IsOptional,
  IsEmail,
} from 'class-validator';
// import { Transform } from "class-transformer";

export class ValidateUserRequestDto {
  @IsNotEmpty()
  // @Transform((value) => value.toString())
  @IsMobilePhone(
    'fr-FR',
    { strictMode: false },
    { message: 'phone number is invalid' },
  )
  phoneNbr: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  otp: string;
}
