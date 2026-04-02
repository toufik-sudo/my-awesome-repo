import { Controller, Get, Post, Query, Req, UseGuards, Param, ParseIntPipe, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get my points summary', description: 'Total points, level, tier for the authenticated user.' })
  async getMySummary(@Req() req: any) {
    return this.pointsService.getUserSummary(req.user.id);
  }

  @Get('me/transactions')
  @ApiOperation({ summary: 'Get my points transactions', description: 'Paginated history of points earned/spent.' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async getMyTransactions(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pointsService.getTransactions(req.user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get points leaderboard' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Default: 20' })
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.pointsService.getLeaderboard(limit ? parseInt(limit) : 20);
  }

  @Post('admin/award')
  @ApiOperation({ summary: 'Admin: Award bonus points', description: '**Roles**: admin+ (via guard)' })
  @ApiBody({ schema: { type: 'object', required: ['userId', 'points', 'description'], properties: {
    userId: { type: 'number' }, points: { type: 'number' }, description: { type: 'string' },
  }}})
  async adminAward(@Body() body: { userId: number; points: number; description: string }) {
    return this.pointsService.awardPoints(body.userId, 'admin_bonus', { customPoints: body.points, description: body.description });
  }

  @Post('admin/deduct')
  @ApiOperation({ summary: 'Admin: Deduct points', description: '**Roles**: admin+ (via guard)' })
  @ApiBody({ schema: { type: 'object', required: ['userId', 'points', 'reason'], properties: {
    userId: { type: 'number' }, points: { type: 'number' }, reason: { type: 'string' },
  }}})
  async adminDeduct(@Body() body: { userId: number; points: number; reason: string }) {
    return this.pointsService.deductPoints(body.userId, body.points, body.reason);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user points (admin view)' })
  @ApiParam({ name: 'userId', type: 'number' })
  async getUserPoints(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointsService.getUserSummary(userId);
  }
}
