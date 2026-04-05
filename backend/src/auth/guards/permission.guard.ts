import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../user/services/roles.service';
import { RbacConfigService } from '../../user/services/rbac-config.service';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { ROLES_KEY } from '../decorators/require-role.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PermissionType } from '../../user/entity/manager-permission.entity';
import { AppRole } from '../../user/entity/user.entity';
import { canMakeBooking } from '../../user/constants/invitation-rules.constant';
import { ALL_BACKEND_KEYS } from '../../rbac/permission-registry';

// ─────────────────────────────────────────────────────────────────────────────
// INVITATION RULES — qui peut inviter qui (miroir de ASSIGNABLE_ROLES_BY_ROLE
// dans RolesService — maintenir les deux en sync si les règles changent).
//
// Le guard vérifie la règle dès le POST /invitations (avant que RolesService
// ne soit appelé) pour un rejet rapide avec message explicite.
//
//   hyper_admin   → admin, hyper_manager, guest  (jamais manager)
//   hyper_manager → admin, guest                 (jamais manager)
//   admin         → manager, guest               (jamais hyper roles ni user)
//   manager       → guest uniquement
//   guest / user  → personne
// ─────────────────────────────────────────────────────────────────────────────

const INVITATION_RULES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['admin', 'hyper_manager', 'guest'],
  hyper_manager: ['admin', 'guest'],
  admin: ['manager', 'guest'],
  manager: ['guest'],
  guest: [],
  user: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// HYPER WHITELIST — paths autorisés en écriture pour les hyper roles.
//
// Whitelist explicite pour remplacer path.includes('hyper') qui était trop
// permissif. Tout path qui commence par l'une de ces valeurs est autorisé
// en POST/PUT/PATCH pour les hyper roles.
// ─────────────────────────────────────────────────────────────────────────────
const HYPER_ALLOWED_WRITE_PATHS: string[] = [
  '/hyper-management',
  '/invitation',
  '/roles',
  '/document-validation',
  '/payments/pending',
  '/payments/transfer',
  '/metrics',
  '/user-metrics',
  '/rewards',
  '/points/admin',
  '/service-fees',
  '/points-rules',
  '/email-tracking',
  '/dashboard',
  '/support',
  '/rbac-config',
];

