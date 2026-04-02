import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Property } from '../entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';
import { ManagerAssignment } from '../../user/entity/manager-assignment.entity';
import { NotificationService } from '../../notification/services/notification.service';
import { EventsGateway } from '../../infrastructure/websocket';

/**
 * Archive TTL (days) — configured via ARCHIVE_TTL_DAYS env or defaults to 90 days.
 * After this period, archived entities are eligible for permanent cleanup.
 */
const ARCHIVE_TTL_DAYS = parseInt(process.env.ARCHIVE_TTL_DAYS || '90', 10);

@Injectable()
export class HyperManagementService {
  private readonly logger = new Logger(HyperManagementService.name);

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(ManagerAssignment)
    private readonly assignmentRepo: Repository<ManagerAssignment>,
    private readonly notificationService: NotificationService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // ─── Properties ────────────────────────────────────────────────

  async pauseProperty(propertyId: string, adminId: number) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    property.status = 'suspended';
    property.isAvailable = false;
    await this.propertyRepo.save(property);

    await this.notifyUser(property.hostId, 'property_paused',
      'Propriété mise en pause',
      `Votre propriété "${property.title}" a été mise en pause par un administrateur.`,
      `/property/${propertyId}`);

    this.logger.log(`Property ${propertyId} paused by admin ${adminId}`);
    return { success: true, message: `Property "${property.title}" paused`, archiveTtlDays: ARCHIVE_TTL_DAYS };
  }

  async resumeProperty(propertyId: string, adminId: number) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    property.status = 'published';
    property.isAvailable = true;
    await this.propertyRepo.save(property);

    await this.notifyUser(property.hostId, 'property_resumed',
      'Propriété réactivée',
      `Votre propriété "${property.title}" a été réactivée.`,
      `/property/${propertyId}`);

    this.logger.log(`Property ${propertyId} resumed by admin ${adminId}`);
    return { success: true, message: `Property "${property.title}" resumed` };
  }

  async archiveProperty(propertyId: string, adminId: number, reason?: string) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    property.status = 'archived';
    property.isAvailable = false;
    await this.propertyRepo.save(property);

    await this.notifyUser(property.hostId, 'property_archived',
      'Propriété archivée',
      `Votre propriété "${property.title}" a été archivée.${reason ? ` Raison: ${reason}` : ''} Elle sera supprimée définitivement dans ${ARCHIVE_TTL_DAYS} jours.`,
      `/property/${propertyId}`);

    this.logger.log(`Property ${propertyId} archived by admin ${adminId} (TTL: ${ARCHIVE_TTL_DAYS} days)`);
    return { success: true, message: `Property archived (auto-delete in ${ARCHIVE_TTL_DAYS} days)`, archiveTtlDays: ARCHIVE_TTL_DAYS };
  }

  async deleteProperty(propertyId: string, adminId: number) {
    const result = await this.propertyRepo.delete(propertyId);
    if (result.affected === 0) throw new NotFoundException('Property not found');
    this.logger.log(`Property ${propertyId} permanently deleted by admin ${adminId}`);
    return { success: true, message: 'Property permanently deleted' };
  }

  // ─── Services ─────────────────────────────────────────────────

  async pauseService(serviceId: string, adminId: number) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    service.status = 'suspended';
    service.isAvailable = false;
    await this.serviceRepo.save(service);

    const title = typeof service.title === 'object' ? (service.title['fr'] || service.title['en'] || 'Service') : String(service.title);
    await this.notifyUser(service.providerId, 'service_paused',
      'Service mis en pause',
      `Votre service "${title}" a été mis en pause par un administrateur.`,
      `/services/${serviceId}`);

    this.logger.log(`Service ${serviceId} paused by admin ${adminId}`);
    return { success: true, message: `Service "${title}" paused` };
  }

  async resumeService(serviceId: string, adminId: number) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    service.status = 'published';
    service.isAvailable = true;
    await this.serviceRepo.save(service);

    this.logger.log(`Service ${serviceId} resumed by admin ${adminId}`);
    return { success: true, message: 'Service resumed' };
  }

  async archiveService(serviceId: string, adminId: number, reason?: string) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    service.status = 'archived';
    service.isAvailable = false;
    await this.serviceRepo.save(service);

    this.logger.log(`Service ${serviceId} archived by admin ${adminId} (TTL: ${ARCHIVE_TTL_DAYS} days)`);
    return { success: true, message: `Service archived (auto-delete in ${ARCHIVE_TTL_DAYS} days)`, archiveTtlDays: ARCHIVE_TTL_DAYS };
  }

  async deleteService(serviceId: string, adminId: number) {
    const result = await this.serviceRepo.delete(serviceId);
    if (result.affected === 0) throw new NotFoundException('Service not found');
    this.logger.log(`Service ${serviceId} permanently deleted by admin ${adminId}`);
    return { success: true, message: 'Service permanently deleted' };
  }

  // ─── User Management (Host/Admin pause/archive with cascade) ──

  async pauseUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Deactivate user
    user.isActive = false;
    await this.userRepo.save(user);

    // Cascade: pause all properties
    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'suspended', isAvailable: false })
      .where('hostId = :userId', { userId })
      .andWhere('status NOT IN (:...excluded)', { excluded: ['archived'] })
      .execute();

    // Cascade: pause all services
    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'suspended', isAvailable: false })
      .where('providerId = :userId', { userId })
      .andWhere('status NOT IN (:...excluded)', { excluded: ['archived'] })
      .execute();

    // Cascade: unassign all managers from this admin
    await this.assignmentRepo.createQueryBuilder()
      .update(ManagerAssignment)
      .set({ isActive: false })
      .where('assignedByAdminId = :userId', { userId })
      .execute();

    await this.notifyUser(userId, 'account_paused',
      'Compte mis en pause',
      'Votre compte a été mis en pause par un administrateur. Toutes vos propriétés et services sont temporairement indisponibles.',
      '/dashboard');

    this.logger.log(`User ${userId} paused by admin ${adminId} — all properties/services suspended, managers unassigned`);
    return { success: true, message: 'User paused with cascading effects' };
  }

  async resumeUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    await this.userRepo.save(user);

    // Restore properties to published
    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'published', isAvailable: true })
      .where('hostId = :userId', { userId })
      .andWhere('status = :status', { status: 'suspended' })
      .execute();

    // Restore services to published
    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'published', isAvailable: true })
      .where('providerId = :userId', { userId })
      .andWhere('status = :status', { status: 'suspended' })
      .execute();

    // Note: manager assignments are NOT auto-restored — admin must reassign manually

    await this.notifyUser(userId, 'account_resumed',
      'Compte réactivé',
      'Votre compte a été réactivé. Vos propriétés et services sont de nouveau disponibles.',
      '/dashboard');

    this.logger.log(`User ${userId} resumed by admin ${adminId}`);
    return { success: true, message: 'User resumed — properties and services restored' };
  }

  async archiveUser(userId: number, adminId: number, reason?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Deactivate user completely
    user.isActive = false;
    await this.userRepo.save(user);

    // Archive all properties
    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'archived', isAvailable: false })
      .where('hostId = :userId', { userId })
      .execute();

    // Archive all services
    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'archived', isAvailable: false })
      .where('providerId = :userId', { userId })
      .execute();

    // Deactivate all manager assignments
    await this.assignmentRepo.createQueryBuilder()
      .update(ManagerAssignment)
      .set({ isActive: false })
      .where('assignedByAdminId = :userId', { userId })
      .execute();

    await this.notifyUser(userId, 'account_archived',
      'Compte archivé',
      `Votre compte a été archivé.${reason ? ` Raison: ${reason}` : ''} Il sera supprimé définitivement dans ${ARCHIVE_TTL_DAYS} jours sauf réactivation par un administrateur.`,
      '/dashboard');

    this.logger.log(`User ${userId} archived by admin ${adminId} (TTL: ${ARCHIVE_TTL_DAYS} days)`);
    return { success: true, message: `User archived (auto-delete in ${ARCHIVE_TTL_DAYS} days)`, archiveTtlDays: ARCHIVE_TTL_DAYS };
  }

  async reactivateUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    await this.userRepo.save(user);

    // Restore archived properties to published
    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'published', isAvailable: true })
      .where('hostId = :userId', { userId })
      .andWhere('status IN (:...statuses)', { statuses: ['archived', 'suspended'] })
      .execute();

    // Restore archived services to published
    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'published', isAvailable: true })
      .where('providerId = :userId', { userId })
      .andWhere('status IN (:...statuses)', { statuses: ['archived', 'suspended'] })
      .execute();

    await this.notifyUser(userId, 'account_reactivated',
      'Compte réactivé',
      'Votre compte a été réactivé par un administrateur. Toutes vos propriétés et services sont de nouveau accessibles.',
      '/dashboard');

    this.logger.log(`User ${userId} reactivated by admin ${adminId}`);
    return { success: true, message: 'User reactivated — all properties and services restored' };
  }

  // ─── Helper ───────────────────────────────────────────────────

  private async notifyUser(userId: number, type: string, title: string, message: string, actionUrl: string) {
    try {
      await this.notificationService.create({
        userId,
        type: type as any,
        title,
        message,
        channel: 'both',
        actionUrl,
      });
      this.eventsGateway.emitNotification(userId, { type, title, message, actionUrl });
    } catch (err:any) {
      this.logger.warn(`Failed to notify user ${userId}: ${err.message}`);
    }
  }
}
