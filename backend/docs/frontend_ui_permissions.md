# Frontend UI Permissions Audit

> Generated: 2026-04-07
> Source: `backend/src/scripts/seed-frontend-ui-permissions.ts`
> Frontend registry: `src/utils/rbac/ui-permission-keys.ts`

## Summary

| Module | Count |
|--------|-------|
| properties | 24 |
| services | 15 |
| bookings | 22 |
| dashboard | 28 |
| users | 14 |
| roles | 8 |
| rbac | 6 |
| fees | 12 |
| points | 6 |
| rewards | 5 |
| referrals | 3 |
| communication | 5 |
| support | 4 |
| payout | 4 |
| groups | 10 |
| documents | 3 |
| email_tracking | 1 |
| settings | 4 |
| shared | 10 |
| navigation | 3 |
| **Total** | **~187** |

## Complete Permission Key Map

### Properties Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.PropertyListPage.Page.View` | `PROPERTY_LIST_VIEW` | all | View property listing page |
| `ui.PropertyListPage.Header.Button.Add` | `PROPERTY_ADD` | admin | Add property button |
| `ui.PropertyListPage.Card.Button.Edit` | `PROPERTY_EDIT` | admin, manager | Edit property button |
| `ui.PropertyListPage.Card.Button.Delete` | `PROPERTY_DELETE` | hyper_admin, admin | Delete property button |
| `ui.PropertyListPage.Card.Button.Pause` | `PROPERTY_PAUSE` | admin, manager | Pause property button |
| `ui.PropertyListPage.Card.Button.Duplicate` | `PROPERTY_DUPLICATE` | admin | Duplicate property button |
| `ui.PropertyListPage.Map.Widget.View` | `PROPERTY_MAP` | all | View map on property list |
| `ui.PropertyListPage.Filter.Dropdown.Filter` | `PROPERTY_FILTER` | all | Filter properties dropdown |
| `ui.PropertyListPage.Filter.Dropdown.Sort` | `PROPERTY_SORT` | all | Sort properties dropdown |
| `ui.PropertyDetailPage.Page.View` | `PROPERTY_DETAIL_VIEW` | all | View property detail page |
| `ui.PropertyDetailPage.Actions.Button.Edit` | `PROPERTY_DETAIL_EDIT` | admin, manager | Edit from detail |
| `ui.PropertyDetailPage.Actions.Button.Delete` | `PROPERTY_DETAIL_DELETE` | hyper_admin, admin | Delete from detail |
| `ui.PropertyDetailPage.Actions.Button.Pause` | `PROPERTY_DETAIL_PAUSE` | admin, manager | Pause from detail |
| `ui.PropertyDetailPage.Actions.Button.Duplicate` | `PROPERTY_DETAIL_DUPLICATE` | admin | Duplicate from detail |
| `ui.PropertyDetailPage.Actions.Button.Share` | `PROPERTY_SHARE` | authenticated | Share property |
| `ui.PropertyDetailPage.Actions.Button.Favorite` | `PROPERTY_FAVORITE` | authenticated | Add to favorites |
| `ui.PropertyDetailPage.Booking.Modal.Open` | `PROPERTY_BOOKING_MODAL` | manager, user, guest | Open booking modal |
| `ui.PropertyDetailPage.Reviews.Section.View` | `PROPERTY_REVIEWS` | all | View reviews section |
| `ui.PropertyDetailPage.Reviews.Button.Add` | `PROPERTY_REVIEW_ADD` | user, guest | Add review |
| `ui.PropertyDetailPage.Comments.Section.View` | `PROPERTY_COMMENTS` | authenticated | View comments section |
| `ui.PropertyDetailPage.Comments.Button.Add` | `PROPERTY_COMMENT_ADD` | authenticated | Add comment |
| `ui.PropertyDetailPage.Gallery.Widget.View` | `PROPERTY_GALLERY` | all | View photo gallery |
| `ui.PropertyDetailPage.Pricing.Section.View` | `PROPERTY_PRICING` | all | View pricing section |
| `ui.PropertyDetailPage.Availability.Widget.View` | `PROPERTY_AVAILABILITY` | all | View availability |

