// -----------------------------------------------------------------------------
// Wall Feature Hooks
// Re-exports from centralized hooks location
// -----------------------------------------------------------------------------

// Re-export from centralized hooks for backwards compatibility
export { 
  useWallSelection,
  usePlatformIdSelection,
  useProgramIdSelection,
  useDashboardNumber,
  useSidebarCollapse,
  type WallSelection,
  type WallPlatform,
  type WallProgram,
  type IDashboardPoints,
  type UseSidebarCollapseReturn
} from '@/hooks/wall';

// Feature-specific hooks that stay here
export { getMenuItems, getWidgetsMenuItems } from './useNavItems';
export { useNavItems } from './useNavItems';
export { default as useWallLayoutData } from './useWallLayoutData';
export { default as usePostsListData } from './usePostsListData';
export { useAdminPrograms } from './useAdminPrograms';
export { useProgramsData } from './useProgramsData';
export { useSuperplatformManagement } from './useSuperplatformManagement';
