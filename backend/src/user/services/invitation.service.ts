import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from '../entity/invitation.entity';
import { RolesService } from './roles.service';
import { JobProducerService } from '../../infrastructure/jobs/job-producer.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    private readonly rolesService: RolesService,
    private readonly jobProducer: JobProducerService,
  ) {}

  async createInvitation(
    invitedBy: number,
    data: {
      method: 'email' | 'phone';
      email?: string;
      phone?: string;
      role: string;
      message?: string;
    },
  ): Promise<Invitation> {
    // Verify the inviter has sufficient permissions
    const inviterRoles = await this.rolesService.getUserRoles(invitedBy);

    // Only hyper_manager can invite admins or other hyper_managers
    if (['hyper_manager', 'admin'].includes(data.role)) {
      if (!inviterRoles.includes('hyper_manager')) {
        throw new ForbiddenException('Only hyper_manager can invite admins or hyper_managers');
      }
    }

    // Admin can invite managers
    if (data.role === 'manager') {
      if (!inviterRoles.includes('hyper_manager') && !inviterRoles.includes('admin')) {
        throw new ForbiddenException('Only hyper_manager or admin can invite managers');
      }
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = this.invitationRepo.create({
      method: data.method,
      email: data.email,
      phone: data.phone,
      role: data.role,
      invitedBy,
      token,
      message: data.message,
      expiresAt,
    });

    const saved = await this.invitationRepo.save(invitation);

    // Send invitation via email using the invitation template
    if (data.method === 'email' && data.email) {
      const roleLabel = data.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const signupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?invitation=${token}`;

      await this.jobProducer.sendEmail({
        to: data.email,
        subject: `You've been invited to join ByootDZ as ${roleLabel}`,
        body: '',
        template: 'invitation',
        context: { roleLabel, signupUrl, message: data.message },
      });
    }

    // TODO: SMS integration for phone invitations

    return saved;
  }

  async getInvitations(userId: number): Promise<Invitation[]> {
    return this.invitationRepo.find({
      where: { invitedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async cancelInvitation(userId: number, invitationId: string): Promise<void> {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, invitedBy: userId },
    });
    if (!invitation) throw new NotFoundException('Invitation not found');
    if (invitation.status !== 'pending') {
      throw new ForbiddenException('Can only cancel pending invitations');
    }

    invitation.status = 'cancelled';
    await this.invitationRepo.save(invitation);
  }

  async resendInvitation(userId: number, invitationId: string): Promise<Invitation> {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, invitedBy: userId },
    });
    if (!invitation) throw new NotFoundException('Invitation not found');

    // Reset expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    invitation.expiresAt = expiresAt;
    invitation.status = 'pending';

    const saved = await this.invitationRepo.save(invitation);

    if (invitation.method === 'email' && invitation.email) {
      const roleLabel = invitation.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const signupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?invitation=${invitation.token}`;

      await this.jobProducer.sendEmail({
        to: invitation.email,
        subject: `Reminder: You've been invited to join ByootDZ as ${roleLabel}`,
        body: '',
        template: 'invitation',
        context: { roleLabel, signupUrl, message: invitation.message },
      });
    }

    return saved;
  }

  async acceptInvitation(token: string, userId: number): Promise<void> {
    const invitation = await this.invitationRepo.findOne({ where: { token } });
    if (!invitation) throw new NotFoundException('Invalid invitation');
    if (invitation.status !== 'pending') {
      throw new ForbiddenException('Invitation is no longer valid');
    }
    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await this.invitationRepo.save(invitation);
      throw new ForbiddenException('Invitation has expired');
    }

    // Assign the role
    await this.rolesService.assignRole(invitation.invitedBy, userId, invitation.role as any);

    // Mark as accepted
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    await this.invitationRepo.save(invitation);

    // Notify the inviter
    await this.jobProducer.queueNotification({
      userId: invitation.invitedBy,
      type: 'invitation_accepted',
      title: 'Invitation Accepted',
      message: `${invitation.email || invitation.phone} has accepted your invitation and joined as ${invitation.role}`,
    });
  }

}
