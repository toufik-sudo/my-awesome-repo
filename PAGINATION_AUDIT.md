# Server-Side Pagination — Audit & Tracking

> Last updated: 2026-05-10 (rev 2)
> Scope: backend controllers exposing list endpoints, web (`src/`) and mobile (`mobile/src/`) consumers.
> Convention: `page` (1-indexed, default 1), `limit` (default 20, max 100). Response shape: `{ data, total, page, limit, totalPages }`.
> RBAC: every list endpoint stays behind its existing `@CsrfCheck` + `PermissionGuard` chain; every list UI uses the dynamic RBAC hooks (`useRoleAccess` / `usePermissions.canUI`) — no hard-coded role checks.

---

## 1. Backend controllers — pagination status

| Domain | Controller | Endpoint(s) | Paginated | Notes |
|---|---|---|---|---|
| Bookings / metrics | `bookings/controllers/metrics.controller.ts` | `GET /metrics/...` | ✅ | Uses `paginate()` from `common/pagination.util.ts` |
| Properties | `properties/controllers/properties.controller.ts` | `GET /properties` | ✅ | Filters: city, minTrustStars, scope |
| Property groups | `properties/controllers/property-groups.controller.ts` | `GET /property-groups` | ✅ | |
| Tourism services | `services/controllers/tourism-services.controller.ts` | `GET /services` | ✅ | |
| Service groups | `services/controllers/service-groups.controller.ts` | `GET /service-groups` | ✅ | |
| Cancellation rules | `user/controllers/cancellation-rule.controller.ts` | `GET /cancellation-rules` | ✅ | `getMine` left unpaginated (small) |
| Invitations | `user/controllers/invitation.controller.ts` | `GET /invitations` | ✅ | |
| Payout accounts | `user/controllers/payout-account.controller.ts` | `GET /payout-accounts` | ✅ | `getMine` left unpaginated |
| Permission bindings | `user/controllers/permission-binding.controller.ts` | `GET /permission-bindings` | ✅ | |
| Points rules | `user/controllers/points-rule.controller.ts` | `GET /points-rules` | ✅ | Needs `?ruleType=` filter to migrate web tab UI (TODO) |
| Rewards (shop & redemptions) | `user/controllers/rewards.controller.ts` | `GET /rewards/shop`, `GET /rewards/redemptions` | ✅ | |
| Service fees | `user/controllers/service-fee.controller.ts` | `GET /service-fees` | ✅ | |
| User blames | `user/controllers/user-blame.controller.ts` | `GET /user-blames` | ❌ | Admin moderation queue, low cardinality. **TODO** if grows. |
| Documents (verification queue) | `properties/.../documents` | `GET /documents/pending` | ❌ | Finite review queue. **TODO** if grows. |
| Comments / reviews / reactions | `comments`, `reviews`, `reactions` | various | ⚠️ | Not audited yet — verify per-resource feeds use pagination. |
| Notifications | `notification/...` | `GET /notifications` | ⚠️ | Mobile client now sends `?page&limit` and degrades gracefully when backend returns flat array. **Backend TODO**: wire `paginate()`. |

---

## 2. Web (`src/`) — frontend wiring status

Shared infra:
- `src/modules/shared/types/pagination.ts` — `Paginated<T>`, `DEFAULT_LIMIT=20`, `MAX_LIMIT=100`
- `src/modules/shared/hooks/usePaginatedList.ts` — responsive (numbered desktop / infinite mobile)
- `src/modules/shared/hooks/useInfiniteScroll.ts` — IntersectionObserver sentinel
- `src/modules/shared/components/PaginatedListView.tsx` — high-level list+footer
- `src/modules/shared/components/PaginationFooter.tsx` — footer-only helper

