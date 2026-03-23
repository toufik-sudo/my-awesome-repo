import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { QUEUE_NOTIFICATION } from '../jobs.constant';
import { NotificationJobData } from '../job-producer.service';
import { Notification } from '../../../notification/entity/notification.entity';

@Processor(QUEUE_NOTIFICATION, { concurrency: 10 })
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {
    super();
  }

  async process(job: Job<NotificationJobData>): Promise<any> {
    const { userId, type, title, message, channel, actionUrl, metadata } = job.data;
    const startTime = Date.now();

    this.logger.log(`Processing notification job ${job.id}: ${title} → user:${userId}`);

    try {
      const notification = this.notificationRepo.create({
        userId,
        user: { id: userId } as any,
        type: type as any,
        title,
        message,
        channel: (channel || 'in_app') as any,
        actionUrl,
        metadata,
      });

      const saved = await this.notificationRepo.save(notification);

      this.logger.log(
        `🔔 Notification created [${Date.now() - startTime}ms] → user:${userId} | ${title}`,
      );

      return { notificationId: saved.id, userId, duration: Date.now() - startTime };
    } catch (error: any) {
      this.logger.error(`Notification job ${job.id} failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
