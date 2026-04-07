import { Controller, Get, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { RankingsService } from '../services/rankings.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('rankings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getRankings(@Request() req: any, @Query('category') category: string = 'global', @Query('limit') limit: number = 50, @Query('page') page: number = 1) {
    const scopeCtx = extractScopeContext(req);
    return this.rankingsService.getRankings(category, page, limit, scopeCtx);
  }

  @Get('me')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getMyRank(@Request() req: any, @Query('category') category: string = 'global') {
    const scopeCtx = extractScopeContext(req);
    return this.rankingsService.getUserRank(req.user.id, category, scopeCtx);
  }
}
