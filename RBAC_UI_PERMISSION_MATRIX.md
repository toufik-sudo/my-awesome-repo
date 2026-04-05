# RBAC UI Permission Matrix — Frontend ↔ Backend Synchronization

> **Generated**: 2026-04-04 | Maps every frontend UI element to its backend API, required permission, role, and scope.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Properly gated via `usePermissions` |
| ⚠️ | Uses inline role check instead of `usePermissions` |
| ❌ | Missing permission check |
| 🔗 | Reference to `RBAC_API_INVENTORY.md` |

---

## 1. Property Listing Page (`PropertyListing.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Add Property" Button | POST `/properties` | `canCreateProperty` | admin, manager (with perm) | admin scope | ✅ |
| Property Card (view) | GET `/properties` | — (public) | Any | — | ✅ |

**Route guard**: `ProtectedRoute` (any authenticated) — ✅ correct, listing is public for authenticated users.

---

## 2. Property Detail Page (`PropertyDetail.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Edit" Button | PUT `/properties/:id` | `canModifyProperty` | admin, manager (with perm) | ownership | ✅ |
| "Book" Button / Modal | POST `/bookings` | `canMakeBooking` | manager, guest, user | self | ✅ |
| Promo Alert Subscribe | POST `/properties/:id/promo-alerts` | — | Any authenticated | self | ✅ |
| Reviews List | GET `/reviews/property/:id` | — (public) | Any | — | ✅ |
| Availability Calendar | GET `/properties/:id/availability` | — (public) | Any | — | ✅ |

---

## 3. Service Listing Page (`ServiceListing.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Add Service" Button | POST `/services` | `canCreateService` | admin, manager (with perm) | admin scope | ✅ |
| Service Cards | GET `/services` | — (public) | Any | — | ✅ |

---

## 4. Service Detail Page (`ServiceDetail.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Edit" Button | PUT `/services/:id` | `canModifyService` | admin, manager (with perm) | ownership | ✅ |
| "Book" Button | POST `/service-bookings` | `canMakeBooking` | manager, guest, user | self | ✅ |

---

## 5. Booking Modal (`BookingModal.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Book Button | POST `/bookings` | `canMakeBooking` | manager, guest, user | self | ✅ |
| Form Display | — | `canMakeBooking` | manager, guest, user | — | ✅ |

---

## 6. Service Booking Form (`ServiceBookingForm.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Submit Booking | POST `/service-bookings` | `canMakeBooking` | manager, guest, user | self | ✅ |

---

## 7. Product Modal (`ProductModal.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Book" CTA | POST `/bookings` | `canMakeBooking` | manager, guest, user | self | ✅ |

---

## 8. Host Bookings Page (`HostBookings.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Accept Button | PUT `/bookings/:id/accept` | `canAcceptBookings` | admin, manager | scoped | ✅ |
| Reject Button | PUT `/bookings/:id/decline` | `canRejectBookings` | admin, manager | scoped | ✅ |
| Refund Button | PUT `/bookings/:id/refund` | `canRefundUsers` | admin, manager, hyper | scoped | ✅ |

**Route guard**: `requiredRoles={MANAGER_ROLES}` — ✅

---

## 9. Booking History Page (`BookingHistory.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Refund Button | PUT `/bookings/:id/refund` | `canRefundUsers` | admin, manager, hyper | scoped | ✅ |
| Hyper Admin Filter | — | Inline `user?.role` check | hyper_admin, hyper_manager | — | ⚠️ Should use `isHyper` from `usePermissions` |

**Route guard**: `requiredRoles={MANAGER_ROLES}` — ✅

---

## 10. Booking Detail Modal (`BookingDetailModal.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Accept/Reject Buttons | PUT `/bookings/:id/accept|decline` | `canManage` prop | admin, manager | scoped | ✅ (prop passed from parent) |

---

## 11. Dashboard — Main (`Dashboard.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Add Property" Quick Action | — (navigate) | `canAddProperty` computed | admin | admin scope | ✅ |
| "Manage Users" Quick Action | — (navigate) | `canCreateUsers` computed | admin, hyper | — | ✅ |
| Booking Detail Accept/Reject | bookings API | `canManageBookings` | admin, manager | scoped | ✅ |

---

## 12. Hyper Dashboard (`HyperDashboard.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Entity Manager (Properties/Services) | hyper-management APIs | `rbac.canCreateProperty`, `canModifyProperty`, etc. | hyper_admin, hyper_manager | global | ✅ |
| Fee Absorption Tab | `/host-fee-absorption` | `rbac.canCreateAbsorptionFees` | hyper, admin | — | ✅ |
| Cancellation Rules Tab | `/cancellation-rules` | `rbac.canCreateCancellationRules` | hyper, admin | — | ✅ |
| Groups Management Tab | — | `rbac.canCreateGroups` | hyper, admin | — | ✅ |
| Users Management Tab | roles APIs | `rbac.canManageUsers` | hyper | global | ✅ |
| Metrics Tabs | `/metrics/*` | hyper route guard | hyper_admin, hyper_manager | global | ✅ |

