# RBAC API Inventory — Complete Backend Endpoint Documentation

> **Generated**: 2026-04-04 | **Source of truth** for all backend API endpoints, guards, roles, permissions, and scope.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔓 | Public (no auth) |
| 🔐 | Authenticated (JwtAuthGuard) |
| 🛡️ | PermissionGuard (JWT + role + permission check) |
| 👑 | RequireRole decorator |
| 📋 | RequirePermission decorator |
| 🎫 | IS_BOOKING_CREATE metadata |

---

## 1. App (Root)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/` | None (CsrfInterceptor) | Any | — | — | Health check, returns "Hello" |

---

## 2. Auth (`auth.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| POST | `/auth/register` | 🔓 Public | Any | — | — | User registration |
| POST | `/auth/login` | 🔓 Public | Any | — | — | Returns JWT tokens |
| POST | `/auth/refresh-token` | 🔓 Public | Any | — | — | Refresh access token |
| POST | `/auth/forgot-password` | 🔓 Public | Any | — | — | Send reset email |
| POST | `/auth/reset-password` | 🔓 Public | Any | — | — | Reset password with token |
| GET | `/auth/me` | 🔐 JwtAuthGuard | Any authenticated | — | self | Current user info |
| POST | `/auth/logout` | 🔐 JwtAuthGuard | Any authenticated | — | self | Invalidate session |

---

## 3. SSO (`sso.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| POST | `/auth/sso/token` | 🔓 Public + SsoEnabledGuard | Any | — | — | Exchange auth code for tokens |
| GET | `/auth/sso/userinfo` | 🔓 Public + SsoEnabledGuard | Any | — | — | Fetch user info from SSO token |
| POST | `/auth/sso/refresh` | 🔓 Public + SsoEnabledGuard | Any | — | — | Refresh SSO token |
| POST | `/auth/sso/logout` | 🔓 Public + SsoEnabledGuard | Any | — | — | SSO logout |

---

## 4. User (`user.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| PUT | `/user/language` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Update language preference |
| POST | `/user/avatar` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Upload avatar (multipart) |
| DELETE | `/user/avatar` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Remove avatar |
| POST | `/user/profile/complete` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Complete profile fields |

---

## 5. Roles Management (`roles.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/roles/users` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | hyper=global, admin=own | List users with roles |
| PUT | `/roles/users/:userId/role` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Change user role |
| GET | `/roles/managers/assignments` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin=own managers | List manager assignments |
| POST | `/roles/managers/assignments` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin=own scope | Create manager assignment |
| PUT | `/roles/managers/assignments/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Update assignment |
| DELETE | `/roles/managers/assignments/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Delete assignment |
| GET | `/roles/managers/assignments/:id/permissions` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Get assignment permissions |
| PUT | `/roles/managers/assignments/:id/permissions` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Update permissions |
| GET | `/roles/managers/assignable-permissions` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | — | List assignable permissions |

---

