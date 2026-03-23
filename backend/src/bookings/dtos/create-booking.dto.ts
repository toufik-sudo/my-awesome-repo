import { IsString, IsInt, IsDateString, IsOptional, IsIn, Min, Max, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  propertyId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsInt()
  @Min(1)
  @Max(50)
  guests: number;

  @IsString()
  @IsIn(['ccp', 'baridi_mob', 'edahabia', 'cib', 'cash', 'bank_transfer'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
