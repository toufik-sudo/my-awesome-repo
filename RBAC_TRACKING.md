# RBAC Module Tracking — Status Report
> Generated: 2026-04-03 | Updated: 2026-04-05
> Convention: Module must be **fully completed** before marking OK/Done.

---

## Backend Modules

| Module | File | Guards Applied | Scope Validation | Status |
|--------|------|---------------|------------------|--------|
| **PermissionGuard** | `backend/src/auth/guards/permission.guard.ts` | Unified RBAC: role + permission + scope + booking restriction + hyper restriction on fees/rules/groups/bookings | Admin ownership, guest scope, hyper restrictions (BE-05/06/07/08) | ✅ Done |
| **RolesGuard** | `backend/src/auth/roles.guard.ts` | Role-only checks with hierarchy bypass | hyper_admin always passes, hyper_manager conditional | ✅ Done |
| **PropertiesController** | `backend/src/properties/controllers/properties.controller.ts` | `@UseGuards(PermissionGuard)`, `@RequireRole`, `@RequirePermission` on all write endpoints | Admin ownership via PermissionGuard.enforceAdminScope | ✅ Done |
| **PropertyGroupsController** | `backend/src/properties/controllers/property-groups.controller.ts` | `@RequireRole('admin')` on POST/PUT; hyper can GET/DELETE only (BE-07) | Service-level ownership check | ✅ Done |
| **ServiceGroupsController** | `backend/src/services/controllers/service-groups.controller.ts` | `@RequireRole('admin')` on POST/PUT; hyper can GET/DELETE only (BE-07) | Admin-scoped | ✅ Done |
| **HyperManagementController** | `backend/src/properties/controllers/hyper-management.controller.ts` | `@RequireRole('hyper_admin', 'hyper_manager')` per endpoint | hyper_admin-only for permanent deletes | ✅ Done |
| **DocumentValidationController** | `backend/src/properties/controllers/document-validation.controller.ts` | `@RequireRole` on all endpoints; hyper_admin+hyper_manager for approve/reject | Admin can submit own docs | ✅ Done |
| **TourismServicesController** | `backend/src/services/controllers/tourism-services.controller.ts` | `@UseGuards(PermissionGuard)`, `@RequireRole`, `@RequirePermission('modify_service')` | Admin ownership via guard | ✅ Done |
| **ServiceBookingsController** | `backend/src/services/controllers/service-bookings.controller.ts` | `@UseGuards(PermissionGuard)`, `IS_BOOKING_CREATE` metadata, accept/decline restricted to admin/manager only (BE-08) | Booking restriction + scope check on getOne (BE-02) | ✅ Done |
| **BookingsController** | `backend/src/bookings/controllers/bookings.controller.ts` | `@UseGuards(PermissionGuard)`, `@RequireRole` on PUT status (BE-01), `@RequirePermission` on accept/decline/refund/status | Scope check on findOne (BE-02), property-scoped permissions | ✅ Done |
| **RolesController** | `backend/src/user/controllers/roles.controller.ts` | `@RequireRole` per endpoint with hierarchy | Admin can only manage own invitees. BE-09: hyper_admin → hyper_manager only for permissions | ✅ Done |
| **InvitationController** | `backend/src/user/controllers/invitation.controller.ts` | `@RequireRole` per endpoint, invitation matrix in service (BE-03) | Role validation via InvitationService with updated matrix | ✅ Done |
| **ServiceFeeController** | `backend/src/user/controllers/service-fee.controller.ts` | `@RequireRole('hyper_admin', 'hyper_manager')` for write; admin can read | Global rules only | ✅ Done |
| **PointsRuleController** | `backend/src/user/controllers/points-rule.controller.ts` | `@RequireRole('hyper_admin', 'hyper_manager')` for write; admin can read | Global rules only | ✅ Done |
| **HostFeeAbsorptionController** | `backend/src/user/controllers/host-fee-absorption.controller.ts` | `@RequireRole('admin', 'manager')` on POST/PUT; hyper can GET/DELETE only (BE-05) | Admin scope in service | ✅ Done |
| **CancellationRuleController** | `backend/src/user/controllers/cancellation-rule.controller.ts` | `@RequireRole('admin', 'manager')` on POST/PUT; hyper can GET/DELETE only (BE-06) | Admin scope in service | ✅ Done |
| **RolesService** | `backend/src/user/services/roles.service.ts` | N/A (service layer) | `isPropertyOwner`, `isServiceOwner`, `getAdminPropertyIds`, `getAdminServiceIds`. BE-09: hyper_admin → hyper_manager only. BE-13: multi-admin pair isolation | ✅ Done |
| **BookingsService** | `backend/src/bookings/services/bookings.service.ts` | N/A (service layer) | `findOneScoped()` with role+ownership check (BE-02) | ✅ Done |
| **ServiceBookingsService** | `backend/src/services/services/service-bookings.service.ts` | N/A (service layer) | `getOneScoped()` with role+ownership check (BE-02) | ✅ Done |
| **CommentsService** | `backend/src/comments/services/comments.service.ts` | N/A (service layer) | Ownership validation on update/delete: author OR admin/hyper moderation (BE-12) | ✅ Done |
| **InvitationService** | `backend/src/user/services/invitation.service.ts` | N/A (service layer) | `canInviteRole()` enforced with updated matrix (BE-03). Guest scope creation on accept (BE-04) | ✅ Done |
| **GuestScopeResolver** | `backend/src/user/resolvers/guest-scope.resolver.ts` | N/A (resolver) | Resolves guest property/service scope from inviter chain (BE-04) | ✅ Done |
| **HostIdFilterHelper** | `backend/src/user/helpers/host-id-filter.helper.ts` | N/A (utility) | `filterByHostId()` helper for admin query scoping (BE-11) | ✅ Done |
| **InvitationRulesConstant** | `backend/src/user/constants/invitation-rules.constant.ts` | N/A (constants) | Updated matrix: hyper_admin can't invite user (BE-03) | ✅ Done |
| **ManagerPermission Entity** | `backend/src/user/entity/manager-permission.entity.ts` | N/A (type definition) | `view_payments`, `view_email_analytics`, `manage_fee_absorption` added | ✅ Done |
| **Role Capabilities** | `backend/src/user/constants/role-capabilities.constant.ts` | N/A (constants) | New permissions added to HYPER_MANAGER_ASSIGNABLE | ✅ Done |
| **PointsController** | `backend/src/modules/points/controllers/points.controller.ts` | `@UseGuards(PermissionGuard)`, `@RequireRole('hyper_admin', 'hyper_manager')` on admin endpoints | Admin award/deduct restricted to hyper roles | ✅ Done |
| **ProfilesController** | `backend/src/profiles/controllers/profiles.controller.ts` | `@UseGuards(JwtAuthGuard)` on class | Auth required for profile read/update | ✅ Done |
| **FavoritesController** | `backend/src/favorites/controllers/favorites.controller.ts` | `@UseGuards(JwtAuthGuard)` on class | Auth required for favorites CRUD | ✅ Done |
| **NotificationController** | `backend/src/notification/controllers/notification.controller.ts` | `@UseGuards(JwtAuthGuard)` on class | Auth re-enabled on all endpoints | ✅ Done |
| **PaymentsController** | `backend/src/payments/payments.controller.ts` | `@UseGuards(PermissionGuard)`, `@Public()` for read, `@RequireRole('hyper_admin', 'hyper_manager')` for admin | Approve/reject hyper-only, receipt upload any auth | ✅ Done |
| **SupportChatController** | `backend/src/support-chat/controllers/support-chat.controller.ts` | `@UseGuards(PermissionGuard)`, `@RequireRole` on admin endpoints | Admin inbox/assign hyper-only | ✅ Done |
| **DashboardController** | `backend/src/properties/controllers/dashboard.controller.ts` | `@UseGuards(JwtAuthGuard)` on class | Auth required | ✅ Done |
| **CommentsController** | `backend/src/comments/controllers/comments.controller.ts` | `@UseGuards(PermissionGuard)` on class | Ownership validated in service layer (BE-12) | ✅ Done |
| **ReactionsController** | `backend/src/reactions/controllers/reactions.controller.ts` | `@UseGuards(PermissionGuard)` on class | Ownership validated in service layer | ✅ Done |

