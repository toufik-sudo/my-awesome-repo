import { AppRole } from '../entity/user.entity';

/**
 * Defines what each role CANNOT do (restrictions).
 * Everything not listed here is implicitly allowed for that role within its scope.
 */
export const ROLE_RESTRICTIONS: Record<AppRole, string[]> = {
  hyper_admin: [
    'invite_manager',
    'create_property',
    'modify_property',
    'create_service',
    'modify_service',
    'create_absorption_fees',
    'create_cancellation_rules',
    'accept_bookings',
    'make_booking',
    'assign_permissions_non_hypermanager',
    'create_property_groups',
  ],
  hyper_manager: [
    'invite_manager',
    'make_booking',
  ],
  admin: [
    'access_other_admin_properties',
    'invite_hyper_admin',
    'invite_hyper_manager',
    'invite_admin',
    'global_document_verification',
    'manage_global_fee_rules',
    'make_booking',
  ],
  manager: [],
  user: [],
  guest: [],
};

/**
 * Backend permission keys that a hyper_admin can assign to hyper_managers.
 */
export const HYPER_MANAGER_ASSIGNABLE_PERMISSIONS: string[] = [
  'backend.PropertiesController.create.POST',
  'backend.PropertiesController.update.PUT',
  'backend.PropertiesController.delete.DELETE',
  'backend.PropertiesController.findOne.GET',
  'backend.PropertiesController.findAll.GET',
  'backend.ServicesController.create.POST',
  'backend.ServicesController.update.PUT',
  'backend.ServicesController.delete.DELETE',
  'backend.ServicesController.findOne.GET',
  'backend.ServicesController.findAll.GET',
  'backend.BookingsController.findAll.GET',
  'backend.BookingsController.accept.PUT',
  'backend.BookingsController.reject.PUT',
  'backend.BookingsController.cancel.PUT',
  'backend.ChatController.sendMessage.POST',
  'backend.ChatController.getMessages.GET',
  'backend.ReviewsController.reply.POST',
  'backend.AnalyticsController.getStats.GET',
  'backend.PaymentsController.validate.POST',
  'backend.VerificationController.verify.POST',
  'backend.ServiceFeeController.findAll.GET',
  'backend.ServiceFeeController.delete.DELETE',
  'backend.CancellationRuleController.findAll.GET',
  'backend.CancellationRuleController.delete.DELETE',
  'backend.HostFeeAbsorptionController.findAll.GET',
  'backend.HostFeeAbsorptionController.delete.DELETE',
  'backend.RolesController.getAllUsers.GET',
  'backend.RolesController.updateUserStatus.PUT',
  'backend.RolesController.deleteUser.DELETE',
  'backend.HyperManagementController.pauseProperty.POST',
  'backend.HyperManagementController.resumeProperty.POST',
  'backend.HyperManagementController.archiveProperty.POST',
  'backend.HyperManagementController.deleteProperty.DELETE',
  'backend.HyperManagementController.pauseService.POST',
  'backend.HyperManagementController.resumeService.POST',
  'backend.HyperManagementController.pauseUser.POST',
  'backend.HyperManagementController.resumeUser.POST',
  'backend.HyperManagementController.archiveUser.POST',
  'backend.HyperManagementController.reactivateUser.POST',
];

/**
 * Backend permission keys that an admin can assign to their managers.
 */
export const ADMIN_ASSIGNABLE_PERMISSIONS: string[] = [
  'backend.PropertiesController.update.PUT',
  'backend.PropertiesController.updatePhotos.PUT',
  'backend.PropertiesController.updatePrices.PUT',
  'backend.PropertiesController.updateAvailability.PUT',
  'backend.PropertiesController.findOne.GET',
  'backend.PropertiesController.findAll.GET',
  'backend.ServicesController.update.PUT',
  'backend.ServicesController.findOne.GET',
  'backend.ServicesController.findAll.GET',
  'backend.BookingsController.findAll.GET',
  'backend.BookingsController.accept.PUT',
  'backend.BookingsController.reject.PUT',
  'backend.BookingsController.cancel.PUT',
  'backend.ChatController.sendMessage.POST',
  'backend.ChatController.getMessages.GET',
  'backend.ReviewsController.reply.POST',
  'backend.AnalyticsController.getStats.GET',
];

/**
 * Roles allowed to access all properties/services on the platform (not scoped).
 */
export const GLOBAL_ACCESS_ROLES: AppRole[] = ['hyper_admin', 'hyper_manager', 'user'];

/**
 * Roles that have scoped access (only see what's assigned to them).
 */
export const SCOPED_ACCESS_ROLES: AppRole[] = ['admin', 'manager', 'guest'];
