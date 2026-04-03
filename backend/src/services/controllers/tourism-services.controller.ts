import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { TourismServicesService } from '../services/tourism-services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceFiltersDto } from '../dto/tourism-service.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequireRole } from '../../auth/decorators';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@Controller('services')
export class TourismServicesController {
  constructor(private readonly servicesService: TourismServicesService) {}

  @Public()
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('categories') categories?: string | string[],
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('participants') participants?: number,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const parsedCategories = categories
      ? (Array.isArray(categories) ? categories : [categories])
      : undefined;

    return this.servicesService.findAll({
      city, category, categories: parsedCategories,
      minPrice, maxPrice, participants,
      sort, search, page: page || 1, limit: limit || 20,
    });
  }

  @Public()
  @Get('categories')
  getCategories() {
    return this.servicesService.getCategories();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createDto: CreateServiceDto) {
    return this.servicesService.create(createDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateDto);
  }

  @Delete(':id')
  @RequireRole('admin')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
