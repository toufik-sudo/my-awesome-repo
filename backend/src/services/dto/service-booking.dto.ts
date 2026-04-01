import { IsString, IsInt, IsDateString, IsOptional, IsIn, Min, Max, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ParticipantDetailDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  age?: number;
}

export class CreateServiceBookingDto {
  @IsString()
  serviceId: string;

  @IsDateString()
  bookingDate: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsInt()
  @Min(1)
  @Max(100)
  participants: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  childParticipants?: number;

  @IsString()
  @IsIn(['ccp', 'baridi_mob', 'edahabia', 'cib', 'cash', 'bank_transfer'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDetailDto)
  participantDetails?: ParticipantDetailDto[];
}

export class ServiceAvailabilityDto {
  @IsDateString()
  date: string;

  @IsOptional()
  isBlocked?: boolean;

  @IsOptional()
  customPrice?: number;

  @IsOptional()
  maxSlots?: number;

  @IsOptional()
  @IsArray()
  timeSlots?: string[];
}
