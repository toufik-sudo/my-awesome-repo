import { Controller, Get, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService, PaginatedResult } from '../services/metrics.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { AppRole } from 'src/user/entity/user.entity';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Metrics')
@ApiBearerAuth('JWT-auth')
@Controller('metrics')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('users')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed user metrics' })
  getUsers(@Request() req: any, @Query('role') role?: AppRole, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedUsers({ role, status, page: page || 1, limit: limit || 50 }, scopeCtx);
  }

  @Get('bookings')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed booking metrics' })
  getBookings(@Request() req: any, @Query('status') status?: string, @Query('propertyId') propertyId?: string, @Query('guestId') guestId?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedBookings({ status, propertyId, guestId, from, to, page: page || 1, limit: limit || 50 }, scopeCtx);
  }

  @Get('properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed property metrics' })
  getProperties(@Request() req: any, @Query('status') status?: string, @Query('hostId') hostId?: string, @Query('city') city?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedProperties({ status, hostId, city, page: page || 1, limit: limit || 50 }, scopeCtx);
  }

  @Get('services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed service metrics' })
  getServices(@Request() req: any, @Query('status') status?: string, @Query('providerId') providerId?: string, @Query('category') category?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedServices({ status, providerId, category, page: page || 1, limit: limit || 50 }, scopeCtx);
  }

  @Get('revenue')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Revenue breakdown' })
  getRevenue(@Request() req: any, @Query('from') from?: string, @Query('to') to?: string, @Query('groupBy') groupBy?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getRevenueBreakdown({ from, to, groupBy: groupBy || 'month' }, scopeCtx);
  }

  @Get('summary')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Platform summary' })
  getSummary(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getPlatformSummary(scopeCtx);
  }
}
