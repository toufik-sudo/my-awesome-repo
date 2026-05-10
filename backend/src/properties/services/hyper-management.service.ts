import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { Property } from '../entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { Booking } from '../../bookings/entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
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
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ServiceBooking)
    private readonly serviceBookingRepo: Repository<ServiceBooking>,
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

  /**
   * Cascade a host pause/archive across their inventory:
   *  • Snapshots current property/service status into previousStatus (so resume
   *    can restore the exact prior state) and sets hostCascade=true.
   *  • Flags upcoming confirmed bookings with hostCascadeFlag=true so the
   *    guest can free-cancel without host validation.
   *  • Notifies every affected guest with a deep link to cancel.
   *
   * Cancellation refund rule (enforced in BookingsService.cancelByGuest):
   *  • Online payment methods (ccp / baridi_mob / bank_transfer / edahabia /
   *    cib) → full refund.
   *  • Cash (hand-to-hand) → no refund (nothing was charged through the
   *    platform), but the cancel demand is auto-approved.
   */
  private async cascadeInventoryStatus(
    userId: number,
    targetStatus: 'suspended' | 'archived',
  ) {
    // Properties: snapshot current status, set new status. Skip rows that
    // are already in a "frozen" state matching the target.
    await this.propertyRepo
      .createQueryBuilder()
      .update(Property)
      .set({
        previousStatus: () => '`status`',
        status: targetStatus,
        isAvailable: false,
        hostCascade: true,
      })
      .where('hostId = :userId', { userId })
      .andWhere('hostCascade = 0')
      .execute();

    // Services: same snapshot pattern.
    await this.serviceRepo
      .createQueryBuilder()
      .update(TourismService)
      .set({
        previousStatus: () => '`status`',
        status: targetStatus,
        isAvailable: false,
        hostCascade: true,
      })
      .where('providerId = :userId', { userId })
      .andWhere('hostCascade = 0')
      .execute();
  }

  /**
   * Restore properties/services that were frozen by a host cascade. Sets
   * status back to its snapshotted previousStatus (defaulting to 'published'
   * if no snapshot is present).
   */
  private async restoreInventoryStatus(userId: number) {
    await this.propertyRepo.query(
      `UPDATE \`properties\`
         SET \`status\` = COALESCE(\`previousStatus\`, 'published'),
             \`isAvailable\` = 1,
             \`previousStatus\` = NULL,
             \`hostCascade\` = 0
       WHERE \`hostId\` = ? AND \`hostCascade\` = 1`,
      [userId],
    );
    await this.serviceRepo.query(
      `UPDATE \`tourism_services\`
         SET \`status\` = COALESCE(\`previousStatus\`, 'published'),
             \`isAvailable\` = 1,
             \`previousStatus\` = NULL,
             \`hostCascade\` = 0
       WHERE \`providerId\` = ? AND \`hostCascade\` = 1`,
      [userId],
    );
  }

  /**
   * Mark every confirmed-but-not-started booking on this host's resources
   * with hostCascadeFlag=true and notify the guest. Returns the count of
   * notified guests for logging.
   */
  private async flagAndNotifyAffectedBookings(
    userId: number,
    reason: 'paused' | 'archived',
  ): Promise<number> {
    const now = new Date();

    // Property bookings on this host's properties
    const propertyIds = (
      await this.propertyRepo.find({ where: { hostId: userId }, select: ['id'] })
    ).map(p => p.id);

    let notified = 0;

    if (propertyIds.length > 0) {
      const upcoming = await this.bookingRepo.find({
        where: {
          propertyId: In(propertyIds),
          status: In(['confirmed', 'pending']) as any,
          checkInDate: MoreThan(now) as any,
        },
        relations: ['property'],
      });

      if (upcoming.length > 0) {
        await this.bookingRepo.update(
          { id: In(upcoming.map(b => b.id)) },
          { hostCascadeFlag: true },
        );
        for (const b of upcoming) {
          await this.notifyUser(
            b.guestId,
            'booking_host_cascade',
            reason === 'paused' ? 'Hôte indisponible' : 'Hôte archivé',
            `L'hôte de votre réservation "${b.property?.title || ''}" a été ` +
              `${reason === 'paused' ? 'mis en pause' : 'archivé'}. ` +
              `Vous pouvez annuler sans frais et obtenir un remboursement complet ` +
              `(sauf paiement en main propre).`,
            `/bookings/${b.id}`,
          );
          notified++;
        }
      }
    }

    // Service bookings on this provider's services
    const serviceIds = (
      await this.serviceRepo.find({ where: { providerId: userId }, select: ['id'] })
    ).map(s => s.id);

    if (serviceIds.length > 0) {
      const upcomingSvc = await this.serviceBookingRepo.find({
        where: {
          serviceId: In(serviceIds),
          status: In(['confirmed', 'pending']) as any,
          bookingDate: MoreThan(now) as any,
        },
        relations: ['service'],
      });

      if (upcomingSvc.length > 0) {
        await this.serviceBookingRepo.update(
          { id: In(upcomingSvc.map(b => b.id)) },
          { hostCascadeFlag: true },
        );
        for (const b of upcomingSvc) {
          const title =
            (b.service?.title as any)?.fr ||
            (b.service?.title as any)?.en ||
            'service';
          await this.notifyUser(
            b.customerId,
            'booking_host_cascade',
            reason === 'paused' ? 'Prestataire indisponible' : 'Prestataire archivé',
            `Le prestataire de votre réservation "${title}" a été ` +
              `${reason === 'paused' ? 'mis en pause' : 'archivé'}. ` +
              `Vous pouvez annuler sans frais et obtenir un remboursement complet ` +
              `(sauf paiement en main propre).`,
            `/bookings/services/${b.id}`,
          );
          notified++;
        }
      }
    }

    return notified;
  }

  /**
   * Clear the host-cascade flag on bookings when a host is resumed/reactivated.
   * Bookings already cancelled by the guest stay cancelled.
   */
  private async clearBookingCascadeFlag(userId: number) {
    const propertyIds = (
      await this.propertyRepo.find({ where: { hostId: userId }, select: ['id'] })
    ).map(p => p.id);
    if (propertyIds.length > 0) {
      await this.bookingRepo
        .createQueryBuilder()
        .update(Booking)
        .set({ hostCascadeFlag: false })
        .where('propertyId IN (:...ids) AND hostCascadeFlag = 1', { ids: propertyIds })
        .execute();
    }
    const serviceIds = (
      await this.serviceRepo.find({ where: { providerId: userId }, select: ['id'] })
    ).map(s => s.id);
    if (serviceIds.length > 0) {
      await this.serviceBookingRepo
        .createQueryBuilder()
        .update(ServiceBooking)
        .set({ hostCascadeFlag: false })
        .where('serviceId IN (:...ids) AND hostCascadeFlag = 1', { ids: serviceIds })
        .execute();
    }
  }

  async pauseUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;
    await this.userRepo.save(user);

    await this.cascadeInventoryStatus(userId, 'suspended');
    const notified = await this.flagAndNotifyAffectedBookings(userId, 'paused');

    // Cascade: remove permissions assigned by this user (managers/guests
    // lose their scope while the host is paused).
    await this.managerPermRepo
      .createQueryBuilder()
      .delete()
      .where('assignedById = :userId', { userId })
      .execute();

    await this.notifyUser(
      userId,
      'account_paused',
      'Compte mis en pause',
      'Votre compte a été mis en pause par un administrateur.',
      '/dashboard',
    );

    this.logger.log(
      `User ${userId} paused by admin ${adminId} (notified ${notified} affected guests)`,
    );
    return { success: true, message: 'User paused with cascading effects', notified };
  }

  async resumeUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    await this.userRepo.save(user);

    await this.restoreInventoryStatus(userId);
    await this.clearBookingCascadeFlag(userId);

    await this.notifyUser(
      userId,
      'account_resumed',
      'Compte réactivé',
      'Votre compte a été réactivé.',
      '/dashboard',
    );

    this.logger.log(`User ${userId} resumed by admin ${adminId}`);
    return { success: true, message: 'User resumed' };
  }

  async archiveUser(userId: number, adminId: number, reason?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;
    await this.userRepo.save(user);

    await this.cascadeInventoryStatus(userId, 'archived');
    const notified = await this.flagAndNotifyAffectedBookings(userId, 'archived');

    await this.managerPermRepo
      .createQueryBuilder()
      .delete()
      .where('assignedById = :userId', { userId })
      .execute();

    await this.notifyUser(
      userId,
      'account_archived',
      'Compte archivé',
      `Votre compte a été archivé.${reason ? ` Raison: ${reason}` : ''} Suppression dans ${ARCHIVE_TTL_DAYS} jours.`,
      '/dashboard',
    );

    this.logger.log(
      `User ${userId} archived by admin ${adminId} (notified ${notified} affected guests)`,
    );
    return {
      success: true,
      message: `User archived (auto-delete in ${ARCHIVE_TTL_DAYS} days)`,
      archiveTtlDays: ARCHIVE_TTL_DAYS,
      notified,
    };
  }

  async reactivateUser(userId: number, adminId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    await this.userRepo.save(user);

    await this.restoreInventoryStatus(userId);
    await this.clearBookingCascadeFlag(userId);

    await this.notifyUser(
      userId,
      'account_reactivated',
      'Compte réactivé',
      'Votre compte a été réactivé par un administrateur.',
      '/dashboard',
    );

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
