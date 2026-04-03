import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ServiceFeeService } from '../services/service-fee.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('service-fees')
@UseGuards(PermissionGuard)
export class ServiceFeeController {
  constructor(private readonly service: ServiceFeeService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getAll() {
    return this.service.getAll();
  }

  @Get('default')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getDefault() {
    return this.service.getDefault();
  }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager')
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }

  @Post('calculate')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async calculate(@Body() body: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number; serviceId?: string; serviceGroupId?: string }) {
    return this.service.calculateFee(body.hostId, body.propertyId, body.propertyGroupId || null, body.amount, body.serviceId, body.serviceGroupId);
  }
}
