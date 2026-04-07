import { Controller, Get, Post, Body, Query, Request, UseGuards, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PointsService } from '../services/points.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../../rbac/scope-context';

@ApiTags('Points')
@ApiBearerAuth('JWT-auth')
@Controller('points')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('me')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my points summary' })
  async getMySummary(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.pointsService.getUserSummary(req.user.id, scopeCtx);
  }

  @Get('me/transactions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my points transactions' })
  async getMyTransactions(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.pointsService.getTransactions(req.user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20, scopeCtx);
  }

  @Get('leaderboard')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get points leaderboard' })
  async getLeaderboard(@Request() req: any, @Query('limit') limit?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.pointsService.getLeaderboard(limit ? parseInt(limit) : 20, scopeCtx);
  }

  @Post('admin/award')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Award bonus points (hyper_admin/hyper_manager only)' })
  async adminAward(@Request() req: any, @Body() body: { userId: number; points: number; description: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.pointsService.awardPoints(body.userId, 'admin_bonus', { customPoints: body.points, description: body.description }, scopeCtx);
  }

  @Post('admin/deduct')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Deduct points (hyper_admin/hyper_manager only)' })
  async adminDeduct(@Request() req: any, @Body() body: { userId: number; points: number; reason: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.pointsService.deductPoints(body.userId, body.points, body.reason, scopeCtx);
  }

  @Get('user/:userId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get user points (admin+)' })
  async getUserPoints(@Request() req: any, @Param('userId', ParseIntPipe) userId: number) {
    const scopeCtx = extractScopeContext(req);
    return this.pointsService.getUserSummary(userId, scopeCtx);
  }
}
