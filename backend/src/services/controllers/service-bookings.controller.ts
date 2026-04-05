import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ServiceBookingsService } from '../services/service-bookings.service';
import { CreateServiceBookingDto, ServiceAvailabilityDto } from '../dto/service-booking.dto';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { RequireRole, RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Service Bookings')
@ApiBearerAuth()
@Controller('service-bookings')
@UseGuards(PermissionGuard)
export class ServiceBookingsController {
  constructor(private readonly bookingsService: ServiceBookingsService) {}

  @Post()
  @SetMetadata('IS_BOOKING_CREATE', true)
  @ApiOperation({
    summary: 'Create service booking',
    description: 'Only manager, guest, and user can book. Hyper/admin cannot.',
  })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 403, description: 'Role cannot book' })
  create(@Request() req: any, @Body() dto: CreateServiceBookingDto) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my bookings' })
  getMyBookings(@Request() req: any) {
    return this.bookingsService.getMyBookings(req.user.id);
  }

  @Get('provider')
  @RequireRole('admin', 'manager', 'hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Get provider bookings', description: 'Admin/manager see their service bookings.' })
  getProviderBookings(@Request() req: any) {
    return this.bookingsService.getProviderBookings(req.user.id);
  }

  // [BE-02] Scope check on getOne
  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  getOne(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.getOneScoped(id, req.user.id);
  }

  // [BE-08] Removed hyper_admin, hyper_manager — only admin/manager can accept
  @Put(':id/accept')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Accept service booking', description: 'Only admin/manager can accept.' })
  accept(@Param('id') id: string) {
    return this.bookingsService.accept(id);
  }

  // [BE-08] Removed hyper_admin, hyper_manager — only admin/manager can decline
  @Put(':id/decline')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Decline service booking', description: 'Only admin/manager can decline.' })
  decline(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingsService.decline(id, reason);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel service booking', description: 'Guest/user can cancel their own booking.' })
  cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingsService.cancel(id, reason);
  }

  // ── Availability ──
  @Get('availability/:serviceId')
  @ApiOperation({ summary: 'Get service availability' })
  @ApiParam({ name: 'serviceId', description: 'Service UUID' })
  getAvailability(
    @Param('serviceId') serviceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.getAvailability(serviceId, startDate, endDate);
  }

  @Post('availability/:serviceId')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Set service availability', description: 'Admin/manager only.' })
  @ApiParam({ name: 'serviceId', description: 'Service UUID' })
  setAvailability(
    @Param('serviceId') serviceId: string,
    @Body() dto: ServiceAvailabilityDto,
  ) {
    return this.bookingsService.setAvailability(serviceId, dto);
  }

  @Post('availability/:serviceId/bulk')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Bulk set service availability' })
  @ApiParam({ name: 'serviceId', description: 'Service UUID' })
  bulkSetAvailability(
    @Param('serviceId') serviceId: string,
    @Body('dates') dates: ServiceAvailabilityDto[],
  ) {
    return this.bookingsService.bulkSetAvailability(serviceId, dates);
  }
}
