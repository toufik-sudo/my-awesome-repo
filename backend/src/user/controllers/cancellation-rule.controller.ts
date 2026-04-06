import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { CancellationRuleService } from '../services/cancellation-rule.service';
import { CancellationRule } from '../entity/cancellation-rule.entity';

@ApiTags('Cancellation Rules')
@ApiBearerAuth('JWT-auth')
@Controller('cancellation-rules')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class CancellationRuleController {
  constructor(private readonly ruleService: CancellationRuleService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get cancellation rules' })
  getMine(@Request() req: any): Promise<CancellationRule[]> {
    return this.ruleService.getForUser(req.user.id);
  }

  @Get('host/:hostId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get cancellation rules for a specific host' })
  getForHost(@Param('hostId') hostId: string): Promise<CancellationRule[]> {
    return this.ruleService.getForHost(Number(hostId));
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create cancellation rule' })
  create(@Request() req: any, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.create(req.user.id, data);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update cancellation rule' })
  update(@Request() req: any, @Param('id') id: string, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.update(req.user.id, id, data);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete cancellation rule' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.ruleService.remove(req.user.id, id);
    return { success: true };
  }
}
