import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionGuard } from '../permission.guard';
import { RolesService } from '../../../user/services/roles.service';
import { PERMISSION_KEY } from '../../decorators/require-permission.decorator';
import { ROLES_KEY } from '../../decorators/require-role.decorator';
import { IS_PUBLIC_KEY } from '../../public.decorator';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let rolesService: jest.Mocked<Partial<RolesService>>;
  let reflector: Reflector;

  const createMockContext = (overrides: {
    userId?: number;
    params?: Record<string, string>;
    body?: Record<string, any>;
    query?: Record<string, string>;
  } = {}): ExecutionContext => {
    const request = {
      user: overrides.userId !== undefined ? { id: overrides.userId } : null,
      params: overrides.params || {},
      body: overrides.body || {},
      query: overrides.query || {},
    };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn() as any,
    } as any;
  };

  beforeEach(async () => {
    rolesService = {
      getUserRoles: jest.fn(),
      hasPermissionForProperty: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: RolesService,
          useValue: rolesService,
        },
        Reflector,
      ],
    }).compile();

    guard = module.get<PermissionGuard>(PermissionGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  // ─── Public endpoints ───────────────────────────────────────────────

  it('should allow public endpoints without authentication', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return true;
      return undefined;
    });

    const context = createMockContext();
    expect(await guard.canActivate(context)).toBe(true);
  });

  // ─── No user ────────────────────────────────────────────────────────

  it('should deny access when no user is present', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockContext({ userId: undefined });
    expect(await guard.canActivate(context)).toBe(false);
  });

  // ─── Hyper manager bypass ──────────────────────────────────────────

  it('should always allow hyper_manager regardless of required roles/permissions', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return ['admin'];
      if (key === PERMISSION_KEY) return { permission: 'modify_prices', propertyParam: 'id', source: 'param' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['hyper_manager']);

    const context = createMockContext({ userId: 1, params: { id: 'prop-1' } });
    expect(await guard.canActivate(context)).toBe(true);
    expect(rolesService.hasPermissionForProperty).not.toHaveBeenCalled();
  });

  // ─── Role-based checks ────────────────────────────────────────────

  it('should allow user with required role', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return ['admin', 'manager'];
      if (key === PERMISSION_KEY) return undefined;
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['admin']);

    const context = createMockContext({ userId: 2 });
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should deny user without required role', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return ['admin'];
      if (key === PERMISSION_KEY) return undefined;
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['user']);

    const context = createMockContext({ userId: 3 });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  // ─── Permission checks (manager with property) ────────────────────

  it('should allow manager with granted permission for property (param source)', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'modify_prices', propertyParam: 'id', source: 'param' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);
    rolesService.hasPermissionForProperty.mockResolvedValue(true);

    const context = createMockContext({ userId: 10, params: { id: 'prop-abc' } });
    expect(await guard.canActivate(context)).toBe(true);
    expect(rolesService.hasPermissionForProperty).toHaveBeenCalledWith(10, 'prop-abc', 'modify_prices');
  });

  it('should deny manager without permission for property', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'modify_prices', propertyParam: 'id', source: 'param' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);
    rolesService.hasPermissionForProperty.mockResolvedValue(false);

    const context = createMockContext({ userId: 10, params: { id: 'prop-xyz' } });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    await expect(guard.canActivate(context)).rejects.toThrow('Missing permission: modify_prices');
  });

  it('should extract propertyId from body when source is body', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'accept_demands', propertyParam: 'propertyId', source: 'body' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);
    rolesService.hasPermissionForProperty.mockResolvedValue(true);

    const context = createMockContext({ userId: 5, body: { propertyId: 'prop-body-1' } });
    expect(await guard.canActivate(context)).toBe(true);
    expect(rolesService.hasPermissionForProperty).toHaveBeenCalledWith(5, 'prop-body-1', 'accept_demands');
  });

  it('should extract propertyId from query when source is query', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'answer_demands', propertyParam: 'propertyId', source: 'query' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);
    rolesService.hasPermissionForProperty.mockResolvedValue(true);

    const context = createMockContext({ userId: 7, query: { propertyId: 'prop-query-1' } });
    expect(await guard.canActivate(context)).toBe(true);
    expect(rolesService.hasPermissionForProperty).toHaveBeenCalledWith(7, 'prop-query-1', 'answer_demands');
  });

  it('should throw when propertyId is missing from request', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'modify_photos', propertyParam: 'id', source: 'param' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);

    const context = createMockContext({ userId: 10, params: {} }); // no 'id' param
    await expect(guard.canActivate(context)).rejects.toThrow('Property context required');
  });

  // ─── Admin bypass on permission checks ─────────────────────────────

  it('should allow admin to bypass permission checks (admin owns properties)', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'modify_prices', propertyParam: 'id', source: 'param' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['admin']);

    const context = createMockContext({ userId: 20, params: { id: 'prop-admin' } });
    expect(await guard.canActivate(context)).toBe(true);
    expect(rolesService.hasPermissionForProperty).not.toHaveBeenCalled();
  });

  // ─── Regular user denied on permission-gated endpoint ──────────────

  it('should deny regular user on permission-gated endpoint', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return undefined;
      if (key === PERMISSION_KEY) return { permission: 'modify_prices', propertyParam: 'id', source: 'param' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['user']);

    const context = createMockContext({ userId: 99, params: { id: 'prop-1' } });
    await expect(guard.canActivate(context)).rejects.toThrow('Manager role required');
  });

  // ─── No decorators = pass through ──────────────────────────────────

  it('should allow authenticated user when no role/permission decorators are set', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    rolesService.getUserRoles.mockResolvedValue(['user']);

    const context = createMockContext({ userId: 50 });
    expect(await guard.canActivate(context)).toBe(true);
  });

  // ─── Combined role + permission check ──────────────────────────────

  it('should check both role and permission when both decorators present', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return ['manager'];
      if (key === PERMISSION_KEY) return { permission: 'refund_users', propertyParam: 'propertyId', source: 'body' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);
    rolesService.hasPermissionForProperty.mockResolvedValue(true);

    const context = createMockContext({ userId: 15, body: { propertyId: 'prop-refund' } });
    expect(await guard.canActivate(context)).toBe(true);
    expect(rolesService.hasPermissionForProperty).toHaveBeenCalledWith(15, 'prop-refund', 'refund_users');
  });

  it('should deny manager with role but missing specific permission', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return false;
      if (key === ROLES_KEY) return ['manager'];
      if (key === PERMISSION_KEY) return { permission: 'refund_users', propertyParam: 'propertyId', source: 'body' };
      return undefined;
    });

    rolesService.getUserRoles.mockResolvedValue(['manager']);
    rolesService.hasPermissionForProperty.mockResolvedValue(false);

    const context = createMockContext({ userId: 15, body: { propertyId: 'prop-no-refund' } });
    await expect(guard.canActivate(context)).rejects.toThrow('Missing permission: refund_users');
  });
});
