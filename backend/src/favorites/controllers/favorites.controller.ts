import { Controller, Get, Post, Delete, Param, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FavoritesService } from '../services/favorites.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my favorites' })
  findMyFavorites(@Request() req: any) { return this.favoritesService.findByUser(req.user.id); }

  @Get('check/:propertyId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Check if property is favorited' })
  checkFavorite(@Request() req: any, @Param('propertyId') propertyId: string) { return this.favoritesService.isFavorited(req.user.id, propertyId); }

  @Post(':propertyId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Toggle favorite' })
  toggle(@Request() req: any, @Param('propertyId') propertyId: string) { return this.favoritesService.toggle(req.user.id, propertyId); }

  @Delete(':propertyId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove favorite' })
  remove(@Request() req: any, @Param('propertyId') propertyId: string) { return this.favoritesService.remove(req.user.id, propertyId); }
}
