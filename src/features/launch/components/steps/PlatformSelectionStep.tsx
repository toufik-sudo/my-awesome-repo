// -----------------------------------------------------------------------------
// PlatformSelectionStep Component
// Platform selection step: Choose which platform to create the program under
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Search, Users, ArrowRight, Crown, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';

interface Platform {
  id: number;
  name: string;
  logo?: string;
  hierarchicType: number;
  usersCount?: number;
  programsCount?: number;
  status?: string;
}

// Mock data for demonstration - will be replaced with API call
const MOCK_PLATFORMS: Platform[] = [
  { id: 1, name: 'Global Corp', hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM, usersCount: 1250, programsCount: 8 },
  { id: 2, name: 'Marketing Division', hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM, usersCount: 350, programsCount: 3 },
  { id: 3, name: 'Sales Team', hierarchicType: PLATFORM_HIERARCHIC_TYPE.INDEPENDENT, usersCount: 180, programsCount: 2 },
  { id: 4, name: 'HR Department', hierarchicType: PLATFORM_HIERARCHIC_TYPE.INDEPENDENT, usersCount: 95, programsCount: 1 },
  { id: 5, name: 'Tech Hub', hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM, usersCount: 520, programsCount: 5 },
];

const getHierarchyBadge = (type: number) => {
  switch (type) {
    case PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM:
      return { label: 'Hyper', variant: 'default' as const, icon: Crown };
    case PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM:
      return { label: 'Super', variant: 'secondary' as const, icon: Crown };
    case PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM:
      return { label: 'Sub', variant: 'outline' as const, icon: Building2 };
    default:
      return { label: 'Independent', variant: 'outline' as const, icon: Building2 };
  }
};

const PlatformSelectionStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { updateStepData, goToNextStep, launchData } = useLaunchWizard();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    (launchData.platform as Platform) || null
  );
  
  // Simulate API call - will be replaced with actual API hook
  useEffect(() => {
    const loadPlatforms = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlatforms(MOCK_PLATFORMS);
      setIsLoading(false);
    };
    loadPlatforms();
  }, []);
  
  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    updateStepData('platform', platform);
  };
  
  const handleContinue = () => {
    if (selectedPlatform) {
      goToNextStep();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.platform.title" 
            defaultMessage="Select Platform" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.platform.description" 
            defaultMessage="Choose the platform where you want to create your program" 
          />
        </p>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={formatMessage({ 
            id: 'launch.platform.search', 
            defaultMessage: 'Search platforms...' 
          })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Platforms List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredPlatforms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FormattedMessage 
                  id="launch.platform.noResults" 
                  defaultMessage="No platforms found" 
                />
              </div>
            ) : (
              filteredPlatforms.map((platform) => {
                const hierarchy = getHierarchyBadge(platform.hierarchicType);
                const HierarchyIcon = hierarchy.icon;
                
                return (
                  <Card
                    key={platform.id}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50',
                      selectedPlatform?.id === platform.id && 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    )}
                    onClick={() => handleSelectPlatform(platform)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4 py-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        {platform.logo ? (
                          <img 
                            src={platform.logo} 
                            alt={platform.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{platform.name}</CardTitle>
                          <Badge variant={hierarchy.variant} className="gap-1">
                            <HierarchyIcon className="h-3 w-3" />
                            {hierarchy.label}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {platform.usersCount} users
                          </span>
                          <span>
                            {platform.programsCount} programs
                          </span>
                        </CardDescription>
                      </div>
                      
                      {selectedPlatform?.id === platform.id && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      )}
      
      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          <FormattedMessage id="launch.platform.create" defaultMessage="Create New Platform" />
        </Button>
        
        <Button 
          onClick={handleContinue}
          disabled={!selectedPlatform}
          className="gap-2"
        >
          <FormattedMessage id="common.continue" defaultMessage="Continue" />
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export { PlatformSelectionStep };
export default PlatformSelectionStep;
