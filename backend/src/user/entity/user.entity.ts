import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

/**
 * Role hierarchy & restrictions:
 * - hyper_admin: full platform access EXCEPT creating/editing properties/services,
 *   cancellation rules, booking acceptance, fee absorption
 * - hyper_manager: invited by hyper_admin only, same scope with hyper_admin-granted permissions
 * - admin: manages OWN properties/services (filtered by hostId). Can invite managers.
 * - manager: invited by admin(s), access limited to assigning admin's resources
 * - user: regular platform user (guest)
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

  /**
   * Get user role.
   */
  getRole(): AppRole {
    return this.role || 'user';
  }

  /**
   * Check if user has a specific role.
   */
  hasRole(role: AppRole): boolean {
    return this.getRole() === role;
  }

  /**
   * Check if user has one of the given roles.
   */
  hasAnyRole(...roles: AppRole[]): boolean {
    return roles.includes(this.getRole());
  }

  /**
   * Check if user is a hyper-level user (hyper_admin or hyper_manager).
   */
  isHyper(): boolean {
    return this.hasAnyRole('hyper_admin', 'hyper_manager');
  }

  /**
   * Check if user is admin-level or above.
   */
  isAdminOrAbove(): boolean {
    return this.hasAnyRole('hyper_admin', 'hyper_manager', 'admin');
  }

  /**
   * @deprecated Use getRole() instead. Kept for backward compat during migration.
   */
  getRoles(): AppRole[] {
    return [this.getRole()];
  }
}
