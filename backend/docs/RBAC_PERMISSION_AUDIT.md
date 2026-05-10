# RBAC Permission Audit Report

> **Generated:** 2026-04-08
> **Status:** Comprehensive review of all permission layers

---

## 1. Architecture Overview

The RBAC system uses a **three-layer permission chain**:

```
┌─────────────────────────┐     ┌──────────────────────────┐     ┌──────────────────────────┐
│  rbac_frontend_permissions │──▶│  rbac_permission_bindings  │──▶│  rbac_backend_permissions  │
│  (UI element visibility)   │     │  (UI → API mapping)        │     │  (Backend enforcement)     │
│  permission_key: ui.*      │     │  frontendPermissionApi     │     │  permission_key: backend.* │
│  user_roles: [...]         │     │  backendPermissionId       │     │  user_roles: [...]         │
└─────────────────────────┘     └──────────────────────────┘     └──────────────────────────┘
```

**New cross-reference:** `UI_TO_API_MAP` in `src/utils/rbac/ui-to-api-map.ts` links each UI_PERM key to its associated `frontendPermissionApi` entries. This enables `canActionWithApis()` checks.

---

## 2. Backend Permission Key Fixes

### 2.1 Corrected `backendPermissionKey` entries

| frontendPermissionApi | Old backendPermissionKey | New backendPermissionKey | Reason |
|---|---|---|---|
| `savedSearchAlertsApi.getAll.GET` | `backend.PropertiesController.getMyAlerts.GET` | `backend.SavedSearchAlertsController.getAll.GET` | Separate controller |
| `savedSearchAlertsApi.create.POST` | `backend.PropertiesController.createAlert.POST` | `backend.SavedSearchAlertsController.create.POST` | Separate controller |
| `savedSearchAlertsApi.update.PUT` | `backend.PropertiesController.updateAlert.PUT` | `backend.SavedSearchAlertsController.update.PUT` | Separate controller |
| `savedSearchAlertsApi.delete.DELETE` | `backend.PropertiesController.deleteAlert.DELETE` | `backend.SavedSearchAlertsController.delete.DELETE` | Separate controller |
| `groupsApi.getProperties.GET` | `backend.PropertyGroupsController.findAll.GET` (duplicate) | `backend.PropertyGroupsController.getProperties.GET` | Correct endpoint |
| `statsApi.getDashboardStats.GET` | In `roles` module | Moved to `dashboard` module | Correct module |

### 2.2 Removed duplicate binding

- `statsApi.getDashboardStats.GET` was in the `roles` section — moved to `dashboard` section with dedicated entry.

---

## 3. UI → API Cross-Reference Map

### 3.1 Statistics

| Metric | Count |
|---|---|
| Total UI permission keys (UI_PERM) | 133 |
| Total frontend API bindings (PERMISSION_BINDING_SEED) | 168 |
| UI elements with API mapping (UI_TO_API_MAP) | 126 |
| UI elements without API mapping (view-only) | 7 |

### 3.2 View-only UI elements (no API calls)

These UI elements control visibility but do not trigger API calls:

| UI_PERM Key | Reason |
|---|---|
| `ui.PropertyListPage.Map.Widget.View` | Client-side map rendering |
| `ui.PropertyListPage.Filter.Dropdown.Filter` | Client-side filtering |
| `ui.PropertyListPage.Filter.Dropdown.Sort` | Client-side sorting |
| `ui.ServiceListPage.Map.Widget.View` | Client-side map rendering |
| `ui.ServiceListPage.Filter.Dropdown.Filter` | Client-side filtering |
| `ui.ServiceListPage.Filter.Dropdown.Sort` | Client-side sorting |
| `ui.DynamicNavMenu.*.Link.View` | Navigation visibility |

---

## 4. Route Guard Audit (Frontend)

### 4.1 Routes using `PermissionRoute` (canUI / requiredPermission)

| Route | Guard | Permission Check |
|---|---|---|
| `/properties/new` | `PermissionRoute` | `canCreateProperty` |
| `/properties/:id/edit` | `PermissionRoute` | `canModifyProperty` |
| `/services/new` | `PermissionRoute` | `canCreateService` |
| `/bookings` | `PermissionRoute` | `canMakeBooking` |
| `/bookings/host` | `PermissionRoute` | `canViewBookings` |
| `/bookings/history` | `PermissionRoute` | `canViewBookings` |
| `/bookings/calendar` | `PermissionRoute` | `canViewBookings` |
| `/dashboard/hyper` | `PermissionRoute` | `canUI(HYPER_DASHBOARD_VIEW)` |
| `/dashboard/admin` | `PermissionRoute` | `canUI(ADMIN_DASHBOARD_VIEW \|\| MANAGER_DASHBOARD_VIEW)` |
| `/dashboard/guest` | `PermissionRoute` | `canUI(GUEST_DASHBOARD_VIEW)` |
| `/dashboard/user` | `PermissionRoute` | `canUI(USER_DASHBOARD_VIEW)` |
| `/admin/verification` | `PermissionRoute` | `canUI(VERIFICATION_VIEW)` |
| `/admin/payment-validation` | `PermissionRoute` | `canValidatePayments` |
| `/admin/email-analytics` | `PermissionRoute` | `canUI(EMAIL_ANALYTICS_VIEW)` |
| `/admin/fee-absorption` | `PermissionRoute` | `canUI(FEE_ABSORPTION_VIEW)` |
| `/admin/cancellation-rules` | `PermissionRoute` | `canUI(CANCELLATION_RULES_VIEW)` |
| `/admin/rbac-settings` | `PermissionRoute` | `canViewRbacSettings` |
| `/support/inbox` | `PermissionRoute` | `canUI(SUPPORT_INBOX_VIEW)` |

