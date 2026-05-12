import { Injectable, ForbiddenException, NotFoundException, BadRequestException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Invitation } from '../entity/invitation.entity';
import { RolesService } from './roles.service';
import { JobProducerService } from '../../infrastructure/jobs/job-producer.service';
import { canInviteRole, getAllowedInvitationRoles, evaluateRoleTransition, isImmutableRole } from '../constants/invitation-rules.constant';
import { AppRole, User } from '../entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../../profiles/entity/profile.entity';
import { CreateUserRequestDto } from '../dtos/requests/create.user.request.dto';
import { UserService } from './user.service';
import { ReferralService } from './referral.service';
import {
  buildInvitationAccessItems,
  buildInvitationEmailCopy,
  getInvitationLanguageMeta,
  getLocalizedRoleLabel,
  normalizeInvitationLanguage,
} from '../constants/invitation-email-content.constant';
import { NotificationContent } from '../../notification/constants/notification-content.constant';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly rolesService: RolesService,
    private readonly jobProducer: JobProducerService,
    private readonly userService: UserService,
    private readonly referralService: ReferralService,
  ) { }

  /** Best-effort: link a new signup to a referral code. Never blocks signup. */
  private async tryCompleteReferral(userId: number, code?: string): Promise<void> {
    if (!code || !userId) return;
    try {
      await this.referralService.completeSignup(code.trim(), userId);
    } catch (e) {
      // swallow — referral linking is non-critical
    }
  }

  // ─── Public endpoints (used by onboarding flow without auth) ──────────────

  /**
   * Verify an invitation token publicly. Returns the safe details required
   * by the onboarding form so the user can confirm they were really invited.
   * Does NOT mutate state. Throws NotFound for invalid tokens, Forbidden for
   * cancelled/accepted/expired tokens.
   */
  async verifyInvitationToken(token: string): Promise<{
    invitationId: string;
    email: string | null;
    phone: string | null;
    role: AppRole;
    method: 'email' | 'phone';
    inviterName: string;
    inviterRole: AppRole;
    expiresAt: Date | null;
    message: string | null;
    userExists: boolean;
  }> {
    if (!token || typeof token !== 'string' || token.length > 128) {
      throw new BadRequestException('Invalid invitation token');
    }

    const invitation = await this.invitationRepo.findOne({ where: { token } });
    if (!invitation) throw new NotFoundException('Invitation not found');

    if (invitation.status === 'accepted') {
      throw new ForbiddenException('This invitation has already been accepted. Please sign in.');
    }
    if (invitation.status === 'cancelled') {
      throw new ForbiddenException('This invitation has been cancelled.');
    }
    if (invitation.status === 'expired' || (invitation.expiresAt && new Date() > invitation.expiresAt)) {
      if (invitation.status !== 'expired') {
        invitation.status = 'expired';
        await this.invitationRepo.save(invitation);
      }
      throw new ForbiddenException('This invitation has expired. Please ask the admin to resend it.');
    }

    // Inviter must still be one of the privileged roles allowed to invite
    const inviter = await this.userRepo.findOne({ where: { id: invitation.invitedBy } });
    if (!inviter) {
      throw new ForbiddenException('The inviter account is no longer available.');
    }
    const allowedInviterRoles: AppRole[] = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
    if (!allowedInviterRoles.includes(inviter.role as AppRole)) {
      throw new ForbiddenException('The inviter is not authorized to issue invitations.');
    }

    // Detect existing user
    let userExists = false;
    if (invitation.email) {
      const existing = await this.userRepo.findOne({ where: { email: invitation.email.toLowerCase() } });
      userExists = !!existing;
    } else if (invitation.phone) {
      const existing = await this.userRepo.findOne({ where: { phoneNbr: invitation.phone } });
      userExists = !!existing;
    }

    const inviterProfile = await this.profileRepo.findOne({ where: { userId: inviter.id } });
    const inviterName = this.getDisplayName(inviter, inviterProfile);

    return {
      invitationId: invitation.id,
      email: invitation.email || null,
      phone: invitation.phone || null,
      role: invitation.role as AppRole,
      method: invitation.method,
      inviterName,
      inviterRole: inviter.role as AppRole,
      expiresAt: invitation.expiresAt || null,
      message: invitation.message || null,
      userExists,
    };
  }

  /**
   * Create a brand new user from an invitation token, then assign the role
   * encoded in the invitation. Public — no auth required.
   * The token is the proof that an admin/manager really invited this person.
   */
  async signupFromInvitation(
    token: string,
    payload: CreateUserRequestDto,
  ): Promise<{ userId: number; role: AppRole; email: string | null; phone: string | null }> {
    const verified = await this.verifyInvitationToken(token);

    // Lock down identifiers: must match what the admin invited
    if (verified.method === 'email' && verified.email) {
      if ((payload.email || '').trim().toLowerCase() !== verified.email.toLowerCase()) {
        throw new BadRequestException('The email does not match the invited address.');
      }
    }
    if (verified.method === 'phone' && verified.phone) {
      if ((payload.phoneNbr || '').trim() !== verified.phone.trim()) {
        throw new BadRequestException('The phone number does not match the invited number.');
      }
    }

    // Force the role to the one stored on the invitation, never trust the body
    payload.role = verified.role;

    // ─── Existing user path: apply role transition rules ─────────────────
    if (verified.userExists) {
      const existingUser = verified.method === 'email' && verified.email
        ? await this.userRepo.findOne({ where: { email: verified.email.toLowerCase() } })
        : await this.userRepo.findOne({ where: { phoneNbr: verified.phone! } });

      if (!existingUser) {
        throw new ConflictException('Account lookup failed. Please contact support.');
      }

      const currentRole = (existingUser.role || 'user') as AppRole;
      const transition = evaluateRoleTransition(currentRole, verified.role);

      if (!transition.allowed) {
        const invitation = await this.invitationRepo.findOne({ where: { token } });
        if (invitation) {
          invitation.status = 'cancelled';
          await this.invitationRepo.save(invitation);
        }
        if (transition.reason === 'SAME') {
          throw new ConflictException(
            `This account already has the role '${currentRole}'. Please sign in.`,
          );
        }
        if (transition.reason === 'IMMUTABLE') {
          throw new ForbiddenException(
            `This account holds the role '${currentRole}', which cannot be changed. Invitation rejected.`,
          );
        }
        if (transition.reason === 'DOWNGRADE') {
          throw new ForbiddenException(
            `Cannot downgrade '${currentRole}' to '${verified.role}'. Roles can only be upgraded.`,
          );
        }
      }

      // Upgrade allowed → assign new role + mark invitation accepted
      const invitation = await this.invitationRepo.findOne({ where: { token } });
      if (invitation) {
        await this.rolesService.assignRole(invitation.invitedBy, existingUser.id, verified.role);
        if (verified.role === 'guest') {
          await this.rolesService.createGuestPermissionsFromInviter(invitation.invitedBy, existingUser.id);
        }
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date();
        await this.invitationRepo.save(invitation);

        await this.jobProducer.queueNotification({
          userId: invitation.invitedBy,
          type: 'invitation_accepted',
          ...NotificationContent.invitationAccepted({
            contact: invitation.email || invitation.phone || 'A new member',
            role: invitation.role,
          }),
        });
      }

      return {
        userId: existingUser.id,
        role: verified.role,
        email: existingUser.email || null,
        phone: existingUser.phoneNbr || null,
      };
    }

    const created: any = await this.userService.createUser(payload);
    const userId: number = created?.id || created?.userId;
    if (!userId) {
      throw new HttpException('User creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.upsertProfileFromSignup(userId, payload);
    await this.tryCompleteReferral(userId, payload.referralCode);

    // Assign role + scope inheritance for guests
    const invitation = await this.invitationRepo.findOne({ where: { token } });
    if (invitation) {
      await this.rolesService.assignRole(invitation.invitedBy, userId, verified.role);
      if (verified.role === 'guest') {
        await this.rolesService.createGuestPermissionsFromInviter(invitation.invitedBy, userId);
      }
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await this.invitationRepo.save(invitation);

      await this.jobProducer.queueNotification({
        userId: invitation.invitedBy,
        type: 'invitation_accepted',
        ...NotificationContent.invitationAccepted({
          contact: invitation.email || invitation.phone || 'A new member',
          role: invitation.role,
        }),
      });
    }

    return {
      userId,
      role: verified.role,
      email: payload.email || null,
      phone: payload.phoneNbr || null,
    };
  }

  /**
   * Public self-signup (no invitation). Always assigns the default 'user' role.
   * Mirrors signupFromInvitation but without the invitation gating.
   */
  async selfSignup(
    payload: CreateUserRequestDto,
  ): Promise<{ userId: number; role: AppRole; email: string | null; phone: string | null }> {
    payload.role = 'user';
    const created: any = await this.userService.createUser(payload);
    const userId: number = created?.id || created?.userId;
    if (!userId) {
      throw new HttpException('User creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await this.upsertProfileFromSignup(userId, payload);
    await this.tryCompleteReferral(userId, payload.referralCode);
    return {
      userId,
      role: 'user',
      email: payload.email || null,
      phone: payload.phoneNbr || null,
    };
  }

  /**
   * Persist optional profile fields gathered during onboarding (avatar URL,
   * display name, city). Best-effort — never blocks signup if it fails.
   */
  private async upsertProfileFromSignup(
    userId: number,
    payload: CreateUserRequestDto,
  ): Promise<void> {
    try {
      const existing = await this.profileRepo.findOne({ where: { userId } });
      const displayName = [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim() || undefined;
      if (existing) {
        if (payload.avatarUrl) existing.avatarUrl = payload.avatarUrl;
        if (displayName && !existing.displayName) existing.displayName = displayName;
        if (payload.city && !existing.city) existing.city = payload.city;
        await this.profileRepo.save(existing);
      } else {
        await this.profileRepo.save(this.profileRepo.create({
          userId,
          avatarUrl: payload.avatarUrl,
          displayName,
          city: payload.city,
          country: payload.country || 'Algeria',
        }));
      }
    } catch (err) {
      // Non-fatal — profile can be filled in later from settings
    }
  }


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
    const normalizedEmail = data.email?.trim().toLowerCase();
    const normalizedPhone = data.phone?.trim();

    // Enforce invitation rules matrix
    if (!canInviteRole(inviterRole, targetRole)) {
      const allowed = getAllowedInvitationRoles(inviterRole);
      throw new ForbiddenException(
        `Role '${inviterRole}' can only invite: ${allowed.length ? allowed.join(', ') : 'nobody'}. Cannot invite '${targetRole}'.`,
      );
    }

    // ─── If the invitee already has an account, validate role transition ──
    const existingUser = data.method === 'email' && normalizedEmail
      ? await this.userRepo.findOne({ where: { email: normalizedEmail } })
      : data.method === 'phone' && normalizedPhone
        ? await this.userRepo.findOne({ where: { phoneNbr: normalizedPhone } })
        : null;

    if (existingUser) {
      const currentRole = (existingUser.role || 'user') as AppRole;
      const transition = evaluateRoleTransition(currentRole, targetRole);
      if (!transition.allowed) {
        if (transition.reason === 'SAME') {
          throw new ConflictException({
            code: 'ROLE_ALREADY_ASSIGNED',
            message: `Cet utilisateur a déjà le rôle "${getLocalizedRoleLabel(currentRole, 'fr')}".`,
            currentRole,
          });
        }
        if (transition.reason === 'IMMUTABLE') {
          throw new ForbiddenException({
            code: 'ROLE_IMMUTABLE',
            message: `Cet utilisateur a le rôle "${getLocalizedRoleLabel(currentRole, 'fr')}", qui ne peut pas être modifié. Invitation impossible.`,
            currentRole,
          });
        }
        if (transition.reason === 'DOWNGRADE') {
          throw new BadRequestException({
            code: 'ROLE_DOWNGRADE_FORBIDDEN',
            message: `Impossible de rétrograder "${getLocalizedRoleLabel(currentRole, 'fr')}" vers "${getLocalizedRoleLabel(targetRole, 'fr')}". Les rôles ne peuvent qu'être promus.`,
            currentRole,
            requestedRole: targetRole,
          });
        }
      }
    }

    // Look up ANY existing invitation from same admin to same contact (any status)
    const existingAny = await this.invitationRepo.findOne({
      where: {
        invitedBy,
        method: data.method,
        email: data.method === 'email' ? normalizedEmail : IsNull(),
        phone: data.method === 'phone' ? normalizedPhone : IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    if (existingAny && existingAny.status === 'pending') {
      // Different role for same pending contact → block (a user can't be both manager and guest)
      if (existingAny.role !== data.role) {
        const existingRoleLabel = getLocalizedRoleLabel(existingAny.role as AppRole, 'fr');
        const requestedRoleLabel = getLocalizedRoleLabel(targetRole, 'fr');
        throw new BadRequestException({
          code: 'ROLE_CONFLICT',
          message: `Une invitation en attente existe déjà pour ce contact avec le rôle "${existingRoleLabel}". Un utilisateur ne peut pas avoir deux rôles distincts. Annulez ou laissez expirer l'invitation actuelle avant d'en créer une nouvelle en tant que "${requestedRoleLabel}".`,
          existingInvitationId: existingAny.id,
          existingRole: existingAny.role,
          requestedRole: data.role,
        });
      }

      // Same role + same contact + same admin → already pending. Don't re-insert; ask admin to confirm resend.
      throw new ConflictException({
        code: 'INVITATION_ALREADY_EXISTS',
        message: `Une invitation est déjà en attente pour ce contact avec le même rôle. Voulez-vous renvoyer l'invitation ?`,
        existingInvitationId: existingAny.id,
        existingRole: existingAny.role,
        canResend: true,
      });
    }

    const token = uuidv4();
    const expiresAt = this.buildInvitationExpiry();

    const invitation = this.invitationRepo.create({
      method: data.method,
      email: normalizedEmail,
      phone: normalizedPhone,
      role: data.role,
      invitedBy,
      token,
      message: data.message,
      expiresAt,
    });

    const saved = await this.invitationRepo.save(invitation);

    if (data.method === 'email' && data.email) {
      return this.sendInvitationEmail(saved, data.email, false);
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

    return this.resendExistingInvitation(invitation, true);
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

    // ─── Role transition guard ────────────────────────────────────────────
    const currentRole = await this.rolesService.getUserRole(userId);
    const transition = evaluateRoleTransition(currentRole, targetRole);
    if (!transition.allowed) {
      // Mark invitation cancelled so it cannot be reused
      invitation.status = 'cancelled';
      await this.invitationRepo.save(invitation);

      if (transition.reason === 'SAME') {
        throw new ConflictException(
          `You already have the role '${currentRole}'.`,
        );
      }
      if (transition.reason === 'IMMUTABLE') {
        throw new ForbiddenException(
          `Your current role '${currentRole}' cannot be changed. Invitation rejected.`,
        );
      }
      if (transition.reason === 'DOWNGRADE') {
        throw new ForbiddenException(
          `Cannot downgrade your role from '${currentRole}' to '${targetRole}'.`,
        );
      }
    }

    // Assign the new (upgraded) role
    await this.rolesService.assignRole(invitation.invitedBy, userId, targetRole);

    // Guest scope: inherit inviter's accessible properties/services (read-only)
    if (targetRole === 'guest') {
      await this.rolesService.createGuestPermissionsFromInviter(
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
      ...NotificationContent.invitationAccepted({
        contact: invitation.email || invitation.phone || 'A new member',
        role: invitation.role,
      }),
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

    // Remove guest-scoped permissions
    await this.rolesService.removeAllPermissions(guestUserId);

    // Set role to 'user' — user gets full access to all properties/services
    await this.rolesService.setUserRoleDirect(guestUserId, 'user');

    return { userId: guestUserId, role: 'user' };
  }

  private async sendInvitationEmail(
    invitation: Invitation,
    email: string,
    isReminder: boolean,
  ): Promise<Invitation> {
    const [inviter, recipient] = await Promise.all([
      this.userRepo.findOne({ where: { id: invitation.invitedBy } }),
      this.userRepo.findOne({ where: { email } }),
    ]);

    const [inviterProfile, recipientProfile] = await Promise.all([
      inviter ? this.profileRepo.findOne({ where: { userId: inviter.id } }) : Promise.resolve(null),
      recipient ? this.profileRepo.findOne({ where: { userId: recipient.id } }) : Promise.resolve(null),
    ]);

    const inviterRole = (inviter?.role || 'user') as AppRole;
    const invitedRole = invitation.role as AppRole;
    const language = normalizeInvitationLanguage(
      recipientProfile?.preferredLanguage || inviterProfile?.preferredLanguage,
    );
    const languageMeta = getInvitationLanguageMeta(language);
    const inviterName = this.getDisplayName(inviter, inviterProfile);
    const frontendUrl = (process.env.HOST_FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:8080').replace(/\/$/, '');
    // Land on the onboarding page (NOT login). The page will verify the token,
    // pre-fill known fields, and let the user complete profile + pick avatar.
    // We also append the contact already known to the inviter so the field can
    // be prefilled (and disabled) before the token verification round-trip.
    const prefillParts: string[] = [];
    if (invitation.method === 'email' && invitation.email) {
      prefillParts.push(`email=${encodeURIComponent(invitation.email)}`);
    }
    if (invitation.method === 'phone' && invitation.phone) {
      prefillParts.push(`phone=${encodeURIComponent(invitation.phone)}`);
    }
    prefillParts.push(`method=${encodeURIComponent(invitation.method)}`);
    const signupUrl = `${frontendUrl}/onboarding?invitation=${encodeURIComponent(invitation.token)}&role=${encodeURIComponent(invitedRole)}&lang=${encodeURIComponent(language)}${prefillParts.length ? `&${prefillParts.join('&')}` : ''}`;
    const appName = process.env.EMAIL_FROM_NAME || 'ByootDZ';
    const copy = buildInvitationEmailCopy({
      language,
      appName,
      inviterName,
      inviterRole,
      invitedRole,
      expiresAt: invitation.expiresAt || new Date(),
    });

    await this.jobProducer.sendEmail({
      to: email,
      subject: isReminder ? copy.reminderSubject : copy.subject,
      body: '',
      template: 'invitation',
      context: {
        ...copy,
        dir: languageMeta.dir,
        language,
        appName,
        preheader: copy.preheader,
        inviterName,
        inviterRoleLabelValue: getLocalizedRoleLabel(inviterRole, language),
        invitedRoleLabelValue: getLocalizedRoleLabel(invitedRole, language),
        signupUrl,
        contactValue: email,
        personalMessage: invitation.message,
        accessItems: buildInvitationAccessItems({
          language,
          inviterName,
          inviterRole,
          invitedRole,
          appName,
        }),
      },
      trackingMeta: {
        invitationId: invitation.id,
        invitationRole: invitedRole,
        inviterRole,
        language,
        invitationKind: isReminder ? 'reminder' : 'initial',
      },
    });

    return this.attachEmailPreview(invitation, inviterName, inviterRole, language, isReminder);
  }

  private async resendExistingInvitation(
    invitation: Invitation,
    isReminder: boolean,
  ): Promise<Invitation> {
    invitation.expiresAt = this.buildInvitationExpiry();
    invitation.status = 'pending';

    if (!invitation.token) {
      invitation.token = uuidv4();
    }

    const saved = await this.invitationRepo.save(invitation);

    if (saved.method === 'email' && saved.email) {
      return this.sendInvitationEmail(saved, saved.email, isReminder);
    }

    return saved;
  }

  private buildInvitationExpiry(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
  }

  private attachEmailPreview(
    invitation: Invitation,
    inviterName: string,
    inviterRole: AppRole,
    language: ReturnType<typeof normalizeInvitationLanguage>,
    isReminder: boolean,
  ): Invitation {
    const copy = buildInvitationEmailCopy({
      language,
      appName: process.env.EMAIL_FROM_NAME || 'ByootDZ',
      inviterName,
      inviterRole,
      invitedRole: invitation.role as AppRole,
      expiresAt: invitation.expiresAt || new Date(),
    });

    return Object.assign(invitation, {
      latestEmailSubject: isReminder ? copy.reminderSubject : copy.subject,
      latestEmailLanguage: language,
      latestEmailKind: isReminder ? 'reminder' : 'initial',
    });
  }

  private getDisplayName(user: User | null, profile: Profile | null): string {
    const profileName = profile?.displayName?.trim();
    if (profileName) return profileName;

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    if (fullName) return fullName;

    return user?.email || user?.phoneNbr || 'ByootDZ';
  }
}