## 6. Invitation (`invitation.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| POST | `/invitations` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin, manager | — | admin scope | Create invitation |
| GET | `/invitations` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin=own | List invitations |
| DELETE | `/invitations/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Cancel invitation |
| POST | `/invitations/accept` | 🔓 Public | Any | — | — | Accept invitation via token |

---

## 7. Referral (`referral.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/referrals/code` | 🛡️ PermissionGuard | Any authenticated | — | self | Get own referral code |
| GET | `/referrals/stats` | 🛡️ PermissionGuard | Any authenticated | — | self | Get referral stats |
| POST | `/referrals/apply` | 🛡️ PermissionGuard | Any authenticated | — | self | Apply a referral code |

---

## 8. Properties (`properties.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/properties` | 🔓 Public | Any | — | — | List properties with filters |
| GET | `/properties/admin` | 🛡️ PermissionGuard | 👑 admin, manager, hyper_admin, hyper_manager | — | admin=own, manager=assigned | Admin property list |
| GET | `/properties/:id` | 🔓 Public | Any | — | — | Property details |
| POST | `/properties` | 🛡️ PermissionGuard | 👑 admin, manager | 📋 create_property (manager) | admin scope | Create property |
| PUT | `/properties/:id` | 🛡️ PermissionGuard | 👑 admin, manager | 📋 modify_property | ownership | Update property |
| PUT | `/properties/:id/prices` | 🛡️ PermissionGuard | 👑 admin, manager | 📋 modify_prices | ownership | Update pricing |
| PUT | `/properties/:id/photos` | 🛡️ PermissionGuard | 👑 admin, manager | 📋 modify_photos | ownership | Update photos |
| PUT | `/properties/:id/availability` | 🛡️ PermissionGuard | 👑 admin, manager | 📋 manage_availability | ownership | Manage availability |
| GET | `/properties/:id/availability` | 🔓 Public | Any | — | — | Get availability |
| PUT | `/properties/:id/pause` | 🛡️ PermissionGuard | 👑 admin, manager, hyper_admin, hyper_manager | 📋 pause_property | ownership | Pause property |
| DELETE | `/properties/:id` | 🛡️ PermissionGuard | 👑 admin, hyper_admin, hyper_manager | 📋 delete_property | admin=own, hyper=global | Delete property |
| POST | `/properties/:id/promo-alerts` | 🛡️ PermissionGuard | Any authenticated | — | self | Subscribe to promo alerts |
| DELETE | `/properties/:id/promo-alerts` | 🛡️ PermissionGuard | Any authenticated | — | self | Unsubscribe promo alerts |
| GET | `/properties/:id/promos` | 🔓 Public | Any | — | — | Get active promos |

---

## 9. Property Groups (`property-groups.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/property-groups` | 🛡️ PermissionGuard | Any authenticated | — | — | List groups |
| GET | `/property-groups/:id` | 🛡️ PermissionGuard | Any authenticated | — | — | Get group details |
| POST | `/property-groups` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin scope | Create group |
| PUT | `/property-groups/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Update group |
| DELETE | `/property-groups/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Delete group |
| POST | `/property-groups/:id/properties` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Add property to group |
| DELETE | `/property-groups/:id/properties/:propertyId` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Remove property from group |

---

## 10. Dashboard (`dashboard.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/dashboard/stats` | 🔐 JwtAuthGuard | Any authenticated | — | self/admin | Dashboard statistics |
| GET | `/dashboard/recent-bookings` | 🔐 JwtAuthGuard | Any authenticated | — | self/admin | Recent bookings |
| GET | `/dashboard/revenue` | 🔐 JwtAuthGuard | Any authenticated | — | admin scope | Revenue data |

---

## 11. Document Validation (`document-validation.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/document-validation/pending` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | List pending documents |
| PUT | `/document-validation/:id/approve` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | 📋 verify_documents | global | Approve document |
| PUT | `/document-validation/:id/reject` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | 📋 verify_documents | global | Reject document |

---

## 12. Hyper Management (`hyper-management.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/hyper-management/properties` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | All properties |
| PUT | `/hyper-management/properties/:id/status` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Change property status |
| DELETE | `/hyper-management/properties/:id` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Delete any property |
| GET | `/hyper-management/services` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | All services |
| PUT | `/hyper-management/services/:id/status` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Change service status |
| DELETE | `/hyper-management/services/:id` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Delete any service |

---

## 13. Bookings (`bookings.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/bookings` | 🛡️ PermissionGuard | admin, manager, hyper | 📋 answer_demands (propertyId, query) | scoped | List bookings |
| GET | `/bookings/my` | 🛡️ PermissionGuard | Any authenticated | — | self | Get own bookings |
| GET | `/bookings/:id` | 🛡️ PermissionGuard | Any authenticated | — | — | Get booking by ID |
| POST | `/bookings` | 🛡️ PermissionGuard | manager, guest, user | — | self | Create booking |
| PUT | `/bookings/:id/accept` | 🛡️ PermissionGuard | admin, manager | 📋 accept_demands (propertyId, body) | scoped | Accept booking |
| PUT | `/bookings/:id/decline` | 🛡️ PermissionGuard | admin, manager | 📋 decline_demands (propertyId, body) | scoped | Decline booking |
| PUT | `/bookings/:id/counter-offer` | 🛡️ PermissionGuard | admin, manager | 📋 accept_demands (propertyId, body) | scoped | Counter-offer |
| PUT | `/bookings/:id/refund` | 🛡️ PermissionGuard | admin, manager, hyper | 📋 refund_users (propertyId, body) | scoped | Refund booking |
| PUT | `/bookings/:id/status` | 🛡️ PermissionGuard | Any authenticated | — | — | ⚠️ Generic status update — needs RBAC |
| GET | `/bookings/availability/:propertyId` | 🔓 Public | Any | — | — | Check availability |

---

## 14. Metrics — Bookings (`metrics.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/metrics/users` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated user metrics |
| GET | `/metrics/bookings` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated booking metrics |
| GET | `/metrics/properties` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated property metrics |
| GET | `/metrics/services` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated service metrics |
| GET | `/metrics/revenue` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Revenue breakdown |
| GET | `/metrics/summary` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Platform summary |

---

## 15. Metrics — Users (`user/metrics.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/user-metrics/users` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated user list |
| GET | `/user-metrics/bookings` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated booking list |
| GET | `/user-metrics/properties` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated property list |
| GET | `/user-metrics/services` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Paginated service list |
| GET | `/user-metrics/revenue` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Revenue breakdown |
| GET | `/user-metrics/summary` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Platform summary |

---

## 16. Tourism Services (`tourism-services.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/services` | 🔓 Public | Any | — | — | List services with filters |
| GET | `/services/categories` | 🔓 Public | Any | — | — | Service categories |
| GET | `/services/:id` | 🔓 Public | Any | — | — | Service details |
| POST | `/services` | 🛡️ PermissionGuard + JwtAuthGuard | 👑 admin, manager | 📋 create_service (manager) | admin scope | Create service |
| PUT | `/services/:id` | 🛡️ PermissionGuard + JwtAuthGuard | 👑 admin, manager | 📋 modify_service | ownership | Update service |
| PUT | `/services/:id/pause` | 🛡️ PermissionGuard + JwtAuthGuard | 👑 admin, manager, hyper_admin, hyper_manager | 📋 pause_service | ownership | Pause service |
| DELETE | `/services/:id` | 🛡️ PermissionGuard | 👑 admin, hyper_admin, hyper_manager | — | admin=own, hyper=global | Delete service |

---

## 17. Service Bookings (`service-bookings.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| POST | `/service-bookings` | 🛡️ PermissionGuard | 🎫 IS_BOOKING_CREATE → manager, guest, user | — | self | Create service booking |
| GET | `/service-bookings/my` | 🛡️ PermissionGuard | Any authenticated | — | self | My service bookings |
| GET | `/service-bookings/provider` | 🛡️ PermissionGuard | 👑 admin, manager, hyper_admin, hyper_manager | — | provider scope | Provider bookings |
| GET | `/service-bookings/:id` | 🛡️ PermissionGuard | Any authenticated | — | — | Booking details |
| PUT | `/service-bookings/:id/accept` | 🛡️ PermissionGuard | 👑 admin, manager, hyper_admin, hyper_manager | — | provider | Accept booking |
| PUT | `/service-bookings/:id/decline` | 🛡️ PermissionGuard | 👑 admin, manager, hyper_admin, hyper_manager | — | provider | Decline booking |
| PUT | `/service-bookings/:id/cancel` | 🛡️ PermissionGuard | Any authenticated | — | self | Cancel own booking |
| GET | `/service-bookings/availability/:serviceId` | 🛡️ PermissionGuard | Any authenticated | — | — | Check availability |
| POST | `/service-bookings/availability/:serviceId` | 🛡️ PermissionGuard | 👑 admin, manager | — | provider | Set availability |
| POST | `/service-bookings/availability/:serviceId/bulk` | 🛡️ PermissionGuard | 👑 admin, manager | — | provider | Bulk set availability |

