import { Controller, Get, Post, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FavoritesService } from '../services/favorites.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get my favorites' })
  findMyFavorites(@Request() req: any) {
    return this.favoritesService.findByUser(req.user.id);
  }

  @Get('check/:propertyId')
  @ApiOperation({ summary: 'Check if property is favorited' })
  checkFavorite(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.isFavorited(req.user.id, propertyId);
  }

  @Post(':propertyId')
  @ApiOperation({ summary: 'Toggle favorite' })
  toggle(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.toggle(req.user.id, propertyId);
  }

  @Delete(':propertyId')
  @ApiOperation({ summary: 'Remove favorite' })
  remove(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.remove(req.user.id, propertyId);
  }
}
