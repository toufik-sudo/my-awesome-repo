import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  findAll(@Request() req: any, @Query('status') status?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.findAll(status, scopeCtx);
  }

  @Get('my')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  getMyBookings(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.findByGuest(req.user.id, scopeCtx);
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  findOne(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.findOneScoped(id, req.user.id, scopeCtx);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  create(@Body() createDto: CreateBookingDto, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.create(createDto, req.user.id, scopeCtx);
  }

  @Put(':id/accept')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  accept(@Param('id') id: string, @Body('propertyId') propertyId: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.updateStatus(id, 'confirmed', scopeCtx);
  }

  @Put(':id/decline')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  decline(@Param('id') id: string, @Body('propertyId') propertyId: string, @Body('reason') reason: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.declineBooking(id, reason, scopeCtx);
  }

  @Put(':id/counter-offer')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  counterOffer(@Param('id') id: string, @Body() body: { propertyId: string; newPrice: number; newCheckIn?: string; newCheckOut?: string; message?: string }, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.createCounterOffer(id, body, scopeCtx);
  }

  @Put(':id/refund')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  refund(@Param('id') id: string, @Body('propertyId') propertyId: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.updateStatus(id, 'refunded', scopeCtx);
  }

  @Put(':id/status')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('propertyId') propertyId: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.bookingsService.updateStatus(id, status, scopeCtx);
  }

  @Public()
  @Get('availability/:propertyId')
  checkAvailability(@Param('propertyId') propertyId: string, @Query('checkIn') checkIn: string, @Query('checkOut') checkOut: string) {
    return this.bookingsService.checkAvailability(propertyId, checkIn, checkOut);
  }
}
