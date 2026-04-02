import {
  Controller, Get, Post, Body, Param, Request, UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from '../services/referral.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Referrals')
@ApiBearerAuth('JWT-auth')
@Controller('referrals')
@UseGuards(PermissionGuard)
export class ReferralController {
  constructor(private readonly service: ReferralService) {}

  @Get('code')
  @ApiOperation({ summary: 'Get my referral code', description: 'Get or create a unique referral code.' })
  async getMyCode(@Request() req) {
    const code = await this.service.getOrCreateReferralCode(req.user.id);
    return { code };
  }

  @Post()
  @ApiOperation({ summary: 'Create a referral' })
  async createReferral(@Request() req, @Body() body: { method: string; inviteeContact?: string; propertyId?: string }) {
    return this.service.createReferral(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get my referrals' })
  async getMyReferrals(@Request() req) {
    return this.service.getUserReferrals(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get my referral statistics' })
  async getMyStats(@Request() req) {
    return this.service.getReferralStats(req.user.id);
  }

  @Post('signup/:code')
  @ApiOperation({ summary: 'Complete referral signup', description: 'New user completes signup via referral code.' })
  @ApiParam({ name: 'code', type: 'string' })
  async completeSignup(@Param('code') code: string, @Request() req) {
    return this.service.completeSignup(code, req.user.id);
  }

  @Post('share')
  @ApiOperation({ summary: 'Share a property', description: 'Share a property link via SMS, email, etc.' })
  async shareProperty(@Request() req, @Body() body: { propertyId: string; method: string; recipient?: string }) {
    return this.service.shareProperty(req.user.id, body.propertyId, body.method, body.recipient);
  }

  @Get('share/:propertyId/stats')
  @ApiOperation({ summary: 'Get property share stats' })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  async getShareStats(@Param('propertyId') propertyId: string) {
    return this.service.getShareStats(propertyId);
  }
}
