import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(PermissionGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Get()
  @RequirePermission('answer_demands', 'propertyId', 'query')
  @ApiOperation({ summary: 'List bookings', description: 'List bookings for a property. **Permission**: answer_demands' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'] })
  @ApiQuery({ name: 'propertyId', required: false, type: 'string', format: 'uuid' })
  findAll(@Query('status') status?: string, @Query('propertyId') propertyId?: string) {
    return this.bookingsService.findAll(status);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my bookings', description: 'List all bookings for the authenticated guest.' })
  @ApiResponse({ status: 200, description: 'Array of user bookings' })
  getMyBookings(@Request() req: any) {
    return this.bookingsService.findByGuest(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a booking', description: 'Book a property. Payment method must be one of: ccp, baridi_mob, edahabia, cib, cash, bank_transfer' })
  @ApiResponse({ status: 201, description: 'Booking created with status pending' })
  create(@Body() createDto: CreateBookingDto, @Request() req: any) {
    return this.bookingsService.create(createDto, req.user.id);
  }

  @Put(':id/accept')
  @RequirePermission('accept_demands', 'propertyId', 'body')
  @ApiOperation({ summary: 'Accept a booking', description: '**Permission**: accept_demands' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', required: ['propertyId'], properties: { propertyId: { type: 'string', format: 'uuid' } } } })
  accept(@Param('id') id: string, @Body('propertyId') propertyId: string) {
    return this.bookingsService.updateStatus(id, 'confirmed');
  }

  @Put(':id/decline')
  @RequirePermission('decline_demands', 'propertyId', 'body')
  @ApiOperation({ summary: 'Decline a booking', description: '**Permission**: decline_demands' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', required: ['propertyId'], properties: {
    propertyId: { type: 'string', format: 'uuid' },
    reason: { type: 'string', description: 'Optional decline reason' },
  }}})
  decline(
    @Param('id') id: string,
    @Body('propertyId') propertyId: string,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.declineBooking(id, reason);
  }

  @Put(':id/counter-offer')
  @RequirePermission('accept_demands', 'propertyId', 'body')
  @ApiOperation({ summary: 'Counter-offer a booking', description: 'Propose alternative price/dates. **Permission**: accept_demands' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', required: ['propertyId', 'newPrice'], properties: {
    propertyId: { type: 'string', format: 'uuid' },
    newPrice: { type: 'number', example: 15000 },
    newCheckIn: { type: 'string', description: 'YYYY-MM-DD' },
    newCheckOut: { type: 'string', description: 'YYYY-MM-DD' },
    message: { type: 'string' },
  }}})
  counterOffer(
    @Param('id') id: string,
    @Body() body: {
      propertyId: string; newPrice: number;
      newCheckIn?: string; newCheckOut?: string; message?: string;
    },
  ) {
    return this.bookingsService.createCounterOffer(id, body);
  }

  @Put(':id/refund')
  @RequirePermission('refund_users', 'propertyId', 'body')
  @ApiOperation({ summary: 'Refund a booking', description: '**Permission**: refund_users' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', required: ['propertyId'], properties: { propertyId: { type: 'string', format: 'uuid' } } } })
  refund(@Param('id') id: string, @Body('propertyId') propertyId: string) {
    return this.bookingsService.updateStatus(id, 'refunded');
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'] } } } })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Public()
  @Get('availability/:propertyId')
  @ApiOperation({ summary: 'Check property availability', description: 'Public — check if dates are available for booking.' })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  @ApiQuery({ name: 'checkIn', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'checkOut', required: true, description: 'YYYY-MM-DD' })
  checkAvailability(
    @Param('propertyId') propertyId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.bookingsService.checkAvailability(propertyId, checkIn, checkOut);
  }
}
