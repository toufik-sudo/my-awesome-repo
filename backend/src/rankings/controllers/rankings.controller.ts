import { Controller, Get, Query, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { RankingsService } from '../services/rankings.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@Controller('rankings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getRankings(@Query('category') category: string = 'global', @Query('limit') limit: number = 50, @Query('page') page: number = 1) {
    return this.rankingsService.getRankings(category, page, limit);
  }

  @Get('me')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getMyRank(@Request() req, @Query('category') category: string = 'global') {
    return this.rankingsService.getUserRank(req.user.id, category);
  }
}