**Route guard**: `requiredRoles={HYPER_ROLES}` — ✅

---

## 13. Admin/Manager Dashboard (`AdminManagerDashboard.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| "Invite Manager" Button | POST `/invitations` | `canInviteManager` | admin | admin scope | ✅ |
| "Invite Guest" Button | POST `/invitations` | `canInviteGuest` | admin, manager | scoped | ✅ |
| "New Property" Button | — (navigate) | `access.canCreateProperty` | admin, manager (with perm) | admin scope | ✅ |
| "New Service" Button | — (navigate) | `access.canCreateService` | admin, manager (with perm) | admin scope | ✅ |
| Analytics Tab | dashboard APIs | `access.canViewAnalytics` | admin, hyper | — | ✅ |
| Points Rules Manager | — | `isAdmin` check | admin | admin scope | ✅ |

**Route guard**: `requiredRoles={MANAGER_ROLES}` — ✅

---

## 14. Admin Users Management (`AdminUsersManagement.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| User List | GET `/roles/users` | `isAdmin`, `isHyper` | admin, hyper | admin=own, hyper=global | ✅ |
| Change Role | PUT `/roles/users/:id/role` | `isHyper` | hyper_admin, hyper_manager | global | ✅ |
| Pause/Reactivate | — | `isAdmin` | admin | admin scope | ✅ |
| Permission Edit | assignments APIs | `isAdmin` | admin | admin scope | ✅ |

**Route guard**: None (accessed via dashboard tabs) — gated by parent dashboard route.

---

## 15. Support Inbox (`SupportInbox.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Admin Inbox View | GET `/support/threads/inbox` | `rbac.isHyper \|\| rbac.isAdmin` | hyper, admin | admin=own, hyper=global | ✅ |
| Assign Thread | PATCH `/support/threads/:id/assign` | `isAdmin` (computed) | hyper, admin | admin scope | ✅ |
| Status Update | PATCH `/support/threads/:id/status` | `isAdmin` (computed) | hyper, admin | admin scope | ✅ |

**Route guard**: `requiredRoles={ADMIN_ROLE_LIST}` — ✅

---

## 16. Invitation Form (`InvitationForm.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Role Selector | — | Filters by `inviterRole` | admin, hyper | — | ⚠️ Uses inline logic, not `usePermissions` |
| Submit Invitation | POST `/invitations` | — | admin, hyper, manager | admin scope | ✅ (parent guards) |

---

## 17. User Manage Modal (`UserManageModal.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Permission Grid | assignments APIs | `isAdmin` inline check | admin | admin scope | ⚠️ Uses `user.role === 'admin'` |
| Status Toggle | — | — | admin | — | ⚠️ Inline role check |

---

## 18. Hyper Entity Manager (`HyperEntityManager.tsx`)

| UI Element | API Endpoint | Permission Check | Roles Allowed | Scope | Status |
|-----------|-------------|-----------------|---------------|-------|--------|
| Publish/Suspend/Archive | hyper-management APIs | `canModify` prop | hyper roles | global | ✅ (props from `usePermissions`) |
| Delete Entity | hyper-management APIs | `canModify` prop | hyper_admin only | global | ✅ |

---

## 19. Route-Level Permission Matrix

