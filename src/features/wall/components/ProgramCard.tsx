// -----------------------------------------------------------------------------
// Program Card Component
// Enhanced card design for displaying program information
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  Calendar, 
  Users, 
  Trophy, 
  Heart, 
  Gift, 
  Zap,
  Star
} from 'lucide-react';
import { IProgram } from '../types';
import { PROGRAM_TYPE_LABELS } from '@/constants/programs';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProgramCardProps {
  program: IProgram;
  onSelect: () => void;
  isSelected?: boolean;
}

const PROGRAM_TYPE_ICONS: Record<number, React.ReactNode> = {
  1: <Trophy className="h-5 w-5" />,      // Challenge
  2: <Heart className="h-5 w-5" />,       // Loyalty
  3: <Gift className="h-5 w-5" />,        // Sponsorship
  4: <Zap className="h-5 w-5" />          // Freemium
};

const PROGRAM_TYPE_COLORS: Record<number, string> = {
  1: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  2: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
  3: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  4: 'from-violet-500/20 to-purple-500/20 border-violet-500/30'
};

const PROGRAM_TYPE_ICON_COLORS: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-rose-500',
  3: 'text-emerald-500',
  4: 'text-violet-500'
};

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  onSelect,
  isSelected = false 
}) => {
  const { formatMessage } = useIntl();
  
  const programType = program.programType || 1;
  const typeLabel = PROGRAM_TYPE_LABELS[programType] || 'Program';
  const typeIcon = PROGRAM_TYPE_ICONS[programType] || <Star className="h-5 w-5" />;
  const gradientClass = PROGRAM_TYPE_COLORS[programType] || 'from-primary/20 to-primary/10 border-primary/30';
  const iconColorClass = PROGRAM_TYPE_ICON_COLORS[programType] || 'text-primary';

  const getStatusBadge = () => {
    if (program.status === 'active' || program.programStatus === 1) {
      return (
        <Badge variant="default" className="bg-emerald-500/90 text-white border-0">
          {formatMessage({ id: 'program.status.active', defaultMessage: 'Active' })}
        </Badge>
      );
    }
    if (program.status === 'pending' || program.programStatus === 0) {
      return (
        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
          {formatMessage({ id: 'program.status.pending', defaultMessage: 'Pending' })}
        </Badge>
      );
    }
    if (program.status === 'finished' || program.programStatus === 3) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          {formatMessage({ id: 'program.status.finished', defaultMessage: 'Finished' })}
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        "border-2 bg-gradient-to-br",
        gradientClass,
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Program Type Icon */}
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            "bg-background/80 backdrop-blur-sm shadow-sm",
            iconColorClass
          )}>
            {typeIcon}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            <Badge variant="outline" className="text-xs font-normal">
              {formatMessage({ 
                id: `program.type.${typeLabel.toLowerCase()}`, 
                defaultMessage: typeLabel 
              })}
            </Badge>
          </div>
        </div>

        {/* Program Name */}
        <h3 className="font-semibold text-lg mt-3 line-clamp-2 group-hover:text-primary transition-colors">
          {program.name}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Program Meta */}
        <div className="space-y-3">
          {/* Date */}
          {program.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(program.startDate), 'PPP')}</span>
            </div>
          )}

          {/* Manager Badge */}
          {program.isPeopleManager && (
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="bg-primary/10 text-primary border-primary/20"
              >
                <Users className="h-3 w-3 mr-1" />
                {formatMessage({ id: 'program.role.manager', defaultMessage: 'Manager' })}
              </Badge>
            </div>
          )}

          {/* Action Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {formatMessage({ id: 'program.action.view', defaultMessage: 'View program' })}
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
