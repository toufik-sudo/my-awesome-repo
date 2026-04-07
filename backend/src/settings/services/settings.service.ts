import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from '../entity/user-preferences.entity';
import { NotificationSettings } from '../entity/notification-settings.entity';
import { User } from '../../user/entity/user.entity';
import { UpdatePreferencesDto } from '../dtos/update-preferences.dto';
import { UpdateNotificationsDto } from '../dtos/update-notifications.dto';
import { UpdateAccountDto, ChangePasswordDto } from '../dtos/update-account.dto';
import { UserService } from '../../user/services/user.service';
import { ScopeContext } from '../../rbac/scope-context';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(UserPreferences)
    private readonly preferencesRepo: Repository<UserPreferences>,
    @InjectRepository(NotificationSettings)
    private readonly notificationsRepo: Repository<NotificationSettings>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  /**
   * Get all settings for a user (preferences + notifications + account info)
   */
  async getSettings(userId: number, _scopeCtx?: ScopeContext) {
    const [preferences, notifications, user] = await Promise.all([
      this.getOrCreatePreferences(userId),
      this.getOrCreateNotifications(userId),
      this.userRepo.findOne({ where: { id: userId } }),
    ]);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      preferences: {
        language: preferences.language,
        theme: preferences.theme,
        dateFormat: preferences.dateFormat,
        timezone: preferences.timezone,
        currency: preferences.currency,
      },
      notifications: {
        emailNotifications: notifications.emailNotifications,
        pushNotifications: notifications.pushNotifications,
        marketingEmails: notifications.marketingEmails,
        securityAlerts: notifications.securityAlerts,
        weeklyDigest: notifications.weeklyDigest,
        commentReplies: notifications.commentReplies,
        commentRepliesPush: notifications.commentRepliesPush,
        rankingUpdates: notifications.rankingUpdates,
        rankingUpdatesPush: notifications.rankingUpdatesPush,
        newFollowers: notifications.newFollowers,
        newFollowersPush: notifications.newFollowersPush,
        systemAnnouncements: notifications.systemAnnouncements,
        systemAnnouncementsPush: notifications.systemAnnouncementsPush,
        quietHoursEnabled: notifications.quietHoursEnabled,
        quietHoursStart: notifications.quietHoursStart,
        quietHoursEnd: notifications.quietHoursEnd,
      },
      account: {
        email: user.email,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNbr: user.phoneNbr,
        secondPhoneNbr: user.secondPhoneNbr,
        city: user.city,
        zipcode: user.zipcode,
        address: user.address,
        country: user.country,
      },
    };
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: number, dto: UpdatePreferencesDto, _scopeCtx?: ScopeContext) {
    const preferences = await this.getOrCreatePreferences(userId);
    Object.assign(preferences, dto);
    return this.preferencesRepo.save(preferences);
  }

  /**
   * Update notification settings
   */
  async updateNotifications(userId: number, dto: UpdateNotificationsDto, _scopeCtx?: ScopeContext) {
    const notifications = await this.getOrCreateNotifications(userId);
    Object.assign(notifications, dto);
    return this.notificationsRepo.save(notifications);
  }

  /**
   * Update account information
   */
  async updateAccount(userId: number, dto: UpdateAccountDto, _scopeCtx?: ScopeContext) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Check email uniqueness if changing email
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing && existing.id !== userId) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    }

    Object.assign(user, dto);
    await this.userRepo.save(user);

    return {
      email: user.email,
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNbr: user.phoneNbr,
      secondPhoneNbr: user.secondPhoneNbr,
      city: user.city,
      zipcode: user.zipcode,
      address: user.address,
      country: user.country,
    };
  }

  /**
   * Change password
   */
  async changePassword(userId: number, dto: ChangePasswordDto, _scopeCtx?: ScopeContext) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Decode the incoming password (uses legacy encoding)
    const currentDecoded = this.userService.decodePassword(dto.currentPassword);
    const isValid = await this.userService.comparePasswords(currentDecoded, user.password);

    if (!isValid) {
      throw new HttpException('Current password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const newDecoded = this.userService.decodePassword(dto.newPassword);
    user.password = await this.userService.hashPassword(newDecoded);
    user.passwordUpdatedAt = new Date();
    await this.userRepo.save(user);

    return { message: 'Password updated successfully' };
  }

  /**
   * Get or create default preferences for user
   */
  private async getOrCreatePreferences(userId: number): Promise<UserPreferences> {
    let prefs = await this.preferencesRepo.findOne({ where: { userId } });
    if (!prefs) {
      prefs = this.preferencesRepo.create({ userId, user: { id: userId } as any });
      prefs = await this.preferencesRepo.save(prefs);
    }
    return prefs;
  }

  /**
   * Get or create default notification settings for user
   */
  private async getOrCreateNotifications(userId: number): Promise<NotificationSettings> {
    let notifs = await this.notificationsRepo.findOne({ where: { userId } });
    if (!notifs) {
      notifs = this.notificationsRepo.create({ userId, user: { id: userId } as any });
      notifs = await this.notificationsRepo.save(notifs);
    }
    return notifs;
  }
}
