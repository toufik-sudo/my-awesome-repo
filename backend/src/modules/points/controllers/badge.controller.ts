import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BadgeService } from '../services/badge.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';

@ApiTags('Badges')
@ApiBearerAuth('JWT-auth')
@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all badges', description: 'List all achievement badges.' })
  async getAllBadges() {
    return this.badgeService.getAllBadges();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my badges', description: 'List badges unlocked by the authenticated user.' })
  async getMyBadges(@Req() req: any) {
    return this.badgeService.getUserBadges(req.user.id);
  }

  @Get('me/progress')
  @ApiOperation({ summary: 'Get badge progress', description: 'Progress towards next badges.' })
  async getMyProgress(@Req() req: any) {
    return this.badgeService.getBadgeProgress(req.user.id);
  }

  @Post('me/check')
  @ApiOperation({ summary: 'Check for badge unlocks', description: 'Trigger check for newly unlocked badges.' })
  async checkUnlocks(@Req() req: any) {
    return this.badgeService.checkAndUnlock(req.user.id);
  }
}
