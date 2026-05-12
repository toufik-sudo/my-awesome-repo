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

  /**
   * When set by an admin/manager, the booking is created on behalf of this guest user.
   * The booking is auto-validated (status = accepted) and the target guest is notified
   * to complete payment.
   */
  @IsOptional()
  onBehalfOfGuestId?: number | string;
}