---

## 18. Service Groups (`service-groups.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/service-groups` | 🔐 JwtAuthGuard | Any authenticated | — | — | List groups |
| GET | `/service-groups/:id` | 🔐 JwtAuthGuard | Any authenticated | — | — | Group details |
| POST | `/service-groups` | 🔐 JwtAuthGuard | 👑 hyper_admin, hyper_manager, admin | — | admin scope | Create group |
| PUT | `/service-groups/:id` | 🔐 JwtAuthGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Update group |
| DELETE | `/service-groups/:id` | 🔐 JwtAuthGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Delete group |
| GET | `/service-groups/:id/services` | 🔐 JwtAuthGuard | Any authenticated | — | — | Group services |
| POST | `/service-groups/:id/services` | 🔐 JwtAuthGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Add service |
| DELETE | `/service-groups/:id/services/:serviceId` | 🔐 JwtAuthGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Remove service |

---

## 19. Reviews (`reviews.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/reviews/property/:propertyId` | 🔓 Public | Any | — | — | Property reviews |
| GET | `/reviews/:id` | 🛡️ PermissionGuard | Any authenticated | — | — | Single review |
| POST | `/reviews` | 🛡️ PermissionGuard | Any authenticated | — | self | Create review |
| POST | `/reviews/:id/reply` | 🛡️ PermissionGuard | admin, manager | 📋 reply_reviews (propertyId, body) | scoped | Reply to review |

