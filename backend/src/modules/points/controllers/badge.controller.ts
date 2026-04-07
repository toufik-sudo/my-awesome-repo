import { Controller, Get, Post, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BadgeService } from '../services/badge.service';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../../rbac/scope-context';

@ApiTags('Badges')
@ApiBearerAuth('JWT-auth')
@Controller('badges')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all badges' })
  async getAllBadges(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.badgeService.getAllBadges(scopeCtx);
  }

  @Get('me')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my badges' })
  async getMyBadges(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.badgeService.getUserBadges(req.user.id, scopeCtx);
  }

  @Get('me/progress')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my badge progress' })
  async getMyProgress(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.badgeService.getBadgeProgress(req.user.id, scopeCtx);
  }

  @Post('me/check')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Check and unlock badges' })
  async checkUnlocks(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.badgeService.checkAndUnlock(req.user.id, scopeCtx);
  }
}
