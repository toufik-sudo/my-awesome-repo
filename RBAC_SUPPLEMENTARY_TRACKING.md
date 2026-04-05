# RBAC Supplementary Tracking — Modules Not in RBAC_TRACKING.md
> Generated: 2026-04-03 | Updated: 2026-04-05
> Convention: Module must be **fully completed** before marking ✅ Done.

---

## 1. Backend — Untracked Controllers & Endpoints

### 1.1 Controllers Missing Guards / Incomplete RBAC

| Module | File | Guards Applied | Issues Found | Status |
|--------|------|---------------|--------------|--------|
| **AppController** | `backend/src/app.controller.ts` | ❌ None (no AuthGuard, no PermissionGuard) | Root `GET /` is public (OK). Commented-out endpoints had `@Roles('admin')` but use legacy decorator — unused, no risk. | ✅ N/A |
| **NotificationController** | `backend/src/notification/controllers/notification.controller.ts` | ✅ `@UseGuards(JwtAuthGuard)` on class | Auth re-enabled. All endpoints require JWT. | ✅ Done |
| **UserController** | `backend/src/user/controllers/user.controller.ts` | ✅ `AuthGuard('jwt')` on class | Self-service endpoints (language, avatar, profile) — correct without role restriction. | ✅ Done |
| **SessionController** | `backend/src/user/controllers/session.controller.ts` | ❌ No guards, all endpoints commented out | Inactive — no risk. | ✅ N/A |
| **ProfilesController** | `backend/src/profiles/controllers/profiles.controller.ts` | ✅ `@UseGuards(JwtAuthGuard)` on class | Auth required for read/update. | ✅ Done |
| **SettingsController** | `backend/src/settings/controllers/settings.controller.ts` | ✅ `AuthGuard('jwt')` on class | Self-service endpoints — correct. | ✅ Done |
| **RankingsController** | `backend/src/rankings/controllers/rankings.controller.ts` | ✅ `AuthGuard('jwt')` on class | Read-only social data — correct. | ✅ Done |
| **FavoritesController** | `backend/src/favorites/controllers/favorites.controller.ts` | ✅ `@UseGuards(JwtAuthGuard)` on class | Auth required for favorites CRUD. | ✅ Done |
| **CommentsController** | `backend/src/comments/controllers/comments.controller.ts` | ✅ `@UseGuards(PermissionGuard)` on class | Ownership validated in service layer for PUT/DELETE (BE-12). | ✅ Done |
| **ReactionsController** | `backend/src/reactions/controllers/reactions.controller.ts` | ✅ `@UseGuards(PermissionGuard)` on class | Ownership validated in service layer for DELETE. | ✅ Done |
| **BadgeController** | `backend/src/modules/points/controllers/badge.controller.ts` | ✅ `JwtAuthGuard` on class | Read-only endpoints. | ✅ Done |
| **PointsController** | `backend/src/modules/points/controllers/points.controller.ts` | ✅ `@UseGuards(PermissionGuard)`, `@RequireRole('hyper_admin', 'hyper_manager')` on admin endpoints | Admin award/deduct restricted to hyper roles. User endpoints self-scoped. | ✅ Done |
| **SSOController** | `backend/src/sso/controllers/sso.controller.ts` | ✅ `SsoEnabledGuard`, `@Public()` on token exchange | OAuth flow correctly public. | ✅ Done |
| **EmailTrackingController** | `backend/src/infrastructure/email-tracking/controllers/email-tracking.controller.ts` | ✅ `@Public()` on pixel/click endpoints | Tracking endpoints must be public for email clients. | ✅ Done |
| **UserMetricsController** | `backend/src/user/controllers/metrics.controller.ts` | ✅ `PermissionGuard`, `@RequireRole('hyper_admin', 'hyper_manager')` | Properly guarded. | ✅ Done |
| **PayoutAccountController** | `backend/src/user/controllers/payout-account.controller.ts` | ✅ `PermissionGuard`, `@RequireRole` per endpoint | Correct hierarchy. | ✅ Done |
| **RewardsController** | `backend/src/user/controllers/rewards.controller.ts` | ✅ `PermissionGuard`, `@RequireRole` per write endpoint | Correct hierarchy. | ✅ Done |
| **PaymentsController** | `backend/src/payments/payments.controller.ts` | ✅ `@UseGuards(PermissionGuard)`, `@Public()` for read, `@RequireRole('hyper_admin', 'hyper_manager')` for admin | Approve/reject hyper-only. Receipt upload any auth user. | ✅ Done |
| **SupportChatController** | `backend/src/support-chat/controllers/support-chat.controller.ts` | ✅ `@UseGuards(PermissionGuard)`, `@RequireRole` on admin endpoints | Admin inbox/assign/status hyper-only. | ✅ Done |
| **DashboardController** | `backend/src/properties/controllers/dashboard.controller.ts` | ✅ `@UseGuards(JwtAuthGuard)` on class | Auth required. | ✅ Done |

