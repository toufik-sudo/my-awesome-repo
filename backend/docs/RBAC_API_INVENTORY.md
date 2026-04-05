# RBAC_API_INVENTORY.md — Auto-generated Permission Inventory

> Last updated: 2026-04-05
> Source of truth: `backend/src/rbac/permission-registry.ts`

## Backend API Permissions

| Key | Resource | Action | Description |
|-----|----------|--------|-------------|
| `backend.PropertiesController.findAll.GET` | properties | read | List all properties |
| `backend.PropertiesController.findOne.GET` | properties | read_one | Get single property |
| `backend.PropertiesController.create.POST` | properties | create | Create a property |
| `backend.PropertiesController.update.PUT` | properties | update | Update a property |
| `backend.PropertiesController.delete.DELETE` | properties | delete | Delete a property |
| `backend.PropertiesController.pause.PUT` | properties | pause | Pause / unpause a property |
| `backend.PropertiesController.duplicate.POST` | properties | duplicate | Duplicate a property |
| `backend.ServicesController.findAll.GET` | services | read | List all services |
| `backend.ServicesController.findOne.GET` | services | read_one | Get single service |
| `backend.ServicesController.create.POST` | services | create | Create a service |
| `backend.ServicesController.update.PUT` | services | update | Update a service |
| `backend.ServicesController.delete.DELETE` | services | delete | Delete a service |
| `backend.ServicesController.pause.PUT` | services | pause | Pause / unpause a service |
| `backend.ServicesController.duplicate.POST` | services | duplicate | Duplicate a service |
| `backend.BookingsController.findAll.GET` | bookings | read | List bookings |
| `backend.BookingsController.findOne.GET` | bookings | read_one | Get single booking |
| `backend.BookingsController.create.POST` | bookings | create | Create a booking |
| `backend.BookingsController.accept.PUT` | bookings | accept | Accept a booking |
| `backend.BookingsController.reject.PUT` | bookings | reject | Reject a booking |
| `backend.BookingsController.cancel.PUT` | bookings | cancel | Cancel a booking |
| `backend.BookingsController.refund.POST` | bookings | refund | Refund a booking |
| `backend.RolesController.getStats.GET` | roles | read_stats | Dashboard statistics |
| `backend.RolesController.getUserRoles.GET` | roles | read_user_role | Get user role |
| `backend.RolesController.assignRole.POST` | roles | assign | Assign a role |
| `backend.RolesController.removeRole.DELETE` | roles | remove | Remove a role |
| `backend.RolesController.listUsers.GET` | users | read | List all users |
| `backend.RolesController.listAdmins.GET` | users | read_admins | List admins |
| `backend.RolesController.listManagers.GET` | users | read_managers | List managers |
| `backend.InvitationController.create.POST` | invitations | create | Send an invitation |
| `backend.InvitationController.findAll.GET` | invitations | read | List invitations |
| `backend.InvitationController.accept.POST` | invitations | accept | Accept invitation |
| `backend.InvitationController.revoke.DELETE` | invitations | revoke | Revoke invitation |
| `backend.InvitationController.convertGuestToUser.POST` | invitations | convert_guest | Convert guest → user |
| `backend.RbacConfigController.listBackend.GET` | rbac_config | read_backend | List backend RBAC perms |
| `backend.RbacConfigController.listFrontend.GET` | rbac_config | read_frontend | List frontend RBAC perms |
| `backend.RbacConfigController.updateBackend.PUT` | rbac_config | update_backend | Update backend RBAC perm |
| `backend.RbacConfigController.updateFrontend.PUT` | rbac_config | update_frontend | Update frontend RBAC perm |
| `backend.RbacConfigController.reloadCache.POST` | rbac_config | reload_cache | Force reload RBAC cache |
| `backend.ServiceFeeController.findAll.GET` | service_fees | read | List service fee rules |
| `backend.ServiceFeeController.create.POST` | service_fees | create | Create service fee rule |
| `backend.ServiceFeeController.update.PUT` | service_fees | update | Update service fee rule |
| `backend.ServiceFeeController.delete.DELETE` | service_fees | delete | Delete service fee rule |
| `backend.PointsRuleController.findAll.GET` | points_rules | read | List points rules |
| `backend.PointsRuleController.create.POST` | points_rules | create | Create points rule |
| `backend.PointsRuleController.update.PUT` | points_rules | update | Update points rule |
| `backend.PointsRuleController.delete.DELETE` | points_rules | delete | Delete points rule |
| `backend.RewardsController.findAll.GET` | rewards | read | List rewards |
| `backend.RewardsController.create.POST` | rewards | create | Create reward |
| `backend.RewardsController.update.PUT` | rewards | update | Update reward |
| `backend.RewardsController.delete.DELETE` | rewards | delete | Delete reward |
| `backend.RewardsController.redeem.POST` | rewards | redeem | Redeem a reward |

## Statistics

- **Total backend keys**: 55+
- **Total frontend keys**: 40+
- **Total bindings**: 20+

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run permissions:sync` | Sync registry → DB → Redis |
| `npm run rbac:validate` | Check for hardcoded strings |