---

## Frontend Modules

| Module | File | RBAC Applied | Scope Filtering | Status |
|--------|------|-------------|----------------|--------|
| **usePermissions** | `src/hooks/usePermissions.ts` | Full scope-aware hook: `can()`, `canOnProperty()`, `filterByScope()` | Fetches assignments+permissions from API for admin/manager/hyper_manager | ✅ Done |
| **useRoleAccess** | `src/hooks/useRoleAccess.ts` | Deprecated — no remaining consumers | Role-only checks (no API fetch) | ✅ Deprecated |
| **RBAC Interceptor** | `src/lib/rbac-interceptor.ts` | 403 response handler with user-friendly messages | `checkRBACPreFlight()` for client-side blocking | ✅ Done |
| **ProtectedRoute** | `src/components/ProtectedRoute.tsx` | Role-based route protection, booking access restriction | Route-level gating | ✅ Done |
| **Routes.tsx** | `src/routes/Routes.tsx` | All routes properly restricted | `MANAGER_ROLES`, `ADMIN_ROLE_LIST`, `HYPER_ROLES`, `requireBookingAccess` | ✅ Done |
| **HyperDashboard** | `src/modules/dashboard/HyperDashboard.tsx` | Uses `usePermissions`, all tabs gated by `rbac.*` flags | HyperManager tabs respect assigned permissions | ✅ Done |
| **AdminManagerDashboard** | `src/modules/dashboard/AdminManagerDashboard.tsx` | Uses `usePermissions`, tabs gated: points, fees, absorption, cancellation, email, payments, verifications | Manager sees only permitted tabs via `access.can*` | ✅ Done |
| **admin.types.ts** | `src/modules/admin/admin.types.ts` | `PermissionType` union, `PERMISSION_LABELS`, `PERMISSION_CATEGORIES`, `ROLE_RESTRICTIONS` | Synced with backend entity | ✅ Done |
| **InvitationForm** | `src/modules/admin/components/InvitationForm.tsx` | `allowedRoles` prop filtered by `usePermissions.allowedInvitationRoles` | Only shows invitable roles | ✅ Done |
| **HyperEntityManager** | `src/modules/admin/components/HyperEntityManager.tsx` | Props: `canCreateProperty`, `canCreateService`, `canModifyProperty`, `canModifyService` from `usePermissions` | Buttons hidden per permission | ✅ Done |
| **PointsRulesManager** | `src/modules/admin/components/PointsRulesManager.tsx` | Rendered only in tabs gated by `canViewAnalytics` | Admin-only create/edit | ✅ Done |
| **ServiceFeesManager** | `src/modules/admin/components/ServiceFeesManager.tsx` | Rendered only in tabs gated by `canManageFees` | Hyper-only create/edit | ✅ Done |
| **GroupsManagement** | `src/modules/admin/pages/GroupsManagement.tsx` | `readOnly` prop from `canCreateGroups` | Admin creates; hyper reads | ✅ Done |
| **ManagerAssignments** | `src/modules/admin/pages/ManagerAssignments.tsx` | `isHyperContext` prop, `@RequireRole` on API | Admin sees own; hyper sees all | ✅ Done |
| **VerificationReview** | `src/modules/admin/pages/VerificationReview.tsx` | Tab gated by `canVerifyDocuments` | Hyper can approve/reject | ✅ Done |
| **PaymentValidation** | `src/modules/payments/pages/PaymentValidation.tsx` | Tab gated by `canViewPayments` | Admin validates; hyper processes | ✅ Done |
| **EmailAnalyticsPage** | `src/modules/admin/pages/EmailAnalyticsPage.tsx` | Tab gated by `canViewEmailAnalytics` | Scope-filtered data | ✅ Done |
| **HostFeeAbsorptionPage** | `src/modules/admin/pages/HostFeeAbsorptionPage.tsx` | Tab gated by `canManageFeeAbsorption`; `viewOnly` prop | Admin creates; hyper can only view/delete | ✅ Done |
| **CancellationRulesPage** | `src/modules/admin/pages/CancellationRulesPage.tsx` | Tab gated by `canManageCancellationRules`; `viewOnly` prop | Admin creates; hyper can only view/delete | ✅ Done |
| **App.tsx** | `src/App.tsx` | `initRBACInterceptor()` called at startup | Global 403 handling | ✅ Done |
| **PropertyDetail** | `src/pages/PropertyDetail.tsx` | `usePermissions().canModifyProperty` for edit/duplicate | Migrated from inline role check | ✅ Done |
| **ServiceDetail** | `src/pages/ServiceDetail.tsx` | `usePermissions().canModifyService` for duplicate button | Button gated by permission | ✅ Done |
| **AdminUsersManagement** | `src/modules/admin/pages/AdminUsersManagement.tsx` | Migrated to `usePermissions` | Replaced deprecated `useRoleAccess` | ✅ Done |
| **HostBookings** | `src/modules/bookings/pages/HostBookings.tsx` | `usePermissions()` for accept/reject/refund flags | Actions gated | ✅ Done |
| **BookingHistory** | `src/modules/bookings/pages/BookingHistory.tsx` | `usePermissions().canRefundUsers` | Refund action gated | ✅ Done |
| **BookingModal** | `src/modules/shared/components/calendar/BookingModal.tsx` | `usePermissions().canMakeBooking` | Booking check added | ✅ Done |
| **ServiceBookingForm** | `src/modules/services/components/ServiceBookingForm.tsx` | `usePermissions().canMakeBooking` | Booking check added | ✅ Done |
| **ProductModal** | `src/modules/shared/components/ProductModal.tsx` | `usePermissions().canMakeBooking` | Book button gated | ✅ Done |