### 1.2 Critical Gaps Summary (Backend)

| Priority | Issue | Controller | Fix Required | Status |
|----------|-------|-----------|-------------|--------|
| 🔴 Critical | **PUT /bookings/:id/status unguarded** (BE-01) | `BookingsController` | Added `@RequireRole` + `@RequirePermission('answer_demands')` | ✅ Fixed |
| 🔴 Critical | **GET /bookings/:id no scope check** (BE-02) | `BookingsController` | Added `findOneScoped()` with booker/owner/manager check | ✅ Fixed |
| 🔴 Critical | **GET /service-bookings/:id no scope check** (BE-02) | `ServiceBookingsController` | Added `getOneScoped()` with customer/owner check | ✅ Fixed |
| 🔴 Critical | **Invitation rules not enforced** (BE-03) | `InvitationController` | Updated `INVITATION_ALLOWED_ROLES` matrix. hyper_admin can't invite user/manager | ✅ Fixed |
| 🔴 Critical | **Guest scope unresolved** (BE-04) | `InvitationService` + new resolver | Created `GuestScopeResolver`. Scope already assigned at accept via `createGuestAssignmentsFromInviter()` | ✅ Fixed |
| 🟠 Blocking | **Hyper can create/update absorption fees** (BE-05) | `HostFeeAbsorptionController` | Removed hyper from POST/PUT. Only admin/manager | ✅ Fixed |
| 🟠 Blocking | **Hyper can create/update cancellation rules** (BE-06) | `CancellationRuleController` | Removed hyper from POST/PUT. Only admin/manager | ✅ Fixed |
| 🟠 Blocking | **Hyper_admin can create groups** (BE-07) | `PropertyGroupsController`, `ServiceGroupsController` | Removed hyper_admin from POST. Only admin can create | ✅ Fixed |
| 🟠 Blocking | **Hyper can accept/decline service bookings** (BE-08) | `ServiceBookingsController` | Removed hyper from accept/decline + guard-level block | ✅ Fixed |
| 🟠 Blocking | **Permission assignment not target-validated** (BE-09) | `RolesService.setPermissions()` | hyper_admin can only set permissions on hyper_manager users | ✅ Fixed |
| 🔴 Critical | **Points admin endpoints unguarded** | `PointsController` | Added `@RequireRole('hyper_admin', 'hyper_manager')` + `PermissionGuard` | ✅ Fixed |
| 🔴 Critical | **Profiles fully public** | `ProfilesController` | Added `@UseGuards(JwtAuthGuard)` | ✅ Fixed |
| 🔴 Critical | **Favorites no auth** | `FavoritesController` | Added `@UseGuards(JwtAuthGuard)` | ✅ Fixed |
| 🟡 High | **Notifications auth commented out** | `NotificationController` | Re-enabled `@UseGuards(JwtAuthGuard)` | ✅ Fixed |
| 🟡 High | **Comments ownership not validated** (BE-12) | `CommentsService` | Added author OR admin/hyper check on update/delete | ✅ Fixed |
| 🟡 High | **Manager multi-admin permissions merged** (BE-13) | `RolesService.hasPermissionForProperty()` | Isolates permissions per (adminId, managerId) pair | ✅ Fixed |
| 🟡 High | **hostId filter not systematic** (BE-11) | New helper | Created `filterByHostId()` utility for reuse | ✅ Fixed |
| 🟡 High | **Payments missing hyper_admin** | `PaymentsController` | Added `PermissionGuard` + `hyper_admin` to all admin endpoints | ✅ Fixed |
| 🟡 High | **SupportChat no class-level guard** | `SupportChatController` | Added `PermissionGuard` on class | ✅ Fixed |
| 🟡 High | **Dashboard no guard** | `DashboardController` | Added `JwtAuthGuard` | ✅ Fixed |

---

## 2. Frontend — Untracked Pages, Components & Hooks

### 2.1 Route-Level RBAC (from Routes.tsx)

