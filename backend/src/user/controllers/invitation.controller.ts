import {
  Controller, Get, Post, Delete, Put, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create invitation', description: 'Invite a user by email or phone. **Roles**: hyper_manager, admin' })
  async create(
    @Request() req,
    @Body() body: { method: 'email' | 'phone'; email?: string; phone?: string; role: string; message?: string },
  ) {
    return this.invitationService.createInvitation(req.user.id, body);
  }

  @Get()
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get all invitations', description: '**Roles**: hyper_manager, admin' })
  async getAll(@Request() req) {
    return this.invitationService.getInvitations(req.user.id);
  }

  @Delete(':id')
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({ summary: 'Cancel an invitation' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Request() req, @Param('id') id: string) {
    await this.invitationService.cancelInvitation(req.user.id, id);
    return { success: true };
  }

  @Post(':id/resend')
  @RequireRole('hyper_manager', 'admin')
  @ApiOperation({ summary: 'Resend an invitation' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async resend(@Request() req, @Param('id') id: string) {
    return this.invitationService.resendInvitation(req.user.id, id);
  }

  @Post('accept/:token')
  @ApiOperation({ summary: 'Accept an invitation', description: 'Accept via invitation token.' })
  @ApiParam({ name: 'token', type: 'string' })
  async accept(@Request() req, @Param('token') token: string) {
    await this.invitationService.acceptInvitation(token, req.user.id);
    return { success: true };
  }
}