---

## Backend Ticket Fixes (2026-04-04)

| Ticket | Priority | Description | Fix | Status |
|--------|----------|-------------|-----|--------|
| **BE-01** | 🔴 Critical | `PUT /bookings/:id/status` — no role/permission check | Added `@RequireRole` + `@RequirePermission('answer_demands')` | ✅ Fixed |
| **BE-02** | 🔴 Critical | `GET /bookings/:id` & `GET /service-bookings/:id` — no scope check | Added `findOneScoped()` / `getOneScoped()` with role+ownership validation | ✅ Fixed |
| **BE-03** | 🔴 Critical | Invitation rules not enforced | Updated `INVITATION_ALLOWED_ROLES`: hyper_admin can't invite user/manager; hyper_manager can't invite manager | ✅ Fixed |
| **BE-04** | 🔴 Critical | Guest scope not resolved from inviter | Created `GuestScopeResolver`. Scope assignment on invite accept already in `RolesService.createGuestAssignmentsFromInviter()` | ✅ Fixed |
| **BE-05** | 🟠 Blocking | Hyper roles can create/update absorption fees | Removed `hyper_admin`/`hyper_manager` from POST/PUT. Only admin/manager can create/update | ✅ Fixed |
| **BE-06** | 🟠 Blocking | Hyper roles can create/update cancellation rules | Same fix as BE-05 on cancellation rules controller | ✅ Fixed |
| **BE-07** | 🟠 Blocking | Hyper_admin can create property/service groups | Removed `hyper_admin` from POST on both controllers. Only admin can create | ✅ Fixed |
| **BE-08** | 🟠 Blocking | Hyper roles can accept/decline service bookings | Removed `hyper_admin`/`hyper_manager` from accept/decline endpoints + guard-level block | ✅ Fixed |
| **BE-09** | 🟠 Blocking | Hyper_admin can assign permissions to any role | Added validation: hyper_admin can only assign fine-grained permissions to hyper_manager | ✅ Fixed |
| **BE-10** | 🟡 Important | DB migration for user role enum | Entity already uses `varchar(20)` with TypeScript type. Migration deferred to deployment | ⬜ Deferred |
| **BE-11** | 🟡 Important | hostId filter not systematic | Created `filterByHostId()` helper utility for reuse across services | ✅ Fixed |
| **BE-12** | 🟡 Important | Comments ownership not validated | Updated `CommentsService.update()` and `.delete()` with author OR admin/hyper check | ✅ Fixed |
| **BE-13** | 🟡 Important | Manager multi-admin permission merging | Updated `hasPermissionForProperty()` to isolate permissions per (adminId, managerId) pair | ✅ Fixed |
| **BE-14** | 🟡 Normal | Seeds missing guest role | Deferred to deployment phase | ⬜ Deferred |
| **BE-15** | 🟡 Normal | Swagger docs incomplete | Controllers updated with detailed `@ApiOperation` descriptions including role restrictions and 403 scenarios | ✅ Fixed |

