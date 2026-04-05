import { IsString, IsNotEmpty, IsOptional, IsIn, IsEmail, IsMobilePhone, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({ enum: ['email', 'phone'], example: 'email', description: 'Method to deliver the invitation' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['email', 'phone'])
  method: 'email' | 'phone';

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Required when method is "email"' })
  @ValidateIf(o => o.method === 'email')
  @IsEmail({}, { message: 'Valid email required when method is email' })
  @IsNotEmpty({ message: 'Email required when method is email' })
  email?: string;

  @ApiPropertyOptional({ example: '+213550000000', description: 'Required when method is "phone"' })
  @ValidateIf(o => o.method === 'phone')
  @IsMobilePhone('fr-FR', { strictMode: false }, { message: 'Valid phone number required' })
  @IsNotEmpty({ message: 'Phone required when method is phone' })
  phone?: string;

  @ApiProperty({
    enum: ['hyper_manager', 'admin', 'manager', 'user', 'guest'],
    example: 'admin',
    description: `Role to assign to the invitee. Must comply with invitation rules:
    - hyper_admin → hyper_manager, admin, user, guest
    - hyper_manager → admin, guest
    - admin → manager, guest
    - manager → guest only
    Note: hyper_admin cannot invite managers (admin-scoped). Admin cannot invite admin/hyper roles.`,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['hyper_manager', 'admin', 'manager', 'user', 'guest'])
  role: string;

  @ApiPropertyOptional({ example: 'Welcome to our platform!', description: 'Optional personal message included in the invitation' })
  @IsOptional()
  @IsString()
  message?: string;
}