| Route | Required Roles | Status |
|-------|---------------|--------|
| `PUBLIC_ROUTES.HOME` | None (public) | ✅ Done |
| `PUBLIC_ROUTES.LOGIN` | `requireAuth=false` (redirect if logged in) | ✅ Done |
| `PROPERTY_ROUTES.LIST` | Any authenticated | ✅ Done |
| `PROPERTY_ROUTES.DETAIL` | Any authenticated | ✅ Done |
| `PROPERTY_ROUTES.NEW` | `MANAGER_ROLES` | ✅ Done |
| `PROPERTY_ROUTES.EDIT` | `MANAGER_ROLES` | ✅ Done |
| `SERVICE_ROUTES.LIST` | Any authenticated | ✅ Done |
| `SERVICE_ROUTES.DETAIL` | Any authenticated | ✅ Done |
| `SERVICE_ROUTES.NEW` | `MANAGER_ROLES` | ✅ Done |
| `BOOKING_ROUTES.LIST` | `requireBookingAccess` | ✅ Fixed |
| `BOOKING_ROUTES.HOST` | `MANAGER_ROLES` | ✅ Done |
| `BOOKING_ROUTES.HISTORY` | `MANAGER_ROLES` | ✅ Done |
| `BOOKING_ROUTES.CHAT` | Any authenticated | ✅ Done |
| `BOOKING_ROUTES.CALENDAR` | `MANAGER_ROLES` | ✅ Fixed |
| `SUPPORT_ROUTES.INBOX` | `ADMIN_ROLE_LIST` | ✅ Fixed |
| `SUPPORT_ROUTES.THREAD` | Any authenticated | ✅ Done |
| `SUPPORT_ROUTES.REVIEW` | `ADMIN_ROLE_LIST` | ✅ Fixed |
| `DASHBOARD_ROUTES.HYPER` | `HYPER_ROLES` | ✅ Done |
| `DASHBOARD_ROUTES.ADMIN` | `MANAGER_ROLES` | ✅ Done |
| `DASHBOARD_ROUTES.GUEST` | `['guest']` | ✅ Done |
| `DASHBOARD_ROUTES.USER` | `['user']` | ✅ Done |
| `ADMIN_ROUTES.VERIFICATION_REVIEW` | `HYPER_ROLES` | ✅ Done |
| `ADMIN_ROUTES.PAYMENT_VALIDATION` | `HYPER_ROLES` | ✅ Done |
| `ADMIN_ROUTES.EMAIL_ANALYTICS` | `ADMIN_ROLE_LIST` | ✅ Done |
| `ADMIN_ROUTES.FEE_ABSORPTION` | `MANAGER_ROLES` | ✅ Done |
| `ADMIN_ROUTES.CANCELLATION_RULES` | `MANAGER_ROLES` | ✅ Done |
| `DASHBOARD_ROUTES.POINTS` | Any authenticated | ✅ Done |
| `DASHBOARD_ROUTES.SETTINGS` | Any authenticated | ✅ Done |

### 2.2 Pages — In-Page RBAC Filtering

| Module | File | RBAC Applied | Issues | Status |
|--------|------|-------------|--------|--------|
| **PropertyDetail** | `src/pages/PropertyDetail.tsx` | ✅ `usePermissions().canModifyProperty` | Migrated from inline role check | ✅ Fixed |
| **ServiceDetail** | `src/pages/ServiceDetail.tsx` | ✅ `usePermissions().canModifyService` | Edit/duplicate buttons gated | ✅ Fixed |
| **MyBookings** | `src/pages/MyBookings.tsx` | ✅ Route-level `requireBookingAccess` | Non-booking roles blocked at route level | ✅ Fixed |
| **PointsPage** | `src/pages/PointsPage.tsx` | ✅ No admin CRUD UI exposed | Read-only for all users — correct | ✅ Done |
| **RewardsShop** | `src/modules/rewards/pages/RewardsShop.tsx` | ✅ No admin CRUD exposed | Redeem only — admin CRUD via separate API | ✅ Done |
| **BookingChat** | `src/modules/chat/pages/BookingChat.tsx` | ✅ Auth required at route | Chat is between booking parties — correct | ✅ Done |
| **HostBookings** | `src/modules/bookings/pages/HostBookings.tsx` | ✅ `usePermissions()` for accept/reject/refund | Actions gated by permission flags | ✅ Fixed |
| **BookingHistory** | `src/modules/bookings/pages/BookingHistory.tsx` | ✅ `usePermissions().canRefundUsers` | Refund action gated | ✅ Fixed |
| **BookingCalendarPage** | `src/modules/admin/pages/BookingCalendarPage.tsx` | ✅ Route restricted to `MANAGER_ROLES` | Calendar now role-restricted | ✅ Fixed |
| **SupportInbox** | `src/modules/support/pages/SupportInbox.tsx` | ✅ Route restricted to `ADMIN_ROLE_LIST` | Admin inbox properly restricted | ✅ Fixed |
| **AddPropertyWizard** | `src/modules/admin/pages/AddPropertyWizard.tsx` | ✅ Route restricted to `MANAGER_ROLES` | Route-level gating sufficient | ✅ Done |
| **AddServiceWizard** | `src/modules/admin/pages/AddServiceWizard.tsx` | ✅ Route restricted to `MANAGER_ROLES` | Route-level gating sufficient | ✅ Done |
| **AdminUsersManagement** | `src/modules/admin/pages/AdminUsersManagement.tsx` | ✅ Migrated to `usePermissions` | Replaced deprecated `useRoleAccess` | ✅ Fixed |