---

## Permission Types (Synced Backend ↔ Frontend)

| Permission | Category | Hyper Assignable | Admin Assignable |
|-----------|----------|-----------------|-----------------|
| `create_property` | Property Management | ✅ | ❌ |
| `modify_property` | Property Management | ✅ | ✅ |
| `delete_property` | Property Management | ✅ | ❌ |
| `pause_property` | Property Management | ✅ | ✅ |
| `archive_property` | Property Management | ✅ | ❌ |
| `duplicate_property` | Property Management | ✅ | ❌ |
| `modify_prices` | Property Management | ❌ | ✅ |
| `modify_photos` | Property Management | ❌ | ✅ |
| `modify_title` | Property Management | ❌ | ✅ |
| `modify_description` | Property Management | ❌ | ✅ |
| `manage_availability` | Property Management | ❌ | ✅ |
| `manage_amenities` | Property Management | ❌ | ✅ |
| `view_bookings` | Bookings | ✅ | ✅ |
| `accept_bookings` | Bookings | ✅ | ✅ |
| `reject_bookings` | Bookings | ✅ | ✅ |
| `pause_bookings` | Bookings | ✅ | ✅ |
| `refund_users` | Bookings | ✅ | ✅ |
| `answer_demands` | Bookings | ✅ | ✅ |
| `decline_demands` | Bookings | ✅ | ✅ |
| `accept_demands` | Bookings | ✅ | ✅ |
| `reply_chat` | Communication | ✅ | ✅ |
| `reply_reviews` | Communication | ✅ | ✅ |
| `reply_comments` | Communication | ✅ | ✅ |
| `send_messages` | Communication | ✅ | ✅ |
| `contact_guests` | Communication | ✅ | ✅ |
| `manage_reactions` | Social | ❌ | ✅ |
| `manage_likes` | Social | ❌ | ✅ |
| `view_analytics` | Business | ✅ | ✅ |
| `manage_promotions` | Business | ✅ | ✅ |
| `modify_offers` | Business | ✅ | ✅ |
| `create_service` | Service | ✅ | ❌ |
| `modify_service` | Service | ✅ | ✅ |
| `delete_service` | Service | ✅ | ❌ |
| `pause_service` | Service | ✅ | ✅ |
| `archive_service` | Service | ✅ | ❌ |
| `duplicate_service` | Service | ✅ | ❌ |
| `manage_users` | User Management | ✅ | ❌ |
| `manage_admins` | User Management | ✅ | ❌ |
| `manage_managers` | User Management | ✅ | ❌ |
| `validate_payments` | Special | ✅ | ❌ |
| `verify_documents` | Special | ✅ | ❌ |
| `manage_fee_rules` | Special | ✅ | ❌ |
| `manage_cancellation_rules` | Special | ✅ | ❌ |
| `archive_entities` | Special | ✅ | ❌ |
| `view_payments` | Dashboard Access | ✅ | ❌ |
| `view_email_analytics` | Dashboard Access | ✅ | ❌ |
| `manage_fee_absorption` | Dashboard Access | ✅ | ❌ |

