import { SetMetadata } from '@nestjs/common';

/**
 * Marks an endpoint as a booking creation endpoint.
 * The PermissionGuard will enforce that only manager/guest/user roles can access it.
 */
export const IsBookingCreate = () => SetMetadata('IS_BOOKING_CREATE', true);
