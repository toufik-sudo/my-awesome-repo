import {
  Controller, Get, Post, Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ReferralService } from '../services/referral.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('referrals')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ReferralController {
  constructor(private readonly service: ReferralService) {}

  @Get('code')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getMyCode(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    const code = await this.service.getOrCreateReferralCode(req.user.id);
    return { code };
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async createReferral(@Request() req, @Body() body: { method: string; inviteeContact?: string; propertyId?: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.service.createReferral(req.user.id, body);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getMyReferrals(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.service.getUserReferrals(req.user.id);
  }

  @Get('stats')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getMyStats(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.service.getReferralStats(req.user.id);
  }

  @Post('signup/:code')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async completeSignup(@Param('code') code: string, @Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.service.completeSignup(code, req.user.id);
  }

  @Post('share')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async shareProperty(@Request() req, @Body() body: { propertyId: string; method: string; recipient?: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.service.shareProperty(req.user.id, body.propertyId, body.method, body.recipient);
  }

  @Get('share/:propertyId/stats')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getShareStats(@Param('propertyId') propertyId: string) {
    return this.service.getShareStats(propertyId);
  }
}
