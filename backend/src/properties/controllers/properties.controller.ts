import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PropertiesService } from '../services/properties.service';
import { Public } from '../../auth/decorators/public.decorator';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all properties' })
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
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Public()
  @Get(':id/availability')
  @ApiOperation({ summary: 'Get availability' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  getAvailability(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.propertiesService.getAvailability(id, from, to);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create property' })
  create(@Request() req, @Body() createDto: any) {
    return this.propertiesService.create({ ...createDto, hostId: req.user.id });
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.propertiesService.update(id, updateDto);
  }

  @Put(':id/prices')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property prices' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updatePrices(@Param('id') id: string, @Body() priceDto: any) {
    return this.propertiesService.update(id, priceDto);
  }

  @Put(':id/photos')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property photos' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updatePhotos(@Param('id') id: string, @Body() photosDto: any) {
    return this.propertiesService.update(id, photosDto);
  }

  @Put(':id/availability')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update availability' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updateAvailability(@Param('id') id: string, @Body() availDto: any) {
    return this.propertiesService.updateAvailability(id, availDto);
  }

  @Post(':id/promos')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create promo' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  createPromo(@Param('id') id: string, @Body() promoDto: any) {
    return this.propertiesService.createPromo(id, promoDto);
  }

  @Public()
  @Get(':id/promos')
  @ApiOperation({ summary: 'Get promos' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  getPromos(@Param('id') id: string) {
    return this.propertiesService.getPromos(id);
  }

  @Delete(':id/promos/:promoId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete promo' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiParam({ name: 'promoId', description: 'Promo UUID' })
  deletePromo(@Param('id') id: string, @Param('promoId') promoId: string) {
    return this.propertiesService.deletePromo(id, promoId);
  }

  @Post(':id/promo-alerts')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Subscribe to promo alerts' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  subscribePromoAlert(@Param('id') id: string, @Request() req: any, @Body() body: { notifyEmail?: boolean; notifyPhone?: boolean }) {
    return this.propertiesService.subscribePromoAlert(id, req.user.id, body);
  }

  @Delete(':id/promo-alerts')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Unsubscribe from promo alerts' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  unsubscribePromoAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.unsubscribePromoAlert(id, req.user.id);
  }

  @Put(':id/recalculate-trust')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Recalculate trust stars' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  recalculateTrust(@Param('id') id: string) {
    return this.propertiesService.recalculateTrustStars(id);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete property' })
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
@UseInterceptors(CustomCsrfInterceptor)
export class SavedSearchAlertsController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my alerts' })
  getMyAlerts(@Request() req: any) {
    return this.propertiesService.getSavedSearchAlerts(req.user.id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create alert' })
  createAlert(@Request() req: any, @Body() body: any) {
    return this.propertiesService.createSavedSearchAlert(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update alert' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  updateAlert(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.propertiesService.updateSavedSearchAlert(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete alert' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  deleteAlert(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.deleteSavedSearchAlert(id, req.user.id);
  }
}
