import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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

  /** Get all cancellation rules for the authenticated host (or all for hyper) */
  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get cancellation rules', description: 'Hyper roles see all; admin/manager see own' })
  getMine(@Request() req: any): Promise<CancellationRule[]> {
    return this.ruleService.getForUser(req.user.id);
  }

  /** Get cancellation rules for a specific host (public-facing) */
  @Get('host/:hostId')
  @ApiOperation({ summary: 'Get cancellation rules for a specific host' })
  getForHost(@Param('hostId') hostId: string): Promise<CancellationRule[]> {
    return this.ruleService.getForHost(Number(hostId));
  }

  /** Create a new cancellation rule — only admin/manager */
  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Create cancellation rule', description: 'Only admin/manager can create. Hyper admin cannot.' })
  create(
    @Request() req: any,
    @Body() data: Partial<CancellationRule>,
  ): Promise<CancellationRule> {
    const role = req.user.role;
    if (role === 'hyper_admin' || role === 'hyper_manager') {
      throw new ForbiddenException('Hyper admins cannot create cancellation rules');
    }
    return this.ruleService.create(req.user.id, data);
  }

  /** Update an existing cancellation rule — only admin/manager */
  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Update cancellation rule', description: 'Only admin/manager can update' })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: Partial<CancellationRule>,
  ): Promise<CancellationRule> {
    return this.ruleService.update(req.user.id, id, data);
  }

  /** Delete a cancellation rule — all authorized roles */
  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Delete cancellation rule', description: 'All authorized roles can delete' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.ruleService.remove(req.user.id, id);
    return { success: true };
  }
}
