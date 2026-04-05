import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SupportThread } from '../entity/support-thread.entity';
import { SupportMessage } from '../entity/support-message.entity';
import { CreateSupportThreadDto, SendSupportMessageDto } from '../dtos/support-chat.dto';
import { EventsGateway } from '../../infrastructure/websocket/events.gateway';
import { RolesService } from '../../user/services/roles.service';

@Injectable()
export class SupportChatService {
  constructor(
    @InjectRepository(SupportThread)
    private readonly threadRepo: Repository<SupportThread>,
    @InjectRepository(SupportMessage)
    private readonly messageRepo: Repository<SupportMessage>,
    private readonly wsGateway: EventsGateway,
    private readonly rolesService: RolesService,
  ) {}

  // ─── Scope helpers ────────────────────────────────────────────────────

  /**
   * Get the list of property/service IDs a user can access for support filtering.
   * Returns null if the user has global access (hyper roles).
   */
  private async getScopedPropertyIds(userId: number, userRole: string): Promise<string[] | null> {
    if (['hyper_admin', 'hyper_manager'].includes(userRole)) {
      return null; // global access
    }
    if (userRole === 'admin') {
      // Admin sees threads related to their own properties/services
      const propIds = await this.rolesService.getAdminPropertyIds(userId);
      const svcIds = await this.rolesService.getAdminServiceIds(userId);
      return [...propIds, ...svcIds];
    }
    if (userRole === 'manager') {
      // Manager sees threads for properties in their assignments
      const propIds = await this.rolesService.getManagerProperties(userId);
      return propIds; // null means all (scope='all' assignment)
    }
    // guest/user: only own threads (handled separately)
    return [];
  }

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

    return this.getThreadById(savedThread.id, userId, userRole);
  }

  /** Get all threads for admin inbox — scoped by role */
  async getAdminThreads(userId: number, userRole: string, page: number, limit: number, status?: string, category?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const scopedIds = await this.getScopedPropertyIds(userId, userRole);

    // Build query
    const qb = this.threadRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.initiator', 'initiator')
      .orderBy('t.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) qb.andWhere('t.status = :status', { status });
    if (category) qb.andWhere('t.category = :category', { category });

    if (scopedIds !== null && scopedIds.length > 0) {
      // Admin/manager: filter by property/service scope OR assigned to them OR initiated by them
      qb.andWhere(
        '(t.propertyId IN (:...scopedIds) OR t.assignedAdminId = :userId OR t.initiatorId = :userId)',
        { scopedIds, userId },
      );
    } else if (scopedIds !== null && scopedIds.length === 0) {
      // No scope — only own threads or assigned
      qb.andWhere('(t.assignedAdminId = :userId OR t.initiatorId = :userId)', { userId });
    }
    // scopedIds === null → global access, no filter

    const [items, total] = await qb.getManyAndCount();
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

  /** Get single thread with messages — enforce scope */
  async getThreadById(threadId: string, userId: number, userRole?: string) {
    const thread = await this.threadRepo.findOne({
      where: { id: threadId },
      relations: ['initiator', 'assignedAdmin'],
    });
    if (!thread) throw new NotFoundException('Thread not found');

    // Ownership / scope check
    await this.assertThreadAccess(thread, userId, userRole);

    return thread;
  }

  /** Get messages for a thread with pagination */
  async getMessages(threadId: string, userId: number, userRole: string, page: number, limit: number) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    await this.assertThreadAccess(thread, userId, userRole);

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

    await this.assertThreadAccess(thread, userId, userRole);

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

  // ─── Access control ───────────────────────────────────────────────────

  /**
   * Assert that the user has access to a support thread based on their role scope.
   * - hyper_admin/hyper_manager: global access
   * - admin: thread must relate to their property/service, or be assigned/initiated by them
   * - manager: thread must relate to properties in their assignment scope
   * - user/guest: must be the thread initiator
   */
  private async assertThreadAccess(thread: SupportThread, userId: number, userRole?: string): Promise<void> {
    if (!userRole) return; // internal calls without role skip check

    // Hyper roles have global access
    if (['hyper_admin', 'hyper_manager'].includes(userRole)) return;

    // Thread initiator always has access
    if (thread.initiatorId === userId) return;

    // Assigned admin has access
    if (thread.assignedAdminId === userId) return;

    if (userRole === 'admin') {
      // Admin can access threads related to their properties/services
      if (thread.propertyId) {
        const owns = await this.rolesService.isPropertyOwner(userId, thread.propertyId);
        if (owns) return;
        // Also check if it's a service
        const ownsService = await this.rolesService.isServiceOwner(userId, thread.propertyId);
        if (ownsService) return;
      }
      throw new ForbiddenException('No access to this support thread');
    }

    if (userRole === 'manager') {
      // Manager can access threads within their assignment scope
      if (thread.propertyId) {
        const hasAccess = await this.rolesService.hasPermissionForProperty(
          userId, thread.propertyId, 'manage_bookings',
        );
        if (hasAccess) return;
      }
      throw new ForbiddenException('No access to this support thread');
    }

    // guest/user: only initiator (checked above)
    throw new ForbiddenException('No access to this support thread');
  }
}
