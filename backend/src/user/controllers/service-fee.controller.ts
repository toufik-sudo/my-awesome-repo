import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { maybePaginate } from '../../common/pagination.util';
import { ServiceFeeService } from '../services/service-fee.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('service-fees')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ServiceFeeController {
  constructor(private readonly service: ServiceFeeService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getAll(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    const scopeCtx = extractScopeContext(req);
    const items = await this.service.getAll();
    return maybePaginate(items, page, limit);
  }

  @Get('default')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getDefault() {
    return this.service.getDefault();
  }

  @Get('host/:hostId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async create(@Request() req, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    const scopeCtx = extractScopeContext(req);
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }

  @Post('calculate')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async calculate(@Request() req: any, @Body() body: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number; serviceId?: string; serviceGroupId?: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.service.calculateFee(body.hostId, body.propertyId, body.propertyGroupId || null, body.amount, body.serviceId, body.serviceGroupId);
  }
}