/**
 * PermissionGuard — Guard RBAC unifié.
 *
 * Combine vérification de rôles, permissions fines et validation de scope.
 * Pensé pour fonctionner conjointement avec RolesService.
 *
 * Ordre d'évaluation :
 *   1. Skip des endpoints publics (@Public())
 *   2. Validation JWT — user authentifié requis (401 si absent)
 *   3. Restriction booking (IS_BOOKING_CREATE) — seuls manager/guest/user peuvent réserver
 *   4. Vérification règle d'invitation sur POST /invitations
 *   5. Logique par rôle :
 *      - hyper_admin   : enforceHyperRestrictions → @RequireRole → return true
 *      - hyper_manager : enforceHyperRestrictions → @RequireRole → @RequirePermission fine → return true
 *      - admin         : enforceAdminRestrictions → enforceAdminScope → inject scopedAdminId
 *      - manager       : inject managerPropertyScope
 *      - guest         : restrictions write → check status booking → enforceGuestScope
 *      - user          : restrictions write → check status booking
 *   6. @RequireRole — vérification pour admin/manager/guest/user
 *   7. @RequirePermission — permission fine scopée (manager uniquement)
 *
 * Méthodes RolesService utilisées :
 *   - getUserRole()
 *   - hasHyperManagerPermission()
 *   - getManagerProperties()             → string[] | null
 *   - isPropertyOwner()
 *   - isServiceOwner()
 *   - getGuestAccessibleProperties()     → string[] | null
 *   - getGuestAccessibleServices()       → string[] | null
 *   - hasPermissionForProperty()         → 3 args (isolation paire gérée dans le service)
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
    private readonly rbacConfig: RbacConfigService,
  ) { }

  /**
   * Check permission via DB-backed RBAC config.
   * Falls back to hardcoded rules if DB has no entry (during migration period).
   * Rejects any key not found in the permission registry.
   */
  private canByDb(role: AppRole, permissionKey: string): boolean | null {
    // Reject unknown keys — only registry-generated keys are valid
    if (!ALL_BACKEND_KEYS.has(permissionKey)) {
      this.logger.warn(`Unknown permission key rejected: '${permissionKey}'. Register it in permission-registry.ts`);
      return false;
    }
    if (!this.rbacConfig.isLoaded()) return null;
    const entry = this.rbacConfig.can(role, permissionKey);
    const allPerms = this.rbacConfig.getBackendPermissions(role);
    if (Object.keys(allPerms).length === 0) return null;
    if (!(permissionKey in allPerms)) return null;
    return entry;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // ─── 1. Skip des endpoints publics ─────────────────────────────────────
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;


    // ─── 2. Validation du user authentifié ─────────────────────────────────
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // [FIX BUG-09] : 401 au lieu de return false (→ 403 implicite).
    // L'absence de user est un problème d'authentification, pas d'autorisation.
    if (!user?.id) {
      throw new UnauthorizedException(
        'Authentication required. Please provide a valid JWT token.',
      );
    }

    const userId: number = user.id;
    const userRole: AppRole = await this.rolesService.getUserRole(userId);

    // Attacher le rôle résolu à la request pour usage downstream
    request.userRole = userRole;

    const method: string = request.method?.toUpperCase() ?? '';

    // [FIX BUG-10] : request.route?.path uniquement — pas request.url qui contient
    // les query strings (?city=Paris) et crée des faux positifs dans les .includes().
    const path: string = request.route?.path ?? '';
    if (!path) {
      throw new InternalServerErrorException(
        'Route path could not be resolved by the router.',
      );
    }


    // ─── 3. Restriction réservation (IS_BOOKING_CREATE) ────────────────────
    // Seuls manager, guest et user peuvent créer des réservations.
    // hyper_admin, hyper_manager et admin sont bloqués par canMakeBooking().
    const isBookingEndpoint = this.reflector.getAllAndOverride<boolean>(
      'IS_BOOKING_CREATE',
      [context.getHandler(), context.getClass()],
    );
    if (isBookingEndpoint && !canMakeBooking(userRole)) {
      throw new ForbiddenException(
        `Role '${userRole}' cannot make bookings. Only manager, guest, and user can book.`,
      );
    }


    // ─── 4. Règles d'invitation ─────────────────────────────────────────────
    // [FIX BUG-04] : vérification rapide avant tout appel à InvitationService.
    // RolesService.assignRole() vérifie aussi via ASSIGNABLE_ROLES_BY_ROLE —
    // ce check ici est une première ligne de défense avec message explicite.
    if (path.includes('/invitations') && method === 'POST') {
      const targetRole: AppRole = request.body?.role;
      if (targetRole) {
        const allowed = INVITATION_RULES[userRole] ?? [];
        if (!allowed.includes(targetRole)) {
          throw new ForbiddenException(
            `'${userRole}' cannot invite role '${targetRole}'. ` +
            `Allowed: [${allowed.join(', ') || 'none'}].`,
          );
        }
      }
    }


    // ─── 5. Logique par rôle ────────────────────────────────────────────────

    // ── hyper_admin ──────────────────────────────────────────────────────────
    if (userRole === 'hyper_admin') {
      this.enforceHyperRestrictions(path, method, 'hyper_admin');

      // [FIX BUG-11] : @RequireRole vérifié avant return true.
      // Un endpoint @RequireRole('hyper_admin') uniquement doit bloquer hyper_manager.
      // Sans ce check, l'early return rendait @RequireRole inopérant pour les hyper roles.
      const requiredRoles = this.getRequiredRoles(context);
      if (requiredRoles?.length && !requiredRoles.includes('hyper_admin')) {
        throw new ForbiddenException(
          `Requires: [${requiredRoles.join(', ')}]. Your role: hyper_admin.`,
        );
      }

      return true; // hyper_admin passe tous les autres checks
    }

    // ── hyper_manager ────────────────────────────────────────────────────────
    if (userRole === 'hyper_manager') {
      this.enforceHyperRestrictions(path, method, 'hyper_manager');

      // [FIX BUG-11] : idem — @RequireRole avant return true.
      const requiredRoles = this.getRequiredRoles(context);
      if (requiredRoles?.length && !requiredRoles.includes('hyper_manager')) {
        throw new ForbiddenException(
          `Requires: [${requiredRoles.join(', ')}]. Your role: hyper_manager.`,
        );
      }

      // Permission fine hyper_manager via @RequirePermission
      const permMeta = this.getPermissionMeta(context);
      if (permMeta) {
        const hasPermission = await this.rolesService.hasHyperManagerPermission(
          userId,
          permMeta.permission,
        );
        if (!hasPermission) {
          throw new ForbiddenException(
            `Missing hyper_manager permission: '${permMeta.permission}'.`,
          );
        }
      }

      return true;
    }

    // ── admin (host) ─────────────────────────────────────────────────────────
    if (userRole === 'admin') {
      this.enforceAdminRestrictions(path, method);

      // [FIX BUG-06] : injecter scopedAdminId pour que les services filtrent
      // les résultats de liste (GET /bookings, GET /dashboard/revenue, etc.)
      // par hostId. Les services lisent request.scopedAdminId.
      request.scopedAdminId = userId;

      await this.enforceAdminScope(request, userId, path, method);
    }

    // ── manager ──────────────────────────────────────────────────────────────
    if (userRole === 'manager') {
      // [FIX BUG-08] : injecter le scope manager dans la request.
      // Les endpoints de liste (GET /service-bookings/provider, GET /bookings, etc.)
      // n'ont pas de @RequirePermission mais doivent être filtrés par les properties
      // assignées au manager. Les services lisent request.managerPropertyScope.
      //
      // getManagerProperties() retourne :
      //   null        → scope global (assignment scope 'all')
      //   string[]    → liste des property IDs assignées
      const managerPropertyScope = await this.rolesService.getManagerProperties(userId);
      request.managerPropertyScope = managerPropertyScope;
    }

    // ── guest ────────────────────────────────────────────────────────────────
    if (userRole === 'guest') {
      const isBookingPath = path.includes('booking');
      const isPromoAlertPath = path.includes('promo-alert');
      const isSavedSearch = path.includes('saved-search') || path.includes('alert');
      const isProfilePath = path.includes('profile') || path.includes('user/me');
      const isSupportPath = path.includes('support');
      const isReviewPath = path.includes('review');
      const isReactionPath = path.includes('reaction') || path.includes('favorite');

      // Guest est read-only sauf pour les actions listées ci-dessus
      if (
        !['GET', 'HEAD', 'OPTIONS'].includes(method) &&
        !isBookingPath &&
        !isPromoAlertPath &&
        !isSavedSearch &&
        !isProfilePath &&
        !isSupportPath &&
        !isReviewPath &&
        !isReactionPath
      ) {
        throw new ForbiddenException(
          'Guest role is read-only except for bookings, promo-alerts, reviews, reactions, and support.',
        );
      }

      // [FIX BUG-02] : bien que isBookingPath = true, PUT /bookings/:id/status
      // est réservé aux admins/managers — un guest ne peut pas changer un statut manuellement.
      if (path.match(/\/bookings\/[^/]+\/status/) && method === 'PUT') {
        throw new ForbiddenException('Guest cannot manually change booking status.');
      }

      // Scope guest : propriétés et services accessibles hérités de l'inviteur
      await this.enforceGuestScope(request, userId, path);
    }

    // ── user ─────────────────────────────────────────────────────────────────
    if (userRole === 'user') {
      const isBookingPath = path.includes('booking');
      const isProfilePath = path.includes('profile') || path.includes('user/me');
      const isSupportPath = path.includes('support');
      const isPointsPath = path.includes('points');
      const isPromoAlertPath = path.includes('promo-alert');
      const isSavedSearch = path.includes('saved-search') || path.includes('alert');
      const isReviewPath = path.includes('review');
      const isReactionPath = path.includes('reaction') || path.includes('like') || path.includes('favorite');

      if (
        !['GET', 'HEAD', 'OPTIONS'].includes(method) &&
        !isBookingPath &&
        !isProfilePath &&
        !isSupportPath &&
        !isPointsPath &&
        !isPromoAlertPath &&
        !isSavedSearch &&
        !isReviewPath &&
        !isReactionPath
      ) {
        throw new ForbiddenException(
          'User role has read + booking + social actions access only.',
        );
      }

      // [FIX BUG-02] : même restriction que guest — PUT /bookings/:id/status interdit.
      if (path.match(/\/bookings\/[^/]+\/status/) && method === 'PUT') {
        throw new ForbiddenException('User cannot manually change booking status.');
      }
    }


    // ─── 6. @RequireRole ────────────────────────────────────────────────────
    // Note : hyper_admin et hyper_manager ont déjà été traités et retournés en step 5.
    const requiredRoles = this.getRequiredRoles(context);
    if (requiredRoles?.length) {
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException(
          `Requires one of: [${requiredRoles.join(', ')}]. Your role: ${userRole}.`,
        );
      }
    }


    // ─── 7. @RequirePermission ──────────────────────────────────────────────
    const permMeta = this.getPermissionMeta(context);

    if (permMeta) {
      // Admin passe directement : ownership déjà validé en step 5 (enforceAdminScope).
      if (userRole === 'admin') return true;

      // Seul le manager nécessite une permission fine.
      if (userRole !== 'manager') {
        throw new ForbiddenException(
          `Permission '${permMeta.permission}' requires manager role. Your role: ${userRole}.`,
        );
      }

      // Extraire le propertyId depuis params/body/query selon la config du décorateur
      const propertyId = this.extractPropertyId(request, permMeta);
      if (!propertyId) {
        throw new ForbiddenException(
          `Property context required for permission '${permMeta.permission}'.`,
        );
      }

      // [BE-13 / BUG-12] : l'isolation paire admin↔manager est gérée INTERNEMENT
      // dans RolesService.hasPermissionForProperty() via une raw query qui récupère
      // le hostId de la property et filtre les assignments par assignedByAdminId.
      // Pas besoin de passer adminId ici — 3 args suffisent.
      const hasPermission = await this.rolesService.hasPermissionForProperty(
        userId,
        propertyId,
        permMeta.permission,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Missing permission '${permMeta.permission}' on property ${propertyId}.`,
        );
      }
    }

    return true;
  }


  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS PRIVÉS
  // ─────────────────────────────────────────────────────────────────────────

  /** Lire les rôles requis via @RequireRole() */
  private getRequiredRoles(context: ExecutionContext): AppRole[] | undefined {
    return this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  /** Lire les métadonnées de permission via @RequirePermission() */
  private getPermissionMeta(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<{
      permission: PermissionType;
      propertyParam: string;
      source: 'param' | 'body' | 'query';
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
  }

  /** Extraire le propertyId depuis params/body/query selon la config du décorateur */
  private extractPropertyId(
    request: any,
    permMeta: { propertyParam: string; source: 'param' | 'body' | 'query' },
  ): string | undefined {
    if (permMeta.source === 'param') return request.params?.[permMeta.propertyParam];
    if (permMeta.source === 'body') return request.body?.[permMeta.propertyParam];
    if (permMeta.source === 'query') return request.query?.[permMeta.propertyParam];
    return undefined;
  }


  /**
   * enforceHyperRestrictions — Restrictions communes à hyper_admin et hyper_manager.
   *
   * Bloque :
   *   [BE-05] POST/PUT/PATCH sur /host-fee-absorption et /cancellation-rule
   *   [BE-06] Écriture directe sur /properties et /services hors whitelist
   *   [BE-07] hyper_admin ne peut pas créer de groupes (POST sur /property-groups, /service-groups)
   *   [BE-08] PUT accept/decline sur /service-bookings
   *
   * [FIX BUG-07] : whitelist HYPER_ALLOWED_WRITE_PATHS au lieu de path.includes('hyper')
   * qui bypassait toute restriction sur des paths contenant "hyper" fortuitement.
   */
  private enforceHyperRestrictions(
    path: string,
    method: string,
    role: 'hyper_admin' | 'hyper_manager',
  ): void {

    // [BE-05] Bloquer CREATE et UPDATE des frais d'absorption et règles d'annulation.
    // Les hyper roles peuvent seulement consulter (GET) et supprimer (DELETE).
    if (
      (path.includes('/host-fee-absorption') || path.includes('/cancellation-rule')) &&
      ['POST', 'PUT', 'PATCH'].includes(method)
    ) {
      throw new ForbiddenException(
        `'${role}' cannot create or modify absorption fees / cancellation rules. ` +
        `Only admin can create them. Hyper roles are limited to view and delete.`,
      );
    }

    // [BE-06] Bloquer les écritures directes sur properties et services
    // sauf si le path est dans HYPER_ALLOWED_WRITE_PATHS.
    const isPropertyOrServiceWrite =
      (path.includes('/properties') || path.includes('/services')) &&
      ['POST', 'PUT', 'PATCH'].includes(method);

    if (isPropertyOrServiceWrite) {
      const isAllowed = HYPER_ALLOWED_WRITE_PATHS.some(p => path.startsWith(p));
      if (!isAllowed) {
        throw new ForbiddenException(
          `'${role}' cannot create or modify properties/services directly. ` +
          `Use /hyper-management endpoints for status changes.`,
        );
      }
    }

    // [BE-07] hyper_admin ne peut pas créer de groupes.
    // hyper_manager peut créer des groupes (son scope le lui permet).
    if (role === 'hyper_admin') {
      if (
        (path.includes('/property-groups') || path.includes('/service-groups')) &&
        method === 'POST'
      ) {
        throw new ForbiddenException(
          `'hyper_admin' cannot create property/service groups. ` +
          `Group creation is reserved for admin and hyper_manager.`,
        );
      }
    }

    // [BE-08] Bloquer accept/decline sur les réservations de services.
    if (
      path.includes('/service-bookings') &&
      (path.includes('/accept') || path.includes('/decline')) &&
      method === 'PUT'
    ) {
      throw new ForbiddenException(
        `'${role}' cannot accept or decline service bookings. ` +
        `Only admin and manager can manage booking requests.`,
      );
    }
  }


  /**
   * enforceAdminRestrictions — Restrictions d'écriture pour l'admin.
   *
   * Bloque :
   *   - Accès aux endpoints /hyper-management et /hyper/
   *   - Création/modification/suppression des règles de frais globaux (/service-fees)
   *   - Création/modification/suppression des règles de points globales (/points-rules)
   *
   * Note : la règle d'invitation est gérée en step 4 via INVITATION_RULES.
   */
  private enforceAdminRestrictions(path: string, method: string): void {

    if (path.startsWith('/hyper-management') || path.startsWith('/hyper/')) {
      throw new ForbiddenException('Admin cannot access hyper management endpoints.');
    }

    if (
      path.includes('/service-fees') &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
    ) {
      throw new ForbiddenException(
        'Admin cannot create, modify, or delete global service fee rules.',
      );
    }

    if (
      path.includes('/points-rules') &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
    ) {
      throw new ForbiddenException(
        'Admin cannot create, modify, or delete global points rules.',
      );
    }
  }


  /**
   * enforceAdminScope — Valider qu'un admin n'accède qu'à ses propres ressources.
   *
   * [FIX BUG-05] : regex services sans $ en fin → capture les sous-chemins :
   *   PUT /services/:id/pause, PUT /services/:id/photos, etc.
   *   L'ancienne regex /\/services\/[^/]+$/ manquait ces cas.
   *
   * [FIX BUG-06] : request.scopedAdminId injecté en amont (bloc admin step 5).
   *   Les services qui retournent des listes doivent filtrer par WHERE hostId = scopedAdminId.
   */
  private async enforceAdminScope(
    request: any,
    adminId: number,
    path: string,
    method: string,
  ): Promise<void> {

    // Vérification ownership pour toute modification/suppression d'une property
    // et de ses sous-ressources (/properties/:id/prices, /properties/:id/photos, etc.)
    if (
      path.match(/\/properties\/[^/]+/) &&
      ['PUT', 'PATCH', 'DELETE'].includes(method)
    ) {
      const propertyId = request.params?.id;
      if (propertyId) {
        const isOwner = await this.rolesService.isPropertyOwner(adminId, propertyId);
        if (!isOwner) {
          throw new ForbiddenException(
            `Admin can only modify or delete their own properties. ` +
            `Property ${propertyId} does not belong to this admin.`,
          );
        }
      }
    }

    // [FIX BUG-05] : regex sans $ → couvre tous les sous-chemins du service.
    // Exemples couverts : PUT /services/:id, PUT /services/:id/pause,
    //                     PUT /services/:id/photos, DELETE /services/:id
    if (
      path.match(/\/services\/[^/]+/) &&
      ['PUT', 'PATCH', 'DELETE'].includes(method)
    ) {
      const serviceId = request.params?.id;
      if (serviceId) {
        const isOwner = await this.rolesService.isServiceOwner(adminId, serviceId);
        if (!isOwner) {
          throw new ForbiddenException(
            `Admin can only modify or delete their own services. ` +
            `Service ${serviceId} does not belong to this admin.`,
          );
        }
      }
    }

    // Les groupes : ownership vérifié au niveau du service (hostId sur le group entity)
  }


  /**
   * enforceGuestScope — Restreindre l'accès guest au scope hérité de son inviteur.
   *
   * Scope déterminé par RolesService.createGuestAssignmentsFromInviter() :
   *   Invité par hyper_admin   → null (accès global)
   *   Invité par hyper_manager → scope du hyper_manager
   *   Invité par admin         → propriétés de l'admin (une entrée par property)
   *   Invité par manager       → sous-ensemble exact du manager
   *
   * [FIX BUG-01] : les endpoints de liste (/properties, /services) ne sont pas
   *   bloqués ici — le scope est injecté dans la request pour que les services
   *   filtrent côté base de données. Ne pas tenter de bloquer les listes dans le
   *   guard : on ne connaît pas encore les IDs au moment de la requête.
   *
   * [FIX BUG-03] : propriétés et services ont des listes séparées.
   *   getGuestAccessibleProperties() → property IDs
   *   getGuestAccessibleServices()   → service IDs (nouvelle méthode dans RolesService)
   *   Avant : les service IDs étaient comparés aux property IDs → toujours false.
   */
  private async enforceGuestScope(
    request: any,
    guestId: number,
    path: string,
  ): Promise<void> {

    // [FIX BUG-03] : deux appels parallèles — listes séparées.
    // null = accès global (invité par hyper_admin)
    // []   = aucun accès
    // [...] = accès scopé à ces IDs uniquement
    const [accessiblePropertyIds, accessibleServiceIds] = await Promise.all([
      this.rolesService.getGuestAccessibleProperties(guestId),
      this.rolesService.getGuestAccessibleServices(guestId),
    ]);

    // [FIX BUG-01] : injection du scope dans la request pour filtrage côté service.
    // Les services (PropertiesService, TourismServicesService, BookingsService) doivent lire
    // request.guestPropertyScope / request.guestServiceScope et appliquer :
    //   if (scope !== null) query.andWhere('entity.id IN (:...ids)', { ids: scope })
    request.guestPropertyScope = accessiblePropertyIds;
    request.guestServiceScope = accessibleServiceIds;

    // Vérification directe sur les endpoints de détail /properties/:id
    if (path.match(/\/properties\/[^/]+/)) {
      const propertyId = request.params?.id;
      if (propertyId && accessiblePropertyIds !== null) {
        if (!accessiblePropertyIds.includes(String(propertyId))) {
          throw new ForbiddenException(
            `Guest does not have access to property ${propertyId}.`,
          );
        }
      }
    }

    // [FIX BUG-03] : utiliser accessibleServiceIds (pas accessiblePropertyIds)
    // pour les endpoints de détail /services/:id.
    if (path.match(/\/services\/[^/]+/)) {
      const serviceId = request.params?.id;
      if (serviceId && accessibleServiceIds !== null) {
        if (!accessibleServiceIds.includes(String(serviceId))) {
          throw new ForbiddenException(
            `Guest does not have access to service ${serviceId}.`,
          );
        }
      }
    }

    // Les list endpoints (/properties, /services) sont filtrés côté service
    // grâce à request.guestPropertyScope et request.guestServiceScope.
  }
}