### Services Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.ServiceListPage.Page.View` | `SERVICE_LIST_VIEW` | all | View service listing page |
| `ui.ServiceListPage.Header.Button.Add` | `SERVICE_ADD` | admin | Add service button |
| `ui.ServiceListPage.Card.Button.Edit` | `SERVICE_EDIT` | admin, manager | Edit service button |
| `ui.ServiceListPage.Card.Button.Delete` | `SERVICE_DELETE` | hyper_admin, admin | Delete service button |
| `ui.ServiceListPage.Card.Button.Pause` | `SERVICE_PAUSE` | admin, manager | Pause service button |
| `ui.ServiceListPage.Card.Button.Duplicate` | `SERVICE_DUPLICATE` | admin | Duplicate service button |
| `ui.ServiceListPage.Map.Widget.View` | `SERVICE_MAP` | all | View map on service list |
| `ui.ServiceDetailPage.Page.View` | `SERVICE_DETAIL_VIEW` | all | View service detail page |
| `ui.ServiceDetailPage.Actions.Button.Edit` | `SERVICE_DETAIL_EDIT` | admin, manager | Edit service from detail |
| `ui.ServiceDetailPage.Actions.Button.Delete` | `SERVICE_DETAIL_DELETE` | hyper_admin, admin | Delete service from detail |
| `ui.ServiceDetailPage.Actions.Button.Pause` | `SERVICE_DETAIL_PAUSE` | admin, manager | Pause service from detail |
| `ui.ServiceDetailPage.Actions.Button.Duplicate` | `SERVICE_DETAIL_DUPLICATE` | admin | Duplicate from detail |
| `ui.ServiceDetailPage.Booking.Modal.Open` | `SERVICE_BOOKING_MODAL` | manager, user, guest | Open service booking |

### Bookings Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.BookingsPage.Tab.View` | `BOOKINGS_TAB` | host roles | Show bookings tab |
| `ui.BookingsPage.Detail.Button.Accept` | `BOOKING_ACCEPT` | admin, manager | Accept booking |
| `ui.BookingsPage.Detail.Button.Reject` | `BOOKING_REJECT` | admin, manager | Reject booking |
| `ui.BookingsPage.Detail.Button.Refund` | `BOOKING_REFUND` | hyper_admin, admin | Refund booking |
| `ui.BookingsPage.Detail.Button.CounterOffer` | `BOOKING_COUNTER_OFFER` | admin, manager | Counter-offer |
| `ui.BookingCalendarPage.Page.View` | `CALENDAR_VIEW` | host roles | View calendar |
| `ui.BookingCalendarPage.Filters.Dropdown.FilterHost` | `CALENDAR_FILTER_HOST` | hyper only | Filter by host |
| `ui.BookingModal.Modal.Open` | `BOOKING_MODAL_OPEN` | manager, user, guest | Open booking modal |
| `ui.HostBookings.Page.View` | `HOST_BOOKINGS_VIEW` | host roles | Host bookings |
| `ui.HostBookings.Actions.Button.Accept` | `HOST_BOOKING_ACCEPT` | admin, manager | Accept (host view) |
| `ui.HostBookings.Actions.Button.Reject` | `HOST_BOOKING_REJECT` | admin, manager | Reject (host view) |
| `ui.HostBookings.Actions.Button.Refund` | `HOST_BOOKING_REFUND` | hyper_admin, admin | Refund (host view) |

### Dashboard Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.Dashboard.Page.View` | `DASHBOARD_VIEW` | authenticated | Access dashboard |
| `ui.Dashboard.Analytics.Tab.View` | `ANALYTICS_TAB` | admin_up | Analytics tab |
| `ui.Dashboard.Payments.Tab.View` | `PAYMENTS_TAB` | admin_up | Payments tab |
| `ui.Dashboard.Revenue.Widget.View` | `REVENUE_WIDGET` | admin_up | Revenue widget |
| `ui.HyperDashboard.Page.View` | `HYPER_DASHBOARD_VIEW` | hyper | Hyper dashboard |
| `ui.HyperDashboard.PaymentValidation.Tab.View` | `HYPER_PAYMENT_VALIDATION` | hyper | Payment validation |
| `ui.HyperDashboard.PaymentValidation.Button.Approve` | `HYPER_PAYMENT_APPROVE` | hyper | Approve payment |
| `ui.HyperDashboard.PaymentValidation.Button.Reject` | `HYPER_PAYMENT_REJECT` | hyper | Reject payment |
| `ui.HyperDashboard.Users.Tab.View` | `HYPER_USERS_TAB` | hyper | Users management |
| `ui.HyperDashboard.Properties.Tab.View` | `HYPER_PROPERTIES_TAB` | hyper | Properties tab |
| `ui.HyperDashboard.Properties.Button.Delete` | `HYPER_PROPERTY_DELETE` | hyper_admin | Delete property |
| `ui.HyperDashboard.Verification.Tab.View` | `HYPER_VERIFICATION_TAB` | hyper | Verification tab |
| `ui.HyperDashboard.Assignments.Tab.View` | `HYPER_ASSIGNMENTS_TAB` | hyper | Assignments tab |

### RBAC Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.RbacSettings.Page.View` | `RBAC_VIEW` | hyper | View RBAC settings |
| `ui.RbacSettings.Page.Edit` | `RBAC_EDIT` | hyper_admin | Edit RBAC settings |
| `ui.RbacSettings.Matrix.Toggle.TogglePermission` | `RBAC_TOGGLE` | hyper_admin | Toggle permission |
| `ui.RbacSettings.Matrix.Dropdown.SetScope` | `RBAC_SET_SCOPE` | hyper_admin | Set scope |
| `ui.RbacSettings.Actions.Button.Save` | `RBAC_SAVE` | hyper_admin | Save changes |
| `ui.RbacSettings.Actions.Button.ReloadCache` | `RBAC_RELOAD_CACHE` | hyper_admin | Reload cache |

