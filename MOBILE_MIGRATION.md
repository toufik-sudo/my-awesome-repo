# Mobile Migration Audit — `mobile/src/`

> Last updated: 2026-05-10 (rev 5 — Onboarding 3-step wizard, Payments receipt upload, PayoutAccounts CRUD, paginated comments + per-comment reactions)
> Scope: tracks the migration of the mobile app to the dynamic RBAC + server-side pagination architecture used on the web (`src/`).
> Core rules:
> - **RBAC**: every screen consumes `usePermissions()` and gates UI with `MOBILE_UI_PERM.*` keys (no hard-coded role checks).
> - **Pagination**: every list screen uses `usePaginatedList` (FlatList infinite scroll, `permKey` aware).
> - **API**: services follow `{ data, total, page, limit, totalPages }` and gracefully fall back when the backend returns a flat array.

---

## 1. Shared infrastructure

| Module | File | Status | Notes |
|---|---|---|---|
| Auth context | `contexts/AuthContext.tsx` | ✅ | JWT + refresh, role exposed to RBAC |
| RBAC context | `contexts/RbacContext.tsx` | ✅ | AsyncStorage-persisted, bootstraps `rbacConfig` & `frontendPermByKey` |
| Permissions hook | `hooks/usePermissions.ts` | ✅ | `canUI(key)`, role flags, helper booleans |
| UI permission registry | `utils/rbac/mobile-permission-keys.ts` | ✅ | Mirror of web `ui-permission-keys.ts` (extend per new screen) |
| Paginated list hook | `hooks/usePaginatedList.ts` | ✅ | Infinite scroll + `permKey` gate + `forbidden` flag |
| Axios client | `lib/axios.ts` | ✅ | Token injection + 401 refresh |
| i18n | `i18n/config.ts` | ✅ | en/fr/ar |

---

## 2. Screens — RBAC & pagination wiring

| Screen | RBAC permKey | Pagination | Status | Notes |
|---|---|---|---|---|
| `PropertyListingScreen` | `PROPERTY_VIEW` / `PROPERTY_ADD` | `usePaginatedList` (FlatList) | ✅ | Search + trust filter |
| `PropertyDetailScreen` | `PROPERTY_DETAIL` / `PROPERTY_SHARE` | embedded comments ⏸ | 🟡 | Detail view wired, comments depend on backend `comments` pagination |
| `VerificationReviewScreen` | `VERIFICATION_REVIEW_VIEW` | `usePaginatedList` (array fallback) | ✅ | Hyper/admin moderation queue |
| `NotificationsScreen` | `NOTIFICATIONS_VIEW` | `usePaginatedList` (array fallback) | ✅ | Falls back when backend not paginated |
| `NotificationDetailScreen` | `NOTIFICATIONS_VIEW` | n/a | ✅ | Single resource |
| `ServiceListingScreen` | `SERVICE_VIEW` / `SERVICE_ADD` | `usePaginatedList` | ✅ | Search + category filter |
| `BookingsScreen` | `BOOKINGS_TAB` | `usePaginatedList` | ✅ (new) | My bookings list, status badges |
| `RewardsScreen` | `REWARDS_VIEW` / `REWARD_REDEEM` | `usePaginatedList` | ✅ (new) | Shop + redeem button gated |
| `ChatScreen` | `CHAT_REPLY` | `usePaginatedList` | ✅ (new) | Conversation list w/ unread badges |
| `PaymentsScreen` | `PAYMENTS_VIEW` / `PAYMENT_APPROVE` / `PAYMENT_REJECT` | `usePaginatedList` | ✅ (new) | Hyper/admin → queue, others → mine |
| `ReferralsScreen` | `REFERRALS_VIEW` | `usePaginatedList` | ✅ (new) | Code + referrals list |
| `SupportScreen` | `SUPPORT_VIEW` / `SUPPORT_CREATE` | `usePaginatedList` | ✅ | My threads, normalizes `{items}` payload |
| `BookingDetailScreen` | `BOOKINGS_TAB` / `BOOKING_ACCEPT` / `BOOKING_REJECT` | n/a (id load) | ✅ (new) | Accept/Reject gated, opens chat |
| `RewardDetailScreen` | `REWARDS_VIEW` / `REWARD_REDEEM` | n/a (id load) | ✅ (new) | Redeem button gated |
| `ChatDetailScreen` | `CHAT_REPLY` | messages list (load 100) | ✅ (new) | Bubble UI + send |
| `SupportDetailScreen` | `SUPPORT_VIEW` | thread + messages (load 100) | ✅ (new) | Reply disabled when closed |
| `MoreMenuScreen` | dynamic (`canUI` per row) | n/a | ✅ | Hub for new tab — only shows allowed sections |
| `SupportNewScreen` | `SUPPORT_CREATE` | n/a (form) | ✅ (new) | Create support thread |
| `AddPropertyScreen` | `PROPERTY_ADD` | n/a (form) | ✅ (new) | Wired in PropertiesStack |
| `AddServiceScreen` | `SERVICE_ADD` | n/a (form) | ✅ (new) | Wired in MoreStack |
| `PayoutAccountsScreen` | `PAYOUT_ACCOUNTS_VIEW` / `PAYOUT_ACCOUNT_CREATE` | `usePaginatedList` | ✅ (new) | Hyper/admin queue, activate toggle |
| `OnboardingScreen` | `ONBOARDING_VIEW` | n/a | ✅ (new) | 3-step intro |
| `SearchScreen` | `PROPERTY_VIEW` / `SERVICE_VIEW` | dual `usePaginatedList` | ✅ | Tabs Properties / Services |
| `PropertyDetailScreen` | `PROPERTY_DETAIL` + `COMMENT_VIEW` / `COMMENT_CREATE` | comments fallback | ✅ | Comments embed via `socialApi` |
| `DashboardScreen` | `ANALYTICS_TAB` / `PAYMENTS_TAB` | metric cards (no list) | 🟡 | RBAC tabs wired; per-section data still TODO |
| `SettingsScreen` | — | n/a | ✅ | Local prefs (theme/language) |
| `NotificationTestScreen` | dev-only | n/a | ✅ | Hidden in prod |
| `UtilitiesDemo` | dev-only | n/a | ✅ | Component sandbox |