| Page / Module | Wired | Strategy | RBAC gate |
|---|---|---|---|
| `pages/PropertyListing.tsx` | ✅ | Infinite scroll (`usePropertiesInfinite`) | `useRoleAccess('PropertyListPage').canViewPage` |
| `pages/ServiceListing.tsx` | ✅ | Infinite scroll (`useServicesInfinite`) | `useRoleAccess('ServiceListPage').canViewPage` |
| `modules/admin/pages/PayoutAccountsPage.tsx` | ✅ | Responsive (`usePaginatedList`) — hyper only | `canUI(PayoutAccountsPage.*)` |
| `modules/admin/pages/ServiceFeeRulesPage.tsx` | ✅ | Responsive | `canUI(ServiceFeeRulesPage.*)` |
| Hyper / Admin manager dashboards | ✅ | Server-paginated metrics endpoints | `canUI(Dashboard.*.View)` |
| `PointsRulesPage` | ⏸ | Skipped — requires backend `?ruleType` filter | — |
| `CancellationRulesPage` (mine) | ⏸ | Personal short list — not migrated | — |
| `GroupsManagement`, `ServiceGroupsManagement` | ⏸ | Tab-filtered — needs `?scope/tab` server param | — |
| `RbacSettingsPage` | ⏸ | Pending audit | — |
| Bookings list, comments, reviews | ⏸ | Pending audit | — |

---

## 3. Mobile (`mobile/src/`) — frontend wiring status

Shared infra:
- `mobile/src/hooks/usePaginatedList.ts` — FlatList-friendly (`onEndReached` + `RefreshControl`); RBAC-gated via `permKey` → `usePermissions().canUI(permKey)`.
- Defaults aligned with backend: `page=1`, `limit=20`, `MAX_LIMIT=100`.

| Screen | Wired | Strategy | RBAC permKey |
|---|---|---|---|
| `screens/PropertyListingScreen.tsx` | ✅ | FlatList infinite scroll via `usePaginatedList` | `MOBILE_UI_PERM.PROPERTY_VIEW` |
| `screens/NotificationsScreen.tsx` | ✅ | FlatList infinite scroll | `MOBILE_UI_PERM.NOTIFICATIONS_VIEW` |
| `screens/VerificationReviewScreen.tsx` | ✅ | FlatList infinite scroll via `documentsApi.getPendingPaginated` (array fallback while backend not paginated). Forbidden view rendered when permission denied. | `MOBILE_UI_PERM.VERIFICATION_REVIEW_VIEW` |
| `screens/ServiceListingScreen.tsx` | ✅ | FlatList infinite scroll via `servicesApi.getAll` | `MOBILE_UI_PERM.SERVICE_VIEW` |
| `screens/SearchScreen.tsx` | ⏸ | Stub — no list yet, will wire when search results land | — |
| `screens/DashboardScreen.tsx` | ⏸ | Metric cards only, no list | — |
| Favorites (`useFavorites`) | ⏸ | Personal "mine" list, low cardinality — not migrated | — |
| Bookings / rewards / chat screens | ⏸ | Not yet implemented in mobile MVP — will be wired with `usePaginatedList` + `permKey` when added | — |
| `screens/PropertyDetailScreen.tsx` (`Comments` block) | ⏸ | Embedded comments list — depends on backend `comments` pagination (TODO §4.1) | — |

> **Mobile coverage status (rev 2):** all currently-implemented list screens are wired. Remaining ⏸ rows are either non-list views, stubs, or features not yet built.

### RBAC integration contract (mobile)

`usePaginatedList({ permKey })` consults `usePermissions().canUI(permKey)`:
- Permission **denied** → `forbidden=true`, no network call. Screens render an "Access denied" view.
- Permissions **still loading** → fetch deferred until `permissionsLoaded` flips true (prevents unauthorized flashes).
- `hyper_admin` short-circuits to allowed (existing `usePermissions` behavior).

---

## 4. Outstanding TODOs

1. **Backend** — apply `paginate()` to: `notification`, `user-blame`, `documents/pending`, `comments`, `reviews`, `reactions`. Mobile `getAllPaginated` / `getPendingPaginated` already degrade gracefully when responses are flat arrays.
2. **Backend filters** — add `?ruleType` (points rules) and `?scope/tab` (groups) so corresponding web tabs can migrate.
3. **Mobile** — once notifications & documents backends are paginated, drop the array-fallback in `notification.api.ts#getAllPaginated` and `properties.api.ts#documentsApi.getPendingPaginated`.
4. **Mobile** — extend `MOBILE_UI_PERM` registry as new list screens land (bookings, rewards, chat); ensure each new screen passes `permKey` to `usePaginatedList`.
5. **Web** — finish migration of `RbacSettingsPage`, bookings list, comments & reviews modules.
6. **Audit** — re-run `scripts/generate-frontend-api-catalog.ts` after each batch and diff against `frontend_api_permissions.md`.
