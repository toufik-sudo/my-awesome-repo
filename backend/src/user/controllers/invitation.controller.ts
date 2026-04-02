import {
  Controller, Get, Post, Delete, Put, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Invitations')
@ApiBearerAuth('JWT-auth')
@Controller('roles/invitations')
@UseGuards(PermissionGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Create an invitation',
    description: `Invite a new user by email or phone number. The invited user receives a link to sign up with a pre-assigned role.

**Roles**: \`hyper_admin\`, \`hyper_manager\` (can invite any role), \`admin\` (can invite \`manager\` only)

**Process**:
1. Creates an invitation record with a unique token
2. Sends email/SMS via BullMQ job queue
3. Invited user signs up and clicks the invitation link
4. Role is auto-assigned on acceptance; inviter is notified

**Invitation expires after 7 days.**

**Example request**:
\`\`\`json
{
  "method": "email",
  "email": "newhost@example.com",
  "role": "admin",
  "message": "Welcome to the platform!"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['method', 'role'], properties: {
    method: { type: 'string', enum: ['email', 'phone'], example: 'email', description: 'Delivery method' },
    email: { type: 'string', example: 'newhost@example.com', description: 'Required when method=email' },
    phone: { type: 'string', example: '+213551234567', description: 'Required when method=phone' },
    role: { type: 'string', enum: ['hyper_manager', 'admin', 'manager'], example: 'admin', description: 'Role to assign on acceptance' },
    message: { type: 'string', example: 'Welcome to ByootDZ!', description: 'Optional personal message in the invitation' },
  }}})
  @ApiResponse({ status: 201, description: 'Invitation created — returns the Invitation record with token and expiry' })
  @ApiResponse({ status: 400, description: 'Bad request — missing email/phone for the chosen method' })
  @ApiResponse({ status: 403, description: 'Forbidden — role not allowed to invite this target role' })
  async create(
    @Request() req,
    @Body() body: { method: 'email' | 'phone'; email?: string; phone?: string; role: string; message?: string },
  ) {
    return this.invitationService.createInvitation(req.user.id, body);
  }

  @Get()
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({
    summary: 'List invitations',
    description: `Returns all invitations created by the caller.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Statuses**: \`pending\`, \`accepted\`, \`expired\`, \`cancelled\``,
  })
  @ApiResponse({ status: 200, description: 'Array of Invitation records with status and expiry info' })
  async getAll(@Request() req) {
    return this.invitationService.getInvitations(req.user.id);
  }

  @Delete(':id')
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Cancel an invitation',
    description: `Cancels a pending invitation. The invitation token becomes invalid.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Invitation ID to cancel' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled — returns { success: true }' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async cancel(@Request() req, @Param('id') id: string) {
    await this.invitationService.cancelInvitation(req.user.id, id);
    return { success: true };
  }

  @Post(':id/resend')
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Resend an invitation',
    description: `Re-sends the invitation email/SMS. Resets the expiry to 7 days from now.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Invitation resent — returns updated Invitation record' })
  async resend(@Request() req, @Param('id') id: string) {
    return this.invitationService.resendInvitation(req.user.id, id);
  }

  @Post('accept/:token')
  @ApiOperation({
    summary: 'Accept an invitation',
    description: `Accept an invitation via its unique token. The authenticated user receives the invited role.

**Roles**: Any authenticated user with a valid token

**Process**: Validates token → assigns role → marks invitation as accepted → notifies the inviter`,
  })
  @ApiParam({ name: 'token', type: 'string', description: 'Unique invitation token from the invite link' })
  @ApiResponse({ status: 200, description: 'Invitation accepted — returns { success: true }' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async accept(@Request() req, @Param('token') token: string) {
    await this.invitationService.acceptInvitation(token, req.user.id);
    return { success: true };
  }
}