| Route | Guard Type | Required Roles | Permission | Status |
|-------|-----------|----------------|------------|--------|
| `/` (Home) | None | Any | — | ✅ |
| `/login` | `requireAuth={false}` | Unauthenticated | — | ✅ |
| `/properties` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/properties/:id` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/properties/new` | `PermissionRoute` | — | `canCreateProperty` | ✅ |
| `/properties/:id/edit` | `PermissionRoute` | — | `canModifyProperty` | ✅ |
| `/services` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/services/:id` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/services/new` | `PermissionRoute` | — | `canCreateService` | ✅ |
| `/bookings` | `ProtectedRoute` | requireBookingAccess | — | ✅ |
| `/bookings/host` | `ProtectedRoute` | MANAGER_ROLES | — | ✅ |
| `/bookings/history` | `ProtectedRoute` | MANAGER_ROLES | — | ✅ |
| `/bookings/calendar` | `ProtectedRoute` | MANAGER_ROLES | — | ✅ |
| `/bookings/chat/:id` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/support/inbox` | `ProtectedRoute` | ADMIN_ROLE_LIST | — | ✅ |
| `/support/thread/:id` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/dashboard` | `ProtectedRoute` | Any authenticated | — | ✅ (redirects by role) |
| `/dashboard/hyper` | `ProtectedRoute` | HYPER_ROLES | — | ✅ |
| `/dashboard/admin` | `ProtectedRoute` | MANAGER_ROLES | — | ✅ |
| `/dashboard/guest` | `ProtectedRoute` | guest | — | ✅ |
| `/dashboard/user` | `ProtectedRoute` | user | — | ✅ |
| `/admin/verification` | `ProtectedRoute` | HYPER_ROLES | — | ✅ |
| `/admin/documents` | `ProtectedRoute` | HYPER_ROLES | — | ✅ |
| `/admin/payments` | `ProtectedRoute` | HYPER_ROLES | — | ✅ |
| `/admin/email-analytics` | `ProtectedRoute` | ADMIN_ROLE_LIST | — | ✅ |
| `/admin/fee-absorption` | `ProtectedRoute` | MANAGER_ROLES | — | ✅ |
| `/admin/cancellation-rules` | `ProtectedRoute` | MANAGER_ROLES | — | ✅ |
| `/settings` | `ProtectedRoute` | Any authenticated | — | ✅ |
| `/points` | `ProtectedRoute` | Any authenticated | — | ✅ |

---

## 20. Frontend API Files ↔ Backend Endpoints

| Frontend API File | Backend Controller | Endpoints Covered | Auth Sync |
|------------------|-------------------|-------------------|-----------|
| `auth.api.ts` | `auth.controller.ts` | login, register, refresh, forgot/reset password, me, logout | ✅ |
| `properties.api.ts` | `properties.controller.ts` | CRUD, availability, promos, alerts | ✅ |
| `bookings.api.ts` | `bookings.controller.ts` | CRUD, accept/decline/refund, availability | ✅ |
| `services.api.ts` | `tourism-services.controller.ts` | CRUD, categories | ✅ |
| `service-bookings.api.ts` | `service-bookings.controller.ts` | CRUD, accept/decline/cancel, availability | ✅ |
| `admin.api.ts` | `roles.controller.ts` | users, assignments, permissions | ✅ |
| `hyper-management.api.ts` | `hyper-management.controller.ts` | entity management | ✅ |
| `metrics.api.ts` | `metrics.controller.ts` | users, bookings, properties, services, revenue, summary | ✅ |
| `reviews.api.ts` | `reviews.controller.ts` | CRUD, replies | ✅ |
| `social.api.ts` | `comments.controller.ts`, `reactions.controller.ts` | comments, reactions | ✅ |
| `favorites.api.ts` | `favorites.controller.ts` | CRUD | ✅ |
| `payments.api.ts` | `payments.controller.ts` | initiate, confirm, receipts, methods | ✅ |
| `support.api.ts` | `support-chat.controller.ts` | threads, messages, inbox | ✅ |
| `settings.api.ts` | `settings.controller.ts` | preferences, notifications, account, password | ✅ |
| `notifications.api.ts` | `notification.controller.ts` | list, read, unread count | ✅ |
| `points.api.ts` | `points.controller.ts` | summary, transactions, leaderboard, admin award/deduct | ✅ |
| `badges.api.ts` | `badge.controller.ts` | my badges, available, user badges | ✅ |
| `rewards.api.ts` | `rewards.controller.ts` | shop, CRUD, redeem, redemptions | ✅ |
| `referrals.api.ts` | `referral.controller.ts` | code, stats, apply | ✅ |
| `dashboard.api.ts` | `dashboard.controller.ts` | stats, recent bookings, revenue | ✅ |
| `cancellation-rules.api.ts` | `cancellation-rule.controller.ts` | CRUD | ✅ |
| `host-fee-absorption.api.ts` | `host-fee-absorption.controller.ts` | CRUD | ✅ |
| `service-fees.api.ts` | `service-fee.controller.ts` | CRUD | ✅ |
| `points-rules.api.ts` | `points-rule.controller.ts` | CRUD | ✅ |
| `email-tracking.api.ts` | `email-tracking.controller.ts` | analytics, details | ✅ |
| `payout-accounts.api.ts` | `payout-account.controller.ts` | CRUD, set default | ✅ |
| `chat.api.ts` | — | WebSocket-based | ✅ |

---

## ⚠️ Synchronization Issues Found

### Backend allows but Frontend doesn't expose

| API Endpoint | Situation | Impact |
|-------------|-----------|--------|
| PUT `/bookings/:id/counter-offer` | No UI for counter-offers | Feature gap — no frontend modal |
| PUT `/bookings/:id/status` | No dedicated UI | ⚠️ Backend has no RBAC on this endpoint |
| GET `/points/user/:userId` | Admin can view user points but no UI exists in admin dashboard | Minor |

