# Scope Context Backend Documentation

> Last updated: 2026-04-07

## Overview

The RBAC scope context system (`ScopeContext`) provides fine-grained resource-level access control across all backend services. When a request passes through the `PermissionGuard`, scope information is extracted and made available via `extractScopeContext(req)`.

## Architecture

```
Request → JwtAuthGuard → PermissionGuard → Controller → Service(scopeCtx)
                              ↓
                    ScopeContext extracted:
                    - userId, userRole
                    - managerScopedPerms
                    - hyperManagerScopedPerms
                    - guestScopedPerms
                    - scopedAdminId
```

## ScopeContext Interface

```typescript
interface ScopeContext {
  userId: number;
  userRole: string;
  managerScopedPerms?: ScopedPerm[];
  hyperManagerScopedPerms?: ScopedPerm[];
  guestScopedPerms?: ScopedPerm[];
  scopedAdminId?: number;
  managerPropertyScope?: string[];
}
```

## Role Scoping Rules

| Role | Scope Behavior |
|------|---------------|
| `hyper_admin` | Full global access — no filtering |
| `hyper_manager` | Global access with scoped permissions via `hyperManagerScopedPerms` |
| `admin` | Own resources only (hostId/providerId = userId) |
| `manager` | Scoped via `managerScopedPerms` — resolved to property/service IDs |
| `user` | Own data only (userId match) |
| `guest` | Scoped via `guestScopedPerms` — limited read access |

## Services with Scope Filtering

### Properties Module

| Service | Method | Scope Implementation |
|---------|--------|---------------------|
| `PropertiesService` | `findAll` | Filters by `resolveAllowedPropertyIds()` |
| `PropertiesService` | `findOne` | Checks property ID against allowed list |
| `PropertiesService` | `update` | Verifies write access to property |
| `PropertiesService` | `remove` | Verifies delete access to property |
| `PropertiesService` | `updateAvailability` | Verifies update access to property |
| `PropertyGroupsService` | `findAll` | Filters groups by scope (property_groups, admins) |
| `PropertyGroupsService` | `update/remove` | Checks ownership or hyper role |

### Bookings Module

| Service | Method | Scope Implementation |
|---------|--------|---------------------|
| `BookingsService` | `findAll` | Filters bookings by scoped property IDs |
| `BookingsService` | `findOneScoped` | Verifies ownership, admin ownership, or manager access |
| `BookingsService` | `create` | Blocks admin/hyper roles from creating bookings |
| `BookingsService` | `updateStatus` | `assertBookingAccess()` checks property ownership |
| `BookingsService` | `declineBooking` | Same access check |
| `BookingsService` | `createCounterOffer` | Same access check |
| `BookingsService` | `findByGuest` | Enforces own-user or hyper role |
| `MetricsService` | `getDetailedBookings` | Filters by admin property ownership or manager scope |
| `MetricsService` | `getDetailedProperties` | Same scoping pattern |
| `MetricsService` | `getDetailedServices` | Filters by admin service ownership or manager scope |
| `MetricsService` | `getDetailedUsers` | Admin/manager see only users they invited |
| `MetricsService` | `getRevenueBreakdown` | Scoped to admin/manager properties |
| `MetricsService` | `getPlatformSummary` | Full summary scoped by role |

### Services Module

| Service | Method | Scope Implementation |
|---------|--------|---------------------|
| `TourismServicesService` | `findAll` | Filters by `resolveAllowedServiceIds()` |
| `TourismServicesService` | `findOne` | Checks service ID against allowed list |
| `TourismServicesService` | `update` | Verifies write access |
| `TourismServicesService` | `remove` | Verifies delete access |
| `ServiceBookingsService` | `create` | Blocks admin/hyper from booking |
| `ServiceBookingsService` | `getProviderBookings` | Filters by scoped service IDs |
| `ServiceBookingsService` | `accept/decline/cancel` | `assertServiceBookingAccess()` |
| `ServiceBookingsService` | `setAvailability` | `assertServiceAccess()` |

