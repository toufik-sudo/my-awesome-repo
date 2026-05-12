import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { Booking } from '../entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { JobProducerService } from '../../infrastructure/jobs';
import { HyperNotifierService } from '../../user/services/hyper-notifier.service';
import { UserBlameService } from '../../user/services/user-blame.service';
import { NotificationContent } from '../../notification/constants/notification-content.constant';

const ACCEPT_REMINDER_AFTER_HOURS = 24;
const ACCEPT_HARD_DEADLINE_HOURS = 48;
const PAYMENT_REMINDER_HOURS = [12, 20]; // first reminder at 12h, last at 20h
const PAYMENT_HARD_DEADLINE_HOURS = 24;

/**
 * Cron-driven lifecycle for bookings & service-bookings:
 *  - Pending too long → reminder, then auto-cancellable + host blame at 48h.
 *  - Accepted but no payment → reminders, then archive + guest blame at 24h.
 * Runs every 15 minutes; idempotent (uses reminder counters / status guards).
 */
@Injectable()
export class BookingLifecycleService {
  private readonly logger = new Logger(BookingLifecycleService.name);

  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ServiceBooking) private readonly serviceBookingRepo: Repository<ServiceBooking>,
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService) private readonly serviceRepo: Repository<TourismService>,
    private readonly jobs: JobProducerService,
    private readonly hyperNotifier: HyperNotifierService,
    private readonly blameService: UserBlameService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async sweep() {
    try {
      await this.handlePropertyBookings();
      await this.handleServiceBookings();
    } catch (e) {
      this.logger.error(`Lifecycle sweep failed: ${(e as Error).message}`);
    }
  }

  // ── Property bookings ────────────────────────────────────────────
  private async handlePropertyBookings() {
    const now = Date.now();

    // PENDING reminders & hard deadline
    const pending = await this.bookingRepo.find({
      where: { status: 'pending' as any },
      relations: ['property', 'guest'],
    });
    for (const b of pending) {
      const ageH = (now - new Date(b.createdAt).getTime()) / 3600 / 1000;

      if (ageH >= ACCEPT_HARD_DEADLINE_HOURS) {
        // Guest is now allowed to cancel; blame the host as non-serious.
        const hostId = b.property?.hostId;
        if (hostId) {
          await this.blameService.createBlame({
            userId: hostId,
            type: 'host_no_response',
            reason: `Did not respond to booking request ${b.id.slice(0, 8)} within ${ACCEPT_HARD_DEADLINE_HOURS}h.`,
            bookingRef: b.id,
          });
        }
        // Notify guest they can cancel
        await this.jobs.queueNotification({
          userId: b.guestId,
          type: 'booking_update',
          ...NotificationContent.hostDidNotRespond({
            propertyName: b.property?.title,
            bookingId: b.id,
            deadlineHours: ACCEPT_HARD_DEADLINE_HOURS,
          }),
          channel: 'both',
          actionUrl: `/bookings/${b.id}`,
          metadata: { bookingId: b.id, hostBlamed: true },
        });
        await this.hyperNotifier.notifyHypers({
          type: 'booking_update',
          ...NotificationContent.hyperBookingPendingTooLong({ bookingId: b.id }),
          actionUrl: `/admin/bookings/${b.id}`,
          metadata: { bookingId: b.id },
        });
      } else if (ageH >= ACCEPT_REMINDER_AFTER_HOURS && (b.acceptReminderCount || 0) < 1) {
        await this.jobs.queueNotification({
          userId: b.property?.hostId as any,
          type: 'booking_request',
          ...NotificationContent.hostPendingReminder({ propertyName: b.property?.title, bookingId: b.id }),
          channel: 'both',
          actionUrl: `/bookings/${b.id}`,
          metadata: { bookingId: b.id },
        });
        await this.bookingRepo.update(b.id, { acceptReminderCount: (b.acceptReminderCount || 0) + 1 });
      }
    }

    // ACCEPTED → unpaid (paymentStatus=pending) reminders + archive
    const accepted = await this.bookingRepo.find({
      where: { status: 'accepted' as any, paymentStatus: 'pending' as any },
      relations: ['property', 'guest'],
    });
    for (const b of accepted) {
      const acceptedAt = b.acceptedAt ? new Date(b.acceptedAt).getTime() : new Date(b.updatedAt).getTime();
      const ageH = (now - acceptedAt) / 3600 / 1000;

      if (ageH >= PAYMENT_HARD_DEADLINE_HOURS) {
        await this.bookingRepo.update(b.id, {
          status: 'archived' as any,
          archivedAt: new Date(),
        });
        await this.blameService.createBlame({
          userId: b.guestId,
          type: 'guest_no_payment',
          reason: `Did not pay for booking ${b.id.slice(0, 8)} within ${PAYMENT_HARD_DEADLINE_HOURS}h after acceptance.`,
          bookingRef: b.id,
        });
        await this.jobs.queueNotification({
          userId: b.guestId,
          type: 'booking_update',
          ...NotificationContent.bookingArchivedGuest({
            propertyName: b.property?.title,
            bookingId: b.id,
            deadlineHours: PAYMENT_HARD_DEADLINE_HOURS,
          }),
          channel: 'both',
          actionUrl: `/bookings/${b.id}`,
        });
        if (b.property?.hostId) {
          await this.jobs.queueNotification({
            userId: b.property.hostId as any,
            type: 'booking_update',
            ...NotificationContent.bookingArchivedHost({
              propertyName: b.property?.title,
              bookingId: b.id,
            }),
            channel: 'both',
            actionUrl: `/bookings/${b.id}`,
          });
        }
        await this.hyperNotifier.notifyHypers({
          type: 'booking_update',
          ...NotificationContent.hyperBookingArchivedNoPayment({ bookingId: b.id }),
          actionUrl: `/admin/bookings/${b.id}`,
          metadata: { bookingId: b.id },
        });
      } else {
        const expectedReminders = PAYMENT_REMINDER_HOURS.filter((h) => ageH >= h).length;
        if ((b.paymentReminderCount || 0) < expectedReminders) {
          const isLast = expectedReminders >= PAYMENT_REMINDER_HOURS.length;
          await this.jobs.queueNotification({
            userId: b.guestId,
            type: 'booking_update',
            ...NotificationContent.paymentReminder({
              propertyName: b.property?.title,
              bookingId: b.id,
              isLast,
              deadlineHours: PAYMENT_HARD_DEADLINE_HOURS,
            }),
            channel: 'both',
            actionUrl: `/bookings/${b.id}`,
          });
          await this.bookingRepo.update(b.id, { paymentReminderCount: expectedReminders });
        }
      }
    }
  }

  // ── Service bookings (mirror logic) ─────────────────────────────
  private async handleServiceBookings() {
    const now = Date.now();
    const pending = await this.serviceBookingRepo.find({
      where: { status: 'pending' as any },
      relations: ['service', 'customer'],
    });
    for (const b of pending) {
      const ageH = (now - new Date(b.createdAt).getTime()) / 3600 / 1000;
      if (ageH >= ACCEPT_HARD_DEADLINE_HOURS) {
        const providerId = b.service?.providerId;
        if (providerId) {
          await this.blameService.createBlame({
            userId: providerId,
            type: 'host_no_response',
            reason: `Did not respond to service booking ${b.id.slice(0, 8)} within ${ACCEPT_HARD_DEADLINE_HOURS}h.`,
            bookingRef: b.id,
          });
        }
        await this.jobs.queueNotification({
          userId: b.customerId,
          type: 'booking_update',
          ...NotificationContent.providerDidNotRespond({ bookingId: b.id, deadlineHours: ACCEPT_HARD_DEADLINE_HOURS }),
          channel: 'both',
          actionUrl: `/services/bookings/${b.id}`,
        });
      } else if (ageH >= ACCEPT_REMINDER_AFTER_HOURS && (b.acceptReminderCount || 0) < 1) {
        await this.jobs.queueNotification({
          userId: b.service?.providerId as any,
          type: 'booking_request',
          ...NotificationContent.providerPendingReminder({ bookingId: b.id }),
          channel: 'both',
          actionUrl: `/services/bookings/${b.id}`,
        });
        await this.serviceBookingRepo.update(b.id, { acceptReminderCount: (b.acceptReminderCount || 0) + 1 });
      }
    }

    const accepted = await this.serviceBookingRepo.find({
      where: { status: 'accepted' as any, paymentStatus: 'pending' as any },
      relations: ['service', 'customer'],
    });
    for (const b of accepted) {
      const acceptedAt = b.acceptedAt ? new Date(b.acceptedAt).getTime() : new Date(b.updatedAt).getTime();
      const ageH = (now - acceptedAt) / 3600 / 1000;
      if (ageH >= PAYMENT_HARD_DEADLINE_HOURS) {
        await this.serviceBookingRepo.update(b.id, {
          status: 'archived' as any,
          archivedAt: new Date(),
        });
        await this.blameService.createBlame({
          userId: b.customerId,
          type: 'guest_no_payment',
          reason: `Did not pay for service booking ${b.id.slice(0, 8)} within ${PAYMENT_HARD_DEADLINE_HOURS}h.`,
          bookingRef: b.id,
        });
        await this.jobs.queueNotification({
          userId: b.customerId,
          type: 'booking_update',
          ...NotificationContent.serviceArchivedCustomer({ bookingId: b.id }),
          channel: 'both',
        });
      } else {
        const expectedReminders = PAYMENT_REMINDER_HOURS.filter((h) => ageH >= h).length;
        if ((b.paymentReminderCount || 0) < expectedReminders) {
          await this.jobs.queueNotification({
            userId: b.customerId,
            type: 'booking_update',
            ...NotificationContent.servicePaymentReminder({ bookingId: b.id }),
            channel: 'both',
            actionUrl: `/services/bookings/${b.id}`,
          });
          await this.serviceBookingRepo.update(b.id, { paymentReminderCount: expectedReminders });
        }
      }
    }
  }
}
