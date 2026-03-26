import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { invitationsApi } from '../admin.api';
import type { UserStatus } from '../admin.constants';
import {
  MoreHorizontal,
  Pause,
  Play,
  Ban,
  Trash2,
  Shield,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';

interface UserStatusActionsProps {
  userId: number;
  currentStatus?: string;
  userName?: string;
  onStatusChange?: () => void;
}

const STATUS_BADGES: Record<string, { variant: any; label: string }> = {
  active: { variant: 'default', label: 'Active' },
  paused: { variant: 'secondary', label: 'Paused' },
  disabled: { variant: 'destructive', label: 'Disabled' },
};

export const UserStatusBadge: React.FC<{ status?: string }> = ({ status = 'active' }) => {
  const cfg = STATUS_BADGES[status] || STATUS_BADGES.active;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const UserStatusActions: React.FC<UserStatusActionsProps> = ({
  userId,
  currentStatus = 'active',
  userName = 'User',
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAction = useCallback(async (action: string, newStatus: UserStatus) => {
    const result = await Swal.fire({
      title: `${action} ${userName}?`,
      text: `This will ${action.toLowerCase()} the user account.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-themed',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await invitationsApi.updateUserStatus(userId, newStatus);
      toast.success(`User ${action.toLowerCase()}d successfully`);
      onStatusChange?.();
    } catch {
      toast.error(`Failed to ${action.toLowerCase()} user`);
    } finally {
      setLoading(false);
    }
  }, [userId, userName, onStatusChange]);

  const handleDelete = useCallback(async () => {
    const result = await Swal.fire({
      title: `Delete ${userName}?`,
      text: 'This action cannot be undone. All user data will be permanently deleted.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Delete Permanently',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-themed',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await invitationsApi.deleteUser(userId);
      toast.success('User deleted');
      onStatusChange?.();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  }, [userId, userName, onStatusChange]);

  if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border border-border">
        {currentStatus !== 'paused' && (
          <DropdownMenuItem onClick={() => handleAction('Pause', 'paused')} className="gap-2">
            <Pause className="h-3.5 w-3.5" /> Pause Account
          </DropdownMenuItem>
        )}
        {currentStatus === 'paused' && (
          <DropdownMenuItem onClick={() => handleAction('Activate', 'active')} className="gap-2">
            <Play className="h-3.5 w-3.5" /> Reactivate
          </DropdownMenuItem>
        )}
        {currentStatus !== 'disabled' && (
          <DropdownMenuItem onClick={() => handleAction('Disable', 'disabled')} className="gap-2 text-amber-600">
            <Ban className="h-3.5 w-3.5" /> Disable Account
          </DropdownMenuItem>
        )}
        {currentStatus === 'disabled' && (
          <DropdownMenuItem onClick={() => handleAction('Activate', 'active')} className="gap-2">
            <Shield className="h-3.5 w-3.5" /> Enable Account
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive">
          <Trash2 className="h-3.5 w-3.5" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
