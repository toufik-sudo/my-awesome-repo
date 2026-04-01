import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { PropertiesService } from '../services/properties.service';
import { Public } from '../../auth/decorators/public.decorator';
import { RequireRole, RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@Controller('properties')
@UseGuards(PermissionGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Public()
  @Get()
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
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  /** Get availability for a date range (3-month windows) */
  @Public()
  @Get(':id/availability')
  getAvailability(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.propertiesService.getAvailability(id, from, to);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createDto: any) {
    return this.propertiesService.create({ ...createDto, hostId: req.user.id });
  }

  @Put(':id')
  @RequirePermission('modify_offers', 'id', 'param')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.propertiesService.update(id, updateDto);
  }

  @Put(':id/prices')
  @RequirePermission('modify_prices', 'id', 'param')
  updatePrices(@Param('id') id: string, @Body() priceDto: any) {
    return this.propertiesService.update(id, priceDto);
  }

  @Put(':id/photos')
  @RequirePermission('modify_photos', 'id', 'param')
  updatePhotos(@Param('id') id: string, @Body() photosDto: any) {
    return this.propertiesService.update(id, photosDto);
  }

  /** Block/unblock dates or set custom prices */
  @Put(':id/availability')
  @RequirePermission('manage_availability', 'id', 'param')
  updateAvailability(@Param('id') id: string, @Body() availDto: any) {
    return this.propertiesService.updateAvailability(id, availDto);
  }

  /** Manage promos for a property */
  @Post(':id/promos')
  @RequirePermission('modify_prices', 'id', 'param')
  createPromo(@Param('id') id: string, @Body() promoDto: any) {
    return this.propertiesService.createPromo(id, promoDto);
  }

  @Get(':id/promos')
  @Public()
  getPromos(@Param('id') id: string) {
    return this.propertiesService.getPromos(id);
  }

  @Delete(':id/promos/:promoId')
  @RequirePermission('modify_prices', 'id', 'param')
  deletePromo(@Param('id') id: string, @Param('promoId') promoId: string) {
    return this.propertiesService.deletePromo(id, promoId);
  }

  /** Subscribe to promo alerts */
  @Post(':id/promo-alerts')
  @UseGuards(JwtAuthGuard)
  subscribePromoAlert(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { notifyEmail?: boolean; notifyPhone?: boolean },
  ) {
    return this.propertiesService.subscribePromoAlert(id, req.user.id, body);
  }

  @Delete(':id/promo-alerts')
  @UseGuards(JwtAuthGuard)
  unsubscribePromoAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.unsubscribePromoAlert(id, req.user.id);
  }

  /** Recalculate trust stars after document approval/rejection */
  @Put(':id/recalculate-trust')
  @RequireRole('admin')
  recalculateTrust(@Param('id') id: string) {
    return this.propertiesService.recalculateTrustStars(id);
  }

  @Delete(':id')
  @RequireRole('admin')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}

/** Saved Search Alerts Controller */
@Controller('alerts/saved-searches')
@UseGuards(JwtAuthGuard)
export class SavedSearchAlertsController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Get()
  getMyAlerts(@Request() req: any) {
    return this.propertiesService.getSavedSearchAlerts(req.user.id);
  }

  @Post()
  createAlert(@Request() req: any, @Body() body: any) {
    return this.propertiesService.createSavedSearchAlert(req.user.id, body);
  }

  @Put(':id')
  updateAlert(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.propertiesService.updateSavedSearchAlert(id, req.user.id, body);
  }

  @Delete(':id')
  deleteAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.deleteSavedSearchAlert(id, req.user.id);
  }
}
