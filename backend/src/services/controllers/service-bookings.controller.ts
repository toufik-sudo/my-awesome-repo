import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ServiceBookingsService } from '../services/service-bookings.service';
import { CreateServiceBookingDto, ServiceAvailabilityDto } from '../dto/service-booking.dto';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@ApiTags('Service Bookings')
@ApiBearerAuth()
@Controller('service-bookings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ServiceBookingsController {
  constructor(private readonly bookingsService: ServiceBookingsService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create service booking' })
  create(@Request() req: any, @Body() dto: CreateServiceBookingDto) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @Get('my')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my bookings' })
  getMyBookings(@Request() req: any) { return this.bookingsService.getMyBookings(req.user.id); }

  @Get('provider')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get provider bookings' })
  getProviderBookings(@Request() req: any) { return this.bookingsService.getProviderBookings(req.user.id); }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id' })
  getOne(@Param('id') id: string, @Request() req: any) { return this.bookingsService.getOneScoped(id, req.user.id); }

  @Put(':id/accept')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Accept service booking' })
  accept(@Param('id') id: string) { return this.bookingsService.accept(id); }

  @Put(':id/decline')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Decline service booking' })
  decline(@Param('id') id: string, @Body('reason') reason?: string) { return this.bookingsService.decline(id, reason); }

  @Put(':id/cancel')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Cancel service booking' })
  cancel(@Param('id') id: string, @Body('reason') reason?: string) { return this.bookingsService.cancel(id, reason); }

  @Get('availability/:serviceId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get service availability' })
  @ApiParam({ name: 'serviceId' })
  getAvailability(@Param('serviceId') serviceId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.bookingsService.getAvailability(serviceId, startDate, endDate);
  }

  @Post('availability/:serviceId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Set service availability' })
  @ApiParam({ name: 'serviceId' })
  setAvailability(@Param('serviceId') serviceId: string, @Body() dto: ServiceAvailabilityDto) {
    return this.bookingsService.setAvailability(serviceId, dto);
  }

  @Post('availability/:serviceId/bulk')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Bulk set service availability' })
  @ApiParam({ name: 'serviceId' })
  bulkSetAvailability(@Param('serviceId') serviceId: string, @Body('dates') dates: ServiceAvailabilityDto[]) {
    return this.bookingsService.bulkSetAvailability(serviceId, dates);
  }
}
