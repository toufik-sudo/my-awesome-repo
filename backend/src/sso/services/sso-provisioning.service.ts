import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { SSOUserInfoResponseDto } from '../dtos/responses/sso.token.response.dto';
import * as bcrypt from 'bcrypt';

/**
 * Handles auto-provisioning of users from SSO claims.
 * On first SSO login, creates a user profile in the users table.
 * On subsequent logins, updates the existing profile with fresh claims.
 */
@Injectable()
export class SSOProvisioningService {
  private readonly logger = new Logger(SSOProvisioningService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  /**
   * Find or create a user from SSO claims.
   * Returns the provisioned/updated user entity.
   */
  async provisionUser(
    userInfo: SSOUserInfoResponseDto,
    provider: string,
  ): Promise<User> {
    // Try to find existing user by email or SSO sub
    let user = await this.findExistingUser(userInfo);

    if (user) {
      this.logger.log(
        `SSO user found (id=${user.id}), updating profile from ${provider}`,
      );
      return this.updateUserFromClaims(user, userInfo, provider);
    }

    this.logger.log(
      `SSO user not found, auto-provisioning from ${provider}: ${userInfo.email || userInfo.sub}`,
    );
    return this.createUserFromClaims(userInfo, provider);
  }

  /**
   * Find an existing user by email or phone number
   */
  private async findExistingUser(
    userInfo: SSOUserInfoResponseDto,
  ): Promise<User | null> {
    if (userInfo.email) {
      const users = await this.usersRepository.findBy({
        email: userInfo.email,
      });
      if (users?.length === 1) return users[0];
    }

    if (userInfo.phone_number) {
      const users = await this.usersRepository.findBy({
        phoneNbr: userInfo.phone_number,
      });
      if (users?.length === 1) return users[0];
    }

    return null;
  }

  /**
   * Create a new user entity from SSO claims
   */
  private async createUserFromClaims(
    userInfo: SSOUserInfoResponseDto,
    provider: string,
  ): Promise<User> {
    const user = new User();

    // Parse name into first/last
    const { firstName, lastName } = this.parseName(userInfo.username);

    user.email = userInfo.email || '';
    user.phoneNbr = userInfo.phone_number || `sso_${provider}_${userInfo.sub}`;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = this.resolveRoles(userInfo.roles);
    user.cardId = `SSO_${provider.toUpperCase()}_${userInfo.sub}`;
    user.passportId = null;
    user.title = '';
    user.city = '';
    user.zipcode = '';
    user.address = '';
    user.country = '';
    user.secondPhoneNbr = '';
    user.isActive = true;

    // Generate a random non-usable password (SSO users don't use passwords)
    const randomPassword = await bcrypt.hash(
      Math.random().toString(36) + Date.now().toString(36),
      10,
    );
    user.password = randomPassword;

    // Generate a token
    const token = `${provider}_${userInfo.sub}_${Date.now()}`;
    user.token = await bcrypt.hash(token, 8);
    user.tokenExpirationDate = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    );

    // No OTP needed for SSO users
    user.otp = null;
    user.otpExpirationDate = null;

    const savedUser = this.usersRepository.create(user);
    await this.usersRepository.save(savedUser);

    this.logger.log(
      `SSO user provisioned: id=${savedUser.id}, email=${savedUser.email}, provider=${provider}`,
    );

    return savedUser;
  }

  /**
   * Update existing user with fresh SSO claims
   */
  private async updateUserFromClaims(
    user: User,
    userInfo: SSOUserInfoResponseDto,
    provider: string,
  ): Promise<User> {
    const { firstName, lastName } = this.parseName(userInfo.username);

    // Only update fields that have values from SSO
    if (userInfo.email) user.email = userInfo.email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (userInfo.phone_number) user.phoneNbr = userInfo.phone_number;

    // Update roles if provided by SSO
    if (userInfo.roles?.length) {
      user.roles = this.resolveRoles(userInfo.roles);
    }

    // Ensure user is active after SSO login
    user.isActive = true;

    await this.usersRepository.save(user);

    this.logger.log(
      `SSO user updated: id=${user.id}, provider=${provider}`,
    );

    return user;
  }

  /**
   * Parse a full name into first and last name
   */
  private parseName(name?: string): { firstName: string; lastName: string } {
    if (!name) return { firstName: 'SSO', lastName: 'User' };

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  }

  /**
   * Resolve SSO roles to application roles
   */
  private resolveRoles(roles?: string[]): string {
    if (!roles?.length) return 'ROLE_USER';

    // Map known SSO roles to app roles
    const roleMap: Record<string, string> = {
      admin: 'ROLE_ADMIN',
      manager: 'ROLE_MANAGER',
      user: 'ROLE_USER',
      technician: 'ROLE_TECHNIC',
    };

    const mappedRoles = roles
      .map((r) => roleMap[r.toLowerCase()] || r)
      .filter(Boolean);

    return mappedRoles.length > 0 ? mappedRoles.join(',') : 'ROLE_USER';
  }
}