---

## 20. Comments (`comments.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/comments/:targetType/:targetId` | 🛡️ PermissionGuard | Any authenticated | — | — | Get comments |
| POST | `/comments` | 🛡️ PermissionGuard | Any authenticated | — | self | Create comment |
| PUT | `/comments/:id` | 🛡️ PermissionGuard | Any authenticated | — | ⚠️ ownership needed | Update comment |
| DELETE | `/comments/:id` | 🛡️ PermissionGuard | Any authenticated | — | ⚠️ ownership needed | Delete comment |

---

## 21. Reactions (`reactions.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/reactions/:targetType/:targetId` | 🛡️ PermissionGuard | Any authenticated | — | — | Get reactions |
| POST | `/reactions` | 🛡️ PermissionGuard | Any authenticated | — | self | Toggle reaction |
| DELETE | `/reactions/:targetType/:targetId` | 🛡️ PermissionGuard | Any authenticated | — | self | Remove reaction |

---

## 22. Favorites (`favorites.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/favorites` | 🔐 JwtAuthGuard | Any authenticated | — | self | Get favorites |
| POST | `/favorites` | 🔐 JwtAuthGuard | Any authenticated | — | self | Add favorite |
| DELETE | `/favorites/:id` | 🔐 JwtAuthGuard | Any authenticated | — | self | Remove favorite |

---

## 23. Rankings (`rankings.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/rankings` | 🔐 AuthGuard('jwt') | Any authenticated | — | global | Get leaderboard |
| GET | `/rankings/me` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Get own rank |

---

## 24. Points (`points.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/points/me` | 🛡️ PermissionGuard | Any authenticated | — | self | Points summary |
| GET | `/points/me/transactions` | 🛡️ PermissionGuard | Any authenticated | — | self | Transaction history |
| GET | `/points/leaderboard` | 🛡️ PermissionGuard | Any authenticated | — | global | Points leaderboard |
| POST | `/points/admin/award` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Award bonus points |
| POST | `/points/admin/deduct` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Deduct points |
| GET | `/points/user/:userId` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | global/admin | Get user's points |

---

## 25. Badges (`badge.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/badges/me` | 🛡️ PermissionGuard | Any authenticated | — | self | My badges |
| GET | `/badges/available` | 🛡️ PermissionGuard | Any authenticated | — | — | Available badges |
| GET | `/badges/user/:userId` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin+ | User's badges |

