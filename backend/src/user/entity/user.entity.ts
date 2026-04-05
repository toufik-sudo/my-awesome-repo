import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

/**
 * Role hierarchy & restrictions:
 * 
 * - hyper_admin: full platform access EXCEPT:
 *     • inviting managers (admin-scoped)
 *     • creating/editing properties/services
 *     • creating absorption fees / cancellation rules
 *     • accepting booking requests
 *     • making bookings
 *     • assigning permissions to non-hyper_managers
 *     • creating property/service groups
 * 
 * - hyper_manager: invited by hyper_admin only.
 *     Same capabilities as hyper_admin based on assigned permissions.
 *     Assignable permissions: create/edit/delete/pause/archive
 *     Scope: global, property groups, specific properties, services, admins, managers
 *     Special: payment validation, document verification, fees/cancellation visibility & delete
 *     Cannot make bookings.
 * 
 * - admin (Host): controls OWN properties/services only.
 *     Full access within own scope.
 *     Cannot: access other admins' resources, invite hyper roles or other admins,
 *     access global document verification, manage global fee rules, make bookings.
 *     Can invite: managers, guests.
 * 
 * - manager: invited by one or more admins.
 *     Permissions = exact subset given by each admin.
 *     Multi-admin scope supported (full on admin A, partial on admin B).
 *     Can manage bookings, comments, likes, users/guests on assigned scope.
 *     Can create bookings for self or others.
 *     Can invite: guests only.
 * 
 * - user: self-registered, default role.
 *     Full platform access (all properties/services).
 *     Read + booking only, no management.
 * 
 * - guest: invited by any role above.
 *     Read + booking access scoped to inviter's properties/services.
 *     HyperAdmin → all properties. Admin → admin's properties. Manager → manager's scope.
 *     No management permissions.
 *     IT MVP: can request conversion to user via support.
 * 
 * Booking exception: ONLY manager, guest, user can make bookings.
 */
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  hyper_admin: 100,
  hyper_manager: 90,
  admin: 50,
  manager: 30,
  user: 10,
  guest: 5,
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: false })
  phoneNbr: string;

  @Column({ unique: true, nullable: false })
  cardId: string;

  @Column({ unique: true, nullable: true })
  passportId: string;

  /**
   * Single role per user. Defaults to 'user'.
   */
  @Column({ nullable: false, type: 'varchar', length: 20, default: 'user' })
  role: AppRole;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: true, type: 'datetime' })
  tokenExpirationDate: Date;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, type: 'datetime' })
  otpExpirationDate: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  secondPhoneNbr: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  passwordCreatedAt: Date;

  @Column({ nullable: true })
  passwordUpdatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  // ─── Helper methods ───────────────────────────────────────────────────

  getRole(): AppRole {
    return this.role || 'user';
  }

  hasRole(role: AppRole): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(...roles: AppRole[]): boolean {
    return roles.includes(this.getRole());
  }

  isHyper(): boolean {
    return this.hasAnyRole('hyper_admin', 'hyper_manager');
  }

  isAdminOrAbove(): boolean {
    return this.hasAnyRole('hyper_admin', 'hyper_manager', 'admin');
  }

  /**
   * Check if user can make bookings.
   * Only manager, guest, user can book.
   */
  canBook(): boolean {
    return this.hasAnyRole('manager', 'guest', 'user');
  }

  /**
   * @deprecated Use getRole() instead. Kept for backward compat during migration.
   */
  getRoles(): AppRole[] {
    return [this.getRole()];
  }
}
