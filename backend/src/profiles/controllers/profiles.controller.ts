import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles.service';

@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile', description: 'Get public profile by user ID.' })
  @ApiParam({ name: 'userId', type: 'number' })
  findByUser(@Param('userId') userId: number) {
    return this.profilesService.findByUser(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'userId', type: 'number' })
  update(@Param('userId') userId: number, @Body() updateDto: any) {
    return this.profilesService.update(userId, updateDto);
  }
}
