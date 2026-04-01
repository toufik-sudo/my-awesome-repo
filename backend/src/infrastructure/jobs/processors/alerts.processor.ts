import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Job } from 'bullmq';
import { QUEUE_ALERTS } from '../jobs.constant';
import { SavedSearchAlert } from '../../../properties/entity/saved-search-alert.entity';
import { Property } from '../../../properties/entity/property.entity';
import { PromoAlert } from '../../../properties/entity/promo-alert.entity';
import { PropertyPromo } from '../../../properties/entity/property-promo.entity';
import { Notification } from '../../../notification/entity/notification.entity';

@Processor(QUEUE_ALERTS)
export class AlertsProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertsProcessor.name);

  constructor(
    @InjectRepository(SavedSearchAlert)
    private readonly savedSearchRepo: Repository<SavedSearchAlert>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(PromoAlert)
    private readonly promoAlertRepo: Repository<PromoAlert>,
    @InjectRepository(PropertyPromo)
    private readonly promoRepo: Repository<PropertyPromo>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'process-saved-searches':
        return this.processSavedSearches(job);
      case 'process-promo-alerts':
        return this.processPromoAlerts(job);
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  /** Check saved search alerts and notify users of new matching properties */
  private async processSavedSearches(job: Job) {
    const alerts = await this.savedSearchRepo.find({
      where: { isActive: true },
      relations: ['user'],
    });

    let notified = 0;
    for (const alert of alerts) {
      try {
        const query = this.propertyRepo.createQueryBuilder('p')
          .where('p.status = :status', { status: 'published' });

        if (alert.lastTriggeredAt) {
          query.andWhere('p.createdAt > :since', { since: alert.lastTriggeredAt });
        }

        const criteria = alert.criteria;
        if (criteria.city) query.andWhere('(p.city LIKE :city OR p.wilaya LIKE :city)', { city: `%${criteria.city}%` });
        if (criteria.type) query.andWhere('p.propertyType = :type', { type: criteria.type });
        if (criteria.minPrice) query.andWhere('p.pricePerNight >= :minP', { minP: criteria.minPrice });
        if (criteria.maxPrice) query.andWhere('p.pricePerNight <= :maxP', { maxP: criteria.maxPrice });
        if (criteria.guests) query.andWhere('p.maxGuests >= :guests', { guests: criteria.guests });
        if (criteria.bedrooms) query.andWhere('p.bedrooms >= :beds', { beds: criteria.bedrooms });
        if (criteria.minTrustStars) query.andWhere('p.trustStars >= :trust', { trust: criteria.minTrustStars });
        if (criteria.allowPets) query.andWhere('p.allowPets = :pets', { pets: true });

        const matches = await query.getCount();

        if (matches > 0) {
          await this.notificationRepo.save(
            this.notificationRepo.create({
              userId: alert.userId,
              type: 'saved_search_match',
              title: `${matches} nouvelle(s) propriété(s) correspondent à "${alert.name}"`,
              message: `Votre recherche sauvegardée "${alert.name}" a trouvé ${matches} nouveau(x) résultat(s).`,
              actionUrl: `/properties?saved_search=${alert.id}`,
            }),
          );
          notified++;
        }

        await this.savedSearchRepo.update(alert.id, {
          lastTriggeredAt: new Date(),
          matchCount: matches,
        });
      } catch (err) {
        this.logger.error(`Failed to process alert ${alert.id}: ${(err as Error).message}`);
      }
    }

    this.logger.log(`Saved search alerts processed: ${alerts.length} alerts, ${notified} notifications sent`);
    return { processed: alerts.length, notified };
  }

  /** Notify users subscribed to promo alerts when new promos are created */
  private async processPromoAlerts(job: Job) {
    const { propertyId, promoLabel } = job.data;

    const subscribers = await this.promoAlertRepo.find({
      where: { propertyId, isActive: true },
      relations: ['user', 'property'],
    });

    for (const sub of subscribers) {
      await this.notificationRepo.save(
        this.notificationRepo.create({
          userId: sub.userId,
          type: 'promo_alert',
          title: `Promotion sur ${sub.property?.title || 'une propriété'}`,
          message: promoLabel || 'Une nouvelle promotion est disponible!',
          actionUrl: `/property/${propertyId}`,
        }),
      );
    }

    this.logger.log(`Promo alerts sent: ${subscribers.length} for property ${propertyId}`);
    return { notified: subscribers.length };
  }
}
