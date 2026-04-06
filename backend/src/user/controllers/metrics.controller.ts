import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../entity/user.entity';

@ApiTags('Metrics')
@ApiBearerAuth('JWT-auth')
@Controller('metrics')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class MetricsController {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Get('properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List all properties with metrics' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getProperties(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const qb = this.propertyRepo.createQueryBuilder('prop')
      .leftJoinAndSelect('prop.host', 'host');

    if (status && status !== 'all') {
      qb.where('prop.status = :status', { status });
    }

    qb.orderBy('prop.createdAt', 'DESC')
      .skip((p - 1) * l)
      .take(l);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items.map(prop => ({
        id: prop.id,
        title: prop.title,
        propertyType: prop.propertyType,
        status: prop.status,
        city: prop.city,
        wilaya: prop.wilaya,
        pricePerNight: prop.pricePerNight,
        currency: prop.currency || 'DZD',
        hostId: prop.hostId,
        hostEmail: (prop as any).host?.email || '',
        hostName: `${(prop as any).host?.firstName || ''} ${(prop as any).host?.lastName || ''}`.trim(),
        bedrooms: prop.bedrooms,
        maxGuests: prop.maxGuests,
        averageRating: prop.averageRating || 0,
        trustStars: prop.trustStars || 0,
        isVerified: prop.isVerified || false,
        isAvailable: prop.isAvailable !== false,
        createdAt: prop.createdAt,
      })),
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    };
  }

  @Get('services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List all services with metrics' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getServices(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const qb = this.serviceRepo.createQueryBuilder('svc')
      .leftJoinAndSelect('svc.provider', 'provider');

    if (status && status !== 'all') {
      qb.where('svc.status = :status', { status });
    }

    qb.orderBy('svc.createdAt', 'DESC')
      .skip((p - 1) * l)
      .take(l);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items.map(svc => ({
        id: svc.id,
        title: svc.title,
        category: svc.category,
        status: svc.status || 'published',
        city: svc.city,
        price: svc.price,
        currency: svc.currency || 'DZD',
        providerId: svc.providerId,
        providerEmail: (svc as any).provider?.email || '',
        providerName: `${(svc as any).provider?.firstName || ''} ${(svc as any).provider?.lastName || ''}`.trim(),
        averageRating: svc.averageRating || 0,
        isAvailable: svc.isAvailable !== false,
        createdAt: svc.createdAt,
      })),
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    };
  }

  @Get('summary')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Platform-wide summary metrics' })
  async getSummary() {
    const [totalProperties, publishedProperties] = await Promise.all([
      this.propertyRepo.count(),
      this.propertyRepo.count({ where: { status: 'published' } }),
    ]);

    const totalServices = await this.serviceRepo.count();

    const [totalUsers, activeUsers] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { isActive: true } }),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
      properties: { total: totalProperties, published: publishedProperties },
      services: { total: totalServices },
    };
  }
}
