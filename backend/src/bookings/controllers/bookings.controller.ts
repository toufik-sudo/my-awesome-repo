import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('bookings')
@UseGuards(PermissionGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Get()
  @RequirePermission('answer_demands', 'propertyId', 'query')
  findAll(@Query('status') status?: string, @Query('propertyId') propertyId?: string) {
    return this.bookingsService.findAll(status);
  }

  @Get('my')
  getMyBookings(@Request() req: any) {
    return this.bookingsService.findByGuest(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateBookingDto, @Request() req: any) {
    return this.bookingsService.create(createDto, req.user.id);
  }

  @Put(':id/accept')
  @RequirePermission('accept_demands', 'propertyId', 'body')
  accept(@Param('id') id: string, @Body('propertyId') propertyId: string) {
    return this.bookingsService.updateStatus(id, 'confirmed');
  }

  @Put(':id/decline')
  @RequirePermission('decline_demands', 'propertyId', 'body')
  decline(
    @Param('id') id: string,
    @Body('propertyId') propertyId: string,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.declineBooking(id, reason);
  }

  @Put(':id/counter-offer')
  @RequirePermission('accept_demands', 'propertyId', 'body')
  counterOffer(
    @Param('id') id: string,
    @Body() body: {
      propertyId: string;
      newPrice: number;
      newCheckIn?: string;
      newCheckOut?: string;
      message?: string;
    },
  ) {
    return this.bookingsService.createCounterOffer(id, body);
  }

  @Put(':id/refund')
  @RequirePermission('refund_users', 'propertyId', 'body')
  refund(@Param('id') id: string, @Body('propertyId') propertyId: string) {
    return this.bookingsService.updateStatus(id, 'refunded');
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Public()
  @Get('availability/:propertyId')
  checkAvailability(
    @Param('propertyId') propertyId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.bookingsService.checkAvailability(propertyId, checkIn, checkOut);
  }
}
