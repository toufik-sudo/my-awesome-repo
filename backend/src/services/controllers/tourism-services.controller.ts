import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards, SetMetadata } from '@nestjs/common';
import { TourismServicesService } from '../services/tourism-services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceFiltersDto } from '../dto/tourism-service.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequireRole, RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tourism Services')
@ApiBearerAuth()
@Controller('services')
@UseGuards(PermissionGuard)
export class TourismServicesController {
  constructor(private readonly servicesService: TourismServicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all services', description: 'Public. Returns paginated services with filters.' })
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
  @ApiOperation({ summary: 'Get service categories' })
  getCategories() {
    return this.servicesService.getCategories();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Create service',
    description: `Create a new tourism service.
    - **admin**: creates with own providerId
    - **manager**: requires create_service permission`,
  })
  @ApiResponse({ status: 201, description: 'Service created' })
  @ApiResponse({ status: 403, description: 'Role not allowed' })
  create(@Request() req: any, @Body() createDto: CreateServiceDto) {
    return this.servicesService.create(createDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @RequireRole('admin', 'manager')
  @RequirePermission('modify_service', 'id', 'param')
  @ApiOperation({ summary: 'Update service', description: 'Admin updates own; manager needs modify_service permission.' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateDto);
  }

  @Put(':id/pause')
  @UseGuards(JwtAuthGuard)
  @RequireRole('admin', 'manager', 'hyper_admin', 'hyper_manager')
  @RequirePermission('pause_service', 'id', 'param')
  @ApiOperation({ summary: 'Pause service' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  pause(@Param('id') id: string) {
    return this.servicesService.update(id, { status: 'paused' } as any);
  }

  @Delete(':id')
  @RequireRole('admin', 'hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Delete service', description: 'Admin deletes own; hyper roles can delete any.' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
