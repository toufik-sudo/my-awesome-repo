import React, { useState, useCallback, memo } from 'react';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { hyperManagementApi } from '@/modules/admin/hyper-management.api';
import { usePermissions } from '@/hooks/usePermissions';
import type { UserWithRoles } from '@/modules/admin/admin.types';
import {
  Pause, Play, Archive, RotateCcw, Shield, ShieldCheck, ShieldAlert,
  AlertTriangle, Loader2,
} from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  hyper_admin: 'destructive',
  hyper_manager: 'destructive',
  admin: 'default',
  manager: 'secondary',
  user: 'outline',
};

interface UserManageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRoles | null;
  onRefresh: () => void;
}

export const UserManageModal: React.FC<UserManageModalProps> = memo(({ open, onOpenChange, user, onRefresh }) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const { isTargetAdmin } = usePermissions();

  const handleAction = useCallback(async (action: string) => {
    if (!user) return;
    setActionLoading(action);
    try {
      switch (action) {
        case 'pause':
          await hyperManagementApi.pauseUser(user.id);
          toast.success(`Utilisateur ${user.email} mis en pause — propriétés/services suspendus, managers détachés`);
          break;
        case 'resume':
          await hyperManagementApi.resumeUser(user.id);
          toast.success(`Utilisateur ${user.email} réactivé — propriétés/services restaurés`);
          break;
        case 'archive':
          await hyperManagementApi.archiveUser(user.id);
          toast.success(`Utilisateur ${user.email} archivé — toutes les données sont gelées`);
          break;
        case 'reactivate':
          await hyperManagementApi.reactivateUser(user.id);
          toast.success(`Utilisateur ${user.email} complètement réactivé`);
          break;
      }
      setConfirmAction(null);
      onRefresh();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'action');
    } finally { setActionLoading(null); }
  }, [user, onRefresh, onOpenChange]);

  if (!user) return null;

  const targetIsAdmin = isTargetAdmin(user.role);
  const isInactive = !user.isActive;

  return (
    <DynamicModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Gérer — ${user.firstName || ''} ${user.lastName || ''}`}
      description={user.email}
      size="md"
    >
      <div className="space-y-4">
        {/* User Info */}
        <div className="flex flex-wrap gap-2">
          {user.role && (
            <Badge variant={ROLE_COLORS[user.role] as any} className="gap-1">
              {user.role === 'hyper_admin' || user.role === 'hyper_manager' ? <ShieldAlert className="h-3 w-3" /> :
               user.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> :
               user.role === 'manager' ? <Shield className="h-3 w-3" /> : null}
              {user.role.replace('_', ' ')}
            </Badge>
          )}
          <Badge variant={isInactive ? 'destructive' : 'default'}>
            {isInactive ? 'Inactif' : 'Actif'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Actions</p>

          {!isInactive ? (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                onClick={() => setConfirmAction('pause')}
                disabled={!!actionLoading}
              >
                <Pause className="h-4 w-4" />
                Mettre en pause — suspend propriétés/services, détache managers
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => setConfirmAction('archive')}
                disabled={!!actionLoading}
              >
                <Archive className="h-4 w-4" />
                Archiver (soft delete) — gèle tout, auto-suppression après TTL
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                onClick={() => setConfirmAction('resume')}
                disabled={!!actionLoading}
              >
                <Play className="h-4 w-4" />
                Reprendre — restaure propriétés/services (managers manuels)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-primary border-primary/30 hover:bg-primary/5"
                onClick={() => setConfirmAction('reactivate')}
                disabled={!!actionLoading}
              >
                <RotateCcw className="h-4 w-4" />
                Réactiver complètement — restaure tout y compris les archives
              </Button>
            </>
          )}
        </div>

        {/* Cascade info */}
        {targetIsAdmin && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Impact en cascade (admin/hôte)</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                  <li>Toutes ses propriétés seront suspendues/archivées</li>
                  <li>Tous ses services seront suspendus/archivés</li>
                  <li>Tous ses managers seront détachés</li>
                  <li>Les guests ne pourront plus réserver ses propriétés</li>
                  <li>L'utilisateur ne pourra plus effectuer d'actions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {confirmAction && (
          <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5 space-y-3">
            <p className="text-sm font-medium">
              Confirmer : <strong>
                {confirmAction === 'pause' ? 'Mettre en pause' :
                 confirmAction === 'resume' ? 'Reprendre' :
                 confirmAction === 'archive' ? 'Archiver' :
                 'Réactiver'}
              </strong> cet utilisateur ?
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmAction(null)}>Annuler</Button>
              <Button
                size="sm"
                variant={confirmAction === 'archive' ? 'destructive' : 'default'}
                onClick={() => handleAction(confirmAction)}
                disabled={!!actionLoading}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                Confirmer
              </Button>
            </div>
          </div>
        )}
      </div>
    </DynamicModal>
  );
});

UserManageModal.displayName = 'UserManageModal';
