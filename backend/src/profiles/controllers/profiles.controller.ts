import { Controller, Get, Put, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  findMyProfile(@Request() req) {
    return this.profilesService.findByUser(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateMyProfile(@Request() req, @Body() updateDto: any) {
    return this.profilesService.update(req.user.id, updateDto);
  }
}
