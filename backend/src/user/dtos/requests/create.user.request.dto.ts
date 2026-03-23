import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsMobilePhone,
  IsPostalCode,
  IsEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { Transform } from "class-transformer";

export class CreateUserRequestDto {  
  @IsNotEmpty()
  // @Transform((value) => value.toString())
  @IsMobilePhone(
    'fr-FR',
    { strictMode: false },
    { message: 'phone number is invalid' },
  )
  phoneNbr: string;

  // @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsIn(
    [
      'ROLE_USER',
      'ROLE_ADMIN',
      'ROLE_MANAGER',
      'ROLE_HYPER_ADMIN',
      'ROLE_TECHNIC',
      'ROLE_JOBS',
      'ROLE_DB_USER',
      'ROLE_DB_ADMIN',
    ],
    { each: true }, // ⚡ important → applique la règle à chaque élément
  )
  roles: string[];

  @IsString()
  @IsNotEmpty()
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
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
  // @IsNotEmpty()
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
  @IsPostalCode('DZ')
  zipcode;

  @IsString()
  @IsNotEmpty()
  address;

  @IsString()
  @IsNotEmpty()
  country;

  @IsEmpty()
  // @IsMobilePhone('ar-DZ', null, {
  //   message: 'secondary phone number is invalid',
  // })
  secondPhoneNbr;
}
