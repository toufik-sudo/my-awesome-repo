import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutAccountService } from '../services/payout-account.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Payout Accounts')
@ApiBearerAuth('JWT-auth')
@Controller('payout-accounts')
@UseGuards(PermissionGuard)
export class PayoutAccountController {
  constructor(private readonly service: PayoutAccountService) {}

  @Get()
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Get my payout accounts',
    description: `Returns payout accounts for the authenticated host. These are bank accounts where the hyper admin sends payouts.

**Roles**: \`admin\`, \`manager\`
**Note**: Guests pay to hyper admin accounts. Hyper admin then pays out to host payout accounts.`,
  })
  @ApiResponse({ status: 200, description: 'Array of PayoutAccount records' })
  async getMine(@Request() req) {
    return this.service.getForHost(req.user.id);
  }

  @Get('all')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Get all payout accounts (hyper admin)',
    description: `Returns all host payout accounts for hyper admin to manage payouts.

**Roles**: \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiResponse({ status: 200, description: 'Array of PayoutAccount records with host info' })
  async getAll() {
    return this.service.getAll();
  }

  @Post()
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Add a payout account',
    description: `Adds a new bank account for receiving payouts from the platform.

**Roles**: \`admin\`, \`manager\`

**Example**:
\`\`\`json
{
  "accountType": "ccp",
  "bankName": "CCP",
  "accountNumber": "0012345678",
  "accountKey": "90",
  "holderName": "Ahmed Benzema"
}
\`\`\``,
  })
  @ApiResponse({ status: 201, description: 'Account created' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Update a payout account',
    description: `Updates an existing payout account.

**Roles**: \`admin\`, \`manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Account updated' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Delete a payout account',
    description: `Removes a payout account.

**Roles**: \`admin\`, \`manager\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }
}
