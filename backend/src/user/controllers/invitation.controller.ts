import {
  Controller, Get, Post, Delete, Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';
import { CreateInvitationDto } from '../dtos/requests/create-invitation.dto';
import { ConvertGuestToUserDto } from '../dtos/requests/convert-guest-to-user.dto';

@ApiTags('Invitations')
@ApiBearerAuth()
@Controller('roles/invitations')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get('allowed-roles')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get allowed invitation roles' })
  async getAllowedRoles(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.invitationService.getAllowedRolesForInviter(req.user.id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create invitation' })
  @ApiResponse({ status: 201 })
  async create(@Request() req, @Body() body: CreateInvitationDto) {
    const scopeCtx = extractScopeContext(req);
    return this.invitationService.createInvitation(req.user.id, body);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List my invitations' })
  async getAll(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.invitationService.getInvitations(req.user.id);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Cancel invitation' })
  @ApiParam({ name: 'id' })
  async cancel(@Request() req, @Param('id') id: string) {
    const scopeCtx = extractScopeContext(req);
    await this.invitationService.cancelInvitation(req.user.id, id);
    return { success: true };
  }

  @Post(':id/resend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Resend invitation' })
  @ApiParam({ name: 'id' })
  async resend(@Request() req, @Param('id') id: string) {
    const scopeCtx = extractScopeContext(req);
    return this.invitationService.resendInvitation(req.user.id, id);
  }

  @Post('accept/:token')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Accept invitation' })
  @ApiParam({ name: 'token' })
  async accept(@Request() req, @Param('token') token: string) {
    const scopeCtx = extractScopeContext(req);
    await this.invitationService.acceptInvitation(token, req.user.id);
    return { success: true };
  }

  @Post('convert-guest-to-user')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Convert guest to user' })
  async convertGuestToUser(@Request() req, @Body() body: ConvertGuestToUserDto) {
    const scopeCtx = extractScopeContext(req);
    return this.invitationService.convertGuestToUser(req.user.id, body.userId);
  }
}
