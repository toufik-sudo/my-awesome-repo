import { Controller, Get, Post, Delete, Param, Request } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findMyFavorites(@Request() req: any) {
    return this.favoritesService.findByUser(req.user.id);
  }

  @Get('check/:propertyId')
  checkFavorite(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.isFavorited(req.user.id, propertyId);
  }

  @Post(':propertyId')
  toggle(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.toggle(req.user.id, propertyId);
  }

  @Delete(':propertyId')
  remove(@Request() req: any, @Param('propertyId') propertyId: string) {
    return this.favoritesService.remove(req.user.id, propertyId);
  }
}