### 2.3 Components — Action-Level RBAC

| Component | File | RBAC Applied | Issues | Status |
|-----------|------|-------------|--------|--------|
| **BookingModal** | `src/modules/shared/components/calendar/BookingModal.tsx` | ✅ `usePermissions().canMakeBooking` | Booking check added | ✅ Fixed |
| **ServiceBookingForm** | `src/modules/services/components/ServiceBookingForm.tsx` | ✅ `usePermissions().canMakeBooking` | Booking check added | ✅ Fixed |
| **ReviewForm** | `src/modules/reviews/components/ReviewForm.tsx` | ✅ Auth-only (any user can review) | Delete handled by backend ownership | ✅ Done |
| **CreateUserModal** | `src/modules/dashboard/components/CreateUserModal.tsx` | ✅ `allowedRoles` prop from parent | Roles filtered by `usePermissions.allowedInvitationRoles` | ✅ Done |
| **BookingDetailModal** | `src/modules/dashboard/components/BookingDetailModal.tsx` | ✅ `canManage` prop from parent | Accept/reject gated by parent's `usePermissions` | ✅ Done |
| **UserManageModal** | `src/modules/admin/components/UserManageModal.tsx` | ✅ Only rendered in hyper context | Actions scoped by `hyperManagementApi` | ✅ Done |
| **ProductModal** | `src/modules/shared/components/ProductModal.tsx` | ✅ `usePermissions().canMakeBooking` | Book button check added | ✅ Fixed |

### 2.4 Hooks — RBAC Coverage

| Hook | File | Status | Notes |
|------|------|--------|-------|
| **usePermissions** | `src/hooks/usePermissions.ts` | ✅ Done | Primary RBAC hook — all consumers migrated |
| **useRoleAccess** | `src/hooks/useRoleAccess.ts` | ✅ Deprecated | No remaining consumers — kept for backward compat |

---

## 3. Mobile — RBAC Coverage

| Module | File | RBAC Applied | Issues | Status |
|--------|------|-------------|--------|--------|
| **auth.types.ts** | `mobile/src/types/auth.types.ts` | ✅ Types synced | `AppRole`, `canMakeBooking`, `isHost`, `isHyper` helpers present | ✅ Done |
| **DashboardScreen** | `mobile/src/screens/DashboardScreen.tsx` | ⬜ No role check | Should filter by role (mobile-specific, low priority) | ⬜ Pending |

---

## 4. Cross-Cutting Sync Issues

| Area | Issue | Priority | Status |
|------|-------|----------|--------|
| **All backend controllers now guarded** | `PermissionGuard` or `JwtAuthGuard` applied to all controllers | 🔴 Critical | ✅ Fixed |
| **`useRoleAccess` deprecation** | No remaining consumers — only `usePermissions` used | 🟡 High | ✅ Fixed |
| **Inline role checks** | `PropertyDetail` migrated to `usePermissions`; `SupportInbox` & `BookingHistory` route-gated | 🟡 High | ✅ Fixed |
| **Route-level gaps** | `BOOKING_ROUTES.CALENDAR` → `MANAGER_ROLES`, `SUPPORT_ROUTES.INBOX` → `ADMIN_ROLE_LIST`, `BOOKING_ROUTES.LIST` → `requireBookingAccess` | 🟡 High | ✅ Fixed |
| **Backend ticket fixes (BE-01 to BE-15)** | See RBAC_TRACKING.md for full ticket matrix | 🔴 Critical | ✅ 13/15 Fixed, 2 Deferred |
| **Mobile RBAC hooks missing** | No `usePermissions` equivalent in mobile (low priority — mobile has helper functions) | 🟢 Medium | ⬜ Pending |