---

## 26. Rewards (`rewards.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/rewards/shop` | 🛡️ PermissionGuard | Any authenticated | — | — | Rewards catalog |
| GET | `/rewards` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | All rewards (admin) |
| GET | `/rewards/:id` | 🛡️ PermissionGuard | Any authenticated | — | — | Reward details |
| POST | `/rewards` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Create reward |
| PUT | `/rewards/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Update reward |
| DELETE | `/rewards/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Delete reward |
| POST | `/rewards/:id/redeem` | 🛡️ PermissionGuard | Any authenticated | — | self | Redeem reward |
| GET | `/rewards/my/redemptions` | 🛡️ PermissionGuard | Any authenticated | — | self | My redemptions |

---

## 27. Payments (`payments.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| POST | `/payments/initiate` | 🛡️ PermissionGuard | Any authenticated | — | self | Initiate payment |
| POST | `/payments/confirm` | 🛡️ PermissionGuard | Any authenticated | — | self | Confirm payment |
| GET | `/payments/my` | 🛡️ PermissionGuard | Any authenticated | — | self | My payments |
| GET | `/payments/booking/:bookingId` | 🛡️ PermissionGuard | Any authenticated | — | — | Booking payments |
| POST | `/payments/upload-receipt` | 🛡️ PermissionGuard | Any authenticated | — | self | Upload payment receipt |
| GET | `/payments/pending-receipts` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Pending receipts |
| PUT | `/payments/:id/approve-receipt` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | 📋 validate_payments | global | Approve receipt |
| PUT | `/payments/:id/reject-receipt` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | 📋 validate_payments | global | Reject receipt |
| GET | `/payments/methods` | 🔓 Public | Any | — | — | Available payment methods |
| GET | `/payments/transfer-account` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Get transfer account |
| PUT | `/payments/transfer-account` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Upsert transfer account |

---

## 28. Payout Accounts (`payout-account.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/payout-accounts` | 🛡️ PermissionGuard | Any authenticated | — | self | Get own payout accounts |
| POST | `/payout-accounts` | 🛡️ PermissionGuard | Any authenticated | — | self | Create payout account |
| PUT | `/payout-accounts/:id` | 🛡️ PermissionGuard | Any authenticated | — | self | Update payout account |
| DELETE | `/payout-accounts/:id` | 🛡️ PermissionGuard | Any authenticated | — | self | Delete payout account |
| PUT | `/payout-accounts/:id/default` | 🛡️ PermissionGuard | Any authenticated | — | self | Set as default |

---

## 29. Profiles (`profiles.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/profiles/me` | 🔐 JwtAuthGuard | Any authenticated | — | self | My profile |
| GET | `/profiles/:userId` | 🔐 JwtAuthGuard | Any authenticated | — | — | Public profile |
| PUT | `/profiles` | 🔐 JwtAuthGuard | Any authenticated | — | self | Update profile |
| POST | `/profiles/verify-identity` | 🔐 JwtAuthGuard | Any authenticated | — | self | Submit verification |
| GET | `/profiles/host/:userId` | 🔐 JwtAuthGuard | Any authenticated | — | — | Host profile |

---

## 30. Notifications (`notification.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/notifications` | 🔐 JwtAuthGuard | Any authenticated | — | self | Get notifications |
| PUT | `/notifications/:id/read` | 🔐 JwtAuthGuard | Any authenticated | — | self | Mark as read |
| PUT | `/notifications/read-all` | 🔐 JwtAuthGuard | Any authenticated | — | self | Mark all read |
| GET | `/notifications/unread-count` | 🔐 JwtAuthGuard | Any authenticated | — | self | Unread count |

---

