import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertGuestToUserDto {
  @ApiProperty({ example: 42, description: 'The guest user ID to convert to a regular user' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
