// -----------------------------------------------------------------------------
// AgendaWidget Component
// Displays calendar/agenda with tasks for selected day
// Migrated from old_app/src/components/molecules/wall/widgets/AgendaWidget.tsx
// -----------------------------------------------------------------------------

import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { WidgetCard } from './WidgetCard';
import { Loading } from '@/components/library/atoms/Loading';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgendaTasks } from '@/api/hooks/useWidgetApi';
import { useWallSelection } from '@/hooks/wall';
import { createPeriodAroundDate, prepareAgendaTasks } from '@/services/wall/agenda';

interface AgendaTask {
  id: number;
  title: string;
  time: string;
  type?: 'task' | 'event' | 'meeting';
}

interface AgendaWidgetProps {
  className?: string;
  tasks?: AgendaTask[];
  isLoading?: boolean;
  colorMainButtons?: string;
  colorWidgetTitle?: string;
  minDate?: Date;
  onDateChange?: (date: Date) => void;
  platformId?: number;
  programId?: number;
}

const VISIBLE_DAYS = 5;
const MAX_VISIBLE_TASKS = 4;

const AgendaWidget: React.FC<AgendaWidgetProps> = ({
  className,
  tasks: externalTasks,
  isLoading: externalLoading,
  colorMainButtons,
  colorWidgetTitle,
  minDate,
  onDateChange,
  platformId: propPlatformId,
  programId: propProgramId,
}) => {
  // Get context values
  const wallSelection = useWallSelection();
  const platformId = propPlatformId ?? wallSelection?.selectedPlatform?.id;
  const programId = propProgramId ?? wallSelection?.selectedProgramId;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  // Create period around selected date for API call
  const period = useMemo(() => createPeriodAroundDate(selectedDate), [selectedDate]);
  
  // Use API hook for agenda tasks
  const { data: apiTasks, isLoading: apiLoading } = useAgendaTasks(platformId, period, programId);
  
  // Prepare tasks for display
  const preparedTasks = useMemo(() => {
    if (!apiTasks) return [];
    const dailyTasks = prepareAgendaTasks(apiTasks);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return dailyTasks[dateKey] || [];
  }, [apiTasks, selectedDate]);
  
  // Use external values if provided, otherwise use API data
  const tasks = externalTasks ?? preparedTasks;
  const isLoading = externalLoading ?? apiLoading;

  // Generate array of dates for the slider
  const generateDates = () => {
    const dates: Date[] = [];
    const startOffset = Math.floor(VISIBLE_DAYS / 2);
    
    for (let i = -startOffset; i <= startOffset; i++) {
      dates.push(addDays(selectedDate, i));
    }
    return dates;
  };

  const dates = generateDates();
  const currentTasks = tasks;

  const handlePrevDay = () => {
    const newDate = subDays(selectedDate, 1);
    if (!minDate || newDate >= minDate) {
      setSelectedDate(newDate);
      onDateChange?.(newDate);
    }
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const handleDateSelect = (date: Date) => {
    if (!minDate || date >= minDate) {
      setSelectedDate(date);
      onDateChange?.(date);
    }
  };

  const visibleTasks = showAllTasks ? currentTasks : currentTasks.slice(0, MAX_VISIBLE_TASKS);
  const hasMoreTasks = currentTasks.length > MAX_VISIBLE_TASKS;

  return (
    <WidgetCard
      title={
        <span style={colorWidgetTitle ? { color: colorWidgetTitle } : undefined}>
          <FormattedMessage id="wall.agendaWidget.title" defaultMessage="Agenda" />
        </span>
      }
      className={cn('min-h-[280px]', className)}
      accentColor="primary"
      hideOnMobile
    >
      <div className="flex flex-col space-y-4">
        {/* Date Slider */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handlePrevDay}
            disabled={minDate && subDays(selectedDate, 1) < minDate}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1 overflow-hidden">
            {dates.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isDisabled = minDate && date < minDate;
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  disabled={isDisabled}
                  className={cn(
                    'flex flex-col items-center px-2 py-1 rounded-lg transition-all',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 text-primary',
                    isDisabled && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {format(date, 'EEE')}
                  </span>
                  <span className={cn(
                    'text-lg font-semibold',
                    isSelected && 'text-primary'
                  )}>
                    {format(date, 'd')}
                  </span>
                </button>
              );
            })}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleNextDay}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loading type="local" size="sm" />
          </div>
        ) : currentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Calendar className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm text-center">
              <FormattedMessage 
                id="wall.agendaWidget.noTasks" 
                defaultMessage="No tasks for this day" 
              />
            </p>
          </div>
        ) : (
          <ScrollArea className={cn('pr-2', showAllTasks ? 'max-h-48' : 'max-h-36')}>
            <div className="space-y-2">
              {visibleTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center justify-between py-2 px-2 rounded-md',
                    'border-b border-border/50 last:border-0',
                    'hover:bg-muted/30 transition-colors',
                    index === MAX_VISIBLE_TASKS - 1 && !showAllTasks && hasMoreTasks && 'opacity-50'
                  )}
                >
                  <span className="text-sm font-medium truncate max-w-[60%]">
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {task.time}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Show More/Less Toggle */}
        {hasMoreTasks && (
          <Button
            variant="link"
            className="p-0 h-auto font-medium mx-auto"
            onClick={() => setShowAllTasks(!showAllTasks)}
            style={colorMainButtons ? { color: colorMainButtons } : undefined}
          >
            <FormattedMessage
              id={showAllTasks ? 'wall.agendaWidget.hide.all' : 'wall.agendaWidget.see.all'}
              defaultMessage={showAllTasks ? 'Show less' : 'Show all'}
            />
          </Button>
        )}
      </div>
    </WidgetCard>
  );
};

export { AgendaWidget };
export default AgendaWidget;
