import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ServiceBookingsService } from '../services/service-bookings.service';
import { CreateServiceBookingDto, ServiceAvailabilityDto } from '../dto/service-booking.dto';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@Controller('service-bookings')
@UseGuards(JwtAuthGuard)
export class ServiceBookingsController {
  constructor(private readonly bookingsService: ServiceBookingsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateServiceBookingDto) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @Get('my')
  getMyBookings(@Request() req: any) {
    return this.bookingsService.getMyBookings(req.user.id);
  }

  @Get('provider')
  getProviderBookings(@Request() req: any) {
    return this.bookingsService.getProviderBookings(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.bookingsService.getOne(id);
  }

  @Put(':id/accept')
  accept(@Param('id') id: string) {
    return this.bookingsService.accept(id);
  }

  @Put(':id/decline')
  decline(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingsService.decline(id, reason);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingsService.cancel(id, reason);
  }

  // ── Availability ──
  @Get('availability/:serviceId')
  getAvailability(
    @Param('serviceId') serviceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.getAvailability(serviceId, startDate, endDate);
  }

  @Post('availability/:serviceId')
  setAvailability(
    @Param('serviceId') serviceId: string,
    @Body() dto: ServiceAvailabilityDto,
  ) {
    return this.bookingsService.setAvailability(serviceId, dto);
  }

  @Post('availability/:serviceId/bulk')
  bulkSetAvailability(
    @Param('serviceId') serviceId: string,
    @Body('dates') dates: ServiceAvailabilityDto[],
  ) {
    return this.bookingsService.bulkSetAvailability(serviceId, dates);
  }
}
