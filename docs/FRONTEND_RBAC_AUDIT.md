# FRONTEND_RBAC_AUDIT.md — Frontend RBAC Guard Coverage

> Last updated: 2026-04-12
> Auto-generated audit of `useRoleAccess` / `usePermissions` usage across all frontend components.

## Overview

All frontend permission checks flow through two hooks:

| Hook | Purpose | Source |
|------|---------|--------|
| `usePermissions()` | Core RBAC: role flags, `canUI()`, `canAPI()`, `canAction()`, `canCallApi()` | `src/hooks/usePermissions.ts` |
| `useRoleAccess(componentName)` | Scoped wrapper: `can(sub, el, action)`, `guardAction()`, `guardByKey()`, `guardApi()` | `src/hooks/useRoleAccess.ts` |

Permission keys follow the convention: `ui.<ComponentName>.<SubView?>.<ElementType?>.<ActionName?>`

Registry: `src/utils/rbac/ui-permission-keys.ts` (`UI_PERM` object)

---

## Guard Coverage by Component

### ✅ Pages with `useRoleAccess` — Fully Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `PropertyListing` | `PropertyListPage` | Page view, Add button, Edit/Delete/Pause/Duplicate on cards, Map, Filter, Sort |
| `PropertyDetail` | `PropertyDetailPage` | Page view, Edit/Delete/Pause/Duplicate, Share, Favorite, Booking modal, Reviews, Comments, Gallery |
| `ServiceListing` | `ServiceListPage` | Page view, Add button, Edit/Delete/Pause/Duplicate, Map, Filter, Sort |
| `ServiceDetail` | `ServiceDetailPage` | Page view, Edit/Duplicate, Booking modal, Reviews |
| `MyBookings` | `BookingHistory` | Page view, Cancel button |
| `PointsPage` | `PointsPage` | Page view, Leaderboard widget |
| `Index` (Landing) | — | Public page, no guards needed |
| `NotFound` | — | Public page |
| `ApiDocumentation` | — | Public/dev page |

### ✅ Admin Pages — Fully Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `AdminDashboard` | `AdminDashboard` | Page view, all widgets & nav |
| `HyperManagerDashboard` | `HyperDashboard` | Page view, tabs, user/property/service actions |
| `HyperDashboard` | `HyperDashboard` | Page view, payment validation, users tab, properties tab |
| `ManagerDashboard` | `ManagerDashboard` | Page view, scoped by manager permissions |
| `ManagerAssignments` | `ManagerAssignments` | ✅ **NEW** — Create button, Delete actions guarded |
| `PropertyGroupsManagement` | `PropertyGroupsManagement` | ✅ **NEW** — Create/Edit/Delete buttons guarded via `can()` |
| `ServiceGroupsManagement` | `ServiceGroupsManagement` | ✅ **NEW** — Create/Edit/Delete buttons guarded via `can()` |
| `AdminUsersManagement` | `AdminUsersManagement` | Invite, manage users, role filter |
| `AddPropertyWizard` | `AddPropertyWizard` | Page view, submit |
| `AddServiceWizard` | `AddServiceWizard` | Page view, submit |
| `RbacSettingsPage` | `RbacSettingsPage` | View/Edit guards, toggle permissions, save, reload cache |
| `VerificationReview` | `VerificationReview` | Page view, approve/reject documents |
| `EmailAnalyticsPage` | `EmailAnalyticsPage` | Page view |
| `CancellationRulesPage` | `CancellationRulesPage` | Page view, add/edit/delete rules |
| `PointsRulesPage` | `PointsRulesPage` | Page view, add/edit/delete rules |
| `HostFeeAbsorptionPage` | `HostFeeAbsorptionPage` | Page view, add/edit/delete |
| `ServiceFeeRulesPage` | `ServiceFeesPage` | Page view, add/edit/delete |
| `PayoutAccountsPage` | `PayoutAccountsPage` | Page view, add/edit/delete accounts |

### ✅ Dashboard Components — Fully Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `Dashboard` | `Dashboard` | Analytics tab, Payments tab, Revenue/Bookings/Properties widgets |
| `UserDashboard` | `UserDashboard` | Sections gated by `can()` |
| `GuestDashboard` | `GuestDashboard` | Sections gated by `can()` |

### ✅ Booking Components — Fully Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `BookingHistory` | `HostBookings` | Page view, Accept/Reject/Refund actions |
| `BookingModal` | — | Uses `usePermissions().canMakeBooking` |
| `ServiceBookingForm` | `ServiceBookingForm` | Modal open, submit |

