import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { RequireRole } from '../../auth/decorators';
import { CancellationRuleService } from '../services/cancellation-rule.service';
import { CancellationRule } from '../entity/cancellation-rule.entity';

@ApiTags('Cancellation Rules')
@ApiBearerAuth('JWT-auth')
@Controller('cancellation-rules')
@UseGuards(JwtAuthGuard)
export class CancellationRuleController {
  constructor(private readonly ruleService: CancellationRuleService) {}

  @Get()
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Get my cancellation rules',
    description: `Returns cancellation rules owned by the authenticated host/admin.

**Roles**: \`admin\`, \`manager\`

**Policy types**: \`flexible\` (24h free cancel), \`moderate\` (72h), \`strict\` (7 days), \`custom\`

**Example response**:
\`\`\`json
[{
  "policyType": "moderate",
  "fullRefundHours": 72,
  "partialRefundHours": 24,
  "partialRefundPercent": 50,
  "lateCancelPenalty": 50,
  "noShowPenalty": true,
  "noShowPenaltyPercent": 100
}]
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Array of CancellationRule records' })
  getMine(@Request() req: any): Promise<CancellationRule[]> {
    return this.ruleService.getForUser(req.user.id);
  }

  @Get('host/:hostId')
  @ApiOperation({
    summary: 'Get host cancellation rules (public)',
    description: `Public endpoint — returns active cancellation rules for a host. Used by guests to see refund policies before booking.

**Roles**: Public (any authenticated user)`,
  })
  @ApiParam({ name: 'hostId', type: 'string', example: '3', description: 'Host user ID' })
  @ApiResponse({ status: 200, description: 'Array of active CancellationRule records for the host' })
  getForHost(@Param('hostId') hostId: string): Promise<CancellationRule[]> {
    return this.ruleService.getForHost(Number(hostId));
  }

  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Create a cancellation rule',
    description: `Creates a new cancellation policy for properties/services.

**Roles**: \`admin\`, \`manager\`

**Example request**:
\`\`\`json
{
  "policyType": "moderate",
  "scope": "all",
  "fullRefundHours": 72,
  "partialRefundHours": 24,
  "partialRefundPercent": 50,
  "lateCancelPenalty": 50,
  "noShowPenalty": true,
  "noShowPenaltyPercent": 100
}
\`\`\``,
  })
  @ApiResponse({ status: 201, description: 'Rule created' })
  create(@Request() req: any, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.create(req.user.id, data);
  }

  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Update a cancellation rule',
    description: `Updates an existing cancellation rule. Send only changed fields.

**Roles**: \`admin\`, \`manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Rule updated' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  update(@Request() req: any, @Param('id') id: string, @Body() data: Partial<CancellationRule>): Promise<CancellationRule> {
    return this.ruleService.update(req.user.id, id, data);
  }

  @Delete(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Delete a cancellation rule',
    description: `Permanently deletes a cancellation rule.

**Roles**: \`admin\`, \`manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Deleted — returns { success: true }' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.ruleService.remove(req.user.id, id);
    return { success: true };
  }
}
