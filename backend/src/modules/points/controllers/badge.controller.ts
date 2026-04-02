import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BadgeService } from '../services/badge.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';

@ApiTags('Badges')
@ApiBearerAuth('JWT-auth')
@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all available badges',
    description: `Lists all achievement badges configured on the platform with unlock criteria.

**Roles**: Any authenticated user

**Example response**:
\`\`\`json
[{
  "id": "...",
  "name": "First Booking",
  "description": "Complete your first booking",
  "icon": "🏠",
  "criteria": "first_booking",
  "threshold": 1
}]
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Array of Badge objects' })
  async getAllBadges() {
    return this.badgeService.getAllBadges();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get my unlocked badges',
    description: `Lists badges the authenticated user has earned along with unlock dates.

**Roles**: Any authenticated user`,
  })
  @ApiResponse({ status: 200, description: 'Array of UserBadge objects with Badge details and unlockedAt' })
  async getMyBadges(@Req() req: any) {
    return this.badgeService.getUserBadges(req.user.id);
  }

  @Get('me/progress')
  @ApiOperation({
    summary: 'Get badge progress',
    description: `Shows progress towards each badge not yet unlocked (e.g., 3/5 bookings).

**Roles**: Any authenticated user`,
  })
  @ApiResponse({ status: 200, description: 'Array of badge progress objects with current count and threshold' })
  async getMyProgress(@Req() req: any) {
    return this.badgeService.getBadgeProgress(req.user.id);
  }

  @Post('me/check')
  @ApiOperation({
    summary: 'Check for new badge unlocks',
    description: `Triggers a check for newly unlocked badges based on user's current stats and actions. Returns any newly unlocked badges.

**Roles**: Any authenticated user`,
  })
  @ApiResponse({ status: 200, description: 'Array of newly unlocked Badge records (empty if none)' })
  async checkUnlocks(@Req() req: any) {
    return this.badgeService.checkAndUnlock(req.user.id);
  }
}
