import { Controller, Get, Post, Body, Query, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PointsService } from '../services/points.service';
import { PermissionGuard } from '../../../auth/guards/permission.guard';
import { RequireRole } from '../../../auth/decorators/require-role.decorator';
import type { PointAction } from '../entity/user-points.entity';

@ApiTags('Points')
@ApiBearerAuth('JWT-auth')
@Controller('points')
@UseGuards(PermissionGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /** Get current user's points summary */
  @Get('me')
  @ApiOperation({ summary: 'Get my points summary' })
  async getMySummary(@Req() req: any) {
    return this.pointsService.getUserSummary(req.user.id);
  }

  /** Get current user's transaction history */
  @Get('me/transactions')
  @ApiOperation({ summary: 'Get my points transactions' })
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
  @ApiOperation({ summary: 'Get points leaderboard' })
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.pointsService.getLeaderboard(limit ? parseInt(limit) : 20);
  }

  /** Admin: Award bonus points */
  @Post('admin/award')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Award bonus points (hyper_admin/hyper_manager only)' })
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
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Deduct points (hyper_admin/hyper_manager only)' })
  async adminDeduct(
    @Body() body: { userId: number; points: number; reason: string },
  ) {
    return this.pointsService.deductPoints(body.userId, body.points, body.reason);
  }

  /** Get a specific user's points (for admin) */
  @Get('user/:userId')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any)
  @ApiOperation({ summary: 'Get user points (admin+)' })
  async getUserPoints(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointsService.getUserSummary(userId);
  }
}
