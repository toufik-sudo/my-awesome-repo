import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService, PaginatedResult } from '../services/metrics.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Metrics')
@ApiBearerAuth('JWT-auth')
@Controller('metrics')
@UseGuards(PermissionGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('users')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Detailed user metrics', description: 'Paginated user list with roles. **Roles**: hyper_admin, hyper_manager' })
  @ApiQuery({ name: 'role', required: false, enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'] })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'] })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Paginated user metrics' })
  getUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.metricsService.getDetailedUsers({ role, status, page: page || 1, limit: limit || 50 });
  }

  @Get('bookings')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Detailed booking metrics', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'] })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'guestId', required: false })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  getBookings(
    @Query('status') status?: string,
    @Query('propertyId') propertyId?: string,
    @Query('guestId') guestId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.metricsService.getDetailedBookings({ status, propertyId, guestId, from, to, page: page || 1, limit: limit || 50 });
  }

  @Get('properties')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Detailed property metrics', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published', 'archived', 'suspended'] })
  @ApiQuery({ name: 'hostId', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  getProperties(
    @Query('status') status?: string,
    @Query('hostId') hostId?: string,
    @Query('city') city?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.metricsService.getDetailedProperties({ status, hostId, city, page: page || 1, limit: limit || 50 });
  }

  @Get('services')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Detailed service metrics', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  getServices(
    @Query('status') status?: string,
    @Query('providerId') providerId?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<any>> {
    return this.metricsService.getDetailedServices({ status, providerId, category, page: page || 1, limit: limit || 50 });
  }

  @Get('revenue')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Revenue breakdown', description: 'Monthly revenue and booking counts. **Roles**: hyper_admin, hyper_manager' })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['month', 'week', 'day'], description: 'Default: month' })
  getRevenue(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.metricsService.getRevenueBreakdown({ from, to, groupBy: groupBy || 'month' });
  }

  @Get('summary')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Platform summary', description: 'Global counts — users, properties, services, bookings, revenue. **Roles**: hyper_admin, hyper_manager' })
  @ApiResponse({ status: 200, description: 'Platform summary object' })
  getSummary() {
    return this.metricsService.getPlatformSummary();
  }
}
