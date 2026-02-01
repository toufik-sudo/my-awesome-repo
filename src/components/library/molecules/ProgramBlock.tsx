import React from 'react';
import { useIntl } from 'react-intl';
import { Lock, LockOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProgramBlockProps {
  /** Program data */
  program: {
    id: number;
    name: string;
    programType: number;
    isOpen?: boolean;
    status?: string;
    programStatus?: string;
  };
  /** User role information */
  userRole?: {
    isBeneficiary?: boolean;
    isAdmin?: boolean;
  };
  /** Platform information for invitations */
  platform?: {
    companyName?: string;
  };
  /** Whether user has pending invitation */
  isInvitationPending?: boolean;
  /** Whether user is waiting for admin approval */
  isJoinPending?: boolean;
  /** Whether an invitation action is processing */
  isProcessing?: boolean;
  /** Callback to accept invitation */
  onAcceptInvitation?: () => void;
  /** Callback to decline invitation */
  onDeclineInvitation?: () => void;
  /** Callback to open/join the program */
  onOpen?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PROGRAM_TYPE_LABELS: Record<number, string> = {
  1: 'program.type.challenge',
  2: 'program.type.loyalty',
  3: 'program.type.sponsorship',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * ProgramBlock displays a program card with status and action controls
 * Supports invitation acceptance, join requests, and program access
 * 
 * @example
 * ```tsx
 * <ProgramBlock
 *   program={programData}
 *   userRole={{ isBeneficiary: true }}
 *   isInvitationPending={true}
 *   onAcceptInvitation={() => handleAccept(programData.id)}
 *   onDeclineInvitation={() => handleDecline(programData.id)}
 * />
 * ```
 */
const ProgramBlock: React.FC<ProgramBlockProps> = ({
  program,
  userRole = {},
  platform,
  isInvitationPending = false,
  isJoinPending = false,
  isProcessing = false,
  onAcceptInvitation,
  onDeclineInvitation,
  onOpen,
  className,
}) => {
  const intl = useIntl();
  const { name, programType, isOpen } = program;
  const { isBeneficiary } = userRole;

  const programTypeLabel = PROGRAM_TYPE_LABELS[programType] || 'program.type.default';
  const hasLongName = name && name.length > 20;

  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full">
        {/* Program Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          {!isBeneficiary && (
            isOpen ? (
              <LockOpen className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )
          )}
          <Badge variant="secondary">
            {intl.formatMessage({ id: programTypeLabel })}
          </Badge>
        </div>

        {/* Invitation Notice */}
        {isInvitationPending && platform?.companyName && (
          <p className="text-sm text-muted-foreground mb-2">
            {intl.formatMessage(
              { id: 'program.tojoin' },
              { companyName: platform.companyName }
            )}
          </p>
        )}

        {/* Program Name */}
        <h3
          className={cn(
            'text-2xl font-bold text-secondary-foreground mb-4 max-w-full',
            hasLongName && 'text-xl truncate'
          )}
          title={name}
        >
          {name}
        </h3>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2 w-full">
          {/* Invitation Controls */}
          {isInvitationPending && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={onAcceptInvitation}
                disabled={isProcessing}
                className="w-full"
              >
                {intl.formatMessage({ id: 'program.invitation.accept' })}
              </Button>
              <Button
                variant="outline"
                onClick={onDeclineInvitation}
                disabled={isProcessing}
                className="w-full"
              >
                {intl.formatMessage({ id: 'program.invitation.decline' })}
              </Button>
            </div>
          )}

          {/* Join Pending Status */}
          {isJoinPending && (
            <Button variant="secondary" disabled className="w-full">
              {intl.formatMessage({ id: 'programs.status.admin.pending' })}
            </Button>
          )}

          {/* Regular Open Button */}
          {!isInvitationPending && !isJoinPending && onOpen && (
            <Button onClick={onOpen} className="w-full">
              {intl.formatMessage({ id: 'program.open' })}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramBlock;
