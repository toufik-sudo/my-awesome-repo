// -----------------------------------------------------------------------------
// Programs Filters Component
// Provides filtering by superplatform, platform, programs (multi-select), and program type
// -----------------------------------------------------------------------------

import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter, Layers, Building2, Tag, FileText } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { IPlatform, IProgram } from '../types';
import { PROGRAM_TYPE_LABELS, TypeFilterOption } from '@/constants/programs';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';

interface ProgramsFiltersProps {
  superPlatforms: IPlatform[];
  platforms: IPlatform[];
  programs: IProgram[];
  selectedSuperPlatformId: number | null;
  selectedPlatformId: number | null;
  selectedProgramIds: number[];
  selectedProgramType: number | null;
  onSuperPlatformChange: (id: number | null) => void;
  onPlatformChange: (id: number | null) => void;
  onProgramsChange: (ids: number[]) => void;
  onProgramTypeChange: (type: number | null) => void;
  onClearFilters: () => void;
  showAdminFilters?: boolean;
}

const ProgramsFilters: React.FC<ProgramsFiltersProps> = ({
  superPlatforms,
  platforms,
  programs,
  selectedSuperPlatformId,
  selectedPlatformId,
  selectedProgramIds,
  selectedProgramType,
  onSuperPlatformChange,
  onPlatformChange,
  onProgramsChange,
  onProgramTypeChange,
  onClearFilters,
  showAdminFilters = false,
}) => {
  const { formatMessage } = useIntl();

  // Get available platforms based on selected superplatform
  const availablePlatforms = useMemo(() => {
    if (!selectedSuperPlatformId) {
      // Show all non-super platforms
      return platforms.filter(p => 
        p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM &&
        p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
      );
    }
    
    // Show sub-platforms of selected superplatform
    const superPlatform = superPlatforms.find(sp => sp.id === selectedSuperPlatformId);
    return superPlatform?.subPlatforms || platforms.filter(p => 
      p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM
    );
  }, [selectedSuperPlatformId, platforms, superPlatforms]);

  // Program options for multi-select
  const programOptions = useMemo(() => {
    return programs
      .filter(p => p.id !== 0)
      .map(p => ({
        value: p.id,
        label: p.name,
      }));
  }, [programs]);

  const hasActiveFilters = selectedSuperPlatformId !== null || 
                           selectedPlatformId !== null || 
                           selectedProgramIds.length > 0 ||
                           selectedProgramType !== null;

  const programTypeOptions = Object.entries(PROGRAM_TYPE_LABELS);

  // Handle programs multi-select change
  const handleProgramsChange = (selected: (string | number)[]) => {
    onProgramsChange(selected.map(v => Number(v)));
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{formatMessage({ id: 'programs.filters', defaultMessage: 'Filters' })}</span>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            {formatMessage({ id: 'programs.clearFilters', defaultMessage: 'Clear all' })}
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Super Platform Filter - Only for admin users */}
        {showAdminFilters && superPlatforms.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {formatMessage({ id: 'programs.superPlatform', defaultMessage: 'Super Platform' })}
            </label>
            <Select
              value={selectedSuperPlatformId?.toString() || 'all'}
              onValueChange={(value) => {
                onSuperPlatformChange(value === 'all' ? null : parseInt(value));
                // Reset platform filter when superplatform changes
                onPlatformChange(null);
              }}
            >
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder={formatMessage({ id: 'programs.allSuperPlatforms', defaultMessage: 'All Super Platforms' })} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="all">
                  {formatMessage({ id: 'programs.allSuperPlatforms', defaultMessage: 'All Super Platforms' })}
                </SelectItem>
                {superPlatforms.map((sp) => (
                  <SelectItem key={sp.id} value={sp.id.toString()}>
                    {sp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Platform Filter */}
        {availablePlatforms.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {formatMessage({ id: 'programs.platform', defaultMessage: 'Platform' })}
            </label>
            <Select
              value={selectedPlatformId?.toString() || 'all'}
              onValueChange={(value) => onPlatformChange(value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder={formatMessage({ id: 'programs.allPlatforms', defaultMessage: 'All Platforms' })} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="all">
                  {formatMessage({ id: 'programs.allPlatforms', defaultMessage: 'All Platforms' })}
                </SelectItem>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id.toString()}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Programs Multi-Select Filter */}
        {programOptions.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {formatMessage({ id: 'programs.programNames', defaultMessage: 'Programs' })}
            </label>
            <MultiSelect
              options={programOptions}
              selected={selectedProgramIds}
              onChange={handleProgramsChange}
              placeholder={formatMessage({ id: 'programs.selectPrograms', defaultMessage: 'Select programs...' })}
              allLabel={formatMessage({ id: 'programs.selectAll', defaultMessage: 'All' })}
              clearLabel={formatMessage({ id: 'programs.clear', defaultMessage: 'Clear' })}
              className="w-[240px]"
            />
          </div>
        )}

        {/* Program Type Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {formatMessage({ id: 'programs.programType', defaultMessage: 'Program Type' })}
          </label>
          <Select
            value={selectedProgramType?.toString() || 'all'}
            onValueChange={(value) => onProgramTypeChange(value === 'all' ? null : parseInt(value))}
          >
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder={formatMessage({ id: 'programs.allTypes', defaultMessage: 'All Types' })} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">
                {formatMessage({ id: 'programs.allTypes', defaultMessage: 'All Types' })}
              </SelectItem>
              {programTypeOptions.map(([typeId, label]) => (
                <SelectItem key={typeId} value={typeId}>
                  {formatMessage({ id: `program.type.${label.toLowerCase()}`, defaultMessage: label })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedSuperPlatformId && (
            <Badge variant="secondary" className="gap-1">
              <Layers className="h-3 w-3" />
              {superPlatforms.find(sp => sp.id === selectedSuperPlatformId)?.name}
              <button 
                onClick={() => {
                  onSuperPlatformChange(null);
                  onPlatformChange(null);
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedPlatformId && (
            <Badge variant="secondary" className="gap-1">
              <Building2 className="h-3 w-3" />
              {availablePlatforms.find(p => p.id === selectedPlatformId)?.name}
              <button 
                onClick={() => onPlatformChange(null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedProgramIds.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              {selectedProgramIds.length} {formatMessage({ id: 'programs.selected', defaultMessage: 'selected' })}
              <button 
                onClick={() => onProgramsChange([])}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedProgramType && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {PROGRAM_TYPE_LABELS[selectedProgramType]}
              <button 
                onClick={() => onProgramTypeChange(null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramsFilters;