### Frontend allows but Backend might block

| UI Element | Situation | Impact |
|-----------|-----------|--------|
| `BookingHistory` hyper filter | Uses `user?.role` instead of `usePermissions().isHyper` | ⚠️ Inconsistent pattern, works but fragile |
| `InvitationForm` role filter | Uses `inviterRole` prop instead of `usePermissions` | ⚠️ Inline logic, not centralized |
| `UserManageModal` isAdmin | Uses `user.role === 'admin'` | ⚠️ Should use `usePermissions().isAdmin` |

### Missing Frontend Coverage

| Backend API | Missing Frontend | Priority |
|------------|-----------------|----------|
| GET `/user-metrics/*` | Duplicate of `/metrics/*`, no separate UI | Low (intentional duplicate) |
| GET `/email-tracking/:id` | Detail view not implemented | Low |
| POST `/service-bookings/availability/:serviceId/bulk` | No bulk UI | Low |

---

## 21. `usePermissions` Hook — Complete Flag Reference

| Flag / Method | Check Logic | Used By |
|--------------|-------------|---------|
| `canCreateProperty` | admin OR (manager + `create_property` perm) | PropertyListing, Dashboard, AdminManagerDashboard |
| `canModifyProperty` | admin OR (manager + `modify_property` perm) | PropertyDetail, HyperEntityManager |
| `canDeleteProperty` | admin OR (hyper + `delete_property` perm) | HyperEntityManager |
| `canPauseProperty` | admin OR `pause_property` perm | HyperEntityManager |
| `canCreateService` | admin OR (manager + `create_service` perm) | ServiceListing, Dashboard, AdminManagerDashboard |
| `canModifyService` | admin OR (manager + `modify_service` perm) | ServiceDetail, HyperEntityManager |
| `canDeleteService` | admin OR (hyper + `delete_service` perm) | HyperEntityManager |
| `canPauseService` | admin OR `pause_service` perm | HyperEntityManager |
| `canMakeBooking` | NOT restricted(`make_booking`) | BookingModal, ServiceBookingForm, ProductModal, PropertyDetail, ServiceDetail |
| `canAcceptBookings` | admin OR `accept_bookings` perm | HostBookings |
| `canRejectBookings` | admin OR `reject_bookings` perm | HostBookings |
| `canRefundUsers` | admin OR `refund_users` perm | HostBookings, BookingHistory |
| `canViewBookings` | admin OR manager OR hyper | BookingHistory |
| `canAnswerDemands` | admin OR `answer_demands` perm | — (backend only) |
| `canDeclineDemands` | admin OR `decline_demands` perm | — (backend only) |
| `canAcceptDemands` | admin OR `accept_demands` perm | — (backend only) |
| `canInviteManager` | admin | AdminManagerDashboard |
| `canInviteGuest` | admin OR manager | AdminManagerDashboard |
| `canCreateGroups` | admin OR hyper | HyperDashboard |
| `canManageGroups` | admin OR hyper | HyperDashboard |
| `canCreateAbsorptionFees` | admin | HyperDashboard |
| `canCreateCancellationRules` | admin | HyperDashboard |
| `canVerifyDocuments` | hyper OR `verify_documents` perm | VerificationReview |
| `canViewAnalytics` | admin OR hyper OR `view_analytics` perm | AdminManagerDashboard |
| `canViewPayments` | admin OR hyper OR `view_payments` perm | PaymentValidation |
| `canManageUsers` | hyper | HyperDashboard, AdminUsersManagement |
| `canManageManagers` | admin OR hyper | AdminUsersManagement |
| `can(perm)` | Generic check across assignments | Any component |
| `canOnProperty(perm, id)` | Scoped check for specific property | Property-specific actions |
| `filterByScope(items)` | Filter items by accessible property IDs | Lists/tables |

---

## 22. Role Hierarchy Summary

```
hyper_admin (all access, platform-wide)
  └── hyper_manager (global scope, assigned permissions)
        └── admin (own properties/services scope)
              └── manager (assigned scope, assigned permissions)
                    └── guest (inherited scope from inviter, read + book)
                          └── user (platform-wide read + book, no management)
```

### Booking Creation Matrix

| Role | Can Book? | Restriction Source |
|------|-----------|-------------------|
| hyper_admin | ❌ | `ROLE_RESTRICTIONS.hyper_admin.make_booking` |
| hyper_manager | ❌ | `ROLE_RESTRICTIONS.hyper_manager.make_booking` |
| admin | ❌ | `ROLE_RESTRICTIONS.admin.make_booking` |
| manager | ✅ | No restriction |
| guest | ✅ | No restriction |
| user | ✅ | No restriction |
