import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { RequireRole } from '../../auth/decorators';
import { CancellationRuleService } from '../services/cancellation-rule.service';
import { CancellationRule } from '../entity/cancellation-rule.entity';

@ApiTags('Cancellation Rules')
@ApiBearerAuth('JWT-auth')
@Controller('cancellation-rules')
@UseGuards(PermissionGuard)
export class CancellationRuleController {
  constructor(private readonly ruleService: CancellationRuleService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get cancellation rules', description: 'Hyper roles see all; admin/manager see own' })
  getMine(@Request() req: any): Promise<CancellationRule[]> {
    return this.ruleService.getForUser(req.user.id);
  }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get cancellation rules for a specific host' })
  getForHost(@Param('hostId') hostId: string): Promise<CancellationRule[]> {
    return this.ruleService.getForHost(Number(hostId));
  }

  // [BE-06] Only admin/manager can create — hyper roles blocked by PermissionGuard
  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Create cancellation rule', description: 'Only admin/manager can create. Hyper roles cannot.' })
  create(@Request() req: any, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.create(req.user.id, data);
  }

  // [BE-06] Only admin/manager can update
  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Update cancellation rule', description: 'Only admin/manager can update' })
  update(@Request() req: any, @Param('id') id: string, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.update(req.user.id, id, data);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Delete cancellation rule', description: 'All authorized roles can delete' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.ruleService.remove(req.user.id, id);
    return { success: true };
  }
}
