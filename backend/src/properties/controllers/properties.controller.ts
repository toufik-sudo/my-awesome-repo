import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from '../services/properties.service';
import { Public } from '../../auth/decorators/public.decorator';
import { RequireRole, RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(PermissionGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List/search properties', description: 'Public — browse & filter available properties.' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city name' })
  @ApiQuery({ name: 'type', required: false, enum: ['apartment', 'house', 'villa', 'studio', 'condo', 'hotel', 'chalet', 'riad'] })
  @ApiQuery({ name: 'minPrice', required: false, type: 'number' })
  @ApiQuery({ name: 'maxPrice', required: false, type: 'number' })
  @ApiQuery({ name: 'guests', required: false, type: 'number', description: 'Minimum guest capacity' })
  @ApiQuery({ name: 'bedrooms', required: false, type: 'number' })
  @ApiQuery({ name: 'checkIn', required: false, type: 'string', description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'checkOut', required: false, type: 'string', description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'minTrustStars', required: false, type: 'number', description: '0-5 trust rating filter' })
  @ApiQuery({ name: 'sort', required: false, enum: ['price_asc', 'price_desc', 'rating', 'newest'] })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: 'Default: 1' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Default: 20' })
  @ApiResponse({ status: 200, description: 'Paginated list of properties' })
  findAll(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('guests') guests?: number,
    @Query('bedrooms') bedrooms?: number,
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string,
    @Query('minTrustStars') minTrustStars?: number,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.propertiesService.findAll({
      city, type, minPrice, maxPrice, guests, bedrooms,
      checkIn, checkOut, minTrustStars, sort, page: page || 1, limit: limit || 20,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get property details', description: 'Public — full property details including host info, amenities, images.' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Public()
  @Get(':id/availability')
  @ApiOperation({ summary: 'Get property availability', description: 'Public — check available dates for a 3-month window.' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'from', required: true, description: 'Start date YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: true, description: 'End date YYYY-MM-DD' })
  getAvailability(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.propertiesService.getAvailability(id, from, to);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a property', description: 'Create a new property listing. Authenticated host becomes owner. **Roles**: any authenticated user' })
  @ApiResponse({ status: 201, description: 'Property created' })
  create(@Request() req, @Body() createDto: any) {
    return this.propertiesService.create({ ...createDto, hostId: req.user.id });
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @RequirePermission('modify_offers', 'id', 'param')
  @ApiOperation({ summary: 'Update property', description: '**Permission**: modify_offers' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.propertiesService.update(id, updateDto);
  }

  @Put(':id/prices')
  @ApiBearerAuth('JWT-auth')
  @RequirePermission('modify_prices', 'id', 'param')
  @ApiOperation({ summary: 'Update property prices', description: '**Permission**: modify_prices' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updatePrices(@Param('id') id: string, @Body() priceDto: any) {
    return this.propertiesService.update(id, priceDto);
  }

  @Put(':id/photos')
  @ApiBearerAuth('JWT-auth')
  @RequirePermission('modify_photos', 'id', 'param')
  @ApiOperation({ summary: 'Update property photos', description: '**Permission**: modify_photos' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updatePhotos(@Param('id') id: string, @Body() photosDto: any) {
    return this.propertiesService.update(id, photosDto);
  }

  @Put(':id/availability')
  @ApiBearerAuth('JWT-auth')
  @RequirePermission('manage_availability', 'id', 'param')
  @ApiOperation({ summary: 'Block/unblock dates or set custom prices', description: '**Permission**: manage_availability' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updateAvailability(@Param('id') id: string, @Body() availDto: any) {
    return this.propertiesService.updateAvailability(id, availDto);
  }

  @Post(':id/promos')
  @ApiBearerAuth('JWT-auth')
  @RequirePermission('modify_prices', 'id', 'param')
  @ApiOperation({ summary: 'Create a promotion', description: '**Permission**: modify_prices' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  createPromo(@Param('id') id: string, @Body() promoDto: any) {
    return this.propertiesService.createPromo(id, promoDto);
  }

  @Get(':id/promos')
  @Public()
  @ApiOperation({ summary: 'Get active promotions', description: 'Public — list active promos for a property.' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  getPromos(@Param('id') id: string) {
    return this.propertiesService.getPromos(id);
  }

  @Delete(':id/promos/:promoId')
  @ApiBearerAuth('JWT-auth')
  @RequirePermission('modify_prices', 'id', 'param')
  @ApiOperation({ summary: 'Delete a promotion', description: '**Permission**: modify_prices' })
  deletePromo(@Param('id') id: string, @Param('promoId') promoId: string) {
    return this.propertiesService.deletePromo(id, promoId);
  }

  @Post(':id/promo-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Subscribe to promo alerts', description: 'Get notified of new promotions.' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  subscribePromoAlert(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { notifyEmail?: boolean; notifyPhone?: boolean },
  ) {
    return this.propertiesService.subscribePromoAlert(id, req.user.id, body);
  }

  @Delete(':id/promo-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unsubscribe from promo alerts' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  unsubscribePromoAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.unsubscribePromoAlert(id, req.user.id);
  }

  @Put(':id/recalculate-trust')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Recalculate trust stars', description: 'Trigger recalculation after document changes. **Roles**: admin' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  recalculateTrust(@Param('id') id: string) {
    return this.propertiesService.recalculateTrustStars(id);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Delete a property', description: '**Roles**: admin (owner)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}

@ApiTags('Saved Search Alerts')
@ApiBearerAuth('JWT-auth')
@Controller('alerts/saved-searches')
@UseGuards(JwtAuthGuard)
export class SavedSearchAlertsController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Get()
  @ApiOperation({ summary: 'Get my saved search alerts' })
  getMyAlerts(@Request() req: any) {
    return this.propertiesService.getSavedSearchAlerts(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a saved search alert' })
  createAlert(@Request() req: any, @Body() body: any) {
    return this.propertiesService.createSavedSearchAlert(req.user.id, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a saved search alert' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updateAlert(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.propertiesService.updateSavedSearchAlert(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved search alert' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  deleteAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.deleteSavedSearchAlert(id, req.user.id);
  }
}
