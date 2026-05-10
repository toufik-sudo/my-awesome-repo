import { Controller, Get, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService, PaginatedResult } from '../services/metrics.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { AppRole } from 'src/user/entity/user.entity';
import { extractScopeContext } from '../../rbac/scope-context';

/** Clamp pagination params to project-wide defaults: page=1, limit=20, max=100 */
const clampPage = (p?: number | string) => Math.max(1, parseInt(String(p ?? 1), 10) || 1);
const clampLimit = (l?: number | string) => Math.min(100, Math.max(1, parseInt(String(l ?? 20), 10) || 20));

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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUsers(@Request() req: any, @Query('role') role?: AppRole, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedUsers({ role, status, page: clampPage(page), limit: clampLimit(limit) }, scopeCtx);
  }

  @Get('bookings')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed booking metrics' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getBookings(@Request() req: any, @Query('status') status?: string, @Query('propertyId') propertyId?: string, @Query('guestId') guestId?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedBookings({ status, propertyId, guestId, from, to, page: clampPage(page), limit: clampLimit(limit) }, scopeCtx);
  }

  @Get('properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed property metrics' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getProperties(@Request() req: any, @Query('status') status?: string, @Query('hostId') hostId?: string, @Query('city') city?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedProperties({ status, hostId, city, page: clampPage(page), limit: clampLimit(limit) }, scopeCtx);
  }

  @Get('services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Detailed service metrics' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getServices(@Request() req: any, @Query('status') status?: string, @Query('providerId') providerId?: string, @Query('category') category?: string, @Query('page') page?: number, @Query('limit') limit?: number): Promise<PaginatedResult<any>> {
    const scopeCtx = extractScopeContext(req);
    return this.metricsService.getDetailedServices({ status, providerId, category, page: clampPage(page), limit: clampLimit(limit) }, scopeCtx);
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
