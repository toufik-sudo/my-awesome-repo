import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Get all points rules',
    description: `Returns all earning and conversion rules configured on the platform.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\` (read-only)

**Rule types**:
- **earning**: Points awarded when a user performs an action (e.g., booking, review, referral)
- **conversion**: How points convert to currency (e.g., 100 pts = 10 DZD)

**Scopes**: \`global\`, \`host\`, \`property_group\`, \`service_group\`, \`property\`, \`service\``,
  })
  @ApiResponse({ status: 200, description: 'Array of PointsRule objects' })
  async getAll() { return this.service.getAll(); }

  @Get('defaults')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get default points rules',
    description: `Returns only rules marked as \`isDefault: true\` and \`isActive: true\`. These are the fallback rules applied when no specific override exists.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  async getDefaults() { return this.service.getDefaults(); }

  @Get('earning')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get earning rules only',
    description: `Returns active earning rules (ruleType=earning). These define how many points users earn per action.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Example**: booking_completed → 50 points × 1.0 multiplier = 50 pts`,
  })
  async getEarning() { return this.service.getEarningRules(); }

  @Get('conversion')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get conversion rules only',
    description: `Returns active conversion rules (ruleType=conversion). These define how points translate to currency for redemption.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Fields**: conversionRate (pts per 1 currency unit), currency (DZD/EUR), minPointsForConversion`,
  })
  async getConversion() { return this.service.getConversionRules(); }

  @Get('role/:role')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get points rules by target role',
    description: `Filters active rules by target audience.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Target roles**: \`guest\` (booking guests), \`manager\` (property managers)`,
  })
  @ApiParam({ name: 'role', type: 'string', enum: ['guest', 'manager'], example: 'guest', description: 'Target audience for the rules' })
  async getByRole(@Param('role') role: PointsTargetRole) { return this.service.getByRole(role); }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Create a points rule',
    description: `Creates a new earning or conversion rule.

**Roles**: \`hyper_admin\`, \`hyper_manager\` only

**Earning rules** require: \`action\`, \`pointsAmount\` (>0), \`multiplier\` (>0). Optional: \`minNights\`, \`validFrom/validTo\`, \`maxPointsPerPeriod\`, \`period\`.
**Conversion rules** require: \`conversionRate\`, \`currency\`, \`minPointsForConversion\`. No points/multiplier needed.

**Example earning rule**:
\`\`\`json
{
  "ruleType": "earning",
  "targetRole": "guest",
  "scope": "global",
  "action": "booking_completed",
  "pointsAmount": 50,
  "multiplier": 1.5,
  "minNights": 3,
  "validFrom": "2026-06-01",
  "validTo": "2026-08-31",
  "isDefault": false,
  "description": "Summer 2026 bonus"
}
\`\`\`

**Example conversion rule**:
\`\`\`json
{
  "ruleType": "conversion",
  "targetRole": "guest",
  "scope": "global",
  "action": "points_to_currency",
  "conversionRate": 10.0,
  "currency": "DZD",
  "minPointsForConversion": 500,
  "isDefault": true
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['ruleType', 'targetRole', 'action'], properties: {
    ruleType: { type: 'string', enum: ['earning', 'conversion'], example: 'earning' },
    targetRole: { type: 'string', enum: ['guest', 'manager'], example: 'guest' },
    scope: { type: 'string', enum: ['global', 'host', 'property_group', 'service_group', 'property', 'service'], example: 'global' },
    action: { type: 'string', example: 'booking_completed' },
    pointsAmount: { type: 'number', example: 50, description: 'Required for earning rules, must be > 0' },
    multiplier: { type: 'number', example: 1.5, description: 'Required for earning rules, must be > 0' },
    minNights: { type: 'number', example: 3, description: 'Optional min nights for earning' },
    validFrom: { type: 'string', format: 'date', example: '2026-06-01', description: 'Optional start date' },
    validTo: { type: 'string', format: 'date', example: '2026-08-31', description: 'Optional end date' },
    maxPointsPerPeriod: { type: 'number', example: 500 },
    period: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
    conversionRate: { type: 'number', example: 10.0, description: 'Required for conversion rules' },
    currency: { type: 'string', example: 'DZD', description: 'Required for conversion rules' },
    minPointsForConversion: { type: 'number', example: 500, description: 'Required for conversion rules' },
    isDefault: { type: 'boolean', example: false },
    description: { type: 'string', example: 'Summer 2026 double points' },
  }}})
  @ApiResponse({ status: 201, description: 'Rule created — returns the PointsRule record' })
  @ApiResponse({ status: 403, description: 'Forbidden — only hyper roles can create rules' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Update a points rule',
    description: `Updates an existing points rule. Only hyper roles can modify rules.

**Roles**: \`hyper_admin\`, \`hyper_manager\`

Send only the fields you want to update — other fields remain unchanged.`,
  })
  @ApiParam({ name: 'ruleId', format: 'uuid', description: 'ID of the points rule to update' })
  @ApiResponse({ status: 200, description: 'Rule updated — returns the updated PointsRule' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Delete a points rule',
    description: `Permanently deletes a points rule.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Rule deleted — returns { success: true }' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }
}
