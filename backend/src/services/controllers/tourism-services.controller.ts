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
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List all services' })
  findAll(
    @Request() req: any,
    @Query('city') city?: string, @Query('category') category?: string, @Query('categories') categories?: string | string[],
    @Query('minPrice') minPrice?: number, @Query('maxPrice') maxPrice?: number, @Query('participants') participants?: number,
    @Query('sort') sort?: string, @Query('search') search?: string,
    // Privileged roles only — see services in any status. Forced to
    // "published" for public/user/guest callers.
    @Query('status') status?: string,
    @Query('page') page?: number, @Query('limit') limit?: number,
  ) {
    const parsedCategories = categories ? (Array.isArray(categories) ? categories : [categories]) : undefined;
    const scopeCtx = req.user ? extractScopeContext(req) : undefined;
    return this.servicesService.findAll({ city, category, categories: parsedCategories, minPrice, maxPrice, participants, sort, search, status, page: Math.max(1, Number(page) || 1), limit: Math.min(100, Math.max(1, Number(limit) || 20)) }, scopeCtx);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get service categories' })
  getCategories() { return this.servicesService.getCategories(); }

  @Public()
  @Get(':id')
  @UseGuards(PermissionGuard)
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
    const role = req.userRole;
    const inviterAdminIds: number[] = req.inviterAdminIds || [];
    const providerId =
      role === 'manager' && inviterAdminIds.length > 0 ? inviterAdminIds[0] : req.user.id;
    return this.servicesService.create(createDto, providerId);
  }

  @Delete(':id/images')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete a single service image (removes from server)' })
  @ApiParam({ name: 'id' })
  deleteImage(@Param('id') id: string, @Body() body: { url: string }, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.servicesService.deleteImage(id, body?.url, scopeCtx);
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
