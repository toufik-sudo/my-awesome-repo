import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SupportThread } from '../entity/support-thread.entity';
import { SupportMessage } from '../entity/support-message.entity';
import { CreateSupportThreadDto, SendSupportMessageDto } from '../dtos/support-chat.dto';
import { EventsGateway } from '../../infrastructure/websocket/events.gateway';

@Injectable()
export class SupportChatService {
  constructor(
    @InjectRepository(SupportThread)
    private readonly threadRepo: Repository<SupportThread>,
    @InjectRepository(SupportMessage)
    private readonly messageRepo: Repository<SupportMessage>,
    private readonly wsGateway: EventsGateway,
  ) {}

  /** Create a new support thread with initial message */
  async createThread(userId: number, userRole: string, dto: CreateSupportThreadDto) {
    const thread = this.threadRepo.create({
      subject: dto.subject,
      category: dto.category as any || 'general',
      initiatorId: userId,
      propertyId: dto.propertyId,
      bookingId: dto.bookingId,
      reviewId: dto.reviewId,
      status: 'open',
      unreadCountAdmin: 1,
    });
    const savedThread = await this.threadRepo.save(thread);

    // Create initial message
    const message = this.messageRepo.create({
      threadId: savedThread.id,
      senderId: userId,
      senderRole: userRole,
      content: dto.content,
    });
    await this.messageRepo.save(message);

    // Notify admins via websocket
    this.wsGateway.broadcast('support:new_thread', {
      threadId: savedThread.id,
      subject: savedThread.subject,
      category: savedThread.category,
      initiatorId: userId,
    });

    return this.getThreadById(savedThread.id, userId);
  }

  /** Get all threads for admin inbox */
  async getAdminThreads(page: number, limit: number, status?: string, category?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const [items, total] = await this.threadRepo.findAndCount({
      where,
      relations: ['initiator'],
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  /** Get threads for a specific user */
  async getUserThreads(userId: number, page: number, limit: number) {
    const [items, total] = await this.threadRepo.findAndCount({
      where: { initiatorId: userId },
      relations: ['assignedAdmin'],
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  /** Get single thread with messages */
  async getThreadById(threadId: string, userId: number) {
    const thread = await this.threadRepo.findOne({
      where: { id: threadId },
      relations: ['initiator', 'assignedAdmin'],
    });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  /** Get messages for a thread with pagination */
  async getMessages(threadId: string, userId: number, page: number, limit: number) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    const [items, total] = await this.messageRepo.findAndCount({
      where: { threadId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  /** Send a message in a thread */
  async sendMessage(threadId: string, userId: number, userRole: string, dto: SendSupportMessageDto) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.status === 'closed') throw new ForbiddenException('Thread is closed');

    const message = this.messageRepo.create({
      threadId,
      senderId: userId,
      senderRole: userRole,
      content: dto.content,
    });
    const saved = await this.messageRepo.save(message);

    // Update thread
    const isAdmin = ['hyper_admin', 'hyper_manager', 'admin'].includes(userRole);
    if (isAdmin) {
      thread.unreadCountUser += 1;
      if (thread.status === 'open') thread.status = 'in_progress';
      if (!thread.assignedAdminId) thread.assignedAdminId = userId;
    } else {
      thread.unreadCountAdmin += 1;
    }
    await this.threadRepo.save(thread);

    // Real-time delivery
    const recipientId = isAdmin ? thread.initiatorId : (thread.assignedAdminId || null);
    if (recipientId) {
      this.wsGateway.emitToUser(String(recipientId), 'support:message', {
        threadId,
        message: { ...saved, sender: { id: userId } },
      });
    }
    // Also broadcast to admin room for inbox updates
    if (!isAdmin) {
      this.wsGateway.emitToRoom('support:admins', 'support:message', {
        threadId,
        message: { ...saved, sender: { id: userId } },
      });
    }

    return saved;
  }

  /** Update thread status (admin only) */
  async updateStatus(threadId: string, status: string) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');
    thread.status = status as any;
    return this.threadRepo.save(thread);
  }

  /** Assign admin to thread */
  async assignThread(threadId: string, adminId: number) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');
    thread.assignedAdminId = adminId;
    if (thread.status === 'open') thread.status = 'in_progress';
    return this.threadRepo.save(thread);
  }

  /** Mark messages as read */
  async markRead(threadId: string, userId: number, isAdmin: boolean) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) return;
    if (isAdmin) {
      thread.unreadCountAdmin = 0;
    } else {
      thread.unreadCountUser = 0;
    }
    await this.threadRepo.save(thread);
  }
}
