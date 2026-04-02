import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceBookingsService } from '../services/service-bookings.service';
import { CreateServiceBookingDto, ServiceAvailabilityDto } from '../dto/service-booking.dto';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Service Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('service-bookings')
@UseGuards(JwtAuthGuard)
export class ServiceBookingsController {
  constructor(private readonly bookingsService: ServiceBookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a service', description: 'Create a service booking with participant details.' })
  create(@Request() req: any, @Body() dto: CreateServiceBookingDto) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my service bookings' })
  getMyBookings(@Request() req: any) {
    return this.bookingsService.getMyBookings(req.user.id);
  }

  @Get('provider')
  @ApiOperation({ summary: 'Get bookings as provider', description: 'List bookings for services I provide.' })
  getProviderBookings(@Request() req: any) {
    return this.bookingsService.getProviderBookings(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service booking details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  getOne(@Param('id') id: string) {
    return this.bookingsService.getOne(id);
  }

  @Put(':id/accept')
  @ApiOperation({ summary: 'Accept a service booking' })
  @ApiParam({ name: 'id', format: 'uuid' })
  accept(@Param('id') id: string) {
    return this.bookingsService.accept(id);
  }

  @Put(':id/decline')
  @ApiOperation({ summary: 'Decline a service booking' })
  @ApiParam({ name: 'id', format: 'uuid' })
  decline(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingsService.decline(id, reason);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel a service booking' })
  @ApiParam({ name: 'id', format: 'uuid' })
  cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingsService.cancel(id, reason);
  }

  @Get('availability/:serviceId')
  @ApiOperation({ summary: 'Get service availability' })
  @ApiParam({ name: 'serviceId', format: 'uuid' })
  @ApiQuery({ name: 'startDate', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: true, description: 'YYYY-MM-DD' })
  getAvailability(
    @Param('serviceId') serviceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.getAvailability(serviceId, startDate, endDate);
  }

  @Post('availability/:serviceId')
  @ApiOperation({ summary: 'Set service availability for a date' })
  @ApiParam({ name: 'serviceId', format: 'uuid' })
  setAvailability(
    @Param('serviceId') serviceId: string,
    @Body() dto: ServiceAvailabilityDto,
  ) {
    return this.bookingsService.setAvailability(serviceId, dto);
  }

  @Post('availability/:serviceId/bulk')
  @ApiOperation({ summary: 'Bulk set service availability' })
  @ApiParam({ name: 'serviceId', format: 'uuid' })
  bulkSetAvailability(
    @Param('serviceId') serviceId: string,
    @Body('dates') dates: ServiceAvailabilityDto[],
  ) {
    return this.bookingsService.bulkSetAvailability(serviceId, dates);
  }
}
