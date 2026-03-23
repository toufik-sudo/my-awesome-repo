import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RankingsService } from '../services/rankings.service';

@Controller('rankings')
@UseGuards(AuthGuard('jwt'))
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async getRankings(
    @Query('category') category: string = 'global',
    @Query('limit') limit: number = 50,
    @Query('page') page: number = 1,
  ) {
    return this.rankingsService.getRankings(category, page, limit);
  }

  @Get('me')
  async getMyRank(@Request() req, @Query('category') category: string = 'global') {
    return this.rankingsService.getUserRank(req.user.id, category);
  }
}
