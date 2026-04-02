import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Fee Absorption')
@ApiBearerAuth('JWT-auth')
@Controller('host-fee-absorptions')
@UseGuards(PermissionGuard)
export class HostFeeAbsorptionController {
  constructor(private readonly service: HostFeeAbsorptionService) {}

  @Get()
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Get my fee absorptions',
    description: `Returns fee absorption settings for the authenticated host. Fee absorption means the host pays part/all of the platform fee instead of the guest.

**Roles**: \`admin\`, \`manager\`

**Example**: An admin absorbs 100% of fees for cash payments → guests pay zero platform fee when paying cash.`,
  })
  @ApiResponse({ status: 200, description: 'Array of HostFeeAbsorption records' })
  async getMyAbsorptions(@Request() req) {
    return this.service.getForHost(req.user.id);
  }

  @Get('host/:hostId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Get fee absorptions for a specific host',
    description: `View another host's fee absorption settings. Used by hyper roles for oversight.

**Roles**: \`hyper_admin\`, \`hyper_manager\` only`,
  })
  @ApiParam({ name: 'hostId', type: 'string', example: '3' })
  @ApiResponse({ status: 200, description: 'Array of HostFeeAbsorption records' })
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Create a fee absorption rule',
    description: `Create a new rule where the host absorbs a percentage of the platform fee.

**Roles**: \`admin\`, \`manager\`

**Example request**:
\`\`\`json
{
  "scope": "all",
  "absorptionPercent": 50,
  "handToHandOnly": false,
  "paymentMethods": ["cash", "ccp"],
  "validFrom": "2026-06-01",
  "validTo": "2026-08-31",
  "description": "Summer promo — host absorbs 50%"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['scope', 'absorptionPercent'], properties: {
    scope: { type: 'string', enum: ['all', 'property_group', 'service_group', 'property', 'service'], example: 'all' },
    absorptionPercent: { type: 'number', example: 50, description: '0-100 — percentage of fee host absorbs' },
    handToHandOnly: { type: 'boolean', example: false, description: 'Only for cash/hand-to-hand payments' },
    paymentMethods: { type: 'array', items: { type: 'string' }, example: ['cash', 'ccp'], description: 'Null = all methods' },
    validFrom: { type: 'string', format: 'date' },
    validTo: { type: 'string', format: 'date' },
    description: { type: 'string' },
  }}})
  @ApiResponse({ status: 201, description: 'Absorption rule created' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Update a fee absorption rule',
    description: `Update an existing fee absorption rule.

**Roles**: \`admin\`, \`manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Rule updated' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Delete a fee absorption rule',
    description: `Permanently removes a fee absorption rule.

**Roles**: \`admin\`, \`manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Deleted — returns { success: true }' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }
}
