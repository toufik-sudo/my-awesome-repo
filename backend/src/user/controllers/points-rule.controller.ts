import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { PointsRuleService } from '../services/points-rule.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';
import { PointsTargetRole } from '../entity/points-rule.entity';

@Controller('points-rules')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class PointsRuleController {
  constructor(private readonly service: PointsRuleService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getAll(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.getAll();
  }

  @Get('defaults')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getDefaults(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.getDefaults();
  }

  @Get('earning')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getEarning(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.getEarningRules();
  }

  @Get('conversion')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getConversion() {
    return this.service.getConversionRules();
  }

  @Get('role/:role')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getByRole(@Param('role') role: PointsTargetRole) {
    return this.service.getByRole(role);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async create(@Request() req, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    const scopeCtx = extractScopeContext(req);
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }
}
