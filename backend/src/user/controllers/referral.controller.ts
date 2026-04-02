import {
  Controller, Get, Post, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from '../services/referral.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Referrals')
@ApiBearerAuth('JWT-auth')
@Controller('referrals')
@UseGuards(PermissionGuard)
export class ReferralController {
  constructor(private readonly service: ReferralService) {}

  @Get('code')
  @ApiOperation({
    summary: 'Get my referral code',
    description: `Returns the authenticated user's unique referral code. Creates one if it doesn't exist yet.

**Roles**: Any authenticated user

**Example response**: \`{ "code": "REF-A1B2C3D4" }\``,
  })
  @ApiResponse({ status: 200, description: 'Referral code object', schema: { type: 'object', properties: { code: { type: 'string', example: 'REF-A1B2C3D4' } } } })
  async getMyCode(@Request() req) {
    const code = await this.service.getOrCreateReferralCode(req.user.id);
    return { code };
  }

  @Post()
  @ApiOperation({
    summary: 'Create a referral',
    description: `Initiate a referral by sharing a code via email, SMS, or a link.

**Roles**: Any authenticated user

**Example request**:
\`\`\`json
{
  "method": "email",
  "inviteeContact": "friend@example.com",
  "propertyId": "550e8400-..."
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['method'], properties: {
    method: { type: 'string', enum: ['email', 'sms', 'whatsapp', 'link', 'social'], example: 'email' },
    inviteeContact: { type: 'string', example: 'friend@example.com', description: 'Contact info of the invitee' },
    propertyId: { type: 'string', format: 'uuid', description: 'Optional — attach a specific property to share' },
  }}})
  @ApiResponse({ status: 201, description: 'Referral created — returns Referral record with code and status' })
  async createReferral(@Request() req, @Body() body: { method: string; inviteeContact?: string; propertyId?: string }) {
    return this.service.createReferral(req.user.id, body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get my referrals',
    description: `Returns all referrals initiated by the authenticated user.

**Roles**: Any authenticated user

**Statuses**: \`pending\` → \`signed_up\` → \`first_booking\` → \`completed\``,
  })
  @ApiResponse({ status: 200, description: 'Array of Referral objects with referred user info and status' })
  async getMyReferrals(@Request() req) {
    return this.service.getUserReferrals(req.user.id);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get my referral statistics',
    description: `Aggregated stats: total referrals, by status, total points earned.

**Roles**: Any authenticated user

**Example response**:
\`\`\`json
{
  "total": 8,
  "pending": 2,
  "signedUp": 3,
  "completed": 3,
  "totalPointsEarned": 300
}
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Referral statistics object' })
  async getMyStats(@Request() req) {
    return this.service.getReferralStats(req.user.id);
  }

  @Post('signup/:code')
  @ApiOperation({
    summary: 'Complete referral signup',
    description: `Called when a new user who signed up via a referral code completes registration. Awards points to both referrer and referee.

**Roles**: Any authenticated user

**Process**: Validates code → links referred user → awards referrer points (100) and referee points (50)`,
  })
  @ApiParam({ name: 'code', type: 'string', example: 'REF-A1B2C3D4', description: 'Referral code used during signup' })
  @ApiResponse({ status: 200, description: 'Referral completed — returns updated Referral record' })
  @ApiResponse({ status: 400, description: 'Invalid or expired referral code' })
  async completeSignup(@Param('code') code: string, @Request() req) {
    return this.service.completeSignup(code, req.user.id);
  }

  @Post('share')
  @ApiOperation({
    summary: 'Share a property',
    description: `Record a property share via social media, email, or other methods. Awards sharing points (5 pts).

**Roles**: Any authenticated user

**Methods**: \`email\`, \`whatsapp\`, \`facebook\`, \`twitter\`, \`copy_link\`

**Example request**:
\`\`\`json
{
  "propertyId": "550e8400-...",
  "method": "whatsapp",
  "recipient": "+213551234567"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['propertyId', 'method'], properties: {
    propertyId: { type: 'string', format: 'uuid' },
    method: { type: 'string', enum: ['email', 'whatsapp', 'facebook', 'twitter', 'copy_link'], example: 'whatsapp' },
    recipient: { type: 'string', description: 'Optional recipient contact info' },
  }}})
  @ApiResponse({ status: 201, description: 'Share recorded — returns PropertyShare record' })
  async shareProperty(@Request() req, @Body() body: { propertyId: string; method: string; recipient?: string }) {
    return this.service.shareProperty(req.user.id, body.propertyId, body.method, body.recipient);
  }

  @Get('share/:propertyId/stats')
  @ApiOperation({
    summary: 'Get property share statistics',
    description: `Returns share count and breakdown by method for a specific property.

**Roles**: Any authenticated user

**Example response**:
\`\`\`json
{
  "total": 15,
  "byMethod": { "whatsapp": 8, "facebook": 4, "email": 2, "copy_link": 1 }
}
\`\`\``,
  })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Share statistics object' })
  async getShareStats(@Param('propertyId') propertyId: string) {
    return this.service.getShareStats(propertyId);
  }
}
