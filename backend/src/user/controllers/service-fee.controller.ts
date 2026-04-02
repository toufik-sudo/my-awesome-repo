import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceFeeService } from '../services/service-fee.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Service Fees')
@ApiBearerAuth('JWT-auth')
@Controller('service-fees')
@UseGuards(PermissionGuard)
export class ServiceFeeController {
  constructor(private readonly service: ServiceFeeService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get all fee rules', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  async getAll() { return this.service.getAll(); }

  @Get('default')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get default fee rule' })
  async getDefault() { return this.service.getDefault(); }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get fee rules for a host' })
  @ApiParam({ name: 'hostId', type: 'string' })
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Create fee rule', description: '**Roles**: hyper_admin, hyper_manager' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Update fee rule' })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Delete fee rule' })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }

  @Post('calculate')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Calculate fee for a transaction', description: 'Simulate fee calculation.' })
  @ApiBody({ schema: { type: 'object', required: ['hostId', 'propertyId', 'amount'], properties: {
    hostId: { type: 'number' }, propertyId: { type: 'string', format: 'uuid' },
    propertyGroupId: { type: 'string', format: 'uuid' }, amount: { type: 'number' },
    serviceId: { type: 'string', format: 'uuid' }, serviceGroupId: { type: 'string', format: 'uuid' },
  }}})
  async calculate(@Body() body: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number; serviceId?: string; serviceGroupId?: string }) {
    return this.service.calculateFee(body.hostId, body.propertyId, body.propertyGroupId || null, body.amount, body.serviceId, body.serviceGroupId);
  }
}
