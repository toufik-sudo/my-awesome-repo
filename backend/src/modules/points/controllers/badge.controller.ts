import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BadgeService } from '../services/badge.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';

@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  async getAllBadges() {
    return this.badgeService.getAllBadges();
  }

  @Get('me')
  async getMyBadges(@Req() req: any) {
    return this.badgeService.getUserBadges(req.user.id);
  }

  @Get('me/progress')
  async getMyProgress(@Req() req: any) {
    return this.badgeService.getBadgeProgress(req.user.id);
  }

  @Post('me/check')
  async checkUnlocks(@Req() req: any) {
    return this.badgeService.checkAndUnlock(req.user.id);
  }
}