### ✅ Communication Components — Fully Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `BookingChat` | `BookingChat` | Reply gated |
| `SupportInbox` | `SupportInbox` | Page view, reply, status change, create thread |
| `SupportThreadChat` | `SupportThreadChat` | Reply, status change, assign |

### ✅ Rewards & Points — Fully Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `RewardsShop` | `RewardsPage` | View, redeem, admin create/edit/delete |

### ✅ Shared Components — Guarded

| Component | Scope Key | Guards Applied |
|-----------|-----------|----------------|
| `ProductModal` | `ProductModal` | View, Book button |
| `InvitationForm` | `InvitationForm` | Role filtering via `useRoleAccess` |
| `ReviewForm` | `PropertyDetailPage` | ✅ **NEW** — Hidden if user lacks `Reviews.Button.Add` permission |
| `UserStatusActions` | `HyperDashboard` | ✅ **NEW** — Pause/Disable/Delete guarded via `guardAction()` |
| `MainLayout` | `MainLayout` | Sidebar nav items gated by `canUI()` |
| `Settings` | `SettingsPage` | Profile/Notifications/Alerts section visibility |

### ✅ Route-Level Guards — `PermissionRoute`

All admin/protected routes use `<PermissionRoute componentName="...">` wrapper in routes config.
Source: `src/components/PermissionRoute.tsx`

---

## Components Intentionally WITHOUT Guards

These components are either generic/reusable containers or public-facing:

| Component | Reason |
|-----------|--------|
| `DynamicGrid` | Generic data table — guards applied by parent |
| `DynamicForm` | Generic form — guards applied by parent |
| `DynamicComments` | Generic comments — parent passes callbacks (guards at call site) |
| `DynamicImageCropper` | UI utility — no permissions needed |
| `DynamicReactions` | UI utility — parent controls visibility |
| `DynamicTabs` | UI wrapper — tab visibility controlled by parent |
| `ProfileForm` | User's own profile — always allowed |
| `ProfileCompletion` | Onboarding — always allowed |
| `NotificationPreferences` | User's own settings — always allowed |
| `AlertsSettings` | User's own settings — always allowed |
| `OnboardingFlow` | Auth flow — always allowed |
| `ComboboxDemo` | Dev demo — no production use |
| `PopupExample` | Dev demo — no production use |
| `EventCreateModal` / `EventEditModal` | Calendar modals — parent guards calendar access |
| `CreatePermissionModal` | Sub-modal of ManagerAssignments — parent is guarded |
| `PointsRuleFormDialog` | Sub-modal of PointsRulesPage — parent is guarded |
| `RewardFormDialog` | Sub-modal of RewardsManager — parent is guarded |
| `ServiceFeeFormDialog` | Sub-modal of ServiceFeesManager — parent is guarded |
| `PointsRulesManager` | Embedded in PointsRulesPage — parent is guarded |
| `RewardsManager` | Embedded in RewardsShop — parent is guarded |
| `ServiceFeesManager` | Embedded in ServiceFeeRulesPage — parent is guarded |
| `CreateUserModal` | Sub-modal of AdminDashboard — parent is guarded |

---

## Pre-flight API Guards (Axios Interceptor)

The axios interceptor in `src/lib/axios.ts` performs pre-flight RBAC checks before sending mutating API calls:

1. `setRbacCache()` injects backend permission cache + binding map from `usePermissions`
2. On each request, checks `backendPermsCache[permKey]` before hitting the network
3. Blocks denied requests with a toast error instead of a 403 round-trip

---

## Permission Key Registry

All permission keys are centralized in:
- **Frontend**: `src/utils/rbac/ui-permission-keys.ts` → `UI_PERM` constant
- **Mobile**: `mobile/src/utils/rbac/mobile-permission-keys.ts` → `MOBILE_UI_PERM` constant
- **Backend**: `backend/src/rbac/utils/generate-backend-permission-key.ts`

Validate with: `npm run rbac:validate`

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-12 | Added `useRoleAccess` to: `ManagerAssignments`, `PropertyGroupsManagement`, `ServiceGroupsManagement`, `UserStatusActions`, `ReviewForm`. Guarded create/edit/delete/submit actions. Created this audit file. |
| 2026-04-05 | Initial RBAC system with `PermissionGuard`, `usePermissions`, `useRoleAccess` hooks. |
