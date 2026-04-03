import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards, Query,
} from '@nestjs/common';
import { PointsRuleService } from '../services/points-rule.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { PointsTargetRole } from '../entity/points-rule.entity';

@Controller('points-rules')
@UseGuards(PermissionGuard)
export class PointsRuleController {
  constructor(private readonly service: PointsRuleService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getAll() {
    return this.service.getAll();
  }

  @Get('defaults')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getDefaults() {
    return this.service.getDefaults();
  }

  @Get('earning')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getEarning() {
    return this.service.getEarningRules();
  }

  @Get('conversion')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getConversion() {
    return this.service.getConversionRules();
  }

  @Get('role/:role')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getByRole(@Param('role') role: PointsTargetRole) {
    return this.service.getByRole(role);
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
}
