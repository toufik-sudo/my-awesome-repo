import { Controller, Get, Post, Body, Query, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { PointsService } from '../services/points.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import type { PointAction } from '../entity/user-points.entity';

@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /** Get current user's points summary */
  @Get('me')
  async getMySummary(@Req() req: any) {
    return this.pointsService.getUserSummary(req.user.id);
  }

  /** Get current user's transaction history */
  @Get('me/transactions')
  async getMyTransactions(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pointsService.getTransactions(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  /** Get leaderboard */
  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.pointsService.getLeaderboard(limit ? parseInt(limit) : 20);
  }

  /** Admin: Award bonus points */
  @Post('admin/award')
  async adminAward(
    @Body() body: { userId: number; points: number; description: string },
  ) {
    return this.pointsService.awardPoints(body.userId, 'admin_bonus', {
      customPoints: body.points,
      description: body.description,
    });
  }

  /** Admin: Deduct points */
  @Post('admin/deduct')
  async adminDeduct(
    @Body() body: { userId: number; points: number; reason: string },
  ) {
    return this.pointsService.deductPoints(body.userId, body.points, body.reason);
  }

  /** Get a specific user's points (for admin) */
  @Get('user/:userId')
  async getUserPoints(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointsService.getUserSummary(userId);
  }
}
