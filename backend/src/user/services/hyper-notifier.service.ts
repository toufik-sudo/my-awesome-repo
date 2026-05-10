import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../entity/user.entity';
import { JobProducerService } from '../../infrastructure/jobs';
import { EventsGateway } from '../../infrastructure/websocket';

/**
 * Notify all active hyper_admin / hyper_manager users (in-app + email + socket).
 * Used for booking/payment lifecycle events the hyper team must oversee.
 */
@Injectable()
export class HyperNotifierService {
  private readonly logger = new Logger(HyperNotifierService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jobs: JobProducerService,
    private readonly events: EventsGateway,
  ) {}

  async notifyHypers(args: {
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
    socketEvent?: string;
    socketPayload?: any;
  }) {
    const hypers = await this.userRepo
      .createQueryBuilder('u')
      .where('u.role IN (:...roles)', { roles: ['hyper_admin', 'hyper_manager'] })
      .andWhere('u.isActive = 1')
      .getMany();

    for (const h of hypers) {
      await this.jobs.queueNotification({
        userId: h.id,
        type: args.type as any,
        title: args.title,
        message: args.message,
        channel: 'both',
        actionUrl: args.actionUrl,
        metadata: args.metadata,
      });
      if (args.socketEvent) {
        try {
          this.events.emitToUser(String(h.id), args.socketEvent, args.socketPayload || {});
        } catch (e) {
          this.logger.warn(`emit ${args.socketEvent} failed: ${(e as Error).message}`);
        }
      }
    }
  }
}