---

## Synchronization Matrix

| Layer | Role Check | Permission Check | Scope Validation | Booking Block |
|-------|-----------|-----------------|------------------|---------------|
| **Backend PermissionGuard** | ✅ `@RequireRole` | ✅ `@RequirePermission` | ✅ Admin ownership, guest scope, multi-admin isolation | ✅ `IS_BOOKING_CREATE` |
| **Backend RolesGuard** | ✅ Lightweight | ❌ | ❌ | ❌ |
| **Frontend usePermissions** | ✅ `role` flags | ✅ `can()`, `canOnProperty()` | ✅ `filterByScope()` | ✅ `canMakeBooking` |
| **Frontend RBAC Interceptor** | ✅ `checkRBACPreFlight` | ❌ | ❌ | ❌ |
| **Frontend ProtectedRoute** | ✅ `requiredRoles` | ❌ | ❌ | ✅ `requireBookingAccess` |

---

## Notes

- All modules listed as ✅ Done have been verified to have complete RBAC coverage.
- The `usePermissions` hook fetches real assignments/permissions from the API for admin/manager/hyper_manager roles.
- The RBAC interceptor handles 403 responses globally with user-friendly French messages.
- Backend `PermissionGuard` now validates admin ownership via `isPropertyOwner`/`isServiceOwner` queries.
- Guest scope is enforced both on list endpoints (via service-level filtering) and individual resource access (via guard).
- `useRoleAccess` is fully deprecated — no remaining consumers.
- All route-level RBAC gaps (BookingCalendar, SupportInbox, BookingList) have been fixed.
- All component-level booking gating (BookingModal, ServiceBookingForm, ProductModal) now uses `usePermissions().canMakeBooking`.
- **BE-10** (DB enum migration) and **BE-14** (seeds) are deferred to the deployment phase as they require database access.
- **BE-13** multi-admin permission isolation ensures managers with assignments from multiple admins don't merge permissions across admin scopes.

