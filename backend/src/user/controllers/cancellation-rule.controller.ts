import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { RequireRole } from '../../auth/decorators';
import { CancellationRuleService } from '../services/cancellation-rule.service';
import { CancellationRule } from '../entity/cancellation-rule.entity';

@ApiTags('Cancellation Rules')
@ApiBearerAuth('JWT-auth')
@Controller('cancellation-rules')
@UseGuards(JwtAuthGuard)
export class CancellationRuleController {
  constructor(private readonly ruleService: CancellationRuleService) {}

  @Get()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Get my cancellation rules', description: '**Roles**: admin, manager' })
  getMine(@Request() req: any): Promise<CancellationRule[]> {
    return this.ruleService.getForUser(req.user.id);
  }

  @Get('host/:hostId')
  @ApiOperation({ summary: 'Get host cancellation rules', description: 'Public-facing rules for a host.' })
  @ApiParam({ name: 'hostId', type: 'string' })
  getForHost(@Param('hostId') hostId: string): Promise<CancellationRule[]> {
    return this.ruleService.getForHost(Number(hostId));
  }

  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Create cancellation rule', description: '**Roles**: admin, manager' })
  create(@Request() req: any, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.create(req.user.id, data);
  }

  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Update cancellation rule', description: '**Roles**: admin, manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(@Request() req: any, @Param('id') id: string, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.update(req.user.id, id, data);
  }

  @Delete(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Delete cancellation rule', description: '**Roles**: admin, manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.ruleService.remove(req.user.id, id);
    return { success: true };
  }
}
