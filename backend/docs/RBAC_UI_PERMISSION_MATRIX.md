# RBAC_UI_PERMISSION_MATRIX.md — Frontend UI Permission Matrix

> Last updated: 2026-04-05
> Source of truth: `src/utils/rbac/ui-permission-keys.ts`

## UI Permission Keys

| Key | Constant | Description |
|-----|----------|-------------|
| `ui.PropertyListPage.Header.Button.Add` | `UI_PERM.PROPERTY_ADD` | Show "Add Property" button |
| `ui.PropertyListPage.Card.Button.Edit` | `UI_PERM.PROPERTY_EDIT` | Show edit button on property card |
| `ui.PropertyListPage.Card.Button.Delete` | `UI_PERM.PROPERTY_DELETE` | Show delete button on property card |
| `ui.PropertyListPage.Card.Button.Pause` | `UI_PERM.PROPERTY_PAUSE` | Show pause button on property card |
| `ui.PropertyListPage.Card.Button.Duplicate` | `UI_PERM.PROPERTY_DUPLICATE` | Show duplicate button on property card |
| `ui.ServiceListPage.Header.Button.Add` | `UI_PERM.SERVICE_ADD` | Show "Add Service" button |
| `ui.ServiceListPage.Card.Button.Edit` | `UI_PERM.SERVICE_EDIT` | Show edit button on service card |
| `ui.ServiceListPage.Card.Button.Delete` | `UI_PERM.SERVICE_DELETE` | Show delete button on service card |
| `ui.ServiceListPage.Card.Button.Pause` | `UI_PERM.SERVICE_PAUSE` | Show pause button on service card |
| `ui.ServiceListPage.Card.Button.Duplicate` | `UI_PERM.SERVICE_DUPLICATE` | Show duplicate button on service card |
| `ui.BookingsPage.Tab.View` | `UI_PERM.BOOKINGS_TAB` | Show bookings tab |
| `ui.BookingsPage.Detail.Button.Accept` | `UI_PERM.BOOKING_ACCEPT` | Show accept booking button |
| `ui.BookingsPage.Detail.Button.Reject` | `UI_PERM.BOOKING_REJECT` | Show reject booking button |
| `ui.BookingsPage.Detail.Button.Refund` | `UI_PERM.BOOKING_REFUND` | Show refund booking button |
| `ui.Dashboard.Analytics.Tab.View` | `UI_PERM.ANALYTICS_TAB` | Show analytics tab |
| `ui.Dashboard.Payments.Tab.View` | `UI_PERM.PAYMENTS_TAB` | Show payments tab |
| `ui.Dashboard.Revenue.Widget.View` | `UI_PERM.REVENUE_WIDGET` | Show revenue widget |
| `ui.UsersPage.Tab.View` | `UI_PERM.USERS_TAB` | Show users management tab |
| `ui.UsersPage.List.Button.Invite` | `UI_PERM.USER_INVITE` | Show invite user button |
| `ui.UsersPage.List.Button.ConvertGuest` | `UI_PERM.USER_CONVERT_GUEST` | Show convert guest → user |
| `ui.RbacSettings.Page.View` | `UI_PERM.RBAC_VIEW` | Show RBAC settings page |
| `ui.RbacSettings.Page.Edit` | `UI_PERM.RBAC_EDIT` | Allow editing RBAC settings |
| `ui.ServiceFeesPage.Page.View` | `UI_PERM.SERVICE_FEES_VIEW` | Show service fees page |
| `ui.PointsRulesPage.Page.View` | `UI_PERM.POINTS_RULES_VIEW` | Show points rules page |
| `ui.RewardsPage.Page.View` | `UI_PERM.REWARDS_VIEW` | Show rewards page |
| `ui.RewardsPage.Detail.Button.Redeem` | `UI_PERM.REWARD_REDEEM` | Show redeem button |
| `ui.ReferralsPage.Page.View` | `UI_PERM.REFERRALS_VIEW` | Show referrals page |
| `ui.PropertyDetailPage.Actions.Button.Share` | `UI_PERM.PROPERTY_SHARE` | Show share property button |
| `ui.ChatPage.Page.Reply` | `UI_PERM.CHAT_REPLY` | Allow replying in chat |
| `ui.ReviewsPage.Page.Reply` | `UI_PERM.REVIEWS_REPLY` | Allow replying to reviews |
| `ui.PayoutAccountsPage.Page.View` | `UI_PERM.PAYOUT_VIEW` | Show payout accounts page |
| `ui.PayoutAccountsPage.Header.Button.Add` | `UI_PERM.PAYOUT_ADD` | Show add payout account button |

## Role × Permission Matrix (Default)

| Permission | hyper_admin | hyper_manager | admin | manager | user | guest |
|------------|:-----------:|:-------------:|:-----:|:-------:|:----:|:-----:|
| PROPERTY_ADD | ✅ | ❌ | ✅ | ⚙️ | ❌ | ❌ |
| PROPERTY_EDIT | ✅ | ⚙️ | ✅ | ⚙️ | ❌ | ❌ |
| PROPERTY_DELETE | ✅ | ⚙️ | ✅ | ❌ | ❌ | ❌ |
| SERVICE_ADD | ✅ | ❌ | ✅ | ⚙️ | ❌ | ❌ |
| BOOKINGS_TAB | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| BOOKING_ACCEPT | ✅ | ❌ | ✅ | ⚙️ | ❌ | ❌ |
| ANALYTICS_TAB | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| USERS_TAB | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| RBAC_VIEW | ✅ | ✅ | ⚙️ | ❌ | ❌ | ❌ |
| RBAC_EDIT | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| REWARD_REDEEM | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

Legend: ✅ = always allowed | ❌ = denied | ⚙️ = conditional (per assignment/scope)

## API ↔ UI Bindings

| API Key | UI Key | Module |
|---------|--------|--------|
| `backend.PropertiesController.create.POST` | `ui.PropertyListPage.Header.Button.Add` | properties |
| `backend.PropertiesController.update.PUT` | `ui.PropertyListPage.Card.Button.Edit` | properties |
| `backend.PropertiesController.delete.DELETE` | `ui.PropertyListPage.Card.Button.Delete` | properties |
| `backend.BookingsController.accept.PUT` | `ui.BookingsPage.Detail.Button.Accept` | bookings |
| `backend.BookingsController.reject.PUT` | `ui.BookingsPage.Detail.Button.Reject` | bookings |
| `backend.InvitationController.create.POST` | `ui.UsersPage.List.Button.Invite` | users |
| `backend.RewardsController.redeem.POST` | `ui.RewardsPage.Detail.Button.Redeem` | rewards |
| `backend.ReferralController.shareProperty.POST` | `ui.PropertyDetailPage.Actions.Button.Share` | referrals |

## Usage in Components

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function PropertyListPage() {
  const { canUI, UI_PERM } = usePermissions();

  return (
    <>
      {canUI(UI_PERM.PROPERTY_ADD) && <AddPropertyButton />}
      {canUI(UI_PERM.PROPERTY_EDIT) && <EditButton />}
    </>
  );
}
```
