import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Fee Absorption')
@ApiBearerAuth('JWT-auth')
@Controller('host-fee-absorptions')
@UseGuards(PermissionGuard)
export class HostFeeAbsorptionController {
  constructor(private readonly service: HostFeeAbsorptionService) {}

  @Get()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Get my fee absorptions', description: '**Roles**: admin, manager' })
  async getMyAbsorptions(@Request() req) {
    return this.service.getForHost(req.user.id);
  }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Get fee absorptions for a host', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'hostId', type: 'string' })
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Create fee absorption', description: '**Roles**: admin, manager' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Update fee absorption', description: '**Roles**: admin, manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Delete fee absorption', description: '**Roles**: admin, manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }
}
