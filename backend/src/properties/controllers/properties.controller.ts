import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PropertiesService } from '../services/properties.service';
import { Public } from '../../auth/decorators/public.decorator';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

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
    @Request() req: any,
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
    const scopeCtx = req.user ? extractScopeContext(req) : undefined;
    return this.propertiesService.findAll({
      city, type, minPrice, maxPrice, guests, bedrooms,
      checkIn, checkOut, minTrustStars, sort, page: page || 1, limit: limit || 20,
    }, scopeCtx);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = req.user ? extractScopeContext(req) : undefined;
    return this.propertiesService.findOne(id, scopeCtx);
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
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.create({ ...createDto, hostId: req.user.id });
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  update(@Param('id') id: string, @Body() updateDto: any, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.update(id, updateDto, scopeCtx);
  }

  @Put(':id/prices')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property prices' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updatePrices(@Param('id') id: string, @Body() priceDto: any, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.update(id, priceDto, scopeCtx);
  }

  @Put(':id/photos')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property photos' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updatePhotos(@Param('id') id: string, @Body() photosDto: any, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.update(id, photosDto, scopeCtx);
  }

  @Put(':id/availability')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update availability' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  updateAvailability(@Param('id') id: string, @Body() availDto: any, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.updateAvailability(id, availDto, scopeCtx);
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
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.subscribePromoAlert(id, req.user.id, body);
  }

  @Delete(':id/promo-alerts')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Unsubscribe from promo alerts' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  unsubscribePromoAlert(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
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
  remove(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.remove(id, scopeCtx);
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
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.getSavedSearchAlerts(req.user.id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create alert' })
  createAlert(@Request() req: any, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.createSavedSearchAlert(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update alert' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  updateAlert(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.updateSavedSearchAlert(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete alert' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  deleteAlert(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.propertiesService.deleteSavedSearchAlert(id, req.user.id);
  }
}