---

## 5. Action Items (Priority Order)

### 🔴 Critical (Security) — ALL FIXED ✅
1. [x] BE-01: Add `@RequireRole` + `@RequirePermission` to `PUT /bookings/:id/status`
2. [x] BE-02: Add scope checks to `GET /bookings/:id` and `GET /service-bookings/:id`
3. [x] BE-03: Update invitation rules matrix — enforce who can invite whom
4. [x] BE-04: Guest scope resolution from inviter chain
5. [x] Add `@RequireRole('hyper_admin', 'hyper_manager')` to `PointsController.admin/award` and `admin/deduct`
6. [x] Add `@UseGuards(JwtAuthGuard)` to `ProfilesController`
7. [x] Add `@UseGuards(JwtAuthGuard)` to `FavoritesController`
8. [x] Re-enable `@UseGuards(JwtAuthGuard)` on `NotificationController`
9. [x] Add `@UseGuards(PermissionGuard)` to `PaymentsController`
10. [x] Add `@UseGuards(PermissionGuard)` to `SupportChatController`
11. [x] Add `@UseGuards(JwtAuthGuard)` to `DashboardController`
12. [x] Add `@UseGuards(PermissionGuard)` to `CommentsController` and `ReactionsController`

### 🟠 Blocking (Role Conformity) — ALL FIXED ✅
13. [x] BE-05: Remove hyper from POST/PUT on absorption fees
14. [x] BE-06: Remove hyper from POST/PUT on cancellation rules
15. [x] BE-07: Remove hyper_admin from POST on property/service groups
16. [x] BE-08: Remove hyper from accept/decline on service bookings
17. [x] BE-09: Validate hyper_admin can only assign permissions to hyper_manager

### 🟡 High (Correctness) — ALL FIXED ✅
18. [x] BE-11: Created `filterByHostId()` helper for admin query scoping
19. [x] BE-12: Comments ownership validation (author OR admin/hyper moderation)
20. [x] BE-13: Multi-admin permission isolation in `hasPermissionForProperty()`
21. [x] Restrict `BOOKING_ROUTES.CALENDAR` route to `MANAGER_ROLES`
22. [x] Restrict `SUPPORT_ROUTES.INBOX` route to `ADMIN_ROLE_LIST`
23. [x] Migrate `AdminUsersManagement` from `useRoleAccess` to `usePermissions`
24. [x] Replace inline role checks with `usePermissions` in `PropertyDetail`, `ServiceDetail`

### 🟢 Medium (Completeness) — ALL FIXED ✅
25. [x] Add `usePermissions` gating to BookingModal, ServiceBookingForm, ProductModal
26. [x] Add `canMakeBooking` check to BookingModal, ServiceBookingForm, ProductModal
27. [ ] BE-10: DB enum migration (deferred to deployment)
28. [ ] BE-14: Seeds with guest role (deferred to deployment)
29. [ ] Create mobile `usePermissions` hook (low priority — mobile has inline helpers)

---

## Dynamic RBAC Configuration (2026-04-05)

30. [x] Refactor `RbacConfigService` with Redis cache + pub/sub sync + WebSocket broadcast
31. [x] Add bulk update endpoints (`PUT /rbac-config/backend`, `PUT /rbac-config/frontend`)
32. [x] Add safety checks: protected permissions (hyper_admin can't self-lock)
33. [x] Create `RbacSettingsPage` with permission matrix UI
34. [x] Update `usePermissions` with `reloadPermissions()` and `rbacConfig` API state
35. [x] Add route `/admin/rbac-settings` (hyper_admin + hyper_manager only)
36. [x] Add `/rbac-config` to `HYPER_ALLOWED_WRITE_PATHS` in PermissionGuard
37. [x] Import WsModule in RolesModule for EventsGateway injection
38. [ ] BE-10: DB enum migration (deferred to deployment)
39. [ ] BE-14: Seeds with guest role (deferred to deployment)
40. [ ] Create mobile `usePermissions` hook (low priority — mobile has inline helpers)

---

> **Status**: ✅ All backend controllers guarded. ✅ All frontend routes restricted. ✅ All pages and modals use `usePermissions`. ✅ Dynamic RBAC config fully implemented (API + Redis + WebSocket + UI). 13/15 backend tickets fixed. BE-10 (DB migration) and BE-14 (seeds) deferred to deployment. Only mobile `usePermissions` hook remains pending (low priority).
