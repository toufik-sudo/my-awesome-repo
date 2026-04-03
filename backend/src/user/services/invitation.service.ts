import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from '../entity/invitation.entity';
import { RolesService } from './roles.service';
import { JobProducerService } from '../../infrastructure/jobs/job-producer.service';
import { canInviteRole, getAllowedInvitationRoles } from '../constants/invitation-rules.constant';
import { AppRole } from '../entity/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    private readonly rolesService: RolesService,
    private readonly jobProducer: JobProducerService,
  ) {}

  /**
   * Returns the roles the given user is allowed to invite, based on invitation rules.
   */
  async getAllowedRolesForInviter(inviterId: number): Promise<AppRole[]> {
    const inviterRole = await this.rolesService.getUserRole(inviterId);
    return getAllowedInvitationRoles(inviterRole);
  }

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
    const inviterRole = await this.rolesService.getUserRole(invitedBy);
    const targetRole = data.role as AppRole;

    // Enforce invitation rules matrix
    if (!canInviteRole(inviterRole, targetRole)) {
      const allowed = getAllowedInvitationRoles(inviterRole);
      throw new ForbiddenException(
        `Role '${inviterRole}' can only invite: ${allowed.length ? allowed.join(', ') : 'nobody'}. Cannot invite '${targetRole}'.`,
      );
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

    // Send invitation via email
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

    const targetRole = invitation.role as AppRole;

    // Assign the role
    await this.rolesService.assignRole(invitation.invitedBy, userId, targetRole);

    // Guest scope: inherit inviter's accessible properties/services (read-only)
    if (targetRole === 'guest') {
      await this.rolesService.createGuestAssignmentsFromInviter(
        invitation.invitedBy,
        userId,
      );
    }

    // Admin invited = will create own properties, no scope inheritance

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

  /**
   * IT MVP Exception: Convert a guest to a regular user.
   * This gives the guest access to all properties/services.
   * Only hyper_admin or hyper_manager can do this.
   */
  async convertGuestToUser(adminId: number, guestUserId: number): Promise<{ userId: number; role: AppRole }> {
    const adminRole = await this.rolesService.getUserRole(adminId);
    if (adminRole !== 'hyper_admin' && adminRole !== 'hyper_manager') {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can convert guest to user');
    }

    const guestRole = await this.rolesService.getUserRole(guestUserId);
    if (guestRole !== 'guest') {
      throw new BadRequestException(`User is not a guest (current role: ${guestRole})`);
    }

    // Remove guest-scoped assignments
    await this.rolesService.removeAllAssignments(guestUserId);

    // Set role to 'user' — user gets full access to all properties/services
    await this.rolesService.setUserRoleDirect(guestUserId, 'user');

    return { userId: guestUserId, role: 'user' };
  }
}
