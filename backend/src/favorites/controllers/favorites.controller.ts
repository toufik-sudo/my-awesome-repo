import { Controller, Get, Post, Delete, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from '../services/favorites.service';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get my favorites', description: 'List all favorited properties.' })
  findMyFavorites(@Request() req: any) {
    return this.favoritesService.findByUser(req.user.id);
  }

  @Get('check/:propertyId')
  @ApiOperation({ summary: 'Check if property is favorited' })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  checkFavorite(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.isFavorited(req.user.id, propertyId);
  }

  @Post(':propertyId')
  @ApiOperation({ summary: 'Toggle favorite', description: 'Add or remove a property from favorites.' })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  toggle(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.toggle(req.user.id, propertyId);
  }

  @Delete(':propertyId')
  @ApiOperation({ summary: 'Remove from favorites' })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  remove(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.remove(req.user.id, propertyId);
  }
}
