import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JobProducerService } from '../../infrastructure/jobs/job-producer.service';
import { Notification, NotificationType, NotificationChannel } from '../entity/notification.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';

export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  channel?: NotificationChannel;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    private readonly jobProducer: JobProducerService,
  ) {}

  /** Create a single in-app notification */
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepo.create({
      ...dto,
      user: { id: dto.userId } as any,
      channel: dto.channel || 'in_app',
    });
    const saved = await this.notificationRepo.save(notification);

    if (dto.channel === 'email' || dto.channel === 'both') {
      await this.sendEmail(dto.userId, dto.title, dto.message);
    }

    return saved;
  }

  /** Get all notifications for a user */
  async findByUser(userId: number, onlyUnread = false) {
    const where: any = { userId };
    if (onlyUnread) where.isRead = false;
    return this.notificationRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  /** Mark notification as read */
  async markAsRead(notificationId: string) {
    return this.notificationRepo.update(notificationId, { isRead: true });
  }

  /** Mark all as read for a user */
  async markAllAsRead(userId: number) {
    return this.notificationRepo.update({ userId, isRead: false }, { isRead: true });
  }

  /** Notify all hyper admins (in-app + email) */
  async notifyHyperAdmins(type: NotificationType, title: string, message: string, metadata?: Record<string, any>) {
    const hyperAdminRoles = await this.userRoleRepo.find({
      where: { role: 'hyper_manager' },
      relations: ['user'],
    });

    const notifications: Notification[] = [];
    for (const role of hyperAdminRoles) {
      const notif = await this.create({
        userId: role.userId,
        type,
        title,
        message,
        channel: 'both',
        actionUrl: `/admin/verification-review`,
        metadata,
      });
      notifications.push(notif);
    }

    this.logger.log(`Notified ${notifications.length} hyper admin(s): ${title}`);
    return notifications;
  }

  /** Send email notification via the job queue (processed by nodemailer) */
  private async sendEmail(userId: number, subject: string, body: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.email) {
      this.logger.warn(`Cannot send email to user ${userId}: no email address`);
      return;
    }

    await this.jobProducer.sendEmail({
      to: user.email,
      subject,
      body,
      template: 'notification',
      context: { title: subject, message: body },
    });
  }
}
