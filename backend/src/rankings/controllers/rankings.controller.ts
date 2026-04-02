import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { RankingsService } from '../services/rankings.service';

@ApiTags('Rankings')
@ApiBearerAuth('JWT-auth')
@Controller('rankings')
@UseGuards(AuthGuard('jwt'))
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get leaderboard', description: 'Ranked list of users by category (global, host, guest, etc.).' })
  @ApiQuery({ name: 'category', required: false, description: 'Default: global' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Default: 50' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: 'Default: 1' })
  async getRankings(
    @Query('category') category: string = 'global',
    @Query('limit') limit: number = 50,
    @Query('page') page: number = 1,
  ) {
    return this.rankingsService.getRankings(category, page, limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my ranking', description: 'Current user\'s rank and points in a category.' })
  @ApiQuery({ name: 'category', required: false, description: 'Default: global' })
  async getMyRank(@Request() req, @Query('category') category: string = 'global') {
    return this.rankingsService.getUserRank(req.user.id, category);
  }
}
