# Plan

Three batches: RBAC bindings UX, dialog alignment, admin booking-on-behalf-of-guest.

## 1. RBAC Settings — Bindings tab

**File:** `src/modules/admin/pages/RbacSettingsPage.tsx`

- Wrap bindings table in a fixed-height scroll container (`max-h-[600px] overflow-auto`) with `<TableHeader className="sticky top-0 bg-background z-10 shadow-sm">` so the header stays visible while scrolling.
- Improve grid styling: zebra rows, monospace columns aligned, hover highlight, badges polished, role chips wrapped.
- Add a new column **"Backend"** with a button (`variant="outline" size="sm"` + `ArrowRight` icon). On click:
  - `setActiveTab('backend')`
  - `setBackendSearch(binding.backendPermissionKey)` (and clear `backendModule`)
  - Scrolls to top.
- Replace the bindings search `<Input>` with an autocomplete combobox:
  - Reuse existing `Command` + `Popover` shadcn primitives (already in project) or `SearchableSelect`.
  - Suggestions sourced from current `bindings` (`frontendPermissionApi`, `backendPermissionKey`, `module`, `endpoint_url`), deduped, ranked by prefix match.
  - Free-text still allowed; selecting a suggestion sets `bindingsSearch`.

## 2. AddPropertyWizard — confirm modal alignment

**File:** `src/modules/admin/pages/AddPropertyWizard.tsx` (line 1293)

- Override `AlertDialogFooter` className to `flex-row justify-end gap-2 sm:gap-3` (no `flex-col-reverse` on mobile) and give Cancel/Confirm matching `min-w-[110px]` so they line up evenly.

## 3. Admin/Manager booking-on-behalf-of-guest

### Backend
**`backend/src/bookings/dtos/create-booking.dto.ts`**
- Add optional `onBehalfOfGuestId?: string` (UUID/numeric string).

**`backend/src/bookings/services/bookings.service.ts` `create()`**
- If `dto.onBehalfOfGuestId` present **and** `scopeCtx.userRole ∈ {admin, manager, hyper_admin, hyper_manager}`:
  - Skip the early "administrative roles cannot create bookings" guard.
  - Validate target user exists and has role `user` or `guest`.
  - Validate scope: managers can only book guests within their assigned properties' scope (reuse existing scope helpers).
  - Use `targetGuestId` instead of caller `guestId` for `booking.guestId`.
  - Force `status = 'accepted'`, set `acceptedAt = now`, `paymentDeadlineAt = now + PAYMENT_DEADLINE_HOURS`, skip the "pending" branch (no host acceptance needed).
  - Send notification to the target guest (`type: 'booking_created_by_admin'`, channel `both`, actionUrl `/bookings/{id}/payment`) — mandatory.
  - Also notify host informationally.
- Otherwise behavior unchanged.

**RBAC**
- Re-seed binding: ensure `bookingsApi.create.POST` is callable by admin/manager (already is for manager; add admin/hyper roles to the existing backend permission via `backend/src/scripts/rbac.seed.ts`).

### Frontend
**New `src/modules/bookings/components/UserGuestPicker.tsx`**
- Combobox (`Command` + `Popover`) with debounced search hitting `adminApi.searchUsers({ q, roles: ['user','guest'], limit: 10 })` (use existing endpoint; if missing, add a thin `GET /users?role=...&q=...`).
- Returns `{ id, fullName, email }`.

**New `src/modules/bookings/components/AdminBookingModal.tsx`**
- Props: `propertyId`, pricing fields, `open`, `onClose`.
- Fields: UserGuestPicker (required), date range, guests, paymentMethod (subset = manual methods), optional message.
- Submits via `bookingsApi.create({ ...dto, onBehalfOfGuestId })`.
- Success toast: "Booking created and validated, awaiting payment by guest". Closes modal.

**Integration**
- `src/pages/PropertyListing.tsx` (admin/manager-visible variant) and `src/modules/properties/...`: add a "Book for guest" action button on each property card (gated by `usePermissions` `ui.PropertyCard.AdminBookForGuest.button`) that opens `AdminBookingModal`.
- Same for `src/pages/ServiceListing.tsx` using a parallel `AdminServiceBookingModal` against `service-bookings.api.ts` (`onBehalfOfGuestId` field added analogously to `backend/src/services/dto/service-booking.dto.ts` and `service-bookings.service.ts`).

### i18n
- Add FR/EN/AR keys: `bookings.adminCreate.title`, `selectGuest`, `created`, `bindings.goToBackend`, etc.

## Out of scope
- No new pages, no existing booking flow refactor, no payment flow changes.

## Files touched (summary)
- `src/modules/admin/pages/RbacSettingsPage.tsx`
- `src/modules/admin/pages/AddPropertyWizard.tsx`
- `backend/src/bookings/dtos/create-booking.dto.ts`
- `backend/src/bookings/services/bookings.service.ts`
- `backend/src/services/dto/service-booking.dto.ts`
- `backend/src/services/services/service-bookings.service.ts`
- `backend/src/scripts/rbac.seed.ts` (add admin/manager roles to booking create)
- `src/modules/bookings/components/UserGuestPicker.tsx` (new)
- `src/modules/bookings/components/AdminBookingModal.tsx` (new)
- `src/modules/bookings/components/AdminServiceBookingModal.tsx` (new)
- `src/pages/PropertyListing.tsx`, `src/pages/ServiceListing.tsx`
- locales `fr.json`, `en.json`, `ar.json`
