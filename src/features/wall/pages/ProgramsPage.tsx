// -----------------------------------------------------------------------------
// Programs Page Component
// Enhanced page showing available programs with filters and improved styling
// Uses /users/{uuid}/programs or /users/{uuid}/admin-programs based on user role
// -----------------------------------------------------------------------------

import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Loader2, 
  Layers, 
  Building2, 
  Grid3X3,
  LayoutList,
  RefreshCw
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { useUserRole } from '@/hooks/auth';
import { setSelectedProgram, setPrograms, setSelectedPlatform } from '../store/wallReducer';
import { IProgram, IPlatform, ISelectedPlatform } from '../types';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { ROLE, ALL_ADMIN_ROLES } from '@/constants/security/access';
import { useProgramsData, useSuperplatformManagement } from '../hooks';
import { CreateProgramModal } from '../components/CreateProgramModal';
import { CreateSuperplatformModal } from '../components/CreateSuperplatformModal';
import { InviteSuperAdminModal } from '../components/InviteSuperAdminModal';
import ProgramsFilters from '../components/ProgramsFilters';
import ProgramCard from '../components/ProgramCard';
import { cn } from '@/lib/utils';

/**
 * Check if user role is Hyper Admin or Hyper Community Manager
 */
const isHyperRole = (role: ROLE | null): boolean => {
  return role === ROLE.HYPER_ADMIN || role === ROLE.HYPER_COMMUNITY_MANAGER;
};

/**
 * Check if user role is any kind of admin
 */
const isAdminRole = (role: ROLE | null): boolean => {
  if (!role) return false;
  return ALL_ADMIN_ROLES.includes(role);
};

const ProgramsPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userRole = useUserRole();
  const isAdmin = isAdminRole(userRole);
  
  // Use the unified programs data hook (uses /users/{uuid}/programs or admin-programs)
  const { 
    platforms, 
    programs,
    superPlatforms,
    subPlatforms,
    independentPlatforms,
    isLoading, 
    isError,
    shouldUseAdminApi,
    refetch
  } = useProgramsData();

  // Superplatform management
  const {
    selectedSuperPlatform,
    selectedPlatform: managementSelectedPlatform,
    selectSuperPlatform,
    selectPlatform: selectManagementPlatform,
    getSubPlatforms
  } = useSuperplatformManagement();

  // Local state
  const [displaySelectedPlatform, setDisplaySelectedPlatform] = useState<IPlatform | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [selectedSuperPlatformId, setSelectedSuperPlatformId] = useState<number | null>(null);
  const [selectedPlatformId, setSelectedPlatformId] = useState<number | null>(null);
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);
  const [selectedProgramType, setSelectedProgramType] = useState<number | null>(null);

  // Modal states
  const [isCreateProgramModalOpen, setIsCreateProgramModalOpen] = useState(false);
  const [isCreateSuperplatformModalOpen, setIsCreateSuperplatformModalOpen] = useState(false);
  const [isInviteSuperAdminModalOpen, setIsInviteSuperAdminModalOpen] = useState(false);
  const [superplatformModalType, setSuperplatformModalType] = useState<PLATFORM_HIERARCHIC_TYPE>(
    PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM
  );
  const [parentPlatformForSubplatform, setParentPlatformForSubplatform] = useState<IPlatform | null>(null);
  const [platformForInvite, setPlatformForInvite] = useState<IPlatform | null>(null);
  
  const isHyper = isHyperRole(userRole);

  // Filtered programs based on current selection
  const filteredPrograms = useMemo(() => {
    let result = programs;

    // Filter by superplatform
    if (selectedSuperPlatformId) {
      const superPlatform = superPlatforms.find(sp => sp.id === selectedSuperPlatformId);
      if (superPlatform) {
        const subPlatformIds = superPlatform.subPlatforms?.map(sp => sp.id) || [];
        const platformPrograms = platforms
          .filter(p => subPlatformIds.includes(p.id) || p.id === selectedSuperPlatformId)
          .flatMap(p => p.programs || []);
        result = platformPrograms;
      }
    }

    // Filter by specific platform
    if (selectedPlatformId) {
      const platform = platforms.find(p => p.id === selectedPlatformId);
      result = platform?.programs || [];
    }

    // Filter by selected program IDs (multi-select)
    if (selectedProgramIds.length > 0) {
      result = result.filter(p => selectedProgramIds.includes(p.id));
    }

    // Filter by program type
    if (selectedProgramType !== null) {
      result = result.filter(p => p.programType === selectedProgramType);
    }

    return result.filter(p => p.id !== 0);
  }, [programs, platforms, superPlatforms, selectedSuperPlatformId, selectedPlatformId, selectedProgramIds, selectedProgramType]);

  // Handle program selection
  const handleSelectProgram = (program: IProgram, programIndex: number) => {
    dispatch(setSelectedProgram(program.id, programIndex, program.name));
    navigate('/wall');
  };

  // Handle platform selection
  const handleSelectPlatform = (platform: IPlatform) => {
    setDisplaySelectedPlatform(platform);
    setSelectedPlatformId(platform.id);
    
    const selected: ISelectedPlatform = {
      index: platforms.findIndex(p => p.id === platform.id),
      name: platform.name,
      id: platform.id,
      role: platform.role,
      status: platform.status,
      hierarchicType: platform.hierarchicType || PLATFORM_HIERARCHIC_TYPE.INDEPENDENT
    };
    dispatch(setSelectedPlatform(selected));
    dispatch(setPrograms(platform.programs || []));
  };

  // Handle superplatform expand/collapse
  const handleSuperPlatformClick = (platform: IPlatform) => {
    if (selectedSuperPlatform?.id === platform.id) {
      selectSuperPlatform(null);
      setSelectedSuperPlatformId(null);
    } else {
      selectSuperPlatform(platform);
      setSelectedSuperPlatformId(platform.id);
    }
    setSelectedPlatformId(null);
    setDisplaySelectedPlatform(null);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedSuperPlatformId(null);
    setSelectedPlatformId(null);
    setSelectedProgramIds([]);
    setSelectedProgramType(null);
    setDisplaySelectedPlatform(null);
    selectSuperPlatform(null);
  };

  // Modal handlers
  const handleOpenCreateSuperplatform = () => {
    setSuperplatformModalType(PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM);
    setParentPlatformForSubplatform(null);
    setIsCreateSuperplatformModalOpen(true);
  };

  const handleOpenCreateSubplatform = (parentPlatform: IPlatform) => {
    setSuperplatformModalType(PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM);
    setParentPlatformForSubplatform(parentPlatform);
    setIsCreateSuperplatformModalOpen(true);
  };

  const handlePlatformCreated = () => {
    refetch();
    setIsCreateSuperplatformModalOpen(false);
  };

  // Invite super admin handler (only for Hyper Admin)
  const handleOpenInviteSuperAdmin = (platform: IPlatform) => {
    setPlatformForInvite(platform);
    setIsInviteSuperAdminModalOpen(true);
  };

  const handleInviteSent = (email: string) => {
    console.log(`Super Admin invitation sent to ${email}`);
    setIsInviteSuperAdminModalOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              {formatMessage({ id: 'programs.loading', defaultMessage: 'Loading programs...' })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatMessage({ id: 'programs.loadingDescription', defaultMessage: 'Fetching your programs and platforms' })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive font-medium mb-4">
              {formatMessage({ id: 'programs.error', defaultMessage: 'Failed to load programs' })}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {formatMessage({ id: 'programs.retry', defaultMessage: 'Try Again' })}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {formatMessage({ id: 'programs.title', defaultMessage: 'Programs' })}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            {formatMessage({ id: 'programs.subtitle', defaultMessage: 'View and manage your programs' })}
            {shouldUseAdminApi && (
              <Badge variant="secondary" className="text-xs">
                {formatMessage({ id: 'programs.adminView', defaultMessage: 'Admin View' })}
              </Badge>
            )}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>

          {isAdmin && (
            <>
              {shouldUseAdminApi && (
                <Button variant="outline" onClick={handleOpenCreateSuperplatform}>
                  <Layers className="h-4 w-4 mr-2" />
                  {formatMessage({ id: 'superplatform.create', defaultMessage: 'New Super Platform' })}
                </Button>
              )}
              <Button onClick={() => setIsCreateProgramModalOpen(true)} className="shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                {formatMessage({ id: 'programs.createProgram', defaultMessage: 'Create Program' })}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="pt-4 pb-4">
          <ProgramsFilters
            superPlatforms={superPlatforms}
            platforms={[...independentPlatforms, ...subPlatforms]}
            programs={programs}
            selectedSuperPlatformId={selectedSuperPlatformId}
            selectedPlatformId={selectedPlatformId}
            selectedProgramIds={selectedProgramIds}
            selectedProgramType={selectedProgramType}
            onSuperPlatformChange={setSelectedSuperPlatformId}
            onPlatformChange={setSelectedPlatformId}
            onProgramsChange={setSelectedProgramIds}
            onProgramTypeChange={setSelectedProgramType}
            onClearFilters={handleClearFilters}
            showAdminFilters={shouldUseAdminApi}
          />
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Programs Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {displaySelectedPlatform?.name 
                ? `${displaySelectedPlatform.name}`
                : formatMessage({ id: 'programs.available', defaultMessage: 'Available Programs' })
              }
            </h2>
            <Badge variant="secondary">
              {filteredPrograms.length} {formatMessage({ id: 'programs.count', defaultMessage: 'programs' })}
            </Badge>
          </div>
        </div>
        
        {filteredPrograms.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {formatMessage({ id: 'programs.noPrograms', defaultMessage: 'No programs found' })}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                {formatMessage({ 
                  id: 'programs.noProgramsDescription', 
                  defaultMessage: 'There are no programs matching your current filters. Try adjusting your filters or create a new program.' 
                })}
              </p>
              {isAdmin && (
                <Button onClick={() => setIsCreateProgramModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {formatMessage({ id: 'programs.createFirstProgram', defaultMessage: 'Create Your First Program' })}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 max-w-3xl"
          )}>
            {filteredPrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                onSelect={() => handleSelectProgram(program, index)}
                isSelected={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <CreateProgramModal
        isOpen={isCreateProgramModalOpen}
        onClose={() => setIsCreateProgramModalOpen(false)}
        platforms={platforms}
        isLoading={isLoading}
        onCreateSuperplatform={handleOpenCreateSuperplatform}
        onCreateSubplatform={handleOpenCreateSubplatform}
        onInviteSuperAdmin={isHyper ? handleOpenInviteSuperAdmin : undefined}
      />

      <CreateSuperplatformModal
        isOpen={isCreateSuperplatformModalOpen}
        onClose={() => setIsCreateSuperplatformModalOpen(false)}
        onCreated={handlePlatformCreated}
        hierarchicType={superplatformModalType}
        parentPlatform={parentPlatformForSubplatform}
      />

      <InviteSuperAdminModal
        isOpen={isInviteSuperAdminModalOpen}
        onClose={() => setIsInviteSuperAdminModalOpen(false)}
        platform={platformForInvite}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
};

export default ProgramsPage;
