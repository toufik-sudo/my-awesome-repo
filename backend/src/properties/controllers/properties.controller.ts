import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { PropertiesService } from '../services/properties.service';
import { Public } from '../../auth/public.decorator';
import { RequireRole, RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('properties')
@UseGuards(PermissionGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

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

  @Post()
  @RequireRole('admin')
  create(@Body() createDto: any) {
    return this.propertiesService.create(createDto);
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

  @Put(':id/availability')
  @RequirePermission('manage_availability', 'id', 'param')
  updateAvailability(@Param('id') id: string, @Body() availDto: any) {
    return this.propertiesService.update(id, availDto);
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
