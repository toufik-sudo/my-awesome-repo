import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PointsRuleService } from '../services/points-rule.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { PointsTargetRole } from '../entity/points-rule.entity';

@ApiTags('Points Rules')
@ApiBearerAuth('JWT-auth')
@Controller('points-rules')
@UseGuards(PermissionGuard)
export class PointsRuleController {
  constructor(private readonly service: PointsRuleService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get all points rules', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  async getAll() { return this.service.getAll(); }

  @Get('defaults')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get default points rules' })
  async getDefaults() { return this.service.getDefaults(); }

  @Get('earning')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get earning rules' })
  async getEarning() { return this.service.getEarningRules(); }

  @Get('conversion')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get conversion rules' })
  async getConversion() { return this.service.getConversionRules(); }

  @Get('role/:role')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get points rules by target role' })
  @ApiParam({ name: 'role', type: 'string' })
  async getByRole(@Param('role') role: PointsTargetRole) { return this.service.getByRole(role); }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Create points rule', description: '**Roles**: hyper_admin, hyper_manager' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Update points rule' })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Delete points rule' })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }
}
