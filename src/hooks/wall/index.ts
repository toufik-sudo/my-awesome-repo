// -----------------------------------------------------------------------------
// Wall Hooks Barrel Export
// Consolidated wall-related hooks
// -----------------------------------------------------------------------------

// Selection hooks
export { 
  useWallSelection, 
  usePlatformIdSelection, 
  useProgramIdSelection,
  type WallSelection,
  type WallPlatform,
  type WallProgram
} from './useWallSelection';

// Like/Comment hooks
export { 
  useLikes, 
  type UseLikesConfig, 
  type UseLikesResult 
} from './useLikes';

export { 
  useCreateComment, 
  type UseCreateCommentConfig, 
  type UseCreateCommentResult,
  type CommentFile
} from './useCreateComment';

// Dashboard hooks
export { default as useDashboardNumber, type IDashboardPoints } from './useDashboardNumber';
export { default as useUserNumber } from './useUserNumber';
export { default as useUserDeclarations } from './useUserDeclarations';
export { default as useUserRankings } from './useUserRankings';
export { default as useAgendaLoader } from './useAgendaLoader';

// Layout hooks
export { useSidebarCollapse, type UseSidebarCollapseReturn } from './useSidebarCollapse';

// Program type hooks
export { useIsFreemiumProgram } from './useIsFreemiumProgram';
