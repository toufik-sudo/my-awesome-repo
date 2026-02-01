import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/store';

/**
 * Typed selector hook for use with Redux
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
