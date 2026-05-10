import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, Request,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionBindingService } from '../services/permission-binding.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { maybePaginate } from '../../common/pagination.util';

@ApiTags('RBAC Permission Bindings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@UseInterceptors(CustomCsrfInterceptor)
@Controller('rbac-config/bindings')
export class PermissionBindingController {
  constructor(private readonly bindingService: PermissionBindingService) {}

  @Get()
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List all permission bindings (frontendApi → backend mapping)' })
  async findAll(@Query('module') module?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const items = await this.bindingService.findAll(module);
    return maybePaginate(items, page, limit);
  }

  @Get('map')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get the full binding map: frontendApi → { backendKey, roles[] }[]' })
  async getBindingMap() {
    return this.bindingService.getBindingMap();
  }

  @Post('diff')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({
    summary:
      'Diff backend permissions ↔ permission bindings (and optionally runtime frontend keys). Returns link gaps only.',
  })
  async getBindingsDiff(@Body() body: { runtimeFrontendKeys?: string[] }) {
    return this.bindingService.getBindingsDiff(body?.runtimeFrontendKeys);
  }

  @Get('frontend-api/:key')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get bindings for a frontend API key' })
  async findByFrontendApi(@Param('key') key: string) {
    return this.bindingService.findByFrontendApi(key);
  }

  @Get('backend/:key')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get bindings for a backend permission key' })
  async findByBackendKey(@Param('key') key: string) {
    return this.bindingService.findByBackendKey(key);
  }

  @Post()
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create a permission binding (by backend ID + frontend API key)' })
  async create(
    @Body() body: { backendPermissionId: string; frontendPermissionApi: string; endpoint_url?: string; module?: string },
  ) {
    return this.bindingService.create(body);
  }

  @Post('by-keys')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create a permission binding (by backend permission key + frontend API key)' })
  async createByKeys(
    @Body() body: { backendPermissionKey: string; frontendPermissionApi: string; endpoint_url?: string; module?: string },
  ) {
    return this.bindingService.createByKeys(body.backendPermissionKey, body.frontendPermissionApi, body.module, body.endpoint_url);
  }

  @Post('bulk')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Bulk create permission bindings' })
  async bulkCreate(
    @Body() body: { bindings: Array<{ backendPermissionKey: string; frontendPermissionApi: string; endpoint_url?: string; module?: string }> },
  ) {
    return this.bindingService.bulkCreate(body.bindings);
  }

  @Put(':id')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update a permission binding' })
  async update(@Param('id') id: string, @Body() body: { module?: string; endpoint_url?: string | null }) {
    return this.bindingService.update(id, body);
  }

  @Delete(':id')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete a permission binding' })
  async remove(@Param('id') id: string) {
    await this.bindingService.remove(id);
    return { success: true };
  }
}
