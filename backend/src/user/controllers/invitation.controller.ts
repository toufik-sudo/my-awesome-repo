import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvitationService } from '../services/invitation.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('roles/invitations')
@UseGuards(PermissionGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @RequireRole('hyper_manager', 'admin')
  async create(
    @Request() req,
    @Body() body: {
      method: 'email' | 'phone';
      email?: string;
      phone?: string;
      role: string;
      message?: string;
    },
  ) {
    return this.invitationService.createInvitation(req.user.id, body);
  }

  @Get()
  @RequireRole('hyper_manager', 'admin')
  async getAll(@Request() req) {
    return this.invitationService.getInvitations(req.user.id);
  }

  @Delete(':id')
  @RequireRole('hyper_manager', 'admin')
  async cancel(@Request() req, @Param('id') id: string) {
    await this.invitationService.cancelInvitation(req.user.id, id);
    return { success: true };
  }

  @Post(':id/resend')
  @RequireRole('hyper_manager', 'admin')
  async resend(@Request() req, @Param('id') id: string) {
    return this.invitationService.resendInvitation(req.user.id, id);
  }

  @Post('accept/:token')
  async accept(@Request() req, @Param('token') token: string) {
    await this.invitationService.acceptInvitation(token, req.user.id);
    return { success: true };
  }
}
