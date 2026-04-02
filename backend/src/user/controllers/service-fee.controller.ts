import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceFeeService } from '../services/service-fee.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Service Fees')
@ApiBearerAuth('JWT-auth')
@Controller('service-fees')
@UseGuards(PermissionGuard)
export class ServiceFeeController {
  constructor(private readonly service: ServiceFeeService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get all fee rules',
    description: `Returns all service fee rules configured on the platform.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\` (read-only)

**Calculation types**:
- \`percentage\`: fee = amount × rate%
- \`fixed\`: fee = fixedAmount (constant)
- \`percentage_plus_fixed\`: fee = amount × rate% + fixedAmount
- \`fixed_then_percentage\`: fee = fixedAmount up to threshold, then percentage on remainder

**Priority**: Lower number = higher priority. When multiple rules match, the lowest priority number wins.`,
  })
  @ApiResponse({ status: 200, description: 'Array of ServiceFeeRule records' })
  async getAll() { return this.service.getAll(); }

  @Get('default')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get the default fee rule',
    description: `Returns the global default fee rule (isDefault=true). Falls back to this when no specific override applies.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  @ApiResponse({ status: 200, description: 'Default ServiceFeeRule record' })
  async getDefault() { return this.service.getDefault(); }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Get fee rules for a specific host',
    description: `Returns all fee rules scoped to a specific host user ID.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  @ApiParam({ name: 'hostId', type: 'string', example: '3', description: 'Host user ID' })
  @ApiResponse({ status: 200, description: 'Array of ServiceFeeRule records for this host' })
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Create a fee rule',
    description: `Creates a new service fee rule.

**Roles**: \`hyper_admin\`, \`hyper_manager\` only

**Example (fixed_then_percentage)**:
\`\`\`json
{
  "scope": "global",
  "calculationType": "fixed_then_percentage",
  "fixedAmount": 1500,
  "fixedThreshold": 20000,
  "percentageRate": 8.0,
  "minFee": 1500,
  "maxFee": 10000,
  "priority": 70,
  "description": "1500 DZD up to 20000, then 8% beyond"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['scope', 'calculationType'], properties: {
    scope: { type: 'string', enum: ['global', 'host', 'property_group', 'property', 'service_group', 'service'], example: 'global' },
    calculationType: { type: 'string', enum: ['percentage', 'fixed', 'percentage_plus_fixed', 'fixed_then_percentage'], example: 'percentage' },
    percentageRate: { type: 'number', example: 10.0 },
    fixedAmount: { type: 'number', example: 0 },
    fixedThreshold: { type: 'number', example: 20000, description: 'Only for fixed_then_percentage' },
    minFee: { type: 'number', example: 500 },
    maxFee: { type: 'number', example: 10000 },
    priority: { type: 'number', example: 100, description: 'Lower = higher priority' },
    isDefault: { type: 'boolean', example: false },
    description: { type: 'string', example: 'Platform fee 10%' },
    targetHostId: { type: 'number', description: 'Required for scope=host' },
    targetPropertyGroupId: { type: 'string', format: 'uuid' },
    targetPropertyId: { type: 'string', format: 'uuid' },
  }}})
  @ApiResponse({ status: 201, description: 'Rule created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Update a fee rule',
    description: `Updates an existing fee rule. Send only changed fields.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Rule updated' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async update(@Request() req, @Param('ruleId') ruleId: string, @Body() body: any) {
    return this.service.update(req.user.id, ruleId, body);
  }

  @Delete(':ruleId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Delete a fee rule',
    description: `Permanently deletes a fee rule.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'ruleId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Deleted — returns { success: true }' })
  async remove(@Request() req, @Param('ruleId') ruleId: string) {
    await this.service.remove(req.user.id, ruleId);
    return { success: true };
  }

  @Post('calculate')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Simulate fee calculation',
    description: `Calculates the fee for a given transaction amount based on matching rules. Returns the applicable rule and computed fee.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Example request**:
\`\`\`json
{
  "hostId": 3,
  "propertyId": "550e8400-...",
  "amount": 25000
}
\`\`\`

**Example response**:
\`\`\`json
{
  "fee": 2500,
  "rule": { "calculationType": "percentage", "percentageRate": 10.0, ... }
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['hostId', 'propertyId', 'amount'], properties: {
    hostId: { type: 'number', example: 3 },
    propertyId: { type: 'string', format: 'uuid' },
    propertyGroupId: { type: 'string', format: 'uuid' },
    amount: { type: 'number', example: 25000, description: 'Transaction amount in DZD' },
    serviceId: { type: 'string', format: 'uuid' },
    serviceGroupId: { type: 'string', format: 'uuid' },
  }}})
  @ApiResponse({ status: 200, description: 'Calculated fee with the matching rule' })
  async calculate(@Body() body: { hostId: number; propertyId: string; propertyGroupId?: string; amount: number; serviceId?: string; serviceGroupId?: string }) {
    return this.service.calculateFee(body.hostId, body.propertyId, body.propertyGroupId || null, body.amount, body.serviceId, body.serviceGroupId);
  }
}