## 31. Support Chat (`support-chat.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| POST | `/support/threads` | 🛡️ PermissionGuard | Any authenticated | — | self | Create thread |
| GET | `/support/threads/my` | 🛡️ PermissionGuard | Any authenticated | — | self | My threads |
| GET | `/support/threads/inbox` | 🛡️ PermissionGuard | 👑 hyper_admin, admin | — | admin=own, hyper=global | Admin inbox |
| GET | `/support/threads/:id` | 🛡️ PermissionGuard | Any authenticated | — | participation | Thread details |
| POST | `/support/threads/:id/messages` | 🛡️ PermissionGuard | Any authenticated | — | participation | Send message |
| Patch | `/support/threads/:id/status` | 🛡️ PermissionGuard | 👑 hyper_admin, admin | — | admin scope | Update thread status |
| Patch | `/support/threads/:id/assign` | 🛡️ PermissionGuard | 👑 hyper_admin, admin | — | admin scope | Assign thread |

---

## 32. Settings (`settings.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/settings` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Get settings |
| PUT | `/settings/preferences` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Update preferences |
| PUT | `/settings/notifications` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Notification settings |
| PUT | `/settings/account` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Account info |
| PUT | `/settings/password` | 🔐 AuthGuard('jwt') | Any authenticated | — | self | Change password |

---

## 33. Sessions (`session.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/sessions` | 🛡️ PermissionGuard | Any authenticated | — | self | Active sessions |
| DELETE | `/sessions/:id` | 🛡️ PermissionGuard | Any authenticated | — | self | Terminate session |
| DELETE | `/sessions` | 🛡️ PermissionGuard | Any authenticated | — | self | Terminate all others |

---

## 34. Cancellation Rules (`cancellation-rule.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/cancellation-rules` | 🛡️ PermissionGuard | Any authenticated | — | — | List rules |
| GET | `/cancellation-rules/:id` | 🛡️ PermissionGuard | Any authenticated | — | — | Rule details |
| POST | `/cancellation-rules` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin scope | Create rule |
| PUT | `/cancellation-rules/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Update rule |
| DELETE | `/cancellation-rules/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Delete rule |

---

## 35. Host Fee Absorption (`host-fee-absorption.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/host-fee-absorption` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin=own, hyper=global | List rules |
| POST | `/host-fee-absorption` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin scope | Create rule |
| PUT | `/host-fee-absorption/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | ownership | Update rule |
| DELETE | `/host-fee-absorption/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | Delete rule |

---

## 36. Service Fee Rules (`service-fee.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/service-fees` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | List fee rules |
| POST | `/service-fees` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Create fee rule |
| PUT | `/service-fees/:id` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Update fee rule |
| DELETE | `/service-fees/:id` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Delete fee rule |

---

## 37. Points Rules (`points-rule.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/points-rules` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager | — | global | List rules |
| POST | `/points-rules` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Create rule |
| PUT | `/points-rules/:id` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Update rule |
| DELETE | `/points-rules/:id` | 🛡️ PermissionGuard | 👑 hyper_admin | — | global | Delete rule |

---

## 38. Email Tracking (`email-tracking.controller.ts`)

| Method | Route | Guard | Roles | Permissions | Scope | Notes |
|--------|-------|-------|-------|-------------|-------|-------|
| GET | `/email-tracking` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | admin scope | Email analytics |
| GET | `/email-tracking/:id` | 🛡️ PermissionGuard | 👑 hyper_admin, hyper_manager, admin | — | — | Email details |

---

## ⚠️ Issues Found

| # | Issue | Severity | Endpoint |
|---|-------|----------|----------|
| 1 | `PUT /bookings/:id/status` — No role/permission restriction, any authenticated user can change status | 🔴 Critical | bookings.controller.ts:72 |
| 2 | `PUT /comments/:id` — No ownership validation, any user can edit any comment | 🟡 Medium | comments.controller.ts |
| 3 | `DELETE /comments/:id` — No ownership validation | 🟡 Medium | comments.controller.ts |
| 4 | `GET /bookings/:id` — No scope check, any user can read any booking | 🟡 Medium | bookings.controller.ts:25 |
| 5 | `GET /service-bookings/:id` — No scope check | 🟡 Medium | service-bookings.controller.ts |
