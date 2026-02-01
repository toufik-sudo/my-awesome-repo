import React from 'react';
import { useIntl } from 'react-intl';
import { cn } from '@/lib/utils';
import ProgramBlock from './ProgramBlock';
import { Skeleton } from '@/components/ui/skeleton';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface Program {
  id: number;
  name: string;
  programType: number;
  isOpen?: boolean;
  status?: string;
  programStatus?: string;
}

export interface ProgramsListProps {
  /** Array of programs to display */
  programs: Program[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** User role information */
  userRole?: {
    isBeneficiary?: boolean;
    isAdmin?: boolean;
  };
  /** Platform information */
  platform?: {
    companyName?: string;
  };
  /** Set of program IDs with pending invitations */
  pendingInvitations?: Set<number>;
  /** Set of program IDs awaiting admin approval */
  pendingJoinRequests?: Set<number>;
  /** Program ID currently being processed */
  processingProgramId?: number | null;
  /** Callback to accept invitation */
  onAcceptInvitation?: (programId: number) => void;
  /** Callback to decline invitation */
  onDeclineInvitation?: (programId: number) => void;
  /** Callback to open a program */
  onOpenProgram?: (programId: number) => void;
  /** Grid columns configuration */
  columns?: 1 | 2 | 3 | 4;
  /** Additional CSS classes */
  className?: string;
  /** Empty state message key */
  emptyMessageId?: string;
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

const ProgramsListSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <div
    className={cn(
      'grid gap-4',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    )}
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="p-6 border rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-full max-w-[200px]" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    ))}
  </div>
);

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

/**
 * ProgramsList displays a grid of program cards
 * Handles loading states, empty states, and invitation interactions
 * 
 * @example
 * ```tsx
 * <ProgramsList
 *   programs={userPrograms}
 *   isLoading={isLoading}
 *   userRole={{ isBeneficiary: true }}
 *   onOpenProgram={(id) => navigate(`/programs/${id}`)}
 *   columns={3}
 * />
 * ```
 */
const ProgramsList: React.FC<ProgramsListProps> = ({
  programs,
  isLoading = false,
  userRole,
  platform,
  pendingInvitations = new Set(),
  pendingJoinRequests = new Set(),
  processingProgramId = null,
  onAcceptInvitation,
  onDeclineInvitation,
  onOpenProgram,
  columns = 3,
  className,
  emptyMessageId = 'programs.list.empty',
}) => {
  const intl = useIntl();

  // Loading state
  if (isLoading) {
    return <ProgramsListSkeleton columns={columns} />;
  }

  // Empty state
  if (programs.length === 0) {
    return (
      <div className={cn('text-center py-12 text-muted-foreground', className)}>
        <p>{intl.formatMessage({ id: emptyMessageId })}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {programs.map((program) => (
        <ProgramBlock
          key={program.id}
          program={program}
          userRole={userRole}
          platform={platform}
          isInvitationPending={pendingInvitations.has(program.id)}
          isJoinPending={pendingJoinRequests.has(program.id)}
          isProcessing={processingProgramId === program.id}
          onAcceptInvitation={
            onAcceptInvitation ? () => onAcceptInvitation(program.id) : undefined
          }
          onDeclineInvitation={
            onDeclineInvitation ? () => onDeclineInvitation(program.id) : undefined
          }
          onOpen={onOpenProgram ? () => onOpenProgram(program.id) : undefined}
        />
      ))}
    </div>
  );
};

export default ProgramsList;
