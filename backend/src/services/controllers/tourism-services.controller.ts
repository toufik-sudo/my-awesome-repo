import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { TourismServicesService } from '../services/tourism-services.service';
import { CreateServiceDto, UpdateServiceDto } from '../dto/tourism-service.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Tourism Services')
@ApiBearerAuth()
@Controller('services')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class TourismServicesController {
  constructor(private readonly servicesService: TourismServicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all services' })
  findAll(
    @Request() req: any,
    @Query('city') city?: string, @Query('category') category?: string, @Query('categories') categories?: string | string[],
    @Query('minPrice') minPrice?: number, @Query('maxPrice') maxPrice?: number, @Query('participants') participants?: number,
    @Query('sort') sort?: string, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number,
  ) {
    const parsedCategories = categories ? (Array.isArray(categories) ? categories : [categories]) : undefined;
    const scopeCtx = req.user ? extractScopeContext(req) : undefined;
    return this.servicesService.findAll({ city, category, categories: parsedCategories, minPrice, maxPrice, participants, sort, search, page: page || 1, limit: limit || 20 }, scopeCtx);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get service categories' })
  getCategories() { return this.servicesService.getCategories(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = req.user ? extractScopeContext(req) : undefined;
    return this.servicesService.findOne(id, scopeCtx);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create service' })
  create(@Request() req: any, @Body() createDto: CreateServiceDto) {
    const scopeCtx = extractScopeContext(req);
    return this.servicesService.create(createDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update service' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.servicesService.update(id, updateDto, scopeCtx);
  }

  @Put(':id/pause')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Pause service' })
  @ApiParam({ name: 'id' })
  pause(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.servicesService.update(id, { status: 'paused' } as any, scopeCtx);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete service' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.servicesService.remove(id, scopeCtx);
  }
}
