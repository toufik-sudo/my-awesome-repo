import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SSOProvisioningService } from '../sso-provisioning.service';
import { User } from '../../../user/entity/user.entity';
import { SSOUserInfoResponseDto } from '../../dtos/responses/sso.token.response.dto';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedvalue'),
}));

describe('SSOProvisioningService', () => {
  let service: SSOProvisioningService;
  let usersRepository: jest.Mocked<Partial<Repository<User>>>;

  const mockUserInfo: SSOUserInfoResponseDto = {
    sub: 'google-123',
    email: 'john@example.com',
    name: 'John Doe',
    phone_number: '+1234567890',
    roles: ['admin', 'user'],
  };

  const mockExistingUser: Partial<User> = {
    id: 1,
    email: 'john@example.com',
    phoneNbr: '+1234567890',
    firstName: 'John',
    lastName: 'Doe',
    roles: 'ROLE_USER',
    cardId: 'CARD_1',
    isActive: true,
    password: 'hashed',
    token: 'token',
    title: '',
    city: '',
    zipcode: '',
    address: '',
    country: '',
    secondPhoneNbr: '',
    passportId: null,
    otp: null,
    otpExpirationDate: null,
    tokenExpirationDate: new Date(),
    resetToken: null,
    passwordCreatedAt: null,
    passwordUpdatedAt: null,
  };

  beforeEach(async () => {
    usersRepository = {
      findBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SSOProvisioningService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<SSOProvisioningService>(SSOProvisioningService);
  });

  describe('provisionUser', () => {
    it('should create a new user when no existing user found', async () => {
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 42 } as User));

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result).toBeDefined();
      expect(result.id).toBe(42);
      expect(result.email).toBe('john@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.isActive).toBe(true);
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should update existing user found by email', async () => {
      usersRepository.findBy.mockResolvedValueOnce([mockExistingUser as User]);
      usersRepository.save.mockImplementation(async (user) => user as User);

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result).toBeDefined();
      expect(result.email).toBe('john@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.isActive).toBe(true);
      expect(usersRepository.save).toHaveBeenCalled();
      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('should find existing user by phone number when email not found', async () => {
      usersRepository.findBy
        .mockResolvedValueOnce([]) // email lookup
        .mockResolvedValueOnce([mockExistingUser as User]); // phone lookup
      usersRepository.save.mockImplementation(async (user) => user as User);

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result).toBeDefined();
      expect(usersRepository.findBy).toHaveBeenCalledTimes(2);
      expect(usersRepository.findBy).toHaveBeenCalledWith({ phoneNbr: '+1234567890' });
    });

    it('should create user with default name when name is missing', async () => {
      const noNameInfo: SSOUserInfoResponseDto = {
        sub: 'google-456',
        email: 'noname@example.com',
      };
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 43 } as User));

      const result = await service.provisionUser(noNameInfo, 'google');

      expect(result.firstName).toBe('SSO');
      expect(result.lastName).toBe('User');
    });

    it('should map SSO roles to application roles', async () => {
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 44 } as User));

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result.roles).toBe('ROLE_ADMIN,ROLE_USER');
    });

    it('should assign default ROLE_USER when no roles provided', async () => {
      const noRolesInfo: SSOUserInfoResponseDto = {
        sub: 'google-789',
        email: 'noroles@example.com',
        name: 'No Roles',
      };
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 45 } as User));

      const result = await service.provisionUser(noRolesInfo, 'google');

      expect(result.roles).toBe('ROLE_USER');
    });

    it('should set cardId with SSO provider prefix', async () => {
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 46 } as User));

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result.cardId).toBe('SSO_GOOGLE_google-123');
    });

    it('should handle single-word name correctly', async () => {
      const singleNameInfo: SSOUserInfoResponseDto = {
        sub: 'ms-111',
        email: 'mono@example.com',
        name: 'Mononymous',
      };
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 47 } as User));

      const result = await service.provisionUser(singleNameInfo, 'microsoft');

      expect(result.firstName).toBe('Mononymous');
      expect(result.lastName).toBe('');
    });

    it('should handle multi-part last name correctly', async () => {
      const multiNameInfo: SSOUserInfoResponseDto = {
        sub: 'ms-222',
        email: 'multi@example.com',
        name: 'Jean Pierre de la Fontaine',
      };
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 48 } as User));

      const result = await service.provisionUser(multiNameInfo, 'microsoft');

      expect(result.firstName).toBe('Jean');
      expect(result.lastName).toBe('Pierre de la Fontaine');
    });

    it('should not update empty fields from SSO claims on existing user', async () => {
      const partialInfo: SSOUserInfoResponseDto = {
        sub: 'google-999',
        // no email, no name, no phone
      };
      const existingUser = { ...mockExistingUser } as User;
      usersRepository.findBy.mockResolvedValue([]); // no match by email or phone
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 49 } as User));

      const result = await service.provisionUser(partialInfo, 'google');

      // Should create new user with defaults
      expect(result.firstName).toBe('SSO');
      expect(result.lastName).toBe('User');
    });

    it('should update roles on existing user when SSO provides roles', async () => {
      const existingUser = { ...mockExistingUser, roles: 'ROLE_USER' } as User;
      usersRepository.findBy.mockResolvedValueOnce([existingUser]);
      usersRepository.save.mockImplementation(async (user) => user as User);

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result.roles).toBe('ROLE_ADMIN,ROLE_USER');
    });

    it('should ensure user is active after SSO login', async () => {
      const inactiveUser = { ...mockExistingUser, isActive: false } as User;
      usersRepository.findBy.mockResolvedValueOnce([inactiveUser]);
      usersRepository.save.mockImplementation(async (user) => user as User);

      const result = await service.provisionUser(mockUserInfo, 'google');

      expect(result.isActive).toBe(true);
    });

    it('should generate phone placeholder for SSO users without phone', async () => {
      const noPhoneInfo: SSOUserInfoResponseDto = {
        sub: 'apple-555',
        email: 'nophone@example.com',
        name: 'No Phone',
      };
      usersRepository.findBy.mockResolvedValue([]);
      usersRepository.create.mockImplementation((user) => user as User);
      usersRepository.save.mockImplementation(async (user) => ({ ...user, id: 50 } as User));

      const result = await service.provisionUser(noPhoneInfo, 'apple');

      expect(result.phoneNbr).toBe('sso_apple_apple-555');
    });
  });
});
