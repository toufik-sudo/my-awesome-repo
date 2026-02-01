// -----------------------------------------------------------------------------
// UserDetailsBlock Component
// User profile details view with programs and information sections
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  User
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UserProgram {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt?: string;
  points?: number;
}

export interface UserDetails {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  department?: string;
  location?: string;
  createdAt?: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  programs?: UserProgram[];
  metadata?: Record<string, string>;
}

export interface UserDetailsBlockProps {
  user: UserDetails | null;
  isLoading?: boolean;
  backPath?: string;
  backLabel?: string;
  onEdit?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Status Badge Component
// -----------------------------------------------------------------------------

const StatusBadge: React.FC<{ status: UserDetails['status'] }> = ({ status }) => {
  const config = {
    active: { icon: CheckCircle2, label: 'Active', variant: 'default' as const },
    inactive: { icon: XCircle, label: 'Inactive', variant: 'secondary' as const },
    pending: { icon: Clock, label: 'Pending', variant: 'outline' as const },
    blocked: { icon: XCircle, label: 'Blocked', variant: 'destructive' as const }
  };

  const { icon: Icon, label, variant } = config[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

// -----------------------------------------------------------------------------
// Info Row Component
// -----------------------------------------------------------------------------

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Loading Skeleton
// -----------------------------------------------------------------------------

const UserDetailsSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </CardContent>
  </Card>
);

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const UserDetailsBlock: React.FC<UserDetailsBlockProps> = ({
  user,
  isLoading = false,
  backPath = '/users',
  backLabel = 'Back to Users',
  onEdit,
  onBlock,
  onUnblock,
  className
}) => {
  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">User not found</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to={backPath}>{backLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown User';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to={backPath}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          {user.status !== 'blocked' && onBlock && (
            <Button variant="destructive" size="sm" onClick={onBlock}>
              Block User
            </Button>
          )}
          {user.status === 'blocked' && onUnblock && (
            <Button variant="outline" size="sm" onClick={onUnblock}>
              Unblock User
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={fullName} />
              <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-xl">{fullName}</CardTitle>
                <StatusBadge status={user.status} />
              </div>
              {user.role && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          
          {/* Contact Information */}
          <div className="grid gap-2">
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={user.email}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={user.phone}
            />
            <InfoRow
              icon={<Building className="h-4 w-4" />}
              label="Department"
              value={user.department}
            />
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={user.location}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Member Since"
              value={user.createdAt}
            />
          </div>
        </CardContent>
      </Card>

      {/* Programs Section */}
      {user.programs && user.programs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.programs.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium">{program.name}</p>
                    <p className="text-sm text-muted-foreground">{program.role}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={program.status} />
                    {program.points !== undefined && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {program.points.toLocaleString()} pts
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Section */}
      {user.metadata && Object.keys(user.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(user.metadata).map(([key, value]) => (
                <div key={key} className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDetailsBlock;
