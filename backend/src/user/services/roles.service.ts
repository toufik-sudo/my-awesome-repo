import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AppRole, ROLE_HIERARCHY } from '../entity/user.entity';
import { ManagerAssignment, AssignmentScope } from '../entity/manager-assignment.entity';
import { ManagerPermission, PermissionType } from '../entity/manager-permission.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { Invitation } from '../entity/invitation.entity';


// ─────────────────────────────────────────────────────────────────────────────
// INVITATION RULES — table de référence des rôles assignables par inviteur.
//
// Utilisée à deux endroits :
//   1. RolesService.assignRole()   → validation à l'assignation du rôle
//   2. PermissionGuard             → validation dès la création de l'invitation
//
// Règles issues du ticket BE-03 :
//   hyper_admin   → peut assigner : admin, hyper_manager, guest  (PAS manager)
//   hyper_manager → peut assigner : admin, guest                 (PAS manager)
//   admin         → peut assigner : manager, guest               (PAS hyper roles ni user)
//   manager       → peut assigner : guest uniquement
//   guest / user  → ne peut rien assigner
// ─────────────────────────────────────────────────────────────────────────────
const ASSIGNABLE_ROLES_BY_ROLE: Record<AppRole, AppRole[]> = {
  hyper_admin: ['admin', 'hyper_manager', 'guest'],
  hyper_manager: ['admin', 'guest'],
  admin: ['manager', 'guest'],
  manager: ['guest'],
  guest: [],
  user: [],
};


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ManagerAssignment)
    private readonly assignmentRepo: Repository<ManagerAssignment>,
    @InjectRepository(ManagerPermission)
    private readonly permissionRepo: Repository<ManagerPermission>,
    @InjectRepository(PropertyGroupMembership)
    private readonly membershipRepo: Repository<PropertyGroupMembership>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
  ) { }


  // ─────────────────────────────────────────────────────────────────────────
  // ROLE HELPERS — lecture/écriture du champ users.role
  // ─────────────────────────────────────────────────────────────────────────


  async getUserRole(userId: number | string): Promise<AppRole> {
    if (typeof userId === 'string') {
      userId = parseInt(userId, 10);
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return 'user';
    return user.getRole();
  }


  /** @deprecated Utiliser getUserRole() — retourne un tableau pour compatibilité ascendante */
  async getUserRoles(userId: number): Promise<AppRole[]> {
    const role = await this.getUserRole(userId);
    return [role];
  }


  async hasRole(userId: number, role: AppRole): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === role;
  }


  private async setUserRole(userId: number, role: AppRole): Promise<void> {
    await this.userRepo.update(userId, { role });
  }


  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS — retrouver les users invités par un user donné
  // ─────────────────────────────────────────────────────────────────────────


  private async getInvitedUserIds(inviterId: number): Promise<number[]> {
    const invitations = await this.invitationRepo.find({
      where: { invitedBy: inviterId, status: 'accepted' as any },
    });

    const assignments = await this.assignmentRepo.find({
      where: { assignedByAdminId: inviterId, isActive: true },
    });
    const managerIds = [...new Set(assignments.map(a => a.managerId))];

    const invitedEmails = invitations
      .filter(inv => inv.email)
      .map(inv => inv.email);

    let invitedUsers: User[] = [];
    if (invitedEmails.length > 0) {
      invitedUsers = await this.userRepo.find({
        where: invitedEmails.map(email => ({ email })),
      });
    }

    const allIds = new Set<number>([
      ...managerIds,
      ...invitedUsers.map(u => u.id),
    ]);
    return Array.from(allIds);
  }


  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD STATS
  // ─────────────────────────────────────────────────────────────────────────


  async getDashboardStats(callerId?: number) {
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    if (isHyper) {
      const users = await this.userRepo.find({ where: { isActive: true } });

      let totalAdmins = 0, totalManagers = 0, totalRegularUsers = 0,
        totalGuests = 0, hyperAdmins = 0, hyperManagers = 0;

      for (const u of users) {
        const role = u.getRole();
        if (role === 'hyper_admin') hyperAdmins++;
        else if (role === 'hyper_manager') hyperManagers++;
        else if (role === 'admin') totalAdmins++;
        else if (role === 'manager') totalManagers++;
        else if (role === 'guest') totalGuests++;
        else totalRegularUsers++;
      }

      const totalGroups = await this.membershipRepo
        .createQueryBuilder('m')
        .select('COUNT(DISTINCT m.groupId)', 'count')
        .getRawOne()
        .then(r => parseInt(r.count, 10) || 0);

      const totalAssignments = await this.assignmentRepo.count({
        where: { isActive: true },
      });

      return {
        totalUsers: users.length,
        totalGroups,
        activeManagers: totalManagers,
        totalAssignments,
        totalAdmins,
        totalManagers,
        totalRegularUsers,
        totalGuests,
        hyperAdmins,
        hyperManagers,
      };
    }

    // Admin/Manager : stats scopées à leurs invités
    const invitedIds = await this.getInvitedUserIds(callerId);
    const myAssignments = await this.assignmentRepo.count({
      where: { assignedByAdminId: callerId, isActive: true },
    });

    let managersCount = 0, guestsCount = 0;
    if (invitedIds.length > 0) {
      const invitedUsers = await this.userRepo.find({
        where: invitedIds.map(id => ({ id })),
      });
      for (const u of invitedUsers) {
        if (u.getRole() === 'manager') managersCount++;
        else if (u.getRole() === 'guest') guestsCount++;
      }
    }

    return {
      totalUsers: invitedIds.length,
      totalGroups: 0,
      activeManagers: managersCount,
      totalAssignments: myAssignments,
      totalAdmins: 0,
      totalManagers: managersCount,
      totalRegularUsers: 0,
      totalGuests: guestsCount,
      hyperAdmins: 0,
      hyperManagers: 0,
    };
  }


  // ─────────────────────────────────────────────────────────────────────────
  // ROLE ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────


  /**
   * Assigner un rôle à un user.
   *
   * [FIX BE-03] : remplacement de la logique fragmentée de vérification hiérarchique
   * par une table déclarative ASSIGNABLE_ROLES_BY_ROLE.
   *
   * Problèmes corrigés :
   *   1. hyper_admin bypassait le check ROLE_HIERARCHY via `assignerRole !== 'hyper_admin'`
   *      → il pouvait assigner le rôle `manager` librement.
   *   2. hyper_manager n'avait pas de blocage explicite sur `manager`.
   *      → le check ne bloquait que `hyper_admin`, pas `manager`.
   *   3. Logique éparpillée en 5 blocs if/else → remplacée par une seule table.
   */
  async assignRole(assignerId: number, userId: number, role: AppRole) {
    const assignerRole = await this.getUserRole(assignerId);

    // [FIX BE-03] Vérification centralisée via la table déclarative.
    // Chaque rôle d'inviteur a une liste explicite de rôles qu'il peut assigner.
    // Si le rôle cible n'est pas dans la liste → ForbiddenException.
    const allowedRoles = ASSIGNABLE_ROLES_BY_ROLE[assignerRole] ?? [];
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException(
        `'${assignerRole}' cannot assign role '${role}'. ` +
        `Allowed roles to assign: [${allowedRoles.join(', ') || 'none'}].`,
      );
    }

    const currentRole = await this.getUserRole(userId);
    if (currentRole === role) {
      // Idempotent : si le rôle est déjà le bon, on retourne sans erreur
      return { userId, role: currentRole };
    }

    await this.setUserRole(userId, role);
    return { userId, role };
  }


  async removeRole(removerId: number, userId: number, _role: AppRole): Promise<void> {
    const removerRole = await this.getUserRole(removerId);

    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(removerRole)) {
      throw new ForbiddenException('Insufficient permissions to remove roles');
    }

    const currentRole = await this.getUserRole(userId);

    // Admin peut uniquement retirer les rôles de ses propres managers/guests
    if (removerRole === 'admin') {
      if (!['manager', 'guest'].includes(currentRole)) {
        throw new ForbiddenException('Admin can only manage manager and guest roles');
      }
      const invitedIds = await this.getInvitedUserIds(removerId);
      if (!invitedIds.includes(userId)) {
        throw new ForbiddenException('Admin can only manage their own invitees');
      }
    }

    // Seul hyper_admin peut retirer les rôles hyper
    if (
      (currentRole === 'hyper_admin' || currentRole === 'hyper_manager') &&
      removerRole !== 'hyper_admin'
    ) {
      throw new ForbiddenException('Only hyper_admin can remove hyper roles');
    }

    // Rétrograder à 'user' (soft remove)
    await this.setUserRole(userId, 'user');
  }


  // ─────────────────────────────────────────────────────────────────────────
  // MANAGER ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────


  async assignManager(
    adminId: number,
    managerId: number,
    scope: AssignmentScope,
    propertyId?: string,
    propertyGroupId?: string,
  ): Promise<ManagerAssignment> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can assign managers');
    }

    const managerRole = await this.getUserRole(managerId);

    // Les hyper roles ne peuvent assigner que des hyper_managers
    if (adminRole === 'hyper_admin' || adminRole === 'hyper_manager') {
      if (managerRole !== 'hyper_manager') {
        throw new ForbiddenException(
          'Hyper roles can only create assignments for hyper_manager users',
        );
      }
    } else {
      // Admin ne peut assigner que ses propres managers
      if (managerRole !== 'manager') {
        throw new ForbiddenException('User must have manager role to be assigned');
      }
      const invitedIds = await this.getInvitedUserIds(adminId);
      if (!invitedIds.includes(managerId)) {
        throw new ForbiddenException('Admin can only assign managers they invited');
      }
    }

    const assignment = this.assignmentRepo.create({
      managerId,
      assignedByAdminId: adminId,
      scope,
      propertyId: scope === 'property' ? propertyId : null,
      propertyGroupId: scope === 'property_group' ? propertyGroupId : null,
    });

    return this.assignmentRepo.save(assignment);
  }


  // ─────────────────────────────────────────────────────────────────────────
  // PERMISSIONS
  // ─────────────────────────────────────────────────────────────────────────


  async setPermissions(
    adminId: number,
    assignmentId: string,
    permissions: { permission: PermissionType; isGranted: boolean }[],
  ): Promise<ManagerPermission[]> {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Only hyper_admin, hyper_manager, or admin can set permissions');
    }

    // [BE-09] hyper_admin ne peut assigner des permissions fines qu'à des hyper_managers.
    // Il ne peut pas descendre dans les niveaux inférieurs (admin, manager, guest).
    if (adminRole === 'hyper_admin') {
      const targetRole = await this.getUserRole(assignment.managerId);
      if (targetRole !== 'hyper_manager') {
        throw new ForbiddenException(
          'hyper_admin can only assign fine-grained permissions to hyper_manager users',
        );
      }
    }

    // Admin ne peut gérer que les permissions de ses propres assignments
    if (adminRole === 'admin' && assignment.assignedByAdminId !== adminId) {
      throw new ForbiddenException('Admin can only manage permissions for their own managers');
    }

    // Remplacer toutes les permissions existantes de cet assignment
    await this.permissionRepo.delete({ assignmentId });

    const newPermissions = permissions.map(p =>
      this.permissionRepo.create({
        assignmentId,
        permission: p.permission,
        isGranted: p.isGranted,
      }),
    );

    return this.permissionRepo.save(newPermissions);
  }


  /**
   * Vérifie qu'un manager a la permission donnée sur une property spécifique.
   *
   * [BE-13] Isolation paire admin↔manager :
   *   Lors de la vérification, on identifie d'abord l'admin propriétaire de la property
   *   (via SELECT hostId FROM properties WHERE id = $1).
   *   On ne vérifie ensuite que les assignments créés par CET admin pour CE manager.
   *   Exception : les assignments scope 'all' (hyper-level) s'appliquent globalement.
   *
   *   Cela évite le problème de merge : si un manager est assigné par deux admins
   *   différents avec des permissions différentes, les permissions de l'admin A
   *   ne s'appliquent pas aux propriétés de l'admin B.
   */
  async hasPermissionForProperty(
    managerId: number,
    propertyId: string,
    permission: PermissionType,
  ): Promise<boolean> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
      relations: ['propertyGroup'],
    });

    // Identifier l'admin propriétaire de cette property pour isoler la paire [BE-13]
    const ownerResult = await this.assignmentRepo.manager.query(
      `SELECT "hostId" FROM properties WHERE id = $1 LIMIT 1`,
      [propertyId],
    );
    const propertyOwnerId = ownerResult?.[0]?.hostId;

    for (const assignment of assignments) {
      // [BE-13] Ignorer les assignments créés par un autre admin que le propriétaire
      // de cette property — sauf si c'est un assignment scope 'all' (hyper-level).
      if (propertyOwnerId && assignment.assignedByAdminId !== propertyOwnerId) {
        if (assignment.scope !== 'all') continue;
      }

      let coversProperty = false;

      if (assignment.scope === 'all') {
        coversProperty = true;
      } else if (assignment.scope === 'property' && assignment.propertyId === propertyId) {
        coversProperty = true;
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        const membership = await this.membershipRepo.findOne({
          where: { propertyId, groupId: assignment.propertyGroupId },
        });
        coversProperty = !!membership;
      }

      if (coversProperty) {
        const perm = await this.permissionRepo.findOne({
          where: { assignmentId: assignment.id, permission, isGranted: true },
        });
        if (perm) return true;
      }
    }

    return false;
  }


  async getManagerPermissions(
    managerId: number,
    callerId?: number,
  ): Promise<{ assignment: ManagerAssignment; permissions: ManagerPermission[] }[]> {
    let whereClause: any = { managerId, isActive: true };

    // Un admin ne voit que les assignments qu'il a lui-même créés
    if (callerId) {
      const callerRole = await this.getUserRole(callerId);
      if (callerRole === 'admin') {
        whereClause.assignedByAdminId = callerId;
      }
    }

    const assignments = await this.assignmentRepo.find({
      where: whereClause,
      relations: ['property', 'propertyGroup'],
    });

    const result = [];
    for (const assignment of assignments) {
      const permissions = await this.permissionRepo.find({
        where: { assignmentId: assignment.id },
      });
      result.push({ assignment, permissions });
    }

    return result;
  }


  /**
   * Vérifie qu'un hyper_manager possède une permission globale
   * (assignée par hyper_admin via setPermissions).
   */
  async hasHyperManagerPermission(
    hyperManagerId: number,
    permission: PermissionType,
  ): Promise<boolean> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId: hyperManagerId, isActive: true },
    });

    for (const assignment of assignments) {
      const perm = await this.permissionRepo.findOne({
        where: { assignmentId: assignment.id, permission, isGranted: true },
      });
      if (perm) return true;
    }

    return false;
  }


  /**
   * Retourne les property IDs dans le scope d'un manager.
   *
   * [FIX TYPE] : la signature déclare maintenant `Promise<string[] | null>`
   * car la méthode peut retourner null (scope 'all' = accès global).
   * L'ancienne signature `Promise<string[]>` était incorrecte TypeScript.
   *
   * Retourne :
   *   null        → scope global (assignment scope 'all')
   *   string[]    → liste des property IDs accessibles
   */
  async getManagerProperties(managerId: number): Promise<string[] | null> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId, isActive: true },
    });

    const propertyIds = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.scope === 'all') {
        return null; // Accès global — le service ne doit pas filtrer
      } else if (assignment.scope === 'property' && assignment.propertyId) {
        propertyIds.add(assignment.propertyId);
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        const memberships = await this.membershipRepo.find({
          where: { groupId: assignment.propertyGroupId },
        });
        memberships.forEach(m => propertyIds.add(m.propertyId));
      }
    }

    return Array.from(propertyIds);
  }


  // ─────────────────────────────────────────────────────────────────────────
  // GUEST SCOPE RESOLUTION
  // ─────────────────────────────────────────────────────────────────────────


  /**
   * Créer les assignments d'un guest à partir du scope de son inviteur.
   *
   * [FIX BE-04] : un guest invité par un admin recevait scope 'all' — il pouvait
   * voir toutes les propriétés de la plateforme. Le scope doit être restreint
   * aux propriétés de l'admin inviteur uniquement.
   *
   * Logique de scope par inviteur :
   *   hyper_admin   → scope 'all' (accès global) ✅ intentionnel
   *   hyper_manager → copie des assignments du hyper_manager inviteur
   *   admin         → [FIX] scope 'property' par propriété de l'admin (pas 'all')
   *   manager       → copie des assignments du manager inviteur
   */
  async createGuestAssignmentsFromInviter(
    inviterId: number,
    guestId: number,
  ): Promise<void> {
    const inviterRole = await this.getUserRole(inviterId);

    if (inviterRole === 'hyper_admin') {
      // Invité par hyper_admin → accès global (intentionnel — hyper scope)
      const assignment = this.assignmentRepo.create({
        managerId: guestId,
        assignedByAdminId: inviterId,
        scope: 'all' as AssignmentScope,
      });
      await this.assignmentRepo.save(assignment);

    } else if (inviterRole === 'admin') {
      // [FIX BE-04] Invité par admin → scope property par property de l'admin.
      // Avant : scope 'all' → le guest voyait TOUT. Corrigé : une entrée par property.
      const adminPropertyIds = await this.getAdminPropertyIds(inviterId);

      if (adminPropertyIds.length === 0) return; // Admin sans property → aucun accès guest

      const assignments = adminPropertyIds.map(propertyId =>
        this.assignmentRepo.create({
          managerId: guestId,
          assignedByAdminId: inviterId,
          scope: 'property' as AssignmentScope,
          propertyId,
        }),
      );

      await this.assignmentRepo.save(assignments);

    } else if (inviterRole === 'hyper_manager' || inviterRole === 'manager') {
      // Invité par hyper_manager ou manager → copier leur scope exact
      const inviterAssignments = await this.assignmentRepo.find({
        where: { managerId: inviterId, isActive: true },
      });

      for (const src of inviterAssignments) {
        const assignment = this.assignmentRepo.create({
          managerId: guestId,
          assignedByAdminId: src.assignedByAdminId,
          scope: src.scope,
          propertyId: src.propertyId,
          propertyGroupId: src.propertyGroupId,
        });
        await this.assignmentRepo.save(assignment);
      }
    }
    // guest et user ne peuvent pas inviter → rien à faire
  }


  /**
   * Retourne les property IDs accessibles par un guest.
   * null = accès global (invité par hyper_admin).
   */
  async getGuestAccessibleProperties(guestId: number): Promise<string[] | null> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId: guestId, isActive: true },
    });

    if (assignments.length === 0) return [];

    const propertyIds = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.scope === 'all') {
        return null; // Accès global
      } else if (assignment.scope === 'property' && assignment.propertyId) {
        propertyIds.add(assignment.propertyId);
      } else if (assignment.scope === 'property_group' && assignment.propertyGroupId) {
        const memberships = await this.membershipRepo.find({
          where: { groupId: assignment.propertyGroupId },
        });
        memberships.forEach(m => propertyIds.add(m.propertyId));
      }
    }

    return Array.from(propertyIds);
  }


  /**
   * Retourne les service IDs accessibles par un guest.
   * Méthode symétrique à getGuestAccessibleProperties() pour les services.
   *
   * [FIX BUG-03] : séparation des listes property IDs et service IDs.
   * Avant, le PermissionGuard utilisait getGuestAccessibleProperties() pour
   * vérifier l'accès aux services → comparaison incohérente d'IDs différents.
   *
   * Logique :
   *   - scope 'all'      → null (accès global à tous les services)
   *   - scope 'property' → services du même admin que la property
   *   - sinon            → services des admins propriétaires des assignments
   *
   * Note : ManagerAssignment ne stocke pas de serviceId directement.
   * Le scope service est déduit des admins (assignedByAdminId) présents
   * dans les assignments du guest.
   */
  async getGuestAccessibleServices(guestId: number): Promise<string[] | null> {
    const assignments = await this.assignmentRepo.find({
      where: { managerId: guestId, isActive: true },
    });

    if (assignments.length === 0) return [];

    // Si un assignment est scope 'all' → accès global aux services aussi
    if (assignments.some(a => a.scope === 'all')) {
      return null;
    }

    // Récupérer les services appartenant aux admins des assignments du guest.
    // Un guest scopé à l'admin A voit les services dont providerId = adminId de A.
    const adminIds = [...new Set(assignments.map(a => a.assignedByAdminId).filter(Boolean))];
    const serviceIds = new Set<string>();

    for (const adminId of adminIds) {
      const result = await this.assignmentRepo.manager.query(
        `SELECT id FROM tourism_services WHERE "providerId" = $1`,
        [adminId],
      );
      result.forEach((r: any) => serviceIds.add(String(r.id)));
    }

    return Array.from(serviceIds);
  }


  // ─────────────────────────────────────────────────────────────────────────
  // USER MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────


  /**
   * Retourne la liste des users avec leurs rôles, scopée selon le caller.
   *
   * [FIX FE-06] : un hyper_manager ne doit pas voir les hyper_admin dans la liste.
   * Avant : la requête retournait tous les users actifs sans distinction pour isHyper.
   * Après : filtrage ajouté — hyper_manager ne voit que les non-hyper_admin.
   */
  async getAllUsersWithRoles(callerId?: number): Promise<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: AppRole;
    isActive: boolean;
  }[]> {
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    if (isHyper) {
      const users = await this.userRepo.find({ where: { isActive: true } });

      return users
        .filter(u => {
          // [FIX FE-06] : un hyper_manager ne peut pas voir ni gérer les hyper_admin.
          // La visibilité des hyper_admin est réservée aux hyper_admin uniquement.
          if (callerRole === 'hyper_manager' && u.getRole() === 'hyper_admin') {
            return false;
          }
          return true;
        })
        .map(u => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.getRole(),
          isActive: u.isActive,
        }));
    }

    // Admin/Manager : uniquement leurs invités
    const invitedIds = await this.getInvitedUserIds(callerId);
    if (invitedIds.length === 0) return [];

    const users = await this.userRepo.find({
      where: invitedIds.map(id => ({ id })),
    });

    return users
      .filter(u => {
        // Admin voit ses managers et guests
        if (callerRole === 'admin') {
          return ['manager', 'guest'].includes(u.getRole());
        }
        // Manager voit uniquement ses guests
        if (callerRole === 'manager') {
          return u.getRole() === 'guest';
        }
        return true;
      })
      .map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.getRole(),
        isActive: u.isActive,
      }));
  }


  async getAllAssignments(callerId?: string | number): Promise<ManagerAssignment[]> {
    console.log('getAllAssignments called with callerId:', callerId);
    if (typeof callerId === 'string') {
      callerId = parseInt(callerId, 10);
    }
    const callerRole = callerId ? await this.getUserRole(callerId) : 'hyper_admin';
    const isHyper = callerRole === 'hyper_admin' || callerRole === 'hyper_manager';

    if (isHyper) {
      return this.assignmentRepo.find({
        where: { isActive: true },
        relations: ['manager', 'property', 'propertyGroup'],
      });
    }

    if (callerRole === 'admin') {
      return this.assignmentRepo.find({
        where: { assignedByAdminId: callerId, isActive: true },
        relations: ['manager', 'property', 'propertyGroup'],
      });
    }

    if (callerRole === 'manager') {
      return this.assignmentRepo.find({
        where: { managerId: callerId, isActive: true },
        relations: ['manager', 'property', 'propertyGroup'],
      });
    }

    return [];
  }


  async removeAssignment(adminId: number, assignmentId: string): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    // Admin ne peut supprimer que ses propres assignments
    if (adminRole === 'admin' && assignment.assignedByAdminId !== adminId) {
      throw new ForbiddenException('Admin can only manage their own assignments');
    }

    // Soft delete — conserver l'historique
    await this.assignmentRepo.update(assignmentId, { isActive: false });
  }


  async updateUserStatus(adminId: number, userId: number, status: string): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(adminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Admin ne peut gérer que ses managers et guests
    if (adminRole === 'admin') {
      const targetRole = await this.getUserRole(userId);
      if (targetRole !== 'manager' && targetRole !== 'guest') {
        throw new ForbiddenException('Admin can only manage manager and guest accounts');
      }
      const invitedIds = await this.getInvitedUserIds(adminId);
      if (!invitedIds.includes(userId)) {
        throw new ForbiddenException('Admin can only manage their own invitees');
      }
    }

    await this.userRepo.update(userId, { isActive: status === 'active' });
  }


  async deleteUser(adminId: number, userId: number): Promise<void> {
    const adminRole = await this.getUserRole(adminId);
    if (adminRole !== 'hyper_admin' && adminRole !== 'hyper_manager') {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can delete users');
    }
    await this.userRepo.delete(userId);
  }


  // ─────────────────────────────────────────────────────────────────────────
  // IT MVP HELPERS
  // ─────────────────────────────────────────────────────────────────────────


  /** Désactiver tous les assignments d'un user (ex : conversion guest → user) */
  async removeAllAssignments(userId: number): Promise<void> {
    await this.assignmentRepo.update(
      { managerId: userId, isActive: true },
      { isActive: false },
    );
  }


  /**
   * Forcer le rôle d'un user sans vérification de permissions.
   * Réservé à l'usage interne (ex : conversion de rôle automatique).
   */
  async setUserRoleDirect(userId: number, role: AppRole): Promise<void> {
    await this.setUserRole(userId, role);
  }


  // ─────────────────────────────────────────────────────────────────────────
  // OWNERSHIP CHECKS — utilisés par PermissionGuard (scope admin)
  // ─────────────────────────────────────────────────────────────────────────


  /**
   * Vérifie qu'un admin est propriétaire d'une property (hostId = adminId).
   * Les hyper roles retournent toujours true (accès global).
   */
  async isPropertyOwner(adminId: number, propertyId: string): Promise<boolean> {
    const role = await this.getUserRole(adminId);
    if (role === 'hyper_admin' || role === 'hyper_manager') return true;

    const result = await this.assignmentRepo.manager.query(
      `SELECT COUNT(*) as count FROM properties WHERE id = $1 AND "hostId" = $2`,
      [propertyId, adminId],
    );
    return parseInt(result?.[0]?.count, 10) > 0;
  }


  /**
   * Vérifie qu'un admin est propriétaire d'un service (providerId = adminId).
   * Les hyper roles retournent toujours true (accès global).
   */
  async isServiceOwner(adminId: number, serviceId: string): Promise<boolean> {
    const role = await this.getUserRole(adminId);
    if (role === 'hyper_admin' || role === 'hyper_manager') return true;

    const result = await this.assignmentRepo.manager.query(
      `SELECT COUNT(*) as count FROM tourism_services WHERE id = $1 AND "providerId" = $2`,
      [serviceId, adminId],
    );
    return parseInt(result?.[0]?.count, 10) > 0;
  }


  /** Retourne tous les property IDs appartenant à un admin */
  async getAdminPropertyIds(adminId: number): Promise<string[]> {
    const result = await this.assignmentRepo.manager.query(
      `SELECT id FROM properties WHERE "hostId" = $1`,
      [adminId],
    );
    return result.map((r: any) => String(r.id));
  }


  /** Retourne tous les service IDs appartenant à un admin */
  async getAdminServiceIds(adminId: number): Promise<string[]> {
    const result = await this.assignmentRepo.manager.query(
      `SELECT id FROM tourism_services WHERE "providerId" = $1`,
      [adminId],
    );
    return result.map((r: any) => String(r.id));
  }
}