### User & Social Module

| Service | Method | Scope Implementation |
|---------|--------|---------------------|
| `CommentsService` | `getComments` | Filters by target property/service scope |
| `CommentsService` | `create` | Enforces own-user identity |
| `CommentsService` | `update/delete` | Author or admin role check |
| `FavoritesService` | `findByUser/toggle/remove` | Enforces own-user |
| `ReactionsService` | `toggle/remove` | Enforces own-user |
| `ProfilesService` | `findByUser/update` | Enforces own-user or hyper role |
| `ReviewsService` | `findByProperty` | Manager/guest scoped to properties |
| `ReviewsService` | `findOne` | Scope check on property |
| `ReviewsService` | `create` | Enforces own-user as reviewer |

### Admin & Finance Module

| Service | Method | Scope Implementation |
|---------|--------|---------------------|
| `PaymentsService` | `getPendingReceipts` | Admin: own properties; Manager: scoped properties |
| `PaymentsService` | `approveReceipt` | `assertReceiptAccess()` |
| `PaymentsService` | `rejectReceipt` | `assertReceiptAccess()` |
| `PaymentsService` | `getReceiptsByBooking` | Admin: own; Manager: scoped |
| `PaymentsService` | `uploadReceipt` | Own-user identity check |
| `DashboardService` | `getDashboard` | Admin: own properties; Manager: scoped |
| `SettingsService` | all methods | Own-user enforcement |
| `PointsService` | `awardPoints/deductPoints` | Admin/hyper role required |
| `SupportChatService` | `getAdminThreads` | Scoped by `getScopedPropertyIds()` |
| `SupportChatService` | `getThreadById/getMessages/sendMessage` | `assertThreadAccess()` |

### HyperManagement Module

| Service | Method | Scope Implementation |
|---------|--------|---------------------|
| `HyperManagementService` | all methods | Hyper role only (enforced at controller level) |

## Permission Bindings (rbac_permission_bindings)

The `rbac_permission_bindings` table maps frontend UI permissions to backend API permissions. This enables the frontend to check both UI visibility and API access in one step.

```
Frontend Key                          → Backend Key
ui.PropertiesPage.Button.Add          → backend.PropertiesController.create.POST
ui.BookingsPage.Button.Accept         → backend.BookingsController.updateStatus.PUT
ui.Payments.Button.Approve            → backend.PaymentsController.approveReceipt.PUT
```

### Frontend Hook: `usePermissions()`

```typescript
const { canAction, canUI, canAPI } = usePermissions();

// Before rendering a button:
if (canAction('ui.PropertiesPage.Button.Add')) { /* show button */ }

// Before making an API call:
if (canAction('ui.BookingsPage.Button.Accept')) { /* call API */ }
```

The `canAction()` check:
1. Verifies the frontend UI permission is allowed for the role
2. Looks up all linked backend permissions via the binding map
3. Verifies all backend permissions are also allowed

## ScopeFilterService

Core service for resolving scoped permission lists to concrete resource IDs:

- `resolvePropertyIds(scopedPerms, permissionKey)` → property IDs the user can access
- `resolveServiceIds(scopedPerms, permissionKey)` → service IDs
- `resolveScope(scopedPerms, permissionKey)` → both property and service IDs

Returns `null` for global access, `string[]` for restricted access, `[]` for no access.

## Adding Scope to a New Service

1. Add `ScopeFilterService` to constructor DI
2. Import `ScopeContext, getScopedPerms` from `../../rbac/scope-context`
3. Define permission keys: `const PERM_KEY_XXX = 'backend.ControllerName.method.METHOD'`
4. Add `scopeCtx?: ScopeContext` to method signature
5. Call `resolveAllowedPropertyIds` or `resolveAllowedServiceIds`
6. Apply filter: `if (allowedIds !== null) { query.andWhere('id IN (:...ids)', { ids }) }`
7. Create a binding entry in `seed-permission-bindings.ts`
