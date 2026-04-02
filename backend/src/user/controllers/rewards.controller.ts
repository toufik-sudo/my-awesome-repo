import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RewardsService } from '../services/rewards.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { PointsService } from '../../modules/points/services/points.service';

@ApiTags('Rewards')
@ApiBearerAuth('JWT-auth')
@Controller('rewards')
@UseGuards(PermissionGuard)
export class RewardsController {
  constructor(
    private readonly service: RewardsService,
    private readonly pointsService: PointsService,
  ) {}

  @Get('shop')
  @ApiOperation({
    summary: 'Browse rewards shop',
    description: `Returns all active rewards available for redemption. Used as the public rewards catalog.

**Roles**: Any authenticated user

**Reward types**: \`discount\`, \`upgrade\`, \`free_service\`, \`free_night\`, \`cashback\`, \`gift\`

**Example response**:
\`\`\`json
[{
  "id": "...",
  "name": "10% Booking Discount",
  "type": "discount",
  "pointsCost": 200,
  "discountPercent": 10,
  "icon": "🏷️",
  "category": "discounts",
  "requiredTier": null
}]
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Array of active Reward objects for the shop' })
  async getShop() {
    return this.service.getShopRewards();
  }

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Get all rewards (admin)',
    description: `Returns all rewards including inactive/expired ones. For admin management.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiResponse({ status: 200, description: 'Array of all Reward objects' })
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get reward details',
    description: `Returns full details for a specific reward.

**Roles**: Any authenticated user`,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Reward object' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Create a reward',
    description: `Creates a new reward available in the shop.

**Roles**: \`hyper_admin\`, \`hyper_manager\`

**Example request**:
\`\`\`json
{
  "name": "10% Booking Discount",
  "description": "Get 10% off your next booking",
  "type": "discount",
  "pointsCost": 200,
  "discountPercent": 10,
  "icon": "🏷️",
  "category": "discounts",
  "maxRedemptions": 100,
  "maxPerUser": 3
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['name', 'type', 'pointsCost'], properties: {
    name: { type: 'string', example: '10% Booking Discount' },
    description: { type: 'string', example: 'Get 10% off your next booking' },
    type: { type: 'string', enum: ['discount', 'upgrade', 'free_service', 'free_night', 'cashback', 'gift'], example: 'discount' },
    pointsCost: { type: 'number', example: 200, description: 'Points required to redeem' },
    discountPercent: { type: 'number', example: 10 },
    discountAmount: { type: 'number', example: 0 },
    currency: { type: 'string', example: 'DZD' },
    icon: { type: 'string', example: '🏷️' },
    requiredTier: { type: 'string', enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'], description: 'Min tier required (null = any)' },
    maxRedemptions: { type: 'number', example: 100, description: 'Total limit (null = unlimited)' },
    maxPerUser: { type: 'number', example: 3, description: 'Per-user limit (null = unlimited)' },
    category: { type: 'string', example: 'discounts' },
    validFrom: { type: 'string', format: 'date' },
    validTo: { type: 'string', format: 'date' },
  }}})
  @ApiResponse({ status: 201, description: 'Reward created' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Update a reward',
    description: `Updates an existing reward. Send only changed fields.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Reward updated' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Delete a reward',
    description: `Permanently deletes a reward from the system.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Deleted — returns { success: true }' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }

  @Post(':id/redeem')
  @ApiOperation({
    summary: 'Redeem a reward',
    description: `Exchange points for a reward. Checks: sufficient points, tier requirement, availability, per-user limits.

**Roles**: Any authenticated user

**Process**: Validates eligibility → deducts points → creates a redemption code → returns the code

**Response includes a unique redemption code** (e.g., \`RWD-A1B2C3D4\`) valid for 90 days.`,
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Reward ID to redeem' })
  @ApiResponse({ status: 201, description: 'Redemption created — returns RewardRedemption with code' })
  @ApiResponse({ status: 400, description: 'Insufficient points, sold out, tier too low, or limit reached' })
  async redeem(@Request() req, @Param('id') id: string) {
    return this.service.redeem(req.user.id, id, this.pointsService);
  }

  @Get('me/redemptions')
  @ApiOperation({
    summary: 'Get my redemptions',
    description: `Returns all reward redemptions made by the authenticated user, with reward details.

**Roles**: Any authenticated user

**Statuses**: \`pending\`, \`confirmed\`, \`used\`, \`expired\`, \`cancelled\``,
  })
  @ApiResponse({ status: 200, description: 'Array of RewardRedemption objects with Reward details' })
  async getMyRedemptions(@Request() req) {
    return this.service.getUserRedemptions(req.user.id);
  }

  @Post('redemptions/:code/use')
  @ApiOperation({
    summary: 'Use a redemption code',
    description: `Mark a redemption code as used, optionally linking it to a booking or service.

**Roles**: Any authenticated user (owner of the code)

**Example request**:
\`\`\`json
{
  "referenceId": "booking-uuid",
  "referenceType": "booking"
}
\`\`\``,
  })
  @ApiParam({ name: 'code', type: 'string', example: 'RWD-A1B2C3D4' })
  @ApiBody({ schema: { type: 'object', properties: {
    referenceId: { type: 'string', description: 'Booking or service booking ID' },
    referenceType: { type: 'string', enum: ['booking', 'service_booking'], description: 'Type of reference' },
  }}})
  @ApiResponse({ status: 200, description: 'Redemption marked as used' })
  @ApiResponse({ status: 400, description: 'Already used, cancelled, or expired' })
  async useRedemption(
    @Request() req,
    @Param('code') code: string,
    @Body() body: { referenceId?: string; referenceType?: string },
  ) {
    return this.service.useRedemption(req.user.id, code, body.referenceId, body.referenceType);
  }

  @Delete('redemptions/:id/cancel')
  @ApiOperation({
    summary: 'Cancel a redemption and refund points',
    description: `Cancels a pending/confirmed redemption and refunds the spent points. Cannot cancel used redemptions.

**Roles**: Any authenticated user (owner of the redemption)`,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Redemption cancelled and points refunded' })
  @ApiResponse({ status: 400, description: 'Cannot cancel a used redemption' })
  async cancelRedemption(@Request() req, @Param('id') id: string) {
    await this.service.cancelRedemption(req.user.id, id, this.pointsService);
    return { success: true };
  }

  @Get('admin/redemptions')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Get all redemptions (admin)',
    description: `Returns the latest 100 redemptions across all users for admin oversight.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiResponse({ status: 200, description: 'Array of RewardRedemption objects with user and reward details' })
  async getAllRedemptions() {
    return this.service.getAllRedemptions();
  }
}
