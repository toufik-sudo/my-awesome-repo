import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSupportThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  @IsEnum(['technical', 'booking_issue', 'payment', 'property_issue', 'general', 'negative_review'])
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  content: string; // First message content

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  bookingId?: string;

  @IsString()
  @IsOptional()
  reviewId?: string;
}

export class SendSupportMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateThreadStatusDto {
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status: string;
}

export class AssignThreadDto {
  @IsNotEmpty()
  adminId: number;
}