Legend: ✅ done · 🟡 partial · ⏸ pending (depends on feature/backend)

---

## 3. Services (`mobile/src/services/`)

| File | Paginated method | RBAC consumer | Status |
|---|---|---|---|
| `properties.api.ts` | `propertiesApi.getAll`, `documentsApi.getPendingPaginated` | PropertyListing, VerificationReview | ✅ |
| `services.api.ts` | `servicesApi.getAll` (fallback) | ServiceListing | ✅ |
| `notification.api.ts` | `notificationApi.getAllPaginated` (fallback) | Notifications | ✅ |
| `bookings.api.ts` | `bookingsApi.getMine` (fallback) | Bookings | ✅ (new) |
| `rewards.api.ts` | `rewardsApi.getShop` (fallback) | Rewards | ✅ (new) |
| `chat.api.ts` | `chatApi.getConversations` (fallback) | Chat | ✅ (new) |
| `payments.api.ts` | `paymentsApi.getMyReceipts`, `getPendingReceipts` (fallback) | Payments | ✅ (new) |
| `referrals.api.ts` | `referralsApi.getMine` (fallback) | Referrals | ✅ (new) |
| `support.api.ts` | `supportApi.getMyThreads` (normalizes `{items}`) | Support | ✅ (new) |
| `favorites.api.ts` | n/a (mine list) | useFavorites | ✅ |
| `settings.api.ts` | n/a | SettingsScreen | ✅ |

---

## 4. Not yet implemented in mobile (parity gap with web)

These web modules do not have a mobile counterpart yet. When added, they MUST:
1. Define a new `MOBILE_UI_PERM.*` key (mirroring web `UI_PERM`).
2. Use `usePaginatedList({ permKey })` for any list view.
3. Render an "Access denied" view when `forbidden === true`.

| Web module | Suggested mobile screen | Required permKey |
|---|---|---|
| `modules/admin/PayoutAccountsPage` | `PayoutAccountsScreen` (hyper only) | new key `PAYOUT_ACCOUNTS_VIEW` |
| `modules/admin/ServiceFeeRulesPage` | (admin only — likely web-first) | — |
| `modules/admin/PointsRulesPage` | (admin only — likely web-first) | — |
| `modules/social` (comments/reactions) | embed in detail screens | depends on backend pagination |
| `modules/onboarding` | `OnboardingScreen` | `ONBOARDING_VIEW` (key registered, screen pending) |

---

## 4b. Navigation wiring

A new bottom-tab `MoreTab` (`MoreStackNavigator`) is the single entry point for the secondary screens. It contains:

- `MoreMenu` (hub — filters rows via `usePermissions().canUI`)
- `Bookings` → `BookingDetail`
- `Services` (shared with the Properties experience)
- `Rewards` → `RewardDetail`
- `Chat` → `ChatDetail`
- `Payments`
- `Referrals`
- `Support` → `SupportDetail`