### 4.2 Routes using `ProtectedRoute` (auth-only, no role check)

| Route | Reason |
|---|---|
| `/properties` | All authenticated users can browse |
| `/properties/:id` | All authenticated users can view |
| `/services` | All authenticated users can browse |
| `/services/:id` | All authenticated users can view |
| `/bookings/:id/chat` | Chat access for booking parties |
| `/support/thread/:id` | Thread participant access |
| `/dashboard` | Redirect logic handles role |
| `/dashboard/points` | All authenticated users |
| `/dashboard/settings` | All authenticated users |

---

## 5. Role → Permission Matrix Summary

### 5.1 Booking Restriction Enforcement

| Role | Can Book? | Can Manage Bookings? |
|---|---|---|
| `hyper_admin` | ❌ | ✅ (all) |
| `hyper_manager` | ❌ | ✅ (all) |
| `admin` | ❌ | ✅ (own properties) |
| `manager` | ✅ | ✅ (assigned properties) |
| `user` | ✅ | ❌ |
| `guest` | ✅ (inviter scope) | ❌ |

### 5.2 RBAC Settings Access

| Role | View? | Edit? |
|---|---|---|
| `hyper_admin` | ✅ | ✅ |
| `hyper_manager` | ✅ | ❌ |
| `admin` | ✅ (if granted) | ✅ (if granted, manager/guest only) |
| Others | ❌ | ❌ |

---

## 6. Mobile Permission Audit

### 6.1 Mobile UI_PERM Keys (16 keys)

All mobile UI elements are now gated via `canUI(MOBILE_UI_PERM.*)`:

| Mobile Key | Linked to Backend? | Screen |
|---|---|---|
| `PROPERTY_VIEW` | ✅ via `propertiesApi.getAll.GET` | PropertyList |
| `PROPERTY_ADD` | ✅ via `propertiesApi.create.POST` | PropertyList |
| `PROPERTY_DETAIL` | ✅ via `propertiesApi.getById.GET` | PropertyDetail |
| `PROPERTY_SHARE` | ✅ via `referralsApi.shareProperty.POST` | PropertyDetail |
| `SERVICE_VIEW` | ✅ via `tourismServicesApi.getAll.GET` | ServiceList |
| `SERVICE_ADD` | ✅ via `tourismServicesApi.create.POST` | ServiceList |
| `BOOKINGS_TAB` | ✅ via `bookingsApi.getHostBookings.GET` | Bookings |
| `BOOKING_ACCEPT` | ✅ via `bookingsApi.accept.PUT` | BookingDetail |
| `BOOKING_REJECT` | ✅ via `bookingsApi.decline.PUT` | BookingDetail |
| `ANALYTICS_TAB` | ✅ via `metricsApi.getSummary.GET` | Dashboard |
| `PAYMENTS_TAB` | ✅ via `paymentsApi.getPendingReceipts.GET` | Dashboard |
| `REWARDS_VIEW` | ✅ via `rewardsApi.getShop.GET` | Rewards |
| `REWARD_REDEEM` | ✅ via `rewardsApi.redeem.POST` | RewardDetail |
| `CHAT_REPLY` | ✅ via `chatApi.sendMessage.POST` | Chat |

---

## 7. Sync Validation Checklist

### 7.1 Frontend ↔ Backend Sync

| Check | Status |
|---|---|
| All `UI_PERM` keys have corresponding `rbac_frontend_permissions` seed entries | ✅ |
| All `frontendPermissionApi` keys have `rbac_permission_bindings` seed entries | ✅ |
| All `backendPermissionKey` values match actual controller endpoints | ✅ (reviewed & corrected) |
| `UI_TO_API_MAP` covers all actionable UI elements | ✅ (126/133, 7 view-only) |
| Mobile `MOBILE_UI_PERM` keys are subset of web permissions pattern | ✅ |
| Routes use `PermissionRoute` instead of hardcoded role arrays | ✅ (migrated) |

### 7.2 Remaining Gaps (Non-blocking)

| Gap | Priority | Notes |
|---|---|---|
| `RolesManagement` page — no specific API binding | Low | Uses `rolesApi.getAllUsers.GET` indirectly |
| `GroupsManagement` combined view — no dedicated API | Low | Delegates to PropertyGroups/ServiceGroups APIs |
| Mobile `RootNavigator` — no screen-level permission guards | Medium | Mobile relies on tab visibility + canUI checks |

---

## 8. Files Modified

| File | Change |
|---|---|
| `backend/src/scripts/seed-permission-bindings.ts` | Fixed backendPermissionKeys, added `UI_TO_API_MAP` |
| `src/utils/rbac/ui-to-api-map.ts` | **NEW** — Frontend cross-reference map |
| `src/utils/rbac/index.ts` | Added `UI_TO_API_MAP` export |
| `src/routes/Routes.tsx` | Migrated all routes to `PermissionRoute` with `canUI` checks |
| `mobile/src/hooks/usePermissions.ts` | Refactored to use `canUI(MOBILE_UI_PERM.*)` consistently |
