import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_EMAIL, QUEUE_NOTIFICATION, QUEUE_IMAGE } from './jobs.constant';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  template?: string;
  context?: Record<string, any>;
}

export interface NotificationJobData {
  userId: number;
  type: string;
  title: string;
  message: string;
  channel?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ImageJobData {
  filePath: string;
  propertyId?: string;
  userId?: number;
  operations: Array<'resize' | 'compress' | 'thumbnail' | 'watermark'>;
}

@Injectable()
export class JobProducerService {
  private readonly logger = new Logger(JobProducerService.name);

  constructor(
    @InjectQueue(QUEUE_EMAIL) private readonly emailQueue: Queue,
    @InjectQueue(QUEUE_NOTIFICATION) private readonly notificationQueue: Queue,
    @InjectQueue(QUEUE_IMAGE) private readonly imageQueue: Queue,
  ) {}

  async sendEmail(data: EmailJobData, priority = 0) {
    const job = await this.emailQueue.add('send', data, { priority });
    this.logger.log(`Email job queued: ${job.id} → ${data.to}`);
    return job;
  }

  async sendBookingConfirmation(booking: any, guestEmail: string) {
    return this.sendEmail({
      to: guestEmail,
      subject: `Booking Confirmed — ${booking.property?.title || booking.propertyId}`,
      body: `Your booking from ${booking.checkInDate} to ${booking.checkOutDate} is confirmed. Total: ${booking.totalPrice} ${booking.currency}.`,
      template: 'booking-confirmation',
      context: { booking },
    });
  }

  async queueNotification(data: NotificationJobData) {
    const job = await this.notificationQueue.add('create', data);
    this.logger.log(`Notification job queued: ${job.id} → user:${data.userId}`);
    return job;
  }

  async queueBulkNotifications(notifications: NotificationJobData[]) {
    const jobs = notifications.map((data) => ({
      name: 'create',
      data,
    }));
    await this.notificationQueue.addBulk(jobs);
    this.logger.log(`Bulk notification jobs queued: ${notifications.length}`);
  }

  async processImage(data: ImageJobData) {
    const job = await this.imageQueue.add('process', data, {
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 },
    });
    this.logger.log(`Image job queued: ${job.id} → ${data.filePath}`);
    return job;
  }
}
