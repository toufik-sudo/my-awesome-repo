// -----------------------------------------------------------------------------
// User Hooks Barrel Export
// -----------------------------------------------------------------------------

export { 
  useUserDetails, 
  type UserDetails, 
  type UseUserDetailsResult, 
  type UseUserDetailsOptions 
} from './useUserDetails';

// Re-export useUserRole from auth hooks for backwards compatibility
export { useUserRole } from '@/hooks/auth';
