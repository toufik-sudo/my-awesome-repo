import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TourismService } from '../entity/tourism-service.entity';
import { RedisCacheService } from '../../infrastructure/redis';
import { CreateServiceDto, UpdateServiceDto } from '../dto/tourism-service.dto';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';

const CACHE_TTL_DETAIL = 600;
const CACHE_TTL_SEARCH = 120;

const PERM_KEY_FIND_ALL = 'backend.TourismServicesController.findAll.GET';
const PERM_KEY_FIND_ONE = 'backend.TourismServicesController.findOne.GET';
const PERM_KEY_UPDATE = 'backend.TourismServicesController.update.PUT';
const PERM_KEY_DELETE = 'backend.TourismServicesController.remove.DELETE';

interface FindAllFilters {
  city?: string;
  category?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  participants?: number;
  sort?: string;
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class TourismServicesService {
  private readonly logger = new Logger(TourismServicesService.name);

  constructor(
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
    private readonly cache: RedisCacheService,
    private readonly scopeFilter: ScopeFilterService,
  ) { }

  private async resolveAllowedServiceIds(
    scopeCtx: ScopeContext | undefined,
    permissionKey: string,
  ): Promise<string[] | null> {
    if (!scopeCtx) return null;

    const { userRole } = scopeCtx;
    if (userRole === 'hyper_admin' || userRole === 'admin' || userRole === 'user') return null;

    const scopedPerms = getScopedPerms(scopeCtx);
    if (scopedPerms.length === 0) return null;

    return this.scopeFilter.resolveServiceIds(scopedPerms, permissionKey);
  }

  async findAll(filters: FindAllFilters, scopeCtx?: ScopeContext) {
    const query = this.serviceRepo.createQueryBuilder('svc');
    query.where('svc.status = :status', { status: 'published' });

    // Apply scope filtering
    const allowedIds = await this.resolveAllowedServiceIds(scopeCtx, PERM_KEY_FIND_ALL);
    if (allowedIds !== null) {
      if (allowedIds.length === 0) {
        return { data: [], total: 0, page: filters.page, limit: filters.limit, totalPages: 0 };
      }
      query.andWhere('svc.id IN (:...allowedIds)', { allowedIds });
    }

    if (filters.city) {
      query.andWhere('(svc.city LIKE :city OR svc.wilaya LIKE :city)', { city: `%${filters.city}%` });
    }
    if (filters.category) {
      query.andWhere('svc.category = :category', { category: filters.category });
    }
    if (filters.categories && filters.categories.length > 0) {
      query.andWhere('svc.category IN (:...categories)', { categories: filters.categories });
    }
    if (filters.minPrice) {
      query.andWhere('svc.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice) {
      query.andWhere('svc.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters.participants) {
      query.andWhere('svc.maxParticipants >= :participants', { participants: filters.participants });
    }
    if (filters.search) {
      query.andWhere(
        "(JSON_EXTRACT(svc.title, '$.fr') LIKE :search OR JSON_EXTRACT(svc.title, '$.en') LIKE :search OR JSON_EXTRACT(svc.title, '$.ar') LIKE :search)",
        { search: `%${filters.search}%` },
      );
    }

    switch (filters.sort) {
      case 'price_asc': query.orderBy('svc.price', 'ASC'); break;
      case 'price_desc': query.orderBy('svc.price', 'DESC'); break;
      case 'rating': query.orderBy('svc.averageRating', 'DESC'); break;
      case 'newest': query.orderBy('svc.createdAt', 'DESC'); break;
      default:
        query.orderBy('svc.averageRating', 'DESC').addOrderBy('svc.bookingCount', 'DESC');
    }

    const skip = (filters.page - 1) * filters.limit;
    query.skip(skip).take(filters.limit);

    const filterHash = this.cache.hashFilters(filters);
    const scopeSuffix = allowedIds ? `:s${allowedIds.sort().join(',')}` : '';
    const cacheKey = this.cache.key('search', 'services', filterHash + scopeSuffix);

    return this.cache.getOrSet(cacheKey, async () => {
      const [data, total] = await query.getManyAndCount();
      return {
        data,
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      };
    }, CACHE_TTL_SEARCH);
  }

  async findOne(id: string, scopeCtx?: ScopeContext) {
    const allowedIds = await this.resolveAllowedServiceIds(scopeCtx, PERM_KEY_FIND_ONE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to this service');
    }

    const cacheKey = this.cache.key('service', id);
    return this.cache.getOrSet(cacheKey, () =>
      this.serviceRepo.findOne({
        where: { id },
        relations: ['provider'],
      }),
      CACHE_TTL_DETAIL,
    );
  }

  async create(createDto: CreateServiceDto, providerId: number) {
    const cerateServiceEntity = new TourismService();
    cerateServiceEntity.providerId = providerId;
    Object.assign(cerateServiceEntity, createDto);
    const service = this.serviceRepo.create(cerateServiceEntity);
    return this.serviceRepo.save(service);
  }

  async update(id: string, updateDto: UpdateServiceDto, scopeCtx?: ScopeContext) {
    const allowedIds = await this.resolveAllowedServiceIds(scopeCtx, PERM_KEY_UPDATE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to update this service');
    }

    const updateServiceEntity = new TourismService();
    Object.assign(updateServiceEntity, updateDto);
    await this.serviceRepo.update(id, updateServiceEntity);
    await this.cache.del(this.cache.key('service', id));
    await this.cache.invalidatePattern('app:search:services:*');
    return this.findOne(id);
  }

  async remove(id: string, scopeCtx?: ScopeContext) {
    const allowedIds = await this.resolveAllowedServiceIds(scopeCtx, PERM_KEY_DELETE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to delete this service');
    }

    const result = await this.serviceRepo.delete(id);
    await this.cache.del(this.cache.key('service', id));
    await this.cache.invalidatePattern('app:search:services:*');
    return result;
  }

  async getCategories() {
    const categories = await this.serviceRepo
      .createQueryBuilder('svc')
      .select('svc.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('svc.status = :status', { status: 'published' })
      .groupBy('svc.category')
      .getRawMany();
    return categories;
  }
}
