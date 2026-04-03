import {
  Controller, Get, Post, Body, Param, Request, UseGuards, Query,
} from '@nestjs/common';
import { ReferralService } from '../services/referral.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('referrals')
@UseGuards(PermissionGuard)
export class ReferralController {
  constructor(private readonly service: ReferralService) {}

  @Get('code')
  async getMyCode(@Request() req) {
    const code = await this.service.getOrCreateReferralCode(req.user.id);
    return { code };
  }

  @Post()
  async createReferral(@Request() req, @Body() body: {
    method: string;
    inviteeContact?: string;
    propertyId?: string;
  }) {
    return this.service.createReferral(req.user.id, body);
  }

  @Get()
  async getMyReferrals(@Request() req) {
    return this.service.getUserReferrals(req.user.id);
  }

  @Get('stats')
  async getMyStats(@Request() req) {
    return this.service.getReferralStats(req.user.id);
  }

  @Post('signup/:code')
  async completeSignup(@Param('code') code: string, @Request() req) {
    return this.service.completeSignup(code, req.user.id);
  }

  @Post('share')
  async shareProperty(@Request() req, @Body() body: {
    propertyId: string;
    method: string;
    recipient?: string;
  }) {
    return this.service.shareProperty(req.user.id, body.propertyId, body.method, body.recipient);
  }

  @Get('share/:propertyId/stats')
  async getShareStats(@Param('propertyId') propertyId: string) {
    return this.service.getShareStats(propertyId);
  }
}
