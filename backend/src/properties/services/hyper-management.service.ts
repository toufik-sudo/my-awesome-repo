import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { ManagerPermission } from '../../user/entity/manager-permission.entity';
import { HyperManagerPermission } from '../../user/entity/hyper-manager-permission.entity';
import { GuestPermission } from '../../user/entity/guest-permission.entity';
import { NotificationService } from '../../notification/services/notification.service';
import { EventsGateway } from '../../infrastructure/websocket';

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
    @InjectRepository(ManagerPermission)
    private readonly managerPermRepo: Repository<ManagerPermission>,
    @InjectRepository(HyperManagerPermission)
    private readonly hyperPermRepo: Repository<HyperManagerPermission>,
    @InjectRepository(GuestPermission)
    private readonly guestPermRepo: Repository<GuestPermission>,
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
    return { success: true, message: 'Property paused' };
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
    return { success: true, message: 'Property resumed' };
  }

  async archiveProperty(propertyId: string, adminId: number, reason?: string) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    property.status = 'archived';
    property.isAvailable = false;
    await this.propertyRepo.save(property);

    await this.notifyUser(property.hostId, 'property_archived',
      'Propriété archivée',
      `Votre propriété "${property.title}" a été archivée.${reason ? ` Raison: ${reason}` : ''}`,
      `/property/${propertyId}`);

    this.logger.log(`Property ${propertyId} archived by admin ${adminId}`);
    return { success: true, message: 'Property archived' };
  }

  async deleteProperty(propertyId: string, adminId: number) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const hostId = property.hostId;
    await this.propertyRepo.remove(property);

    await this.notifyUser(hostId, 'property_deleted',
      'Propriété supprimée',
      `Votre propriété "${property.title}" a été supprimée définitivement.`,
      '/dashboard');

    this.logger.log(`Property ${propertyId} deleted by admin ${adminId}`);
    return { success: true, message: 'Property deleted permanently' };
  }

  // ─── Services ──────────────────────────────────────────────────

  async pauseService(serviceId: string, adminId: number) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    service.status = 'suspended';
    service.isAvailable = false;
    await this.serviceRepo.save(service);

    const serviceTitle = service.title?.fr || service.title?.en || serviceId;
    await this.notifyUser(service.providerId, 'service_paused',
      'Service mis en pause',
      `Votre service "${serviceTitle}" a été mis en pause.`,
      `/service/${serviceId}`);

    this.logger.log(`Service ${serviceId} paused by admin ${adminId}`);
    return { success: true, message: 'Service paused' };
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

    const serviceTitle = service.title?.fr || service.title?.en || serviceId;
    await this.notifyUser(service.providerId, 'service_archived',
      'Service archivé',
      `Votre service "${serviceTitle}" a été archivé.${reason ? ` Raison: ${reason}` : ''}`,
      `/service/${serviceId}`);

    this.logger.log(`Service ${serviceId} archived by admin ${adminId}`);
    return { success: true, message: 'Service archived' };
  }

  async deleteService(serviceId: string, adminId: number) {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    const providerId = service.providerId;
    const serviceTitle = service.title?.fr || service.title?.en || serviceId;
    await this.serviceRepo.remove(service);

    await this.notifyUser(providerId, 'service_deleted',
      'Service supprimé',
      `Votre service "${serviceTitle}" a été supprimé définitivement.`,
      '/dashboard');

    this.logger.log(`Service ${serviceId} deleted by admin ${adminId}`);
    return { success: true, message: 'Service deleted permanently' };
  }

  // ─── Users ─────────────────────────────────────────────────────

  async pauseUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

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

    // Cascade: remove all permissions assigned by this user
    await this.managerPermRepo.createQueryBuilder()
      .delete()
      .where('assignedById = :userId', { userId })
      .execute();

    await this.notifyUser(userId, 'account_paused',
      'Compte mis en pause',
      'Votre compte a été mis en pause par un administrateur.',
      '/dashboard');

    this.logger.log(`User ${userId} paused by admin ${adminId}`);
    return { success: true, message: 'User paused with cascading effects' };
  }

  async resumeUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    await this.userRepo.save(user);

    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'published', isAvailable: true })
      .where('hostId = :userId', { userId })
      .andWhere('status = :status', { status: 'suspended' })
      .execute();

    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'published', isAvailable: true })
      .where('providerId = :userId', { userId })
      .andWhere('status = :status', { status: 'suspended' })
      .execute();

    await this.notifyUser(userId, 'account_resumed',
      'Compte réactivé',
      'Votre compte a été réactivé.',
      '/dashboard');

    this.logger.log(`User ${userId} resumed by admin ${adminId}`);
    return { success: true, message: 'User resumed' };
  }

  async archiveUser(userId: number, adminId: number, reason?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;
    await this.userRepo.save(user);

    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'archived', isAvailable: false })
      .where('hostId = :userId', { userId })
      .execute();

    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'archived', isAvailable: false })
      .where('providerId = :userId', { userId })
      .execute();

    // Remove all permissions assigned by this user
    await this.managerPermRepo.createQueryBuilder()
      .delete()
      .where('assignedById = :userId', { userId })
      .execute();

    await this.notifyUser(userId, 'account_archived',
      'Compte archivé',
      `Votre compte a été archivé.${reason ? ` Raison: ${reason}` : ''} Suppression dans ${ARCHIVE_TTL_DAYS} jours.`,
      '/dashboard');

    this.logger.log(`User ${userId} archived by admin ${adminId}`);
    return { success: true, message: `User archived (auto-delete in ${ARCHIVE_TTL_DAYS} days)`, archiveTtlDays: ARCHIVE_TTL_DAYS };
  }

  async reactivateUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    await this.userRepo.save(user);

    await this.propertyRepo.createQueryBuilder()
      .update(Property)
      .set({ status: 'published', isAvailable: true })
      .where('hostId = :userId', { userId })
      .andWhere('status IN (:...statuses)', { statuses: ['archived', 'suspended'] })
      .execute();

    await this.serviceRepo.createQueryBuilder()
      .update(TourismService)
      .set({ status: 'published', isAvailable: true })
      .where('providerId = :userId', { userId })
      .andWhere('status IN (:...statuses)', { statuses: ['archived', 'suspended'] })
      .execute();

    await this.notifyUser(userId, 'account_reactivated',
      'Compte réactivé',
      'Votre compte a été réactivé par un administrateur.',
      '/dashboard');

    this.logger.log(`User ${userId} reactivated by admin ${adminId}`);
    return { success: true, message: 'User reactivated' };
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
    } catch (err: any) {
      this.logger.warn(`Failed to notify user ${userId}: ${err.message}`);
    }
  }
}
