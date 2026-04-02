import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TourismServicesService } from '../services/tourism-services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceFiltersDto } from '../dto/tourism-service.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequireRole } from '../../auth/decorators';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Services')
@Controller('services')
export class TourismServicesController {
  constructor(private readonly servicesService: TourismServicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List/search tourism services', description: 'Public — browse & filter services by category, city, price, etc.' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'categories', required: false, type: 'string', description: 'Comma-separated list' })
  @ApiQuery({ name: 'minPrice', required: false, type: 'number' })
  @ApiQuery({ name: 'maxPrice', required: false, type: 'number' })
  @ApiQuery({ name: 'participants', required: false, type: 'number' })
  @ApiQuery({ name: 'sort', required: false, enum: ['price_asc', 'price_desc', 'rating', 'newest'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
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
  @ApiOperation({ summary: 'Get service categories', description: 'Public — list all available service categories.' })
  getCategories() {
    return this.servicesService.getCategories();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get service details', description: 'Public — full service details.' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a tourism service', description: 'Authenticated user creates a service listing.' })
  create(@Request() req: any, @Body() createDto: CreateServiceDto) {
    return this.servicesService.create(createDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a service' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Delete a service', description: '**Roles**: admin' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