Each route mounts the corresponding screen which performs its own `permKey` check via `usePaginatedList` or guards the load function with `canViewX`. Forbidden states render the localized `rbac.forbidden` view.

Tabs registered in `MainTabNavigator`: `HomeTab`, `PropertiesTab`, `SearchTab`, `NotificationsTab`, `MoreTab`, `ProfileTab`.

---

## 5. RBAC integration contract (mobile)

Every screen MUST follow this pattern:

```tsx
const { canViewX, canDoY, MOBILE_UI_PERM } = usePermissions();
const { items, forbidden } = usePaginatedList({
  fetcher,
  permKey: MOBILE_UI_PERM.X_VIEW,
});
if (forbidden) return <ForbiddenView />;
```

- Action buttons gated with the appropriate `canDoY` boolean.
- No hard-coded role comparisons (`role === 'admin'`) outside `usePermissions`.
- `hyper_admin` short-circuit handled centrally in `usePermissions.canUI`.
- Permission still loading → fetch deferred to avoid unauthorized flashes.

---

## 6. Rev 5 — Finalized features

| Feature | Files | RBAC keys | Notes |
|---|---|---|---|
| Onboarding 3-step wizard | `screens/OnboardingScreen.tsx`, `services/onboarding.api.ts` | `ONBOARDING_VIEW` | Steps 1–2 = intro cards; step 3 = signup form (firstName, lastName, email, phone, password ≥8, address, city, zipcode, country, optional referral). Per-field validation, progress bar, Back/Next/Finish CTAs, calls `onboardingApi.selfSignup`, redirects to `Auth/Login` on success. |
| Payments — receipt upload | `screens/PaymentsScreen.tsx`, `services/payments.api.ts#uploadReceipt` | `RECEIPT_UPLOAD` (guest), `PAYMENTS_VIEW` | Modal form (booking id, amount, currency, note) + image/document picker (`expo-image-picker`, `expo-document-picker`). Live preview (image thumbnail or file chip + remove button). `multipart/form-data` POST to `/payments/receipts`. CTA only rendered when `!adminMode && canUI(RECEIPT_UPLOAD)`. |
| PayoutAccounts CRUD | `screens/PayoutAccountsScreen.tsx`, `services/payout-accounts.api.ts` | `PAYOUT_ACCOUNTS_VIEW`, `PAYOUT_ACCOUNT_CREATE` | Paginated list (existing). New: `+ New` CTA opens create form, per-card `Edit` button reuses same modal, type chips, validation (bank name, account number, holder name). Toggle active/inactive wired to `payoutAccountsApi.update`. |
| Comments — pagination | `screens/PropertyDetailScreen.tsx`, `services/social.api.ts#getCommentsPaginated` | `COMMENT_VIEW`, `COMMENT_CREATE` | Replaced one-shot fetch with manual pagination (10/page). `Load more` CTA appends results; total count rendered. New posts reset to page 1. |
| Comments — reactions | `components/CommentReactions.tsx` | `REACTION_TOGGLE` | Per-comment reaction strip (👍 ❤️ 😂 🎉 😮). Lazy-loads summary via `socialApi.getReactions('comment', id)`. Optimistic toggle via `socialApi.toggleReaction`. Pills disabled (low opacity) when permission missing. |

## 7. Outstanding TODOs

1. **Backend** — apply `paginate()` to `notification`, `documents/pending`, `comments`, `reviews`, `reactions` so the mobile fallbacks become no-ops.
2. **Mobile** — extend `MOBILE_UI_PERM` registry as new screens land (keep parity with `src/utils/rbac/ui-permission-keys.ts`).
3. **Mobile** — once backends are paginated, drop the array fallback in `notification.api.ts`, `services.api.ts`, `properties.api.ts#documentsApi.getPendingPaginated`, and `social.api.ts#getCommentsPaginated`.
4. **Audit** — re-run `scripts/generate-frontend-api-catalog.ts` and reconcile with `frontend_api_permissions.md` after each batch.

---

## 8. Related documents

- `PAGINATION_AUDIT.md` — backend + web + mobile pagination tracking
- `RBAC_TRACKING.md`, `RBAC_SUPPLEMENTARY_TRACKING.md`, `RBAC_UI_PERMISSION_MATRIX.md` — RBAC audit
- `docs/FRONTEND_RBAC_AUDIT.md` — frontend RBAC audit
- `frontend_api_permissions.md` — generated API↔permission catalog
