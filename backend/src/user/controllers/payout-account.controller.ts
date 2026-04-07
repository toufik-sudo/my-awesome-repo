import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutAccountService } from '../services/payout-account.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Payout Accounts')
@ApiBearerAuth('JWT-auth')
@Controller('payout-accounts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class PayoutAccountController {
  constructor(private readonly service: PayoutAccountService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my payout accounts' })
  async getMine(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.service.getForHost(req.user.id);
  }

  @Get('all')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all payout accounts (hyper admin)' })
  async getAll() {
    return this.service.getAll();
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Add a payout account' })
  async create(@Request() req, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update a payout account' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete a payout account' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Request() req, @Param('id') id: string) {
    const scopeCtx = extractScopeContext(req);
    await this.service.remove(req.user.id, id);
    return { success: true };
  }
}
