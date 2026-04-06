import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ServiceFeeService } from '../services/service-fee.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@Controller('service-fees')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ServiceFeeController {
  constructor(private readonly service: ServiceFeeService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getAll() {
    return this.service.getAll();
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
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }

  @Post('calculate')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async calculate(@Body() body: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number; serviceId?: string; serviceGroupId?: string }) {
    return this.service.calculateFee(body.hostId, body.propertyId, body.propertyGroupId || null, body.amount, body.serviceId, body.serviceGroupId);
  }
}
