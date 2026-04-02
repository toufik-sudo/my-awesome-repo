import { Controller, Get, Post, Query, Req, UseGuards, Param, ParseIntPipe, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PointsService } from '../services/points.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import type { PointAction } from '../entity/user-points.entity';

@ApiTags('Points')
@ApiBearerAuth('JWT-auth')
@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get my points summary',
    description: `Returns the complete points profile for the authenticated user: total/available/spent points, tier, lifetime points, recent transactions, and next tier progress.

**Roles**: Any authenticated user

**Tiers**: bronze (0) → silver (500) → gold (1000) → platinum (2000) → diamond (5000)

**Example response**:
\`\`\`json
{
  "totalPoints": 350,
  "availablePoints": 300,
  "spentPoints": 50,
  "tier": "bronze",
  "lifetimePoints": 350,
  "recentTransactions": [...],
  "nextTier": { "tier": "silver", "pointsNeeded": 150 },
  "tierProgress": 70
}
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Points summary with tier info and recent transactions' })
  async getMySummary(@Req() req: any) {
    return this.pointsService.getUserSummary(req.user.id);
  }

  @Get('me/transactions')
  @ApiOperation({
    summary: 'Get my points transactions',
    description: `Paginated list of all points earned, spent, bonus, or penalty transactions.

**Roles**: Any authenticated user

**Transaction types**: \`earn\`, \`spend\`, \`bonus\`, \`penalty\``,
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated transactions { data, total, page, totalPages }' })
  async getMyTransactions(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pointsService.getTransactions(req.user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
  }

  @Get('leaderboard')
  @ApiOperation({
    summary: 'Get points leaderboard',
    description: `Top users by lifetime points. Shows user name, tier, and total points.

**Roles**: Any authenticated user`,
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Max results (default: 20)', example: 20 })
  @ApiResponse({ status: 200, description: 'Array of leaderboard entries sorted by lifetimePoints DESC' })
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.pointsService.getLeaderboard(limit ? parseInt(limit) : 20);
  }

  @Post('admin/award')
  @ApiOperation({
    summary: 'Award bonus points to a user',
    description: `Manually award bonus points to any user. Used for promotions, customer support, or events.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Example request**:
\`\`\`json
{
  "userId": 7,
  "points": 100,
  "description": "Compensation for booking issue"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['userId', 'points', 'description'], properties: {
    userId: { type: 'number', example: 7 },
    points: { type: 'number', example: 100 },
    description: { type: 'string', example: 'Compensation for booking issue' },
  }}})
  @ApiResponse({ status: 201, description: 'Points awarded — returns PointTransaction record' })
  async adminAward(@Body() body: { userId: number; points: number; description: string }) {
    return this.pointsService.awardPoints(body.userId, 'admin_bonus', { customPoints: body.points, description: body.description });
  }

  @Post('admin/deduct')
  @ApiOperation({
    summary: 'Deduct points from a user',
    description: `Apply a penalty or correction by deducting points from a user.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Example request**:
\`\`\`json
{
  "userId": 7,
  "points": 50,
  "reason": "Fake review detected"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['userId', 'points', 'reason'], properties: {
    userId: { type: 'number', example: 7 },
    points: { type: 'number', example: 50 },
    reason: { type: 'string', example: 'Fake review detected' },
  }}})
  @ApiResponse({ status: 201, description: 'Points deducted — returns PointTransaction record' })
  async adminDeduct(@Body() body: { userId: number; points: number; reason: string }) {
    return this.pointsService.deductPoints(body.userId, body.points, body.reason);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get any user\'s points summary',
    description: `Admin view of a user's points. Same response as GET /points/me.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'userId', type: 'number', example: 7 })
  @ApiResponse({ status: 200, description: 'Points summary for the specified user' })
  async getUserPoints(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointsService.getUserSummary(userId);
  }
}