---

## Dynamic RBAC Configuration (2026-04-05)

| Module | File | Description | Status |
|--------|------|-------------|--------|
| **RbacConfigService** | `backend/src/user/services/rbac-config.service.ts` | Refactored: Redis cache (read/write), Redis pub/sub cross-instance sync, WebSocket broadcast to frontends, safety checks (protected permissions), bulk update API | ✅ Done |
| **RbacConfigController** | `backend/src/user/controllers/rbac-config.controller.ts` | New endpoints: `PUT /rbac-config/backend` (bulk), `PUT /rbac-config/frontend` (bulk), `GET /rbac-config/roles`. Swagger documented. hyper_manager read-only access | ✅ Done |
| **rbac-config.api.ts** | `src/modules/admin/rbac-config.api.ts` | Updated API client: `bulkUpdateBackend()`, `bulkUpdateFrontend()`, `getRoles()`. All return `.data` directly | ✅ Done |
| **RbacSettingsPage** | `src/modules/admin/pages/RbacSettingsPage.tsx` | New page: permission matrix UI (backend + frontend tabs), toggle switches, scope dropdown, bulk save, search, pending changes indicator, WebSocket auto-refresh | ✅ Done |
| **usePermissions** | `src/hooks/usePermissions.ts` | Added: `reloadPermissions()` function, `rbacConfig` state fetched from API, `fetchCounter` trigger for re-fetch | ✅ Done |
| **Routes** | `src/routes/Routes.tsx`, `src/routes/routes.constants.ts` | Added `ADMIN_ROUTES.RBAC_SETTINGS` → `/admin/rbac-settings` (hyper_admin + hyper_manager only) | ✅ Done |
| **PermissionGuard** | `backend/src/auth/guards/permission.guard.ts` | Added `/rbac-config` to `HYPER_ALLOWED_WRITE_PATHS` | ✅ Done |
| **RolesModule** | `backend/src/user/modules/roles.module.ts` | Imported `WsModule` for EventsGateway injection | ✅ Done |

### Architecture
- **Cache strategy**: Memory cache (fast) → Redis (shared) → DB (source of truth)
- **Update flow**: DB update → Redis persist → Redis pub/sub broadcast → WebSocket event → Frontend auto-refresh
- **Safety**: Protected permissions list prevents hyper_admin from self-locking critical ops
- **Seed**: Existing `rbac.seed.ts` already provides idempotent seed data for all 6 roles
