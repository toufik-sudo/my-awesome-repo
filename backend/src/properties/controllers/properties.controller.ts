import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PropertiesService } from '../services/properties.service';
import { Public } from '../../auth/decorators/public.decorator';
import { RequireRole, RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
@UseGuards(PermissionGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all properties', description: 'Public endpoint. Returns paginated list with optional filters.' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'guests', required: false, type: Number })
  @ApiQuery({ name: 'minTrustStars', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated property list' })
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
  @ApiOperation({ summary: 'Get property by ID', description: 'Public endpoint. Returns a single property.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiResponse({ status: 200, description: 'Property object' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Public()
  @Get(':id/availability')
  @ApiOperation({ summary: 'Get availability', description: 'Returns availability entries for a date range.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiQuery({ name: 'from', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, description: 'End date (YYYY-MM-DD)' })
  getAvailability(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.propertiesService.getAvailability(id, from, to);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Create property',
    description: `Create a new property. Only admin (host) and manager (with create_property permission) can create.
    - **admin**: creates with own hostId — full ownership
    - **manager**: creates on behalf of admin — requires create_property permission`,
  })
  @ApiResponse({ status: 201, description: 'Property created' })
  @ApiResponse({ status: 403, description: 'Role not allowed to create properties' })
  create(@Request() req, @Body() createDto: any) {
    return this.propertiesService.create({ ...createDto, hostId: req.user.id });
  }

  @Put(':id')
  @RequirePermission('modify_property', 'id', 'param')
  @ApiOperation({ summary: 'Update property', description: 'Admin updates own property; manager needs modify_property permission.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiResponse({ status: 200, description: 'Property updated' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.propertiesService.update(id, updateDto);
  }

  @Put(':id/prices')
  @RequirePermission('modify_prices', 'id', 'param')
  @ApiOperation({ summary: 'Update property prices', description: 'Update pricing fields. Requires modify_prices permission for managers.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updatePrices(@Param('id') id: string, @Body() priceDto: any) {
    return this.propertiesService.update(id, priceDto);
  }

  @Put(':id/photos')
  @RequirePermission('modify_photos', 'id', 'param')
  @ApiOperation({ summary: 'Update property photos', description: 'Update image list. Requires modify_photos permission for managers.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updatePhotos(@Param('id') id: string, @Body() photosDto: any) {
    return this.propertiesService.update(id, photosDto);
  }

  @Put(':id/availability')
  @RequirePermission('manage_availability', 'id', 'param')
  @ApiOperation({ summary: 'Update availability', description: 'Block/unblock dates or set custom prices.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updateAvailability(@Param('id') id: string, @Body() availDto: any) {
    return this.propertiesService.updateAvailability(id, availDto);
  }

  @Post(':id/promos')
  @RequirePermission('modify_prices', 'id', 'param')
  @ApiOperation({ summary: 'Create promo', description: 'Add a promotional offer to a property.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  createPromo(@Param('id') id: string, @Body() promoDto: any) {
    return this.propertiesService.createPromo(id, promoDto);
  }

  @Get(':id/promos')
  @Public()
  @ApiOperation({ summary: 'Get promos', description: 'Public endpoint. Returns active promos for a property.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  getPromos(@Param('id') id: string) {
    return this.propertiesService.getPromos(id);
  }

  @Delete(':id/promos/:promoId')
  @RequirePermission('modify_prices', 'id', 'param')
  @ApiOperation({ summary: 'Delete promo', description: 'Remove a promotional offer.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiParam({ name: 'promoId', description: 'Promo UUID' })
  deletePromo(@Param('id') id: string, @Param('promoId') promoId: string) {
    return this.propertiesService.deletePromo(id, promoId);
  }

  @Post(':id/promo-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Subscribe to promo alerts', description: 'Get notified of promotions on a property.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiBody({ schema: { example: { notifyEmail: true, notifyPhone: false } } })
  subscribePromoAlert(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { notifyEmail?: boolean; notifyPhone?: boolean },
  ) {
    return this.propertiesService.subscribePromoAlert(id, req.user.id, body);
  }

  @Delete(':id/promo-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unsubscribe from promo alerts' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  unsubscribePromoAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.unsubscribePromoAlert(id, req.user.id);
  }

  @Put(':id/recalculate-trust')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Recalculate trust stars', description: 'Admin-only. Recalculate trust score after document approval/rejection.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  recalculateTrust(@Param('id') id: string) {
    return this.propertiesService.recalculateTrustStars(id);
  }

  @Delete(':id')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Delete property', description: 'Admin-only. Permanently delete a property. Admin can only delete own properties.' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}

/** Saved Search Alerts Controller */
@ApiTags('Saved Search Alerts')
@ApiBearerAuth()
@Controller('alerts/saved-searches')
@UseGuards(JwtAuthGuard)
export class SavedSearchAlertsController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Get()
  @ApiOperation({ summary: 'Get my alerts', description: 'Returns all saved search alerts for the authenticated user.' })
  getMyAlerts(@Request() req: any) {
    return this.propertiesService.getSavedSearchAlerts(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create alert', description: 'Create a new saved search alert.' })
  createAlert(@Request() req: any, @Body() body: any) {
    return this.propertiesService.createSavedSearchAlert(req.user.id, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update alert' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  updateAlert(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.propertiesService.updateSavedSearchAlert(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alert' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  deleteAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.deleteSavedSearchAlert(id, req.user.id);
  }
}
