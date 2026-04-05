import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Host Fee Absorptions')
@ApiBearerAuth('JWT-auth')
@Controller('host-fee-absorptions')
@UseGuards(PermissionGuard)
export class HostFeeAbsorptionController {
  constructor(private readonly service: HostFeeAbsorptionService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get absorption rules', description: 'Hyper roles see all; admin/manager see own' })
  async getMyAbsorptions(@Request() req) {
    return this.service.getForHost(req.user.id);
  }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Get absorption rules for a specific host' })
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  // [BE-05] Only admin/manager can create — hyper roles removed
  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Create absorption rule', description: 'Only admin/manager can create. Hyper roles cannot.' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  // [BE-05] Only admin/manager can update — hyper roles removed
  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Update absorption rule', description: 'Only admin/manager can update' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Delete absorption rule', description: 'All authorized roles can delete' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }
}
