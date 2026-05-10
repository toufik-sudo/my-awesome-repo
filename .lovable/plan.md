## Problem

The RBAC pipeline (PermissionGuard → ScopeFilterService) is wired correctly for every role, BUT a `manager` (and `guest` / `hyper_manager`) currently sees **zero services** as soon as the inviter admin hasn't explicitly opened the Permissions editor and saved a row in `manager_permissions`.

Your stated rule is the opposite:

> If no scope found OR scope = `all` for that user → access to all the properties and services owned by the invitor.

Today this is only honoured when at least one `manager_permissions` row exists. With zero rows we return `[]` and block everything. That is why "manager doesn't see its own services" and is the same reason it will silently break bookings, comments, reactions, points, promos, fees, escrow, disputes, etc. — they all funnel through the same scope filter.

## Goal

Add an "inviter-inheritance fallback" so the scope resolver always finds the correct inviter admin(s) for a `manager` / `guest` / `hyper_manager`, even when their scoped-permissions table is empty for the requested key. Hyper_admin and admin behavior is unchanged. `user` stays platform-wide-published-only as confirmed.

## Behavior matrix (after change)

| Role | Scope returned by `effective*Ids` |
|---|---|
| `hyper_admin` | `null` (no filter) |
| `admin` | own properties / services only (`hostId` / `providerId`) |
| `hyper_manager` | union of `hyper_manager_permissions`; `scope='all'` ⇒ `null`. If empty ⇒ inherit assigner hyper_admin's whole platform = `null`. |
| `manager` | union of all granted `manager_permissions` rows (multi-inviter). If empty for the requested key ⇒ union over every other granted row touching that resource type. If still empty AND the user has at least one inviter admin (via `invitations.invitedBy` or any historical `assignedById`) ⇒ inherit each inviter admin's full inventory. |
| `guest` | same multi-inviter union logic as manager. |
| `user` | `null` (platform-wide; controllers keep `status='published'`). |
| Anonymous | `null`. |

`scope='all'` semantics are preserved:
- `hyper_manager` + `all` ⇒ platform-wide (`null`)
- `manager` / `guest` + `all` ⇒ inviter's full inventory (already handled by the existing `case 'all'` branch).

The only new behavior is the **empty-perms fallback**, which makes the rule "no scope = inherit inviter" actually fire when there are zero rows at all.

## Technical changes

All edits are backend-only inside the RBAC layer. No controller changes needed because every relevant service (`tourism-services`, `properties`, `service-bookings`, `bookings`, `comments`, `reviews`, `escrow`, `disputes`, etc.) already calls `effectivePropertyIds` / `effectiveServiceIds` (or `resolve*Ids`).

### 1. `backend/src/user/services/roles.service.ts`

Add a small helper:

```ts
async getInviterAdminIds(userId: number, role: 'manager' | 'guest'): Promise<number[]>
```

Resolution order:
1. Distinct `assignedById` from `manager_permissions` (or `guest_permissions`) — covers users that already had at least one row.
2. If none, distinct `invitedBy` from the `invitations` table where `invitedUserId = userId` AND inviter has role `admin` (status accepted/active).
3. De-duplicate, return `number[]`.

### 2. `backend/src/rbac/scope-context.ts`

Extend `ScopeContext` with a lazily-populated field:

```ts
inviterAdminIds?: number[];
```

Populate it inside `PermissionGuard` for `manager` / `guest` only (cheap — one indexed query, cached per request). For `hyper_manager` set it to the assigner hyper_admin (or just leave undefined → treat as `null` global).

### 3. `backend/src/rbac/services/scope-filter.service.ts`

Update `effectivePropertyIds` / `effectiveServiceIds`:

```ts
if (userRole === 'manager' || userRole === 'guest') {
  const scopedPerms = getScopedPerms(scopeCtx);
  if (scopedPerms.length === 0) {
    // Empty grants → fall back to inviter admin(s) full inventory
    return this.expandInviterInventory(
      scopeCtx.inviterAdminIds ?? [], 'property', userRole, userId
    );
  }
  const ids = await this.resolvePropertyIds(scopedPerms, permissionKey, userRole, userId);
  // resolve* already returns [] when nothing matches; if empty AND user has
  // inviters, fall back to inviter inventory (rule: "no scope = inviter").
  if (ids && ids.length === 0 && scopeCtx.inviterAdminIds?.length) {
    return this.expandInviterInventory(
      scopeCtx.inviterAdminIds, 'property', userRole, userId
    );
  }
  return ids;
}

if (userRole === 'hyper_manager') {
  const scopedPerms = getScopedPerms(scopeCtx);
  if (scopedPerms.length === 0) return null;            // inherits hyper_admin scope
  return this.resolvePropertyIds(scopedPerms, permissionKey, userRole, userId);
}
```

`expandInviterInventory(inviterIds, kind)` queries `propertyRepo.find({ where: { hostId: In(inviterIds) }, select:['id'] })` (and the equivalent for services). Already used internally — just extracted into a helper.

Same change in `effectiveServiceIds`.

### 4. Tests / verification

- Trigger the existing scope-fallback logger so the dashboard explicitly shows when the empty-perms fallback fires (`reason: 'Scoped role has no permissions seeded — inheriting inviter admin inventory.'`).
- Manually verify with a freshly-invited manager (no perms saved): `GET /tourism-services` returns the inviter admin's services with all statuses (because `canSeeAllStatuses` is already true for managers).

## Out of scope

- No changes to controllers, no changes to seed scripts, no new permission keys.
- No changes to `admin` / `hyper_admin` / `user` behavior.
- No UI changes.

After approval I will implement the three edits and confirm with a build.
