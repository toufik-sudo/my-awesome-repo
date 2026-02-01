// -----------------------------------------------------------------------------
// GlobalSlider Component
// Platform and Program dropdown selectors for wall view
// Migrated from old_app with modern shadcn/ui components
// -----------------------------------------------------------------------------

import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Building2, Layers } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWallSelection } from '@/hooks/wall';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { setSelectedProgram, setSelectedPlatform, setPrograms } from '../store/wallReducer';
import { IProgram, IPlatform, ISelectedPlatform } from '../types';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { cn } from '@/lib/utils';

interface GlobalSliderProps {
  className?: string;
  showPlatformSelector?: boolean;
  showProgramSelector?: boolean;
  platformLabel?: boolean;
  programLabel?: boolean;
}

const GlobalSlider: React.FC<GlobalSliderProps> = ({
  className,
  showPlatformSelector = true,
  showProgramSelector = true,
  platformLabel = true,
  programLabel = true,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const {
    platforms,
    programs,
    selectedPlatform,
    selectedProgramId,
    isProgramSelectionLocked,
  } = useWallSelection();

  // Platform options
  const platformOptions = useMemo(() => {
    return platforms
      .filter(p => p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM)
      .map((platform, index) => ({
        value: platform.id.toString(),
        label: platform.name,
        index,
        platform,
      }));
  }, [platforms]);

  // Program options with "All" option
  const programOptions = useMemo(() => {
    const options = [
      {
        value: 'all',
        label: formatMessage({ id: 'wall.allPrograms', defaultMessage: 'All Programs' }),
      },
    ];
    
    programs
      .filter(p => p.id !== 0)
      .forEach((program) => {
        options.push({
          value: program.id.toString(),
          label: program.name,
        });
      });
    
    return options;
  }, [programs, formatMessage]);

  // Handle platform change
  const handlePlatformChange = useCallback((value: string) => {
    if (isProgramSelectionLocked) return;
    
    const option = platformOptions.find(o => o.value === value);
    if (!option) return;

    const platform = option.platform;
    const selected: ISelectedPlatform = {
      index: option.index,
      name: platform.name,
      id: platform.id,
      role: platform.role,
      status: platform.status,
      hierarchicType: platform.hierarchicType || PLATFORM_HIERARCHIC_TYPE.INDEPENDENT,
    };
    
    dispatch(setSelectedPlatform(selected));
    dispatch(setPrograms(platform.programs || []));
  }, [dispatch, platformOptions, isProgramSelectionLocked]);

  // Handle program change
  const handleProgramChange = useCallback((value: string) => {
    if (isProgramSelectionLocked) return;
    
    if (value === 'all') {
      dispatch(setSelectedProgram(undefined, null, ''));
      return;
    }

    const programId = parseInt(value, 10);
    const programIndex = programs.findIndex(p => p.id === programId);
    const program = programs[programIndex];
    
    if (program) {
      dispatch(setSelectedProgram(program.id, programIndex, program.name));
    }
  }, [dispatch, programs, isProgramSelectionLocked]);

  if (!platforms.length) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Platform Selector */}
      {showPlatformSelector && platforms.length > 1 && (
        <div className="flex flex-col gap-1.5">
          {platformLabel && (
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {formatMessage({ id: 'wall.platform', defaultMessage: 'Platform' })}
            </label>
          )}
          <Select
            value={selectedPlatform.id?.toString() || ''}
            onValueChange={handlePlatformChange}
            disabled={isProgramSelectionLocked}
          >
            <SelectTrigger className="w-[200px] bg-card border-border">
              <SelectValue 
                placeholder={formatMessage({ 
                  id: 'wall.selectPlatform', 
                  defaultMessage: 'Select Platform' 
                })} 
              />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {platformOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Program Selector */}
      {showProgramSelector && programs.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {programLabel && (
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {formatMessage({ id: 'wall.program', defaultMessage: 'Program' })}
            </label>
          )}
          <Select
            value={selectedProgramId?.toString() || 'all'}
            onValueChange={handleProgramChange}
            disabled={isProgramSelectionLocked}
          >
            <SelectTrigger className="w-[200px] bg-card border-border">
              <SelectValue 
                placeholder={formatMessage({ 
                  id: 'wall.selectProgram', 
                  defaultMessage: 'Select Program' 
                })} 
              />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {programOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export { GlobalSlider };
export default GlobalSlider;
