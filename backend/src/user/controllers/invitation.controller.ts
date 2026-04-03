import {
  Controller, Get, Post, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CreateInvitationDto } from '../dtos/requests/create-invitation.dto';
import { ConvertGuestToUserDto } from '../dtos/requests/convert-guest-to-user.dto';

@ApiTags('Invitations')
@ApiBearerAuth()
@Controller('roles/invitations')
@UseGuards(PermissionGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get('allowed-roles')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({
    summary: 'Get allowed invitation roles',
    description: `Returns the roles the authenticated user can invite based on the invitation rules matrix:
    - **hyper_admin** → hyper_manager, admin, user, guest
    - **hyper_manager** → admin, guest
    - **admin** → manager, guest
    - **manager** → guest`,
  })
  @ApiResponse({ status: 200, description: 'List of invitable role strings' })
  async getAllowedRoles(@Request() req) {
    return this.invitationService.getAllowedRolesForInviter(req.user.id);
  }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({
    summary: 'Create invitation',
    description: `Send an invitation to join the platform. Role must match the invitation rules:
    - hyper_admin → can invite hyper_manager, admin, user, guest
    - hyper_manager → can invite admin, guest
    - admin → can invite manager, guest
    - manager → can invite guest only
    
    **Guest behavior**: Guest inherits the inviter's property/service scope (read-only).
    **Admin behavior**: Invited admin creates their own properties — no scope sharing.`,
  })
  @ApiResponse({ status: 201, description: 'Invitation created and sent' })
  @ApiResponse({ status: 403, description: 'Role not allowed for this inviter' })
  async create(@Request() req, @Body() body: CreateInvitationDto) {
    return this.invitationService.createInvitation(req.user.id, body);
  }

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'List my invitations', description: 'Returns all invitations sent by the authenticated user, ordered by creation date descending.' })
  @ApiResponse({ status: 200, description: 'Array of Invitation objects' })
  async getAll(@Request() req) {
    return this.invitationService.getInvitations(req.user.id);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Cancel invitation', description: 'Cancel a pending invitation. Only the inviter can cancel their own invitations.' })
  @ApiParam({ name: 'id', description: 'Invitation UUID' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async cancel(@Request() req, @Param('id') id: string) {
    await this.invitationService.cancelInvitation(req.user.id, id);
    return { success: true };
  }

  @Post(':id/resend')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Resend invitation', description: 'Resend an invitation email/SMS and reset its 7-day expiry.' })
  @ApiParam({ name: 'id', description: 'Invitation UUID' })
  @ApiResponse({ status: 200, description: 'Invitation resent' })
  async resend(@Request() req, @Param('id') id: string) {
    return this.invitationService.resendInvitation(req.user.id, id);
  }

  @Post('accept/:token')
  @ApiOperation({
    summary: 'Accept invitation',
    description: `Accept an invitation using the token from the invitation link.
    The user's role is updated and, for guests, scope is inherited from the inviter.
    The inviter receives a notification.`,
  })
  @ApiParam({ name: 'token', description: 'Invitation token (UUID)' })
  @ApiResponse({ status: 200, description: 'Invitation accepted, role assigned' })
  @ApiResponse({ status: 404, description: 'Invalid token' })
  @ApiResponse({ status: 403, description: 'Invitation expired or already used' })
  async accept(@Request() req, @Param('token') token: string) {
    await this.invitationService.acceptInvitation(token, req.user.id);
    return { success: true };
  }

  @Post('convert-guest-to-user')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Convert guest to user (IT MVP exception)',
    description: `Converts a guest account to a regular user, giving them full access to all properties and services.
    This is used when a guest requests full access via support.
    Only hyper_admin or hyper_manager can perform this action.`,
  })
  @ApiBody({ type: ConvertGuestToUserDto })
  @ApiResponse({ status: 200, description: 'Guest converted to user', schema: { example: { userId: 42, role: 'user' } } })
  @ApiResponse({ status: 400, description: 'User is not a guest' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async convertGuestToUser(@Request() req, @Body() body: ConvertGuestToUserDto) {
    return this.invitationService.convertGuestToUser(req.user.id, body.userId);
  }
}