### Fees Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.ServiceFeesPage.Page.View` | `SERVICE_FEES_VIEW` | hyper | View service fees |
| `ui.ServiceFeesPage.Header.Button.Add` | `SERVICE_FEES_ADD` | hyper_admin | Add fee rule |
| `ui.ServiceFeesPage.Card.Button.Edit` | `SERVICE_FEES_EDIT` | hyper_admin | Edit fee rule |
| `ui.ServiceFeesPage.Card.Button.Delete` | `SERVICE_FEES_DELETE` | hyper_admin | Delete fee rule |
| `ui.HostFeeAbsorptionPage.Page.View` | `FEE_ABSORPTION_VIEW` | admin | View absorption |
| `ui.HostFeeAbsorptionPage.Header.Button.Add` | `FEE_ABSORPTION_ADD` | admin | Add absorption |
| `ui.HostFeeAbsorptionPage.Card.Button.Edit` | `FEE_ABSORPTION_EDIT` | admin | Edit absorption |
| `ui.HostFeeAbsorptionPage.Card.Button.Delete` | `FEE_ABSORPTION_DELETE` | admin | Delete absorption |
| `ui.CancellationRulesPage.Page.View` | `CANCELLATION_RULES_VIEW` | admin | View rules |
| `ui.CancellationRulesPage.Header.Button.Add` | `CANCELLATION_RULES_ADD` | admin | Add rule |
| `ui.CancellationRulesPage.Card.Button.Edit` | `CANCELLATION_RULES_EDIT` | admin | Edit rule |
| `ui.CancellationRulesPage.Card.Button.Delete` | `CANCELLATION_RULES_DELETE` | admin | Delete rule |

### Users & Roles Module

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.UsersPage.Tab.View` | `USERS_TAB` | hyper | Users tab |
| `ui.UsersPage.List.Button.Invite` | `USER_INVITE` | admin_up | Invite button |
| `ui.UsersPage.List.Button.ConvertGuest` | `USER_CONVERT_GUEST` | admin | Convert guest |
| `ui.UsersPage.Detail.Button.AssignRole` | `USER_ASSIGN_ROLE` | hyper_admin, admin | Assign role |
| `ui.UsersPage.Detail.Button.ManagePermissions` | `USER_MANAGE_PERMS` | hyper_admin, admin | Manage perms |
| `ui.ManagerAssignments.Page.View` | `ASSIGNMENTS_VIEW` | admin_up | Assignments page |
| `ui.ManagerAssignments.Header.Button.Create` | `ASSIGNMENT_CREATE` | admin | Create assignment |

### Shared Components

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.ProductCard.Actions.Button.Favorite` | `PRODUCT_CARD_FAVORITE` | authenticated | Favorite on card |
| `ui.ProductCard.Actions.Button.Share` | `PRODUCT_CARD_SHARE` | authenticated | Share on card |
| `ui.ProductModal.Modal.View` | `PRODUCT_MODAL_VIEW` | all | Product modal |
| `ui.ProductModal.Actions.Button.Book` | `PRODUCT_MODAL_BOOK` | manager, user, guest | Book from modal |
| `ui.DynamicComments.Form.Button.Post` | `COMMENT_POST` | authenticated | Post comment |
| `ui.DynamicComments.Item.Button.Edit` | `COMMENT_EDIT` | authenticated | Edit own comment |
| `ui.DynamicComments.Item.Button.Delete` | `COMMENT_DELETE` | authenticated | Delete own comment |
| `ui.DynamicReactions.Actions.Button.Toggle` | `REACTION_TOGGLE` | authenticated | Toggle reaction |
| `ui.Basket.Widget.View` | `BASKET_VIEW` | manager, user, guest | View basket |
| `ui.NotificationsPanel.Widget.View` | `NOTIFICATIONS_VIEW` | authenticated | Notifications |

### Navigation

| Permission Key | Constant | Roles | Description |
|---------------|----------|-------|-------------|
| `ui.DynamicNavMenu.Admin.Link.View` | `NAV_ADMIN` | admin_up | Admin nav section |
| `ui.DynamicNavMenu.Hyper.Link.View` | `NAV_HYPER` | hyper | Hyper nav section |
| `ui.DynamicNavMenu.Host.Link.View` | `NAV_HOST` | host | Host nav section |

## Usage in Components

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function PropertyListPage() {
  const { canUI, UI_PERM } = usePermissions();

  return (
    <>
      {canUI(UI_PERM.PROPERTY_ADD) && <AddPropertyButton />}
      {canUI(UI_PERM.PROPERTY_EDIT) && <EditButton />}
      {canUI(UI_PERM.PROPERTY_DELETE) && <DeleteButton />}
      {canUI(UI_PERM.PROPERTY_MAP) && <MapWidget />}
    </>
  );
}
```

## Seed Command

```bash
npx ts-node -r tsconfig-paths/register backend/src/scripts/seed-frontend-ui-permissions.ts
